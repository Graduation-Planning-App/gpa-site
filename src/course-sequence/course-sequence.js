// since this page should require login, make sure that user is authenticated
import Auth from '../js/auth';
import "../js/web-components/create-plan-modal";

import DirectedGraph from 'graphology';
import {topologicalSort} from 'graphology-dag';

// import custom html elements
import ('../js/web-components/course-flowchart-components.js');
// unused imports (for now)
//import * as d3 from 'd3';
//import * as d3Dag from 'd3-dag';

const auth = new Auth();

// Get course plan courses from api
async function search() {
    const response = await fetch(
        import.meta.env.VITE_API_BASEURL + "/api/courses/plan",
        {   
            method: "GET",
            credentials: "include"
        }
    );

    let jsonResponse = await response.json();

    return jsonResponse;
}

function buildCourseGraph(coursePlan, planId) {
    const graph = new DirectedGraph();
    // add graph vertices
    coursePlan.courses.forEach(element => {
        graph.addNode(element.course_title, element);
    });

    // add graph edges
    graph.forEachNode( (node, attributes) => {
        const selected = getPrereqs(attributes.prerequisites, coursePlan);
        let prereqs = new Array(selected);
        for (let i = 0; i < prereqs.length; i++) {
            const source = graph.findNode( (e) => {
                if (e.toString().includes(prereqs[i])) {
                    return e;
                } else {
                    return undefined;
                }
            });
            if (source) {
                graph.addDirectedEdge(source, node);
            }
        }
    });

    // Topological sort graph
    const topo = topologicalSort(graph);

    // Put courses into a sequence
    const courseSequence = getCourseSequence(topo, coursePlan.courses)

    // Display sequence in list form
    const displayBox = document.getElementById('course-plans');

    // Display plan title
    const planName = document.createElement('h2');
    planName.innerHTML = "<b>" + coursePlan.name + ":" + "</b>";
    displayBox.append(planName);

    // Display plan details
    const plan = document.createElement('course-plan');
    plan.planId = planId;
    plan.coursePlan = courseSequence;
    displayBox.append(plan);
}

// returns a list of prerequisites for a course
function getPrereqs(prerequisites, coursePlan) {
    let retVal = [];
    if (!prerequisites) {
        return;
    } else {
        // put prereqs, ANDs, and ORs into an array
        let possiblePrereqs = prerequisites.match(/\w\w\w?\w? \d\d\d\d|AND|OR|\(|\)/g);
        // loop thru array to handle ANDs and ORs
        while (possiblePrereqs.length > 0) {
            const currentElement = possiblePrereqs.shift();
            const nextElement = possiblePrereqs.shift();

            if (currentElement === "(") {
                // remove other parentheses
                possiblePrereqs.pop();
                // add next element back to the array
                possiblePrereqs.unshift(nextElement);
            } else if (currentElement === "AND") {
                // handle group
                if (nextElement === "(") {
                    possiblePrereqs.unshift("(");
                    const list = possiblePrereqs.slice(possiblePrereqs.indexOf('('), possiblePrereqs.indexOf(')'));
                    retVal.push(chooseFromList(list, coursePlan));
                    possiblePrereqs = possiblePrereqs.slice(possiblePrereqs.indexOf(')') + 1);
                } else {
                    retVal.push(nextElement);
                }
            } else if (currentElement === "OR") {
                // handle group
                if (nextElement === "(") {
                    possiblePrereqs.unshift("(");
                    const list = possiblePrereqs.slice(possiblePrereqs.indexOf('('), possiblePrereqs.indexOf(')'));
                    retVal.push(chooseFromList(list, coursePlan));
                    possiblePrereqs = possiblePrereqs.slice(possiblePrereqs.indexOf(')') + 1);
                } else {
                    break;
                }
            }
            if (!nextElement) {
                retVal.push(currentElement);
            } else if (nextElement === "AND") {
                retVal.push(currentElement);
                const thirdElement = possiblePrereqs.shift();
                if (thirdElement === "(") {
                    // put parentheses back into array
                    possiblePrereqs.unshift("(");
                    const list = possiblePrereqs.slice(possiblePrereqs.indexOf('('), possiblePrereqs.indexOf(')'));
                    retVal.push(chooseFromList(list, coursePlan));
                    possiblePrereqs = possiblePrereqs.slice(possiblePrereqs.indexOf(')') + 1);
                } else {
                    retVal.push(thirdElement);
                }
            } else if (nextElement === "OR") {
                // TODO: make this part smarter, for now, it will just choose the first option or skip if it is not found in the plan
                const correspondingCourse = coursePlan.courses.find( e => {
                    if (e.course_title.includes(currentElement)) {
                        return true;
                    } else {
                        return false;
                    }
                })
                if (correspondingCourse) {
                    retVal.push(currentElement);
                    possiblePrereqs.shift();
                }
                
            } else {

            }
        }
    }
    return retVal;
}

