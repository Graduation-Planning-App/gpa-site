// put search results div in variable
const searchResults = document.getElementById('searchResults');

// Gets unfiltered list of courses on page load
document.addEventListener("DOMContentLoaded", async (e) => {
    const data = {
        "title":"",
        "discipline":"",
        "crn":"", 
        "year":"", 
        "term":"", 
        "credits":"", 
        "attributes":[],
        "start_time":"",
        "end_time":"",
        "instruct_methods":"", 
        "instructors":""
    };
    const response = await sendSearch(data);
    const result = await response.json();

    // Display results on screen
    displayResults(result);
    return;
});

// Sends GET request to api on search
const searchForm = document.getElementById('searchForm');
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
    const data = {
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
    const response = await sendSearch(data);

    const result = await response.json();

    // Display results on screen
    displayResults(result);
    return 
});

// Sends request to api
async function sendSearch(data) {
    // TODO: for production, replace http://localhost:3000 with the url of the api
    const response = await fetch("http://localhost:3000/api/courses/search?input=" + encodeURIComponent(JSON.stringify(data)),
        {
            method: "GET",
        }
    )
    return response;
}

// Displays results on the results div
function displayResults(result) {
    // clear previous results
    document.getElementById('searchResults').innerHTML = "";
    // put results of search into the search results div
    for (let i = 0; i < result.rows.length; i++) {
        let course_info = searchResults.appendChild(document.createElement("div"));
        course_info.classList = "row mb-3";
        course_info.innerHTML = result.rows[i].course_title;
    }
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

// Leftover code from prior page implementation (may still be useful)
var coll = document.getElementsByClassName('collapsible');
      var i;
      for (i = 0; i < coll.length; i++) {
        coll[i].addEventListener('click', function () {
          this.classList.toggle('active');
          var content = this.nextElementSibling;
          if (content.style.display === 'block') {
            content.style.display = 'none';
          } else {
            content.style.display = 'block';
          }
        });
      }