let rocketsPlayers = JSON.parse(localStorage.getItem("players"));

if (!rocketsPlayers || rocketsPlayers.length === 0) {
  rocketsPlayers = [
  "Fred VanVleet",
  "Amen Thompson",
  "Reed Sheppard",
  "Josh Okogie",
  "Tristen Newton",
  "Aaron Holiday",
  "JD Divison",
  "Jae'Sean Tate",
  "Jabari Smith Jr.",
  "Jeff Green",
  "Dorian Finney-Smith",
  "Tari Eason",
  "Kevin Durant",
  "Isaiah Crawford",
  "Alperen Şengün",
  "Clint Capela",
  "Steven Adams",
  ];
  localStorage.setItem("players", JSON.stringify(rocketsPlayers));
}

const playerList = document.getElementById("playerList");
const addBtn = document.getElementById("addPlayerBtn");

function render() {
  playerList.innerHTML = "";

  rocketsPlayers.forEach((player, index) => {
    const div = document.createElement("div");

    div.innerHTML = `
      <span class="player-name">${player}</span>
      <button onclick="deletePlayer(${index})">削除</button>
    `;

    playerList.appendChild(div);
  });
}

addBtn.addEventListener("click", () => {
  const input = document.getElementById("newPlayer");
  const name = input.value;

  if (!name) return;

  rocketsPlayers.push(name);
  localStorage.setItem("players", JSON.stringify(rocketsPlayers));

  input.value = "";
  render();
});

function deletePlayer(index) {
  rocketsPlayers.splice(index, 1);
  localStorage.setItem("players", JSON.stringify(rocketsPlayers));
  render();
}

render();