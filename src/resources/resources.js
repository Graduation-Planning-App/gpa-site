document.addEventListener("DOMContentLoaded", async (e) => {
    // prevent default action
    e.preventDefault();

    var degreeList = document.querySelector('#degree-list');
    var courseList = document.querySelector('#course-list');

    // get all degree from database
    const degrees = await getDegrees();

    // populate degree programs in left column
    for (let i = 0; i < degrees.length; i++) {
        let li = degreeList.appendChild(document.createElement("li"));
        li.value = degrees[i].name;
        li.innerHTML = degrees[i].name;
        const liID = degrees[i].id;
        li.setAttribute('id', liID);
        
        // set up click event for each degree program to show required classes
        li.addEventListener('click', async () => {
            const checkID = li.getAttribute('id');
            courseList.innerHTML = "";
            const degreeCourses = await getDegreeCourses(checkID);
            for (let i = 0; i < degreeCourses.length; i++) {
                let add = document.createElement('li');
                add.setAttribute('class', 'row mb-2 mx-5 px-5 py-2 justify-content-between rounded border');
                add.innerHTML = `${degreeCourses[i]}`;
                courseList.appendChild(add);
            }
        })
    }

    // display the first degree program's required classes by default
    const degreeCourses = await getDegreeCourses(degrees[0].id);
    if (!degreeCourses) { // fallback if getDegreeCourses fails
        const add = document.createElement('li');
        add.innerHTML = '<li>Click on a program to see its required courses</li>'
    } else { // Display requirements for top of list degree
        for (let i = 0; i < degreeCourses.length; i++) {
            const add = document.createElement('li');
            add.setAttribute('class', 'row mb-2 mx-5 px-5 py-2 justify-content-between rounded border');
            add.innerHTML = `${degreeCourses[i]}`;
            courseList.appendChild(add);
        }
    }
    return;
});

// obtains a list of all degrees stored in the database
async function getDegrees() {
    const degrees = await fetch(
        import.meta.env.VITE_API_BASEURL + "/api/degrees/degree-programs",
        { method: "GET" }
    );
    const retVal = await degrees.json();
    return retVal;
}

// obtains a list of required courses for a degree
async function getDegreeCourses(id) {
    const degreeCourse = await fetch(
        import.meta.env.VITE_API_BASEURL + "/api/degrees/requirements?degreeProg=" + id,
        { method: "GET" }
    );
    const retVal = await degreeCourse.json();
    return retVal;
}