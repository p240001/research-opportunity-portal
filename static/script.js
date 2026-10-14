const API_URL = "/api/opportunities";
const listElement = document.getElementById("opportunityList");
const messageElement = document.getElementById("message");
const form = document.getElementById("opportunityForm");
const formHeading = document.getElementById("formHeading");
const saveButton = document.getElementById("saveButton");
const cancelEditButton = document.getElementById("cancelEditButton");
let editingId = null;

function showMessage(message, isError = false) {
    messageElement.replaceChildren();
    const notice = document.createElement("div");
    notice.className = isError ? "notice error" : "notice";
    notice.textContent = message;
    messageElement.appendChild(notice);
}

function clearMessage() {
    messageElement.replaceChildren();
}

async function apiRequest(url, options = {}) {
    const response = await fetch(url, {
        ...options,
        headers: { "Content-Type": "application/json", ...(options.headers || {}) }
    });
    const body = await response.json().catch(() => ({}));
    if (!response.ok) {
        throw new Error(body.error || body.message || `Request failed (${response.status})`);
    }
    return body;
}

function addText(parent, tag, className, text) {
    const element = document.createElement(tag);
    if (className) element.className = className;
    element.textContent = text ?? "";
    parent.appendChild(element);
    return element;
}

function createCard(opportunity) {
    const card = document.createElement("article");
    card.className = "opportunity-card";
    const top = document.createElement("div");
    top.className = "card-top";
    const title = addText(top, "h3", "", opportunity.research_title);
    const badge = addText(top, "span", "badge" + (opportunity.status === "Closed" ? " closed" : ""), opportunity.status);
    card.appendChild(top);
    addText(card, "p", "card-meta",
        `${opportunity.research_area} · ${opportunity.department} · ${opportunity.faculty_name}`);
    addText(card, "p", "card-description", opportunity.research_description);
    addText(card, "p", "card-skills", `Required skills: ${opportunity.required_skills}`);
    addText(card, "p", "card-meta",
        `Positions: ${opportunity.available_positions} · Deadline: ${opportunity.application_deadline}`);

    const actions = document.createElement("div");
    actions.className = "card-actions";
    const detailsButton = addText(actions, "button", "button secondary", "Details");
    detailsButton.type = "button";
    detailsButton.addEventListener("click", () => showDetails(opportunity.id));

    const editButton = addText(actions, "button", "button secondary", "Edit");
    editButton.type = "button";
    editButton.addEventListener("click", () => beginEdit(opportunity.id));

    const statusButton = addText(actions, "button", "button secondary",
        opportunity.status === "Open" ? "Close opportunity" : "Reopen opportunity");
    statusButton.type = "button";
    statusButton.addEventListener("click", () => changeStatus(opportunity));

    const deleteButton = addText(actions, "button", "button danger", "Delete");
    deleteButton.type = "button";
    deleteButton.addEventListener("click", () => deleteOpportunity(opportunity.id));

    card.appendChild(actions);
    return card;
}

async function loadOpportunities() {
    listElement.replaceChildren();
    addText(listElement, "p", "muted", "Loading opportunities…");
    try {
        const opportunities = await apiRequest(API_URL);
        listElement.replaceChildren();
        if (opportunities.length === 0) {
            addText(listElement, "p", "muted", "No opportunities have been posted yet. Use the form to add one.");
            return;
        }
        opportunities.forEach(item => listElement.appendChild(createCard(item)));
    } catch (error) {
        listElement.replaceChildren();
        addText(listElement, "p", "muted", "Could not load opportunities. Check that Flask and MySQL are running.");
        showMessage(error.message, true);
    }
}

async function showDetails(id) {
    clearMessage();
    try {
        const item = await apiRequest(`${API_URL}/${id}`);
        showMessage(`Opportunity #${item.id}: ${item.research_title}. Faculty: ${item.faculty_name}. Department: ${item.department}. Area: ${item.research_area}. Skills: ${item.required_skills}. Positions: ${item.available_positions}. Deadline: ${item.application_deadline}. Status: ${item.status}. Description: ${item.research_description}`);
    } catch (error) {
        showMessage(error.message, true);
    }
}

async function beginEdit(id) {
    clearMessage();
    try {
        const item = await apiRequest(`${API_URL}/${id}`);
        editingId = id;
        for (const [key, value] of Object.entries(item)) {
            if (form.elements.namedItem(key)) form.elements.namedItem(key).value = value;
        }
        formHeading.textContent = `Edit opportunity #${id}`;
        saveButton.textContent = "Save changes";
        cancelEditButton.classList.remove("hidden");
        form.scrollIntoView({ behavior: "smooth", block: "start" });
    } catch (error) {
        showMessage(error.message, true);
    }
}

function resetForm() {
    editingId = null;
    form.reset();
    formHeading.textContent = "Post an opportunity";
    saveButton.textContent = "Create opportunity";
    cancelEditButton.classList.add("hidden");
}

async function changeStatus(item) {
    clearMessage();
    const status = item.status === "Open" ? "Closed" : "Open";
    try {
        await apiRequest(`${API_URL}/${item.id}`, {
            method: "PUT",
            body: JSON.stringify({ status })
        });
        showMessage(`Opportunity status changed to ${status}.`);
        await loadOpportunities();
    } catch (error) {
        showMessage(error.message, true);
    }
}

async function deleteOpportunity(id) {
    if (!window.confirm(`Delete opportunity #${id}? This cannot be undone.`)) return;
    clearMessage();
    try {
        await apiRequest(`${API_URL}/${id}`, { method: "DELETE" });
        showMessage("Opportunity deleted.");
        if (editingId === id) resetForm();
        await loadOpportunities();
    } catch (error) {
        showMessage(error.message, true);
    }
}

form.addEventListener("submit", async event => {
    event.preventDefault();
    clearMessage();
    if (!form.reportValidity()) return;

    const data = Object.fromEntries(new FormData(form).entries());
    data.available_positions = Number(data.available_positions);
    const url = editingId === null ? API_URL : `${API_URL}/${editingId}`;
    const method = editingId === null ? "POST" : "PUT";
    try {
        await apiRequest(url, { method, body: JSON.stringify(data) });
        showMessage(editingId === null ? "Opportunity created successfully." : "Opportunity updated successfully.");
        resetForm();
        await loadOpportunities();
    } catch (error) {
        showMessage(error.message, true);
    }
});

cancelEditButton.addEventListener("click", resetForm);
document.getElementById("refreshButton").addEventListener("click", loadOpportunities);
loadOpportunities();
