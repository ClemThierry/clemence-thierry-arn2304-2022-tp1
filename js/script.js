const optionsDiv = document.querySelector("#MyDialogue");
const questionDiv = document.querySelector("#PNJdialogue");
let questions = [];
let index = 0;
let nbErreur = 0;

fetch('../json/questions.json')
    .then((response) => response.json())
    .then((data) => {
        questions = data;
        startGame();
    })
    .catch((err) => {
        console.error(err);
    });

document.querySelector("#PNJdialogue").addEventListener("click", isAnswerCorrect);

function startGame() {

    console.log("le jeu peut commencer ! ");
    console.log(questions.length);
    askQuestion(questions[index]);
    // if (isAnswerCorrect) {
    //     alert("dommage")
    // }
}

function askQuestion(askingQuestion) {
    questionDiv.innerHTML = "<p>" + askingQuestion.question + "</p>";
    if (askingQuestion.image != "") {
        questionDiv.innerHTML += "<img src='" + askingQuestion.image + "'/>";
    }


    optionsDiv.innerHTML = "";
    if (askingQuestion.type == "text") {
        askingQuestion.choices.forEach((choice) => {
            optionsDiv.innerHTML += "<div class=\"choices\">" + choice + "</div>";
        });
    } else {
        console.log(askingQuestion.choices);
        askingQuestion.choices.forEach((choice) => {
            optionsDiv.innerHTML += "<div class=\"choices\"><img src='" + choice + "'/></div>";
        });
    }
    document.querySelectorAll('.choices').forEach(choice => {
        choice.addEventListener('click', isAnswerCorrect);
    });

}

function isAnswerCorrect() {
    if (this.children[0]) {
        if (this.children[0].getAttribute('src') == questions[index].choices[questions[index].answer]) {
            console.log("sale humain");
            nbErreur++;
        } else {
            console.log("bravo tu n'es pas un humain");
            nextQuestion();
        }
    } else {
        if (this.innerHTML == questions[index].choices[questions[index].answer]) {
            console.log("sale humain");
            nbErreur++;
        } else {
            console.log("bravo tu n'es pas un humain");
            nextQuestion();
        }
    }
}

function nextQuestion() {
    if (index < questions.length - 1) {
        index++;
        askQuestion(questions[index]);
    } else {
        console.log("Plus de questions.");
    }
}