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


    console.log(graph);
}

function findPrereq(courses) {
    let prereqs = [];


    return prereqs;
}

// Gets users course plans on page load and generate flowcharts
document.addEventListener("DOMContentLoaded", async (e) => {

    const courses = await search('kyle.telnes@outlook.com');
    buildCourseGraph(courses);

    return;
});