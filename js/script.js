/*Partie Intro*/
let secondes = 0;
let minutes = 5;

let rightDoor = document.querySelector("#rightDoor");
let letter = document.querySelector("#messageIntro > img");
let messageBebe = document.querySelector("#contenuMessage");
let buttonMessageBebe = document.querySelector("#contenuMessage>button");
let dialogueMarchandIntro = document.querySelector("#messageIntro");
let buttonDialogueMarchandIntro = document.querySelector("#firstPart .next");

document.querySelector("#firstPart").classList.add("none");
document.querySelector("#endMessage").classList.add("none");


document.querySelector("#startGame").addEventListener('click', function() {
    document.querySelector("#leftDoor").style.animation = "leftDoorOpening 1s linear forwards";
    rightDoor.style.animation = "rightDoorOpening 1s linear forwards";
    this.style.opacity = "0";
});

rightDoor.addEventListener("animationend", function() {
    document.querySelector("#accueil").style.display = "none";
    letter.style.animation = "wiggle 1s linear infinite";
}, false);

letter.addEventListener("click", function() {
    this.classList.add("none");
    document.querySelector("#messageIntro > h1").classList.add("none");
    messageBebe.classList.remove("none");

    // messageBebe.style.height = "50%";
    messageBebe.style.transform = "scale(1)";
    setTimeout(function() {
        buttonMessageBebe.style.opacity = "1";
    }, 8000);
});

buttonMessageBebe.addEventListener("click", function() {
    dialogueMarchandIntro.style.opacity = "0";
    setTimeout(function() {
        dialogueMarchandIntro.classList.add("none");
        document.querySelector("#firstPart").classList.remove("none");
    }, 200);

    setTimeout(function() {
        buttonDialogueMarchandIntro.style.opacity = "1";
    }, 5000);
});

buttonDialogueMarchandIntro.addEventListener("click", function() {
    // document.querySelector("#firstPart").classList.add("none");
    departCompteRebours();
    document.querySelectorAll(".firstPlan").forEach(function(element) {
        element.classList.add("none");
    })
});

/*Partie quizz*/

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
        startQuiz();
    })
    .catch((err) => {
        console.error(err);
    });

// document.querySelector("#blackBoard").addEventListener("click", isAnswerCorrect);

function startQuiz() {
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
        nextQuestion();
    } else {
        console.log("sale humain");
        nbErreur++;
        switch (nbErreur) {
            case 1:
                document.querySelector("#marchandInGame").setAttribute("src", "images/marchand1.png");
                break;
            case 2:
                document.querySelector("#marchandInGame").setAttribute("src", "images/marchand2.png");
                endGameFail();
                break;

            default:
                break;
        }
        // if (nbErreur >= 2) {
        //     alert("c'est perdu");
        // }
    }
}

function nextQuestion() {
    if (index < questions.length - 1) {
        index++;
        askQuestion(questions[index]);
    } else {
        //next part
        document.querySelectorAll(".quiz").forEach(function(element) {
            element.classList.add("none");
        });
        printPlan();
    }
}

function endGameFail() {
    document.querySelector("#endMessage").classList.remove("none");
    document.querySelector("#endMessage").innerHTML = "<p>Malhereusement pour toi tu as perdu. Tu n'étais pas digne d'avoir un bébé robot.</p><p>Mais tu peux toujours rééssayer si tu as envie ! (ou juste quitter le jeu aussi...)</p><button id='replayButton'>Replay</button>";
    document.querySelector("#replayButton").addEventListener("click", function() {
        location.reload();
    });
}

function printPlan() {
    document.querySelector("#game").innerHTML += "<img src=\"images/imprimante.png\" alt=\"imprimante\" id=\"imprimante\" class=\"interaction\"/>";
    document.querySelector("#imprimante").addEventListener("click", function() {
        //ghbjn
        document.querySelector("#plan").classList.remove("none");
        setTimeout(function() {
            document.querySelector("#plan").style.transform = "scaleY(1)";
        }, 500);

        setTimeout(function() {
            document.querySelector("#plan").style.transform = "scaleY(0.5)";
            document.querySelector("#plan").addEventListener("click", function() {
                this.classList.add("none");
                clearInterval(planMvt);
            });
            const planMvt = setInterval(function() {
                let left = Math.floor(Math.random() * (300 - 1));
                let bottom = Math.floor(Math.random() * (300 - 1));
                console.log("ok");

                document.querySelector("#plan").style.transform = "translate(" + left + "px, " + bottom + "px)";
            }, 800);
        }, 1000);
    })
}

document.querySelector("#huile").addEventListener("click", function() {
    this.classList.add("none");
    document.querySelector("#huileListe").classList.add("collected");
    document.querySelector("#huileListe>img").classList.remove("uncollected");
});

document.querySelector("#ecrous").addEventListener("click", function() {
    this.classList.add("none");
    document.querySelector("#ecrousListe").classList.add("collected");
    document.querySelector("#ecrousListe>img").classList.remove("uncollected");
});

document.querySelector("#metal").addEventListener("click", function() {
    this.classList.add("none");
    document.querySelector("#metalListe").classList.add("collected");
    document.querySelector("#metalListe>img").classList.remove("uncollected");
});

function departCompteRebours() {
    const compteRebours = setInterval(function() {
        if (secondes == 0) {
            secondes = 60;
            minutes--;
        }
        secondes--;
        console.log(minutes + " min " + secondes + " s");
        document.querySelector("#compteRebours").innerHTML = "<p>" + formatNumerique(minutes) + ":" + formatNumerique(secondes) + "</p>";
        if (minutes == 0) {
            document.querySelector("#compteRebours").style.color = "red;"
        }
    }, 1000);

    setTimeout(function() {
        endGameFail();
    }, 300000);
}

function formatNumerique(n) {
    return n > 9 ? "" + n : "0" + n;
}