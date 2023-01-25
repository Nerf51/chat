const ws = new WebSocket("ws://178.33.237.158:26904");
const section = document.getElementById("section");
const chat = document.getElementById("chat-container");
let name;

ws.onopen = function () {
    let username = "";
    username = prompt("Nombre");
    while (username === null || username.trim().length === 0 || username.length > 18) {
        alert("Error, revisa que el nombre sea válido y no seobrepase los 18 caracteres")
        username = prompt("Nombre");
    }
    name = username;
    ws.send(JSON.stringify({
        event: "Authorization",
        data: {
            name
        }
    }))
}

ws.onmessage = function (message) {
    const data = JSON.parse(message.data);
    if (data.event === "connect") {
        appendUser(data.user.name, data.user.id);
    }
    if (data.event === "disconnect") {
        removeUser(data.id);
    }
    if (data.event === "loadUsers") {
        data.users.forEach(user => {
            appendUser(user.name, user.id)
        })
    }
    if (data.event === "message") {
        appendMessage(data.message, data.name)
        chat.scrollTop = chat.scrollHeight;
    }
}

function appendUser(nombre, id) {
    const div = document.createElement("div");
    div.classList.add("user");
    div.setAttribute("id", id)
    const p = document.createElement("p");
    p.textContent = nombre;
    div.appendChild(p);
    const picture = document.createElement("div");
    picture.classList.add("picture");
    div.appendChild(picture);
    section.appendChild(div);
    return 0;
}

function removeUser(id) {
    const element = document.getElementById(id);
    section.removeChild(element);
}

function appendMessage(message, user) {
    const name = user;
    const div = document.createElement("div");
    div.classList.add("message");
    const image = document.createElement("img");
    image.src = "http://getdrawings.com/free-icon-bw/free-avatars-icons-25.png";
    image.alt = "user";
    div.append(image);
    const nameDiv = document.createElement("div");
    nameDiv.setAttribute("id", "name");
    const p1 = document.createElement("p");
    p1.setAttribute("id", "username");
    p1.textContent = name;
    nameDiv.appendChild(p1);
    const p2 = document.createElement("p");
    p2.setAttribute("id", "message");
    p2.textContent = message;
    nameDiv.appendChild(p2);
    div.appendChild(nameDiv);
    chat.append(div);
}
/*
<div class="message" >
                <img src="http://getdrawings.com/free-icon-bw/free-avatars-icons-25.png" alt="user" />
                <div id="name">
                    <p id="username">Nombre</p>
                    <p id="message">Message</p>
                </div>
            </div>
            */

const form = document.getElementById("form");
form.addEventListener("submit", (e) => {
    e.preventDefault();
    const input = document.getElementById("input");
    const value = input.value;
    input.value = "";
    ws.send(JSON.stringify({
        event: "newMessage",
        data: {
            name,
            message: value
        }
    }))
})