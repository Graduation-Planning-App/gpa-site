document.addEventListener("DOMContentLoaded", async (e) => {
    e.preventDefault;
    var degreeList = document.querySelector('#degree-list');
    var courseList = document.querySelector('#course-list');
    const degrees = await getDegrees();
    const degreeCourses = await getDegreeCourses();
    const courses = await getCourses();
    

    for (let i = 0; i < degrees.degrees.length; i++) {
        let li = degreeList.appendChild(document.createElement("li"));
        li.value = degrees.degrees[i].name;
        li.innerHTML = degrees.degrees[i].name;
        const liID = degrees.degrees[i].id;
        li.setAttribute('id', liID);
        

        li.addEventListener('click', () => {
            const checkID = li.getAttribute('id');
            courseList.innerHTML = "";

            for (let i = 0; i < degreeCourses.degreeCourse.length; i++) {
                if (checkID == degreeCourses.degreeCourse[i].degree_program_id) {
                    if (degreeCourses.degreeCourse[i].course_id == courses.courses[i].id) {
                        const add = document.createElement('li');
                        const info = `Course Title: ${courses.courses[i].name} 
                        - Course CRN: ${courses.courses[i].crn}`; //CHANGE
                        add.textContent = info;
                        courseList.appendChild(add);
                    }
                }
            }
        })
    }
    return;
});

async function getDegrees() {
    let retVal = {};
    const degrees = await fetch(
        import.meta.env.VITE_API_BASEURL + "/api/courses/degree-program", //"?degreeProg=" +
        { method: "GET" }
    );
    retVal.degrees = await degrees.json();
    console.log(retVal);
    return retVal;
}

async function getDegreeCourses() {
    let retVal = {};
    const degreeCourse = await fetch(
        import.meta.env.VITE_API_BASEURL + "/api/courses/degree-courses",
        { method: "GET" }
    );
    retVal.degreeCourse = await degreeCourse.json();
    console.log(retVal)
    return retVal;
}

async function getCourses() {
    let retVal = {};
    const courses = await fetch(
        import.meta.env.VITE_API_BASEURL + "/api/courses/get-course",
        { method: "GET" }
    );
    retVal.courses = await courses.json();
    console.log(retVal)
    return retVal;
}

