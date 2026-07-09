// Paste your Course List Array here
const courses = [
    // Example format:
    // { subject: 'WDD', number: 130, title: 'Web Fundamentals', credits: 2, completed: true },
    // { subject: 'CSE', number: 110, title: 'Programming Building Blocks', credits: 3, completed: false }
];

const container = document.getElementById("course-container");
const creditsSpan = document.getElementById("total-credits");

function displayCourses(filteredCourses) {
    container.innerHTML = "";
    
    filteredCourses.forEach(course => {
        const card = document.createElement("div");
        card.classList.add("course-card");
        if (course.completed) {
            card.classList.add("completed");
        }
        card.textContent = `${course.subject} ${course.number}`;
        container.appendChild(card);
    });

    // Calculate total credits dynamically using reduce
    const totalCredits = filteredCourses.reduce((sum, course) => sum + course.credits, 0);
    creditsSpan.textContent = totalCredits;
}

// Event Listeners for Filters
document.getElementById("all").addEventListener("click", () => displayCourses(courses));
document.getElementById("wdd").addEventListener("click", () => {
    const wddCourses = courses.filter(course => course.subject === "WDD");
    displayCourses(wddCourses);
});
document.getElementById("cse").addEventListener("click", () => {
    const cseCourses = courses.filter(course => course.subject === "CSE");
    displayCourses(cseCourses);
});

// Initial display
displayCourses(courses);