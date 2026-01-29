
document.addEventListener("DOMContentLoaded", () => {
    pollEvents();
    // Poll every 15 seconds as per requirements
    setInterval(pollEvents, 15000);
});

async function pollEvents() {
    try {
        const response = await fetch("/events");
        const data = await response.json();
        renderEvents(data);
    } catch (error) {
        console.error("Error fetching events:", error);
    }
}

function renderEvents(events) {
    const feed = document.getElementById("feed");

    if (events.length === 0) {
        // preserve loading state if we want, or show specific empty state
        // for now, do nothing or show "No events yet" logic
        return;
    }

    feed.innerHTML = ""; // Clear current feed

    events.forEach(event => {
        const card = document.createElement("div");
        card.classList.add("card");

        let content = "";
        let typeClass = "";

        if (event.type === "PUSH") {
            typeClass = "push";
            content = `<span class="author">"${event.author}"</span> pushed to <span class="branch">"${event.to_branch}"</span> on ${event.timestamp}`;
        }
        else if (event.type === "PULL_REQUEST") {
            typeClass = "pr";
            content = `<span class="author">"${event.author}"</span> submitted a pull request from <span class="branch">"${event.from_branch}"</span> to <span class="branch">"${event.to_branch}"</span> on ${event.timestamp}`;
        }
        else if (event.type === "MERGE") {
            typeClass = "merge";
            content = `<span class="author">"${event.author}"</span> merged branch <span class="branch">"${event.from_branch}"</span> to <span class="branch">"${event.to_branch}"</span> on ${event.timestamp}`;
        }

        card.classList.add(typeClass);
        card.innerHTML = `
            <div class="card-text">${content}</div>
        `;
        feed.appendChild(card);
    });
}
