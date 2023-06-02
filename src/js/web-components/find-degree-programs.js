document.addEventListener("DOMContentLoaded", async (e) => {
    e.preventDefault();
    var degreeList = document.querySelector('#degree-list');
    var courseList = document.querySelector('#course-list');
    const degrees = await getDegrees();

    for (let i = 0; i < degrees.length; i++) {
        let li = degreeList.appendChild(document.createElement("li"));
        li.value = degrees[i].name;
        li.innerHTML = degrees[i].name;
        const liID = degrees[i].id;
        li.setAttribute('id', liID);
        

        li.addEventListener('click', async () => {
            const checkID = li.getAttribute('id');
            courseList.innerHTML = "";
            const degreeCourses = await getDegreeCourses(checkID);
            for (let i = 0; i < degreeCourses.length; i++) {
                const add = document.createElement('li');
                const info = `${degreeCourses[i]}`;
                add.innerHTML = info;
                courseList.appendChild(add);
            }
        })
    }
    return;
});

async function getDegrees() {
    const degrees = await fetch(
        import.meta.env.VITE_API_BASEURL + "/api/degrees/degree-programs",
        { method: "GET" }
    );
    const retVal = await degrees.json();
    return retVal;
}

async function getDegreeCourses(id) {
    const degreeCourse = await fetch(
        import.meta.env.VITE_API_BASEURL + "/api/degrees/requirements?degreeProg=" + id,
        { method: "GET" }
    );
    const retVal = await degreeCourse.json();
    return retVal;
}