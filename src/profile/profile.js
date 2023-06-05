// since this page should require login, make sure that user is authenticated
import Auth from '../js/auth';
import CreateGraph  from './flowchart.js';

const auth = new Auth();
const graph = new CreateGraph();

// Gets users course plans on page load and generate flowcharts
document.addEventListener("DOMContentLoaded", async (e) => {
    // make sure that user is logged in
    auth.validateAuth();

    // fill in profile info if user is logged in
    if (auth.isLoggedIn()) {
        const profileInfo = await getProfile();
        let nameElement = document.getElementById("profileName");
        let emailElement = document.getElementById("profileEmail");
        let completedCourses = document.getElementById("completedCourses");
        let degreePrograms = document.getElementById("degreePrograms");
        nameElement.innerHTML = profileInfo.name;
        emailElement.innerHTML = profileInfo.email;
        completedCourses.innerHTML = profileInfo.courses.toString() || 'No completed courses';
        degreePrograms.innerHTML = profileInfo.degreePrograms.toString() || 'No degrees added';

        // generate graph too
        await graph.generateMajor1();
    }



    return;
});

async function getProfile() {
    const response = await fetch(
        import.meta.env.VITE_API_BASEURL + "/api/users/profile",
        {   
            method: "GET",
            credentials: "include"
        }
    );

    let jsonResponse = await response.json();

    return jsonResponse;
}