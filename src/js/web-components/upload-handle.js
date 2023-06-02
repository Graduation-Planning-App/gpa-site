const preview = document.querySelector('.preview');
const input = document.querySelector('input');
input.style.opacity = 0;

const fileInput = document.getElementById('file_input');
let file = null;
const form = document.getElementById('uploadForm');
const submit = document.getElementById('submitBtn');
var courseList = document.getElementById('course-list');



//Check if the file is valid
fileInput.addEventListener('change', () => {
    if (fileInput.files.length > 0) {
    const file = fileInput.files[0];
    if (file.type !== 'text/html') {
        fileInput.value = '';
        preview.textContent = 'Invalid file, please send an HTML file.'
        return;
    } 
        preview.textContent = `File selected: ${file.name}`;

        const formData = new FormData();
        formData.append('htmlFile', file);


        fetch(import.meta.env.VITE_API_BASEURL + "/api/users/upload", {
            method: 'POST',
            body: formData
        })
        .then(res => res.json())
        .then(data => {
            var courselist = document.getElementById('course-list');
            /*var p = document.getElementById('6-p');
            p.textContent = 'After confirming these are your classes, 
            hit submit to add them to your completed courses! (For now does not support transfer credits)';*/

            for (let i = 0; i < data.length; i++) {
                let li = courselist.appendChild(document.createElement("li"));
                const innerArray = data[i];
                const crn = innerArray[4];
                const name = innerArray[2];
                li.value = `[Course Name: ${name} CRN: ${crn}]`;
                //li.textContent = `[Course Name: ${name} CRN: ${crn}]`;
                /*let li = courselist.appendChild(document.createElement("p"));
                const innerArray = data[i];
                const crn = innerArray[4];
                const name = innerArray[2];
                li.value = crn, name;
                li.innerHTML = `[Course Name: ${name} CRN: ${crn}]`;
                li.style.opacity = 0;*/
            }
            console.log(typeof data, data);

            

            submit.addEventListener('click', () => {
                /*const liElements = document.querySelectorAll('#course-list li');
                const selectedCourses = Array.from(liElements).map(li => li.innerHTML);
                console.log(selectedCourses);*/

                const selectedCourses = data;
                
                fetch(import.meta.env.VITE_API_BASEURL + "/api/users/confirmCourse", {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(selectedCourses)
                })
                    .then(res => res.json())
                    .then(data => {
                        console.log('Processed correctly');
                    })
                    .catch(err=> {
                        console.error('Error:', err);
                    })
            });
        
        })
        .catch(err => {
            console.error('Error:', err);
        }) 
    } else {
    return;
    }
});
