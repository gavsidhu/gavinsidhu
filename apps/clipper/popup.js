const authToken = "AUTH_TOKEN_HERE"

const clipperForm = document.getElementById("clipper-form");

clipperForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const saveOption = document.getElementById("save-options")
    console.log(saveOption.value)

    let queryOptions = { active: true, };
    let [tab] = await chrome.tabs.query(queryOptions);
    console.log(tab)

    const res = await fetch("http://localhost:3333/activity", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': authToken
        },
        body: JSON.stringify({ "type": saveOption.value, url: tab.url, title: tab.title })
    });

    if (!res.ok) {
        const data = await res.json();
        const popupContainer = document.getElementById("popup-container")
        const errorMessage = document.createElement("p")
        errorMessage.innerText = data.error
        popupContainer.append(errorMessage)
    }

});

