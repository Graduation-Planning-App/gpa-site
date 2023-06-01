document.addEventListener("DOMContentLoaded", async (e) => {
    e.preventDefault();
    var degreeList = document.querySelector('#degree-list');
    var courseList = document.querySelector('#course-list');
    const degrees = await getDegrees();

    for (let i = 0; i < degrees.degrees.length; i++) {
        let li = degreeList.appendChild(document.createElement("li"));
        li.value = degrees.degrees[i].name;
        li.innerHTML = degrees.degrees[i].name;
        const liID = degrees.degrees[i].id;
        li.setAttribute('id', liID);
        

        li.addEventListener('click', async () => {
            const checkID = li.getAttribute('id');
            courseList.innerHTML = "";
            const degreeCourses = await getDegreeCourses(checkID);
            for (let i = 0; i < degreeCourses.course_titles.length; i++) {
                const add = document.createElement('li');
                const info = `${course_titles[i].discipline_code}${course_titles[i].course_number}: ${course_titles[i].title}`; //CHANGE
                add.textContent = info;
                courseList.appendChild(add);

            }
        })
    }
    return;
});

async function getDegrees() {
    let retVal = {};
    const degrees = await fetch(
        import.meta.env.VITE_API_BASEURL + "/api/degrees/degree-programs",
        { method: "GET" }
    );
    retVal.degrees = await degrees.json();
    console.log(retVal);
    return retVal;
}

async function getDegreeCourses(id) {
    let retVal = {};
    const degreeCourse = await fetch(
        import.meta.env.VITE_API_BASEURL + "/api/degrees/degree-courses?degreeProg=" + id,
        { method: "GET" }
    );
    retVal.degreeCourse = await degreeCourse.json();
    console.log(retVal)
    return retVal;
}