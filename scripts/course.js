// Example array of course objects
const courses = [
    { name: "CSE 110", department: "CSE", credits: 2, completed: true },
    { name: "WDD 130", department: "WDD", credits: 2, completed: true },
    { name: "WDD 131", department: "WDD", credits: 2, completed: true },
    { name: "CSE 210", department: "CSE", credits: 2, completed: true },
    { name: "WDD 231", department: "WDD", credits: 2, completed: false }
];

const container = document.getElementById('course-container');
const creditsDisplay = document.getElementById('total-credits');

function displayCourses(filteredCourses) {
    container.innerHTML = ""; // Clear existing output
    
    filteredCourses.forEach(course => {
        const card = document.createElement('div');
        card.className = `course-card ${course.completed ? 'completed' : ''}`;
        card.innerHTML = `<h3>${course.name}</h3><p>Credits: ${course.credits}</p>`;
        container.appendChild(card);
    });

    // Calculate total credits displayed using reduce
    const totalCredits = filteredCourses.reduce((sum, course) => sum + course.credits, 0);
    creditsDisplay.textContent = `Total Credits: ${totalCredits}`;
}

// Event Listeners for Filter Buttons
document.getElementById('all-btn').addEventListener('click', () => displayCourses(courses));
document.getElementById('wdd-btn').addEventListener('click', () => {
    const wddCourses = courses.filter(course => course.department === "WDD");
    displayCourses(wddCourses);
});
document.getElementById('cse-btn').addEventListener('click', () => {
    const cseCourses = courses.filter(course => course.department === "CSE");
    displayCourses(cseCourses);
});

// Initial load
displayCourses(courses);