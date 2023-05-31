const preview = document.querySelector('.preview');
const input = document.querySelector('input');
input.style.opacity = 0;

const fileInput = document.getElementById('file_input');
let file = null;
const form = document.getElementById('uploadForm');
const submitButton = document.getElementById('submit');
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
            
            var p = document.getElementById('6-p');
            var courselist = document.getElementById('course-list');
            p.textContent = '';


            for (let i = 0; i < data.length; i++) {
                let li = courselist.appendChild(document.createElement("li"));
                const innerArray = data[i];
                const crn = innerArray[4];
                const name = innerArray[2];
                li.value = crn, name;
                li.innerHTML = `[Course Name: ${name} CRN: ${crn}]`;
            }
            console.log(typeof data, data);
        })
        .catch(err => {
            console.error('Error:', err);
        }) 
    } else {
    return;
    }
});



/*
form.addEventListener('submit', (e) => {
    e.preventDefault();

    const file = fileInput.files[0];
    if (file.type !== 'text/html') {
        fileInput.value = '';
        preview.textContent = 'Invalid file, please send an HTML file.'
        return;
    } else {
        preview.textContent = `File selected: ${file.name}`;

        const htmlData = new htmlData();
        htmlData.append('htmlFile', file);

        fetch('/upload', {
            method: 'POST',
            body: htmlData
        })
        .then(res => res.json())
        .then(data => {
            console.log(data);
        })
        .catch(err => {
            console.error('Error:', err);
        })
    } 
});
*/