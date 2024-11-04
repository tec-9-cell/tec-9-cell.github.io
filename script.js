const questions = {
    easy: [
        { question: "¿De qué casa es Harry?", answers: ["Gryffindor", "Slytherin", "Ravenclaw", "Hufflepuff"], correct: 0 },
        { question: "¿Cuál es la profesión de Hagrid?", answers: ["Profesor", "Conserje", "Guardabosques", "Ministerio"], correct: 2 }
    ],
    medium: [
        { question: "¿Cómo se llama la mascota de Harry?", answers: ["Hedwig", "Fawkes", "Scabbers", "Crookshanks"], correct: 0 },
        { question: "¿Quién mató a Dumbledore?", answers: ["Snape", "Voldemort", "Bellatrix", "Draco"], correct: 0 }
    ],
    hard: [
        { question: "¿Cómo se llama el primer basilisco que mató un heredero de Slytherin?", answers: ["Nagini", "Aragog", "Salazar", "No se menciona su nombre en los libros"], correct: 3 },
        { question: "¿Qué número tiene la bóveda de la familia Potter en Gringotts?", answers: ["687", "713", "711", "394"], correct: 0 }
    ]
};

let score = 0;
let timer;
let timeLeft = 30;
let questionIndex = 0;
let currentQuestions = [];
let highScore = localStorage.getItem("highScore") || 0;
let selectedAnswers = [];

document.getElementById("high-score").textContent = `Puntaje Máximo: ${highScore}`;

function startGame() {
    const difficulty = document.getElementById("difficulty").value;
    score = 0;
    questionIndex = 0;
    selectedAnswers = [];
    currentQuestions = shuffleQuestions(questions[difficulty]);
    showQuestion();
    startTimer();
    document.getElementById("score").textContent = `Puntaje: 0`;
    document.getElementById("house").textContent = `Casa: -`;
}

function shuffleQuestions(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function showQuestion() {
    if (questionIndex >= currentQuestions.length) {
        endGame();
        return;
    }
    const q = currentQuestions[questionIndex];
    document.getElementById("question").textContent = q.question;
    const answersDiv = document.getElementById("answers");
    answersDiv.innerHTML = '';
    q.answers.forEach((answer, index) => {
        const button = document.createElement("button");
        button.textContent = answer;
        button.onclick = () => checkAnswer(index);
        answersDiv.appendChild(button);
    });
}

function checkAnswer(selected) {
    const q = currentQuestions[questionIndex];
    if (selected === q.correct) {
        score += getScoreForDifficulty();
    }
    selectedAnswers.push(selected);
    questionIndex++;
    document.getElementById("score").textContent = `Puntaje: ${score}`;
    showQuestion();
}

function getScoreForDifficulty() {
    const difficulty = document.getElementById("difficulty").value;
    if (difficulty === "easy") return 2;
    if (difficulty === "medium") return 3;
    return 5;
}

function startTimer() {
    timeLeft = 30;
    clearInterval(timer);
    timer = setInterval(() => {
        if (timeLeft <= 0) {
            clearInterval(timer);
            endGame();
        } else {
            document.getElementById("timer").textContent = `Tiempo: ${timeLeft}`;
            timeLeft--;
        }
    }, 1000);
}

function endGame() {
    clearInterval(timer);
    assignHouse();
    alert(`Juego terminado! Puntaje: ${score}`);
    if (score > highScore) {
        highScore = score;
        localStorage.setItem("highScore", highScore);
        document.getElementById("high-score").textContent = `Puntaje Máximo: ${highScore}`;
    }
}

function assignHouse() {
    let gryffindor = 0, slytherin = 0, ravenclaw = 0, hufflepuff = 0;
    selectedAnswers.forEach(answer => {
        if (answer === 0) gryffindor++;
        else if (answer === 1) slytherin++;
        else if (answer === 2) ravenclaw++;
        else hufflepuff++;
    });
    let house = "Hufflepuff";
    if (gryffindor > slytherin && gryffindor > ravenclaw && gryffindor > hufflepuff) house = "Gryffindor";
    else if (slytherin > gryffindor && slytherin > ravenclaw && slytherin > hufflepuff) house = "Slytherin";
    else if (ravenclaw > gryffindor && ravenclaw > slytherin && ravenclaw > hufflepuff) house = "Ravenclaw";
    document.getElementById("house").textContent = `Casa: ${house}`;
}

function saveScore() {
    const playerName = document.getElementById("player-name").value;
    if (!playerName) return;
    const rankingList = document.getElementById("ranking-list");
    const newScore = { name: playerName, points: score, time: 30 - timeLeft };
    let ranking = JSON.parse(localStorage.getItem("ranking")) || [];
    ranking.push(newScore);
    ranking.sort((a, b) => b.points - a.points || a.time - b.time);
    ranking = ranking.slice(0, 10);
    localStorage.setItem("ranking", JSON.stringify(ranking));
    displayRanking(ranking);
}

function displayRanking(ranking) {
    const rankingList = document.getElementById("ranking-list");
    rankingList.innerHTML = '';
    ranking.forEach(player => {
        const listItem = document.createElement("li");
        listItem.textContent = `${player.name} - ${player.points} puntos - ${player.time}s`;
        rankingList.appendChild(listItem);
    });
}

document.addEventListener("DOMContentLoaded", () => {
    const ranking = JSON.parse(localStorage.getItem("ranking")) || [];
    displayRanking(ranking);
});
