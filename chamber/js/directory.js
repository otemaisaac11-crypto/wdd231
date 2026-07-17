// Footer dates
document.getElementById("currentyear").textContent = new Date().getFullYear();
document.getElementById("lastModified").textContent = document.lastModified;

// Fetch and display members
const url = "data/members.json";
const container = document.querySelector("#members-container");

async function getMembers() {
    try {
        const response = await fetch(url);
        if (response.ok) {
            const data = await response.json();
            displayMembers(data);
        } else {
            console.error("Failed to fetch data");
        }
    } catch (error) {
        console.error("Error fetching data:", error);
    }
}

function displayMembers(members) {
    container.innerHTML = ""; // Clear existing content
    
    members.forEach((member) => {
        const card = document.createElement("section");
        card.classList.add("member-card");

        // Convert level to text
        const levels = { 1: "Member", 2: "Silver", 3: "Gold" };

        card.innerHTML = `
            <img src="images/${member.image}" alt="${member.name} Logo" loading="lazy">
            <h3>${member.name}</h3>
            <p>${member.addresses}</p>
            <p>${member.phone}</p>
            <p><a href="${member.website}" target="_blank">Visit Website</a></p>
            <p class="membership">Level: ${levels[member.membershipLevel]}</p>
            <p class="extra-info">${member.otherInfo}</p>
        `;
        container.appendChild(card);
    });
}

// Toggle Views (Grid vs List)
const gridButton = document.querySelector("#grid");
const listButton = document.querySelector("#list");

gridButton.addEventListener("click", () => {
    container.classList.add("grid-view");
    container.classList.remove("list-view");
});

listButton.addEventListener("click", () => {
    container.classList.add("list-view");
    container.classList.remove("grid-view");
});

getMembers();