/*
Extremely Inefficient, (3 loops)

TODO: 
-Test for more updated DB
-See if it works with more classes (only tested with 4)
-CORS issues?

*/



document.addEventListener("DOMContentLoaded", async (e) => {
    e.preventDefault;
    var degreeList = document.querySelector('#degree-list');
    var courseList = document.querySelector('#course-list');
    const degrees = await getDegrees();
    const degreeCourses = await getDegreeCourses();
    const courses = await getCourses();

    degrees.forEach(degree => {
        const li = document.createElement('li');
        li.textContent = degree.name;
        const liID = `li-${degree.id}`;
        li.setAttribute('id', liID);
        degreeList.appendChild(li);

        li.addEventListener('click', () => {
            const checkID = li.getAttribute('id');
            const degreeID = checkID.split('-')[1];
            courseList.innerHTML = "";
            
            degreeCourses.forEach(degreeCourse => {
                if (degreeID === degreeCourse.degree_program_id.toString()) {
                    courses.forEach(course => {
                        if (degreeCourse.course_id.toString() === course.id.toString()) {
                            const add = document.createElement('li');
                            const info = `Course CRN: ${course.crn} - Course PreReq: ${course.prerequisites}`;
                            add.textContent = info;
                            courseList.appendChild(add);
                        }
                    })
                } else {
                    return;
                }
            })
        })
    });
});

async function getDegrees() {
    const res = await fetch("http://localhost:3000/api/courses/degree-program");
    const degrees = await res.json();
    return degrees;
}

async function getDegreeCourses() {
    const res = await fetch("http://localhost:3000/api/courses/degree-courses");
    const degreeCourses = await res.json();
    console.log(degreeCourses)
    return degreeCourses;
}

async function getCourses() {
    const res = await fetch("http://localhost:3000/api/courses/get-course");
    const courses = await res.json();
    console.log(courses)
    return courses;
}


