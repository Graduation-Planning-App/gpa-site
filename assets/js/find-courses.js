import ('./web-components/find-courses-components.js')

// search form
const searchForm = document.getElementById('searchForm');
// search results
const searchResults = document.getElementById('searchResults');

// Gets unfiltered list of courses on page load
document.addEventListener("DOMContentLoaded", async (e) => {
    const tAndD = await getTeachersAndDisciplines();
    // Add teachers and discipline codes to their selects
    const teachers = document.getElementById('inputInstructor');
    const disciplines = document.getElementById('inputDiscipline');
    for (let i = 0; i < tAndD.teachers.length; i++) {
        let option = teachers.appendChild(document.createElement("option"));
        option.value = tAndD.teachers[i].name;
        option.innerHTML = tAndD.teachers[i].name;
    }
    for (let i = 0; i < tAndD.disciplines.length; i++) {
        let option = disciplines.appendChild(document.createElement("option"));
        option.value = tAndD.disciplines[i].discipline_code;
        option.innerHTML = tAndD.disciplines[i].discipline_code;
    }
    await search(searchResults.query);

    return;
});

// Sends GET request to api on search
searchForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    // All variables to turn in
    const title = document.getElementById('inputTitle');
    const discipline = document.getElementById('inputDiscipline');
    const crn = document.getElementById('inputCRN');
    const instructor = document.getElementById('inputInstructor');
    const credits = document.getElementById('inputCredits');
    const term = document.getElementById('inputTerm');
    const year = document.getElementById('inputYear');
    const startTime = document.getElementById('inputStartTime');
    const endTime = document.getElementById('inputEndTime');
    let attributes = [];
    // Put selected attributes into an array
    const checkBoxes = document.getElementsByClassName('form-check-input');
    for (let i = 0; i < checkBoxes.length; i++) {
        if (checkBoxes[i].checked) {
            attributes.push(checkBoxes[i].value);
        }
    }
    searchResults.query = {
        "title":title.value, // keyword will yield more results, full title will narrow search results
        "discipline":discipline.value, // discipline code
        "crn":crn.value, // course crn
        "year":year.value, // year that course is offered
        "term":term.value, // quarter that course is offered
        "credits":credits.value, // number of credits
        "attributes":attributes, // course attributes, will return results that contain any in the array.
        "start_time":startTime.value, // start and end time, end time doesn't have to exist. Will return results that fall within the time frame.
        "end_time":endTime.value,
        "instruct_methods":"", 
        "instructors":instructor.value
    };
    await search(searchResults.query);

    return
});

// Sends request to api
async function search(query) {
    // TODO: for production, replace http://localhost:3000 with the url of the api
    const response = await fetch(
        "http://localhost:3000" + "/api/courses/search?input=" + encodeURIComponent(JSON.stringify(query)),
        { method: "GET" }
    );

    let jsonResponse = await response.json();
    
    console.log(jsonResponse);

    searchResults.results = jsonResponse.rows;
    searchResults.currentPage = jsonResponse.currentPage + 1;
    searchResults.totalPages = jsonResponse.totalPages;
    searchResults.numResults = jsonResponse.count;

    return;
}

// Gets teachers and discipline codes
async function getTeachersAndDisciplines() {
    let retVal = {};
    // TODO: for production, replace http://localhost:3000 with the url of the api
    const teachers = await fetch(
        "http://localhost:3000" + "/api/courses/teachers",
        { method: "GET" }
    );
    // TODO: for production, replace http://localhost:3000 with the url of the api
    const disciplines = await fetch(
        "http://localhost:3000" + "/api/courses/disciplines",
        { method: "GET" }
    );
    retVal.teachers = await teachers.json();
    retVal.disciplines = await disciplines.json();
    return retVal;
}

// checks all attribute boxes
const selectAllAttributes = document.getElementById('selectAllAttributes');
selectAllAttributes.addEventListener('click', (e) => {
    e.preventDefault();
    const checkBoxes = document.getElementsByClassName('form-check-input');
    for (let i = 0; i < checkBoxes.length; i++) {
        checkBoxes[i].checked = true;
    }
});

// deselects all attributes
const deselectAllAttributes = document.getElementById('removeAllAttributes');
deselectAllAttributes.addEventListener('click', (e) => {
    e.preventDefault();
    const checkBoxes = document.getElementsByClassName('form-check-input');
    for (let i = 0; i < checkBoxes.length; i++) {
        checkBoxes[i].checked = false;
    }
});