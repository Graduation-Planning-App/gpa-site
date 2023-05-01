// TODO: figure out how to make cytoscape work
import cytoscape from 'cytoscape';

import DirectedGraph from 'graphology';

const graph = new DirectedGraph();



// Get course plan courses from api
async function search(query) {
    const response = await fetch(
        import.meta.env.VITE_API_BASEURL + "/api/courses/plan?email=" + query,
        { method: "GET" }
    );

    let jsonResponse = await response.json();

    console.log(jsonResponse);

    return jsonResponse;
}

function buildCourseGraph(coursePlan) {

    // add graph vertices
    coursePlan[0].courses.forEach(element => {
        graph.addNode(element.course_title, element);
    });

    // add graph edges
    graph.forEachNode( (node, attributes) => {
        const prereqsList = getPrereqs(attributes);
        console.log(prereqsList);
    });
}

// returns a list of prerequisites for a course
function getPrereqs(attributes) {
    let prereqs = [];
    if (!attributes.prerequisites) {
        return;
    } else {
        // put prereqs, ANDs, and ORs into an array
        let possiblePrereqs = attributes.prerequisites.match(/\w\w\w?\w? \d\d\d\d|AND|OR|\(|\)/g);
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
                    prereqs.push(chooseFromList(list));
                    possiblePrereqs = possiblePrereqs.slice(possiblePrereqs.indexOf(')') + 1);
                } else {
                    prereqs.push(nextElement);
                }
            } else if (currentElement === "OR") {
                // handle group
                if (nextElement === "(") {
                    possiblePrereqs.unshift("(");
                    const list = possiblePrereqs.slice(possiblePrereqs.indexOf('('), possiblePrereqs.indexOf(')'));
                    prereqs.push(chooseFromList(list));
                    possiblePrereqs = possiblePrereqs.slice(possiblePrereqs.indexOf(')') + 1);
                } else {
                    break;
                }
            }
            if (!nextElement) {
                prereqs.push(currentElement);
            } else if (nextElement === "AND") {
                prereqs.push(currentElement);
                const thirdElement = possiblePrereqs.shift();
                if (thirdElement === "(") {
                    // put parentheses back into array
                    possiblePrereqs.unshift("(");
                    const list = possiblePrereqs.slice(possiblePrereqs.indexOf('('), possiblePrereqs.indexOf(')'));
                    prereqs.push(chooseFromList(list));
                    possiblePrereqs = possiblePrereqs.slice(possiblePrereqs.indexOf(')') + 1);
                } else {
                    prereqs.push(thirdElement);
                }
            } else if (nextElement === "OR") {
                // TODO: make this part smarter, for now, it will just choose the first option
                prereqs.push(currentElement);
                possiblePrereqs.shift();
            } else {
                
            }
        }
    }
    return prereqs;
}

// returns a prereq or list of prereqs from a list bound by parentheses
function chooseFromList(prereqList) {
    // TODO: make this function smarter, right now, will only choose the first prereq (or group of prereqs)
    return prereqList.at(1);
}

// Gets users course plans on page load and generate flowcharts
document.addEventListener("DOMContentLoaded", async (e) => {

    const courses = await search('kyle.telnes@outlook.com');
    buildCourseGraph(courses);

    return;
});