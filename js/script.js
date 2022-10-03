document.querySelector("#firstPart").classList.add("none");

document.querySelector("#startGame").addEventListener('click', function() {
    document.querySelector("#leftDoor").style.animation = "leftDoorOpening 1s linear forwards";
    document.querySelector("#rightDoor").style.animation = "rightDoorOpening 1s linear forwards";
    document.querySelector("#startGame").style.opacity = "0";
});

document.querySelector("#rightDoor").addEventListener("animationend", function() {
    document.querySelector("#accueil").style.display = "none";
    document.querySelector("#messageIntro > img").style.animation = "wiggle 1s linear infinite";
}, false);

document.querySelector("#messageIntro > img").addEventListener("click", function() {
    this.classList.add("none");
    document.querySelector("#messageIntro > h1").classList.add("none");
    document.querySelector("#contenuMessage").classList.remove("none");

    // document.querySelector("#contenuMessage").style.height = "50%";
    document.querySelector("#contenuMessage").style.transform = "scale(1)";
    setTimeout(function() {
        document.querySelector("#contenuMessage>button").style.opacity = "1";
    }, 8000);
});

document.querySelector("#contenuMessage>button").addEventListener("click", function() {
    document.querySelector("#messageIntro").style.opacity = "0";
    setTimeout(function() {
        document.querySelector("#messageIntro").classList.add("none");
        document.querySelector("#firstPart").classList.remove("none");
    }, 200);

    setTimeout(function() {
        document.querySelector("#firstPart .next").style.opacity = "1";
    }, 5000);
});

document.querySelector("#firstPart .next").addEventListener("click", function() {
    // document.querySelector("#firstPart").classList.add("none");
    document.querySelectorAll(".firstPlan").forEach(function(element) {
        element.classList.add("none");
    })
});

const optionsDiv = document.querySelector("#MyDialogue");
const questionDiv = document.querySelector("#blackBoard");
let questions = [];
let index = 0;
let nbErreur = 0;
let choiceClicked;

fetch('../json/questions.json')
    .then((response) => response.json())
    .then((data) => {
        questions = data;
        startGame();
    })
    .catch((err) => {
        console.error(err);
    });

document.querySelector("#blackBoard").addEventListener("click", isAnswerCorrect);

function startGame() {
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
        choiceClicked = this.children[0].getAttribute('src');
    } else {
        choiceClicked = this.innerHTML;
    }

    if (questions[index].answer.includes(questions[index].choices.indexOf(choiceClicked))) {
        console.log("bravo tu n'es pas un humain");
        nextQuestion();
    } else {
        console.log("sale humain");
        nbErreur++;
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