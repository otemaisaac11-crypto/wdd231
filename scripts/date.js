// Dynamically populate the current year for the copyright
document.getElementById("currentyear").textContent = new Date().getFullYear();

// Dynamically populate the last modified date
document.getElementById("lastModified").textContent = `Last Modification: ${document.lastModified}`;