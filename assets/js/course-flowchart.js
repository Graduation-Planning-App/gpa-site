import DirectedGraph from 'graphology';
import {topologicalSort} from 'graphology-dag';


const graph = new DirectedGraph();

// Get course plan courses from api
async function search(query) {
    const response = await fetch(
        import.meta.env.VITE_API_BASEURL + "/api/courses/plan?email=" + query,
        { method: "GET" }
    );

    let jsonResponse = await response.json();

    console.log(jsonResponse)

    return jsonResponse;
}

function buildCourseGraph(coursePlan) {

    // add graph vertices
    coursePlan.courses.forEach(element => {
        graph.addNode(element.course_title, element);
    });

    // add graph edges
    graph.forEachNode( (node, attributes) => {
        console.log("course: ", node);
        const selected = getPrereqs(attributes.prerequisites, coursePlan);
        let prereqs = new Array(selected);
        console.log("selected prereqs: ", prereqs);
        for (let i = 0; i < prereqs.length; i++) {
            const source = graph.findNode( (e) => {
                if (e.toString().includes(prereqs[i])) {
                    return e;
                } else {
                    return undefined;
                }
            });
            if (source) {
                console.log("prereq: ", source);
                graph.addDirectedEdge(source, node);
            }
        }
    });

    // Topological sort graph
    console.log(topologicalSort(graph));

    // display graph in browser

}

// returns a list of prerequisites for a course
function getPrereqs(prerequisites, coursePlan) {
    let retVal = [];
    if (!prerequisites) {
        return;
    } else {
        // put prereqs, ANDs, and ORs into an array
        let possiblePrereqs = prerequisites.match(/\w\w\w?\w? \d\d\d\d|AND|OR|\(|\)/g);
        console.log("possible prereqs: ", possiblePrereqs);
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
    // TODO: make this part smarter, for now, it will just choose the first option or skip if it is not found in the plan

    return prereqList.at(1);
}

// Gets users course plans on page load and generate flowcharts
document.addEventListener("DOMContentLoaded", async (e) => {

    const coursePlans = await search('kyle.telnes@outlook.com');
    for (let i = 0; i < coursePlans.length; i++) {
        buildCourseGraph(coursePlans[i]);
    }

    return;
});