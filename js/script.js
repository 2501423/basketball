const saveBtn = document.getElementById("saveBtn");
const list = document.getElementById("list");
const summary = document.getElementById("summary");
const opponentSelect = document.getElementById("opponent");

const MY_TEAM = "Houston Rockets";

const nbaTeams = [
  "Atlanta Hawks","Boston Celtics","Brooklyn Nets","Charlotte Hornets",
  "Chicago Bulls","Cleveland Cavaliers","Dallas Mavericks","Denver Nuggets",
  "Detroit Pistons","Golden State Warriors","Houston Rockets","Indiana Pacers",
  "LA Clippers","LA Lakers","Memphis Grizzlies","Miami Heat","Milwaukee Bucks",
  "Minnesota Timberwolves","New Orleans Pelicans","New York Knicks",
  "Oklahoma City Thunder","Orlando Magic","Philadelphia 76ers","Phoenix Suns",
  "Portland Trail Blazers","Sacramento Kings","San Antonio Spurs","Toronto Raptors",
  "Utah Jazz","Washington Wizards"
];

let rocketsPlayers = JSON.parse(localStorage.getItem("players"));
if (!rocketsPlayers || rocketsPlayers.length === 0) {
  rocketsPlayers = [
    "Fred VanVleet","Amen Thompson","Reed Sheppard","Josh Okogie","Tristen Newton",
    "Aaron Holiday","JD Divison","Jae'Sean Tate","Jabari Smith Jr.","Jeff Green",
    "Dorian Finney-Smith","Tari Eason","Kevin Durant","Isaiah Crawford",
    "Alperen Şengün","Clint Capela","Steven Adams"
  ];
  localStorage.setItem("players", JSON.stringify(rocketsPlayers));
}

const teamLogos = {
  "Atlanta Hawks": "img/Hawks.svg","Boston Celtics": "img/Celtics.svg","Brooklyn Nets": "img/Nets.svg",
  "Charlotte Hornets": "img/Hornets.svg","Chicago Bulls": "img/Bulls.svg","Cleveland Cavaliers": "img/Cavaliers.svg",
  "Dallas Mavericks": "img/Mavericks.svg","Denver Nuggets": "img/Nuggets.svg","Detroit Pistons": "img/Pistons.svg",
  "Golden State Warriors": "img/Warriors.svg","Houston Rockets": "img/Rockets.svg","Indiana Pacers": "img/Pacers.svg",
  "LA Clippers": "img/Clippers.svg","LA Lakers": "img/Lakers.svg","Memphis Grizzlies": "img/Grizzlies.svg",
  "Miami Heat": "img/Heat.svg","Milwaukee Bucks": "img/Bucks.svg","Minnesota Timberwolves": "img/Wolves.svg",
  "New Orleans Pelicans": "img/Pelicans.svg",
  "New York Knicks": "img/Knicks.svg",
  "Oklahoma City Thunder": "img/Thunder.svg",
  "Orlando Magic": "img/Magic.svg","Philadelphia 76ers": "img/76ers.svg","Phoenix Suns": "img/Suns.svg",
  "Portland Trail Blazers": "img/Blazers.svg","Sacramento Kings": "img/Kings.svg","San Antonio Spurs": "img/Spurs.svg",
  "Toronto Raptors": "img/Raptors.svg","Utah Jazz": "img/Jazz.svg","Washington Wizards": "img/Wizards.svg"
};

nbaTeams.forEach(team => {
  if (team === MY_TEAM) return;
  const option = document.createElement("option");
  option.value = team;
  option.textContent = team;
  opponentSelect.appendChild(option);
});

const topScorerSelect = document.getElementById("topScorer");
rocketsPlayers.forEach(player => {
  const option = document.createElement("option");
  option.value = player;
  option.textContent = player;
  topScorerSelect.appendChild(option);
});

const games = JSON.parse(localStorage.getItem("rocketsGames")) || [];
let chart;

function render() {
  list.innerHTML = "";

const sortedGames = [...games].sort((a, b) => new Date(b.date) - new Date(a.date));

sortedGames.forEach((game) => {
  const actualIndex = games.indexOf(game);
    const div = document.createElement("div");
    div.className = "game " + (game.isWin ? "win" : "lose");

    div.innerHTML = `
      <strong>
        <div class="team-group">
          <img src="${teamLogos[MY_TEAM]}" class="team-logo" alt="${MY_TEAM}">${MY_TEAM}
        </div>
        <span class="vs-text">vs</span>
        <div class="team-group">
          <img src="${teamLogos[game.opponent]}" class="team-logo" alt="${game.opponent}">${game.opponent}
        </div>
      </strong>
      <div class="score">${game.myScore} - ${game.oppScore} （${game.isWin ? "勝ち" : "負け"}）</div>
      <div class="game-date">${game.date}</div>
      <div class="top-scorer">最多得点：${game.topScorer} (${game.topPoints}点)</div>
      <button onclick="deleteGame(${actualIndex})">削除</button>
    `;

    list.appendChild(div);
  });

  renderSummary();
  renderChart();
}
function renderSummary() {
  const wins = games.filter(g => g.isWin).length;
  const rate = games.length ? Math.round((wins / games.length) * 100) : 0;
  summary.textContent = `勝率：${rate}%（${wins}勝 / ${games.length}試合）`;
}

saveBtn.addEventListener("click", () => {
  const date = document.getElementById("date").value;
  const opponent = opponentSelect.value;
  const topScorer = document.getElementById("topScorer").value;

  if (!date) { alert("日付が入力されていません！"); return; }
  if (!opponent) { alert("相手チームが選択されていません！"); return; }
  if (document.getElementById("myScore").value === "") { alert("Rockets得点が入力されていません！"); return; }
  if (document.getElementById("oppScore").value === "") { alert("相手得点が入力されていません！"); return; }
  if (!topScorer) { alert("最多得点選手が選択されていません！"); return; }
  if (document.getElementById("topPoints").value === "") { alert("最多得点が入力されていません！"); return; }

  const myScore = Number(document.getElementById("myScore").value);
  const oppScore = Number(document.getElementById("oppScore").value);
  const topPoints = Number(document.getElementById("topPoints").value);

  const game = {
    date,
    opponent,
    myScore,
    oppScore,
    isWin: myScore > oppScore,
    topScorer,
    topPoints
  };

  games.push(game);
  localStorage.setItem("rocketsGames", JSON.stringify(games));

  opponentSelect.value = "";
  document.getElementById("myScore").value = "";
  document.getElementById("oppScore").value = "";
  document.getElementById("topScorer").value = "";
  document.getElementById("topPoints").value = "";

  render();
});
function renderChart() {
  const ctx = document.getElementById("scoreChart");
  if (chart) chart.destroy();

  const sortedGames = [...games].sort((a, b) => new Date(a.date) - new Date(b.date));

  const labels = sortedGames.map(g => g.date);
  const data = sortedGames.map(g => g.myScore);

  chart = new Chart(ctx, {
    type: "line",
    data: { labels, datasets: [{ label: "得点", data, borderWidth: 2, tension: 0.3 }] },
    options: { responsive: true }
  });
}
function deleteGame(index) {
  games.splice(index, 1);
  localStorage.setItem("rocketsGames", JSON.stringify(games));
  render();
}

render();