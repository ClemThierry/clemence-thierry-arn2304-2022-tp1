/*Partie Intro*/
let secondes = 0;
let minutes = 5;

let rightDoor = document.querySelector("#rightDoor");
let letter = document.querySelector("#messageIntro > img");
let messageBebe = document.querySelector("#contenuMessage");
let buttonMessageBebe = document.querySelector("#contenuMessage>button");
let dialogueMarchandIntro = document.querySelector("#messageIntro");
let buttonDialogueMarchandIntro = document.querySelector("#messageMarchand .next");

document.querySelector("#messageMarchand").classList.add("none");
document.querySelector("#mainPart").classList.add("none");
document.querySelector("#endMessage").classList.add("none");


document.querySelector("#startGame").addEventListener('click', function() {
    document.querySelector("#leftDoor").style.animation = "leftDoorOpening 1.8s linear forwards";
    rightDoor.style.animation = "rightDoorOpening 1.8s linear forwards";
    document.querySelector("#doorSound").play();
    document.querySelector("#title").style.opacity = "0";
    this.style.opacity = "0";
    jouerMusique();
});

rightDoor.addEventListener("animationend", function() {
    document.querySelector("#accueil").style.display = "none";
    letter.style.animation = "wiggle 1s linear infinite";
}, false);

letter.addEventListener("click", function() {
    this.classList.add("none");
    document.querySelector("#messageIntro > h1").classList.add("none");
    messageBebe.classList.remove("none");

    messageBebe.style.transform = "scale(1)";
    setTimeout(function() {
        buttonMessageBebe.style.opacity = "1";
    }, 5000);
});

buttonMessageBebe.addEventListener("click", function() {
    dialogueMarchandIntro.style.opacity = "0";
    setTimeout(function() {
        dialogueMarchandIntro.classList.add("none");
        document.querySelector("#messageMarchand").classList.remove("none");
    }, 200);

    setTimeout(function() {
        buttonDialogueMarchandIntro.style.opacity = "1";
    }, 4000);
});

