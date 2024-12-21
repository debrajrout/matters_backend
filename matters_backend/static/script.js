const API_BASE_URL = "http://127.0.0.1:8000"; // Backend URL
let mattersContainer = document.getElementById("mattersContainer");
let generateBtn = document.getElementById("generateBtn");
let exportBtn = document.getElementById("exportBtn");
let contextMenu = document.getElementById("contextMenu");
let matters = [];

// Fetch matters from the backend
async function loadMatters() {
    try {
        const response = await fetch(`${API_BASE_URL}/matters`);
        const data = await response.json();
        data.forEach((matter) => {
            createMatterFromData(matter);
        });
    } catch (error) {
        console.error("Failed to load matters:", error);
    }
}

// Save a new matter to the backend
async function saveMatter(matter) {
    try {
        const response = await fetch(`${API_BASE_URL}/matters`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(matter),
        });
        const savedMatter = await response.json();
        return savedMatter; // Returns the saved matter with an ID
    } catch (error) {
        console.error("Failed to save matter:", error);
    }
}

// Delete a matter from the backend
async function deleteMatter(id) {
    try {
        await fetch(`${API_BASE_URL}/matters/${id}`, { method: "DELETE" });
    } catch (error) {
        console.error("Failed to delete matter:", error);
    }
}

// Update a matter's state in the backend
async function updateMatterState(id, newState) {
    try {
        await fetch(`${API_BASE_URL}/matters/${id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ state: newState }),
        });
    } catch (error) {
        console.error("Failed to update matter state:", error);
    }
}

// Generate a new matter
async function createMatter() {
    let newMatter = { state: "Gas" };
    let savedMatter = await saveMatter(newMatter);
    if (savedMatter) {
        createMatterFromData(savedMatter);
    }
}

// Create a matter element from data
function createMatterFromData(data) {
    let matter = document.createElement("div");
    matter.className = `matter ${data.state.toLowerCase()}`;
    matter.textContent = data.state;
    matter.dataset.id = data.id; // Attach ID for backend operations
    mattersContainer.appendChild(matter);
    matters.push(matter);
    attachEventHandlers(matter);
}

// Attach event handlers to a matter
function attachEventHandlers(matter) {
    matter.addEventListener("click", async () => {
        await deleteMatter(matter.dataset.id); // Delete from backend
        mattersContainer.removeChild(matter);
        matters = matters.filter((m) => m !== matter);
    });

    matter.addEventListener("contextmenu", (e) => {
        e.preventDefault();
        showContextMenu(e, matter);
    });
}

// Show the context menu
function showContextMenu(event, matter) {
    contextMenu.style.display = "block";
    contextMenu.style.left = `${event.pageX}px`;
    contextMenu.style.top = `${event.pageY}px`;

    let options = contextMenu.querySelectorAll("li");
    options.forEach((option) => {
        let state = option.getAttribute("data-state");
        if (isValidStateTransition(matter.textContent, state)) {
            option.style.display = "block";
        } else {
            option.style.display = "none";
        }
        option.onclick = async () => {
            await updateMatterState(matter.dataset.id, state); // Update in backend
            changeState(matter, state);
        };
    });
}

// Hide the context menu
function hideContextMenu() {
    contextMenu.style.display = "none";
}

// Validate state transition
function isValidStateTransition(current, next) {
    return (
        (current === "Gas" && (next === "Liquid" || next === "Solid")) ||
        (current === "Liquid" && next === "Solid")
    );
}

// Change the state of a matter
function changeState(matter, newState) {
    matter.textContent = newState;
    matter.className = `matter ${newState.toLowerCase()}`;
    hideContextMenu();
}

// Export matter counts to a text file
function exportToFile() {
    let counts = matters.reduce(
        (acc, matter) => {
            acc[matter.textContent]++;
            return acc;
        },
        { Gas: 0, Liquid: 0, Solid: 0 }
    );

    let content = `Gas: ${counts.Gas}\nLiquid: ${counts.Liquid}\nSolid: ${counts.Solid}`;
    let blob = new Blob([content], { type: "text/plain" });
    let link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "matter_counts.txt";
    link.click();
}

// Event listeners
generateBtn.addEventListener("click", createMatter);
exportBtn.addEventListener("click", exportToFile);
document.addEventListener("click", hideContextMenu);

// Load matters on page load
window.onload = loadMatters;