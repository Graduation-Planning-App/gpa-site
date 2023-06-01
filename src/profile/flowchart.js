/*Functions*/

//Reads local file and returns data or throws error
async function readLocalFile(filePath) {
  return await fetch(filePath)
    .then((response) => response.text())
    .then((data) => {
      return data;
    })
    .catch((error) => console.error(error));
}

//Takes local file data and returns it as an array
function courseList(major) {
  const lines = major.split('\n');
  let coursesList = []; //Placeholder array to return
  for (let i = 0; i < lines.length - 1; i++) {
    let line = lines[i];
    const parts = line.split(', ');
    let curCourse = new Object();
    curCourse.courseCode = parts[0];
    curCourse.courseName = parts[1];
    curCourse.credits = parts[2];

    //Parse prereqs
    let startPR = line.indexOf('[');
    let endPR = line.indexOf(']');
    let pr = line.substring(startPR + 1, endPR);
    let prCourses = pr.split(', ');
    let prArray = [];
    for (let j = 0; j < prCourses.length; j++) {
      prArray.push(prCourses[j]);
    }
    curCourse.preReqs = prArray;

    //Parse quarters offered
    let startQO = line.indexOf('[', endPR + 1);
    let endQO = line.indexOf(']', endPR + 1);
    let qo = line.substring(startQO + 1, endQO);
    let qoQuarters = qo.split(', ');
    let qoArray = [];
    for (let j = 0; j < qoQuarters.length; j++) {
      qoArray.push(qoQuarters[j]);
    }
    curCourse.quartersOffered = qoArray;
      
    //Positioning data
    const courseNum = curCourse.courseCode.match(/[0-9]+/)[0];
    x = parseInt(courseNum.slice(0, 1)) * 10;
    y = parseInt(courseNum.slice(1, 2)) * 10;
    curCourse.x = x;
    curCourse.y = y;
    console.log(courseNum);

    coursesList.push(curCourse);
  }
  return coursesList;
}

//Takes the data in given format (with course-specific keys) and converts it to Cytoscape node format
function convertToNode(course) {
  let element = new Object();
  let data = new Object();
  data.id = course.courseCode;
  element.data = data;
  element.group = 'nodes';
  element.position = {}
  element.position.x = 20;
  element.position.y = 30;
//console.log(element) //FIXME
  return element;
}

//Creates an edge in Cytoscape format given a course and a prerequisite
function getEdge(preReq, curNode) {
  let edge = new Object();
  let data = new Object();
  data.id = preReq.concat('-', curNode);
  data.source = preReq;
  data.target = curNode;
  edge.data = data;
  edge.group = 'edges';
  return edge;
}

//Returns nodes and edges as arrays in an array (since JS doesn't support multiple returns)
function getNodesAndEdges(courseList) {
  let nodes = []; //Placeholder array
  let edges = []; //Placeholder array
  let nodesAndEdges = [];
  //Iterate through each course
  for (let i = 0; i < courseList.length; i++) {
    //Get node using convertToNode() function to convert all courses to nodes
    let element = convertToNode(courseList[i]);
    nodes.push(element);

    //Get edge using getEdge() function
    let curNode = courseList[i].courseCode;
    let preReq = courseList[i].preReqs;
    for (let i = 0; i < preReq.length; i++) {
      if (preReq[0] != '') {
        //If prereq exists
        let edge = getEdge(preReq[i], curNode);
        edges.push(edge);
      }
    }
  }
  //Store as single array for returning
  nodesAndEdges.push(nodes, edges);
  return nodesAndEdges;
}

/*Define all variables*/
//Read major 1
var major1 = await readLocalFile('major1.txt').then(function (response) {
  return response;
});


//Read major 2
var major2 = await readLocalFile('major2.txt').then(function (response) {
  return response;
});

//Store majors in arrays
let coursesList1 = courseList(major1);
let coursesList2 = courseList(major2);

//Store nodes and edges in arrays
let Course1NE = getNodesAndEdges(coursesList1);
let course1Nodes = Course1NE[0];
let course1Edges = Course1NE[1];

let Course2NE = getNodesAndEdges(coursesList2);
let course2Nodes = Course2NE[0];
let course2Edges = Course2NE[1];

/*Graphical Rendering*/
var cy = cytoscape({
  container: document.getElementById('cy'), // container to render in

  elements: [],

  style: [
    //Node Styling
    {
      selector: 'node',
      style: {
        'background-color': '#021B2E',
        label: 'data(id)',
        'shape': 'round-rectangle',
        "text-valign": "center",
        "text-halign": "center",
        width: '100px',
        height: '100px',
        color: 'white',
      },
    },

    //Edge Styling
    {
      selector: 'edge',
      style: {
        width: 3,
        'line-color': '#21B2EB',
        'target-arrow-color': '#21B2EB',
        'target-arrow-shape': 'triangle',
        'curve-style': 'bezier',
      },
    },
  ],
});

//Add nodes and edges for given course (best displayed one at a time)
cy.add(course1Nodes);
cy.add(course1Edges);

//cy.add(course2Nodes);
//cy.add(course2Edges);

//Layout styling (needs to be called after elements are added)
var layout = cy.layout({ name: 'grid' });
layout.run();