buttonDialogueMarchandIntro.addEventListener("click", function() {
    // document.querySelector("#mainPart").classList.add("none");
    departCompteRebours();
    document.querySelector("#messageMarchand").classList.add("none");
    document.querySelector("#littleSpeaker").classList.add("none");
    document.querySelector("#mainPart").classList.remove("none");
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
}

function askQuestion(askingQuestion) {
    questionDiv.innerHTML = "<p>" + askingQuestion.question + "</p>";
    if (askingQuestion.image != "") {
        questionDiv.innerHTML += "<img src='" + askingQuestion.image + "'/>";
    }


    optionsDiv.innerHTML = "";
    if (askingQuestion.type == "text") {
        askingQuestion.choices.forEach((choice) => {
            optionsDiv.innerHTML += "<p class=\"choices interaction\">" + choice + "</p>";
        });
    } else {
        console.log(askingQuestion.choices);
        askingQuestion.choices.forEach((choice) => {
            optionsDiv.innerHTML += "<div class=\"choices interaction\"><img src='" + choice + "'/></div>";
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
        document.querySelector("#goodSound").play();
    } else {
        document.querySelector("#wrongSound").play();
        nbErreur++;
        switch (nbErreur) {
            case 1:
                document.querySelector("#marchandInGame>img").setAttribute("src", "images/marchand1.png");
                break;
            case 2:
                document.querySelector("#marchandInGame>img").setAttribute("src", "images/marchand2.png");
                endGameFail();
                break;

            default:
                break;
        }
    }
}

function nextQuestion() {
    if (index < questions.length - 1) {
        index++;
        askQuestion(questions[index]);
    } else {
        //next part
        optionsDiv.innerHTML = "";
        optionsDiv.classList.add("none");
        document.querySelectorAll('.choices').forEach(choice => {
            choice.removeEventListener('click', isAnswerCorrect);
        });
        document.querySelector("#blackBoard").innerHTML = "";
        printPlan();
    }
}
let planMvt;
let imprimante = document.querySelector("#imprimante");


function printPlan() {
    imprimante.classList.add("interaction");
    imprimante.addEventListener("click", function() {
        this.classList.remove("interaction");
        document.querySelector("#plan").classList.remove("none");
        activateItems();
        setTimeout(function() {
            document.querySelector("#plan").style.transform = "scaleY(1)";
        }, 500);

        setTimeout(function() {
            document.querySelector("#plan").style.transform = "scaleY(0.5)";
            document.querySelector("#plan").addEventListener("click", function() {
                document.querySelector("#phase1").classList.add("collected");
                this.classList.add("none");
                document.querySelector("#inventory").style.transform = "scaleY(1)";
                clearInterval(planMvt);
            });
            planMvt = setInterval(function() {
                let left = Math.floor(Math.random() * (300 - 1));
                let bottom = Math.floor(Math.random() * (300 - 1));
                console.log("ok");

                document.querySelector("#plan").style.transform = "translate(" + left + "px, " + bottom + "px)";
            }, 800);
        }, 1000);


    }, { once: true });
}

let huile = document.querySelector("#huile");
let ecrous = document.querySelector("#ecrous");

function activateItems() {
    huile.classList.add("interaction");
    ecrous.classList.add("interaction");
    document.querySelector("#marchandInGame>img").classList.add("interaction");
    document.querySelector("#marchandInGame").addEventListener("click", dialogueMarchand);


    huile.addEventListener("click", function() {
        this.classList.add("none");
        document.querySelector("#huileListe").classList.add("collected");
        document.querySelector("#huileListe>img").classList.remove("uncollected");
        itemsCollected++;
        if (itemsCollected == 2) {
            nextDialogueID = 1;
        }
        itemCollectedMusic();
    }, { once: true });

    ecrous.addEventListener("click", function() {
        this.setAttribute("src", "images/potecrous1.png");
        document.querySelector("#ecrousListe").classList.add("collected");
        document.querySelector("#ecrousListe>img").classList.remove("uncollected");
        itemsCollected++;
        if (itemsCollected == 2) {
            nextDialogueID = 1;
        }
        itemCollectedMusic();
    }, { once: true });
}




/*Last part*/

let itemsCollected = 0;
let dialogues;
let nextDialogueID = 0;


fetch('../json/dialogue.json')
    .then((response) => response.json())
    .then((data) => {
        dialogues = data;
        dialogueReceive();
    })
    .catch((err) => {
        console.error(err);
    });

function dialogueReceive() {
    return true;
}

function dialogueMarchand() {
    if (dialogueReceive()) {
        document.querySelector("#marchandInGame>p").style.opacity = "1";
        document.querySelector("#marchandInGame>p").innerHTML = dialogues[nextDialogueID].marchand;
        if (nextDialogueID >= 1) {
            optionsDiv.classList.remove("none");
            optionsDiv.innerHTML = "";
            dialogues[nextDialogueID].joueur.forEach((choice, index) => {
                optionsDiv.innerHTML += "<p class=\"choices interaction\" currentID='" + nextDialogueID + "' nextID='" + dialogues[nextDialogueID].next[index] + "' onclick='updateNextDialogueID(this.getAttribute(\"nextID\"), this.getAttribute(\"currentID\"))'>" + choice + "</p>";
            });
            if (nextDialogueID == 3) {
                document.querySelector("#metalListe").classList.add("collected");
                document.querySelector("#metalListe>img").classList.remove("uncollected");
                itemsCollected++;
                itemCollectedMusic();
                setTimeout(endGameWin(), 2000);
            }
        }
    }
}

function updateNextDialogueID(nextIndex, currentIndex) {
    nextDialogueID = nextIndex;
    if (dialogues[currentIndex].isNext) {
        dialogueMarchand();
    } else {
        closeDialogue();
    }
}

function closeDialogue() {
    optionsDiv.classList.add("none");
    document.querySelector("#marchandInGame>p").style.opacity = "0";
}


function endGameFail() {
    clearInterval(compteRebours);
    pauseMusique();
    playEndMusique("audio/fail.wav");
    document.querySelector("#endMessage").classList.remove("none");
    document.querySelector("#endMessage").style.opacity = "1";
    document.querySelector("#endMessage").innerHTML = "<div><p>Malhereusement pour toi tu as perdu. Tu n'étais pas digne d'avoir un bébé robot.</p><p>Mais tu peux toujours rééssayer si tu as envie ! (ou juste quitter le jeu aussi...)</p></div><button id='replayButton' class='boutons interaction'>Replay</button>";
    document.querySelector("#replayButton").addEventListener("click", function() {
        location.reload();
    });
}

function endGameWin() {

    document.querySelector("#endMessage").classList.remove("none");
    setTimeout(function() {
        pauseMusique();
        playEndMusique("audio/win.mp3");
        document.querySelector("#mainPart").style.opacity = "0";
        console.log("gagné");
        clearInterval(compteRebours);
        document.querySelector("#endMessage").style.opacity = "1";
        document.querySelector("#endMessage").innerHTML = "<h2>Félicitation te voilà parent !</h2><p>Merci d'avoir joué à Robabies.</p><img src='images/bebe.png' alt='bébé robot'/><button id='replayButton' class='boutons interaction'>Replay</button>";
        document.querySelector("#replayButton").addEventListener("click", function() {
            location.reload();
        });
    }, 2000)

}


/*Compte à rebours*/

let compteRebours;

function departCompteRebours() {
    compteRebours = setInterval(function() {
        if (secondes == 0) {
            secondes = 60;
            minutes--;
            if (minutes == 0) {
                document.querySelector("#compteRebours").style.color = "red"
            }
        }
        secondes--;
        document.querySelector("#compteRebours").innerHTML = "<p>" + formatNumerique(minutes) + ":" + formatNumerique(secondes) + "</p>";
    }, 1000);

    setTimeout(function() {
        endGameFail();
    }, 300000);
}

function formatNumerique(n) {
    return n > 9 ? "" + n : "0" + n;
}

/*Musique*/
let musique = document.querySelector("#musique");
musique.loop = true;
document.querySelectorAll(".speaker").forEach(function(speaker) {
    speaker.addEventListener("click", function() {
        // this.classList.toggle("paused");
        document.querySelectorAll(".speaker").forEach(function(test) {
            test.classList.toggle("paused");
        });
        if (this.classList.contains("paused")) {
            pauseMusique();
        } else {
            jouerMusique();

        }
    });
});

function jouerMusique() {
    musique.play();
}

function pauseMusique() {
    musique.pause();
}

function playEndMusique(link) {
    document.querySelector("#endMusic").setAttribute("src", link);
    document.querySelector("#endMusic").play();
}

function itemCollectedMusic() {
    document.querySelector("#itemsCollectedSound").play();
}