// returns a prereq or list of prereqs from a list bound by parentheses
function chooseFromList(prereqList, coursePlan) {
    // TODO: make this part smarter, for now, it will just choose the first option

    return prereqList.at(1);
}

function getCourseSequence(topoOrder, courses) {
    // map topoOrder to course list to have complete info for each course
    let courseList = topoOrder.map( (e) => {
        return courses.find(element => element.course_title === e);
    });

    let layers = [];

    let currentQuarter = 1;
    let currentYear = 1;

    while (currentYear < 5) {
        let currCredits = 0;
        let quarterCourses = [];
        while (findNextAddableCourse(courseList, currentQuarter, currentYear) && currCredits < 11) {
            
            // find the next available course
            const currentCourse = findNextAddableCourse(courseList, currentQuarter, currentYear);

            // remove currentCourse from list
            courseList.splice(courseList.findIndex(e => {
                if (e === currentCourse) {
                    return e;
                }
            }), 1);

            currCredits += currentCourse.credits;

            // add course to current quarter
            quarterCourses.push(currentCourse);
        }
        // add the quarter to the layer
        layers.push(quarterCourses);

        // updates the current quarter
        currentQuarter = changeQuarter(currentQuarter);
        // updates the current year
        if ((currentQuarter - 1) % 4 === 0) {
            currentYear++;
        }
    }
    return layers;
}

function getQtrNum(quarterString) {
    if (quarterString === 'Autumn') {
        return 1;
    } else if (quarterString === 'Winter') {
        return 2;
    } else if (quarterString === 'Spring') {
        return 3;
    } else if (quarterString === 'Summer') {
        return 4;
    } else {
        return null;
    }
}

function getCorrectYear(course) {
    if (course.attributes.includes("Upper-Division")) {
        return 3;
    } else {
        return 1;
    }
}

function findNextAddableCourse(courseList, currentQuarter, currentYear) {
    return courseList.find( e => {
        if ( (getQtrNum(e.term) === currentQuarter) && (getCorrectYear(e) <= currentYear) ) {
            return e;
        }
    });
}

function changeQuarter(currentQuarter) {
    if (currentQuarter < 4) {
        return currentQuarter + 1
    } else {
        return 1;
    }
}

// Gets users course plans on page load and generate flowcharts
document.addEventListener("DOMContentLoaded", async (e) => {
    // make sure that user is logged in
    auth.validateAuth();
    if (auth.isLoggedIn()) {
        // set up create new plan button
        const createBtn = document.getElementById('createNewPlan');
        createBtn.onclick = () => {
            const modal = document.createElement('create-plan');
            modal.id = 'createPlanModal';
            document.getElementById('main').append(modal);
        };

        // show user's course plans
        const coursePlans = await search();
        for (let i = 0; i < coursePlans.length; i++) {
            buildCourseGraph(coursePlans[i], coursePlans[i].id);
        }
    }

    return;
});