let rightDoor = document.querySelector("#rightDoor");
let letter = document.querySelector("#introMessageSection > img");
let babyMessage = document.querySelector("#contenuMessage");
let buttonBabyMessage = document.querySelector("#contenuMessage>button");
let merchantIntroDialog = document.querySelector("#introMessageSection");
let buttonMerchantIntroDialog = document.querySelector("#merchantMessageSection .next");
let merchantDialog = document.querySelector("#merchantMessageSection");
let mainSection = document.querySelector("#mainPartSection");
let divEndMessage = document.querySelector("#endMessage");

merchantDialog.classList.add("none");
mainSection.classList.add("none");
divEndMessage.classList.add("none");

/************************/
/* Beginnig of the game */
/************************/

//Doors animation + Music
document.querySelector("#startGame").addEventListener('click', function() {
    document.querySelector("#leftDoor").style.animation = "leftDoorOpening 1.8s linear forwards";
    rightDoor.style.animation = "rightDoorOpening 1.8s linear forwards";
    document.querySelector("#doorSound").play();
    document.querySelector("#title").style.opacity = "0";
    this.style.opacity = "0";
    playMusic();
});

//Letter animation
rightDoor.addEventListener("animationend", function() {
    document.querySelector("#welcomePartSection").style.display = "none";
    letter.style.animation = "wiggle 1s linear infinite";
}, false);

//Opening of the message
letter.addEventListener("click", function() {
    this.classList.add("none");
    document.querySelector("#introMessageSection > h1").classList.add("none");
    babyMessage.classList.remove("none");

    babyMessage.style.transitionDuration = "5s";
    babyMessage.style.transform = "scale(1)";
    setTimeout(function() {
        buttonBabyMessage.style.opacity = "1";
        buttonBabyMessage.classList.add("interaction");
    }, 5000);
});

//Intro dialog of the merchant
buttonBabyMessage.addEventListener("click", function() {
    merchantIntroDialog.style.opacity = "0";
    setTimeout(function() {
        merchantIntroDialog.classList.add("none");
        merchantDialog.classList.remove("none");
    }, 200);

    setTimeout(function() {
        buttonMerchantIntroDialog.style.opacity = "1";
        buttonMerchantIntroDialog.classList.add("interaction");
    }, 4000);
});

buttonMerchantIntroDialog.addEventListener("click", function() {
    countdownStart();
    merchantDialog.classList.add("none");
    document.querySelector("#littleSpeaker").classList.add("none");
    mainSection.classList.remove("none");
});

/***********************/
/*Main part of the game*/
/***********************/

const optionsDiv = document.querySelector("#MyDialogue");
const questionDiv = document.querySelector("#blackBoard");
let questions = [];
let index = 0;
let nbErrors = 0;
let choiceClicked;
let planMvt;
let imprimante = document.querySelector("#imprimante");
let planItem = document.querySelector("#plan");
let huile = document.querySelector("#huile");
let ecrous = document.querySelector("#ecrous");
let merchantImg = document.querySelector("#marchandInGame>img");

//Question retrieval
fetch('../json/questions.json')
    .then((response) => response.json())
    .then((data) => {
        questions = data;
        startQuiz();
    })
    .catch((err) => {
        console.error(err);
    });

//Launch of the quiz
function startQuiz() {
    askQuestion(questions[index]);
}

//Question display + answer display
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

//Checking the answer
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
        nbErrors++;
        switch (nbErrors) {
            case 1:
                merchantImg.setAttribute("src", "images/marchand1.png");
                break;
            case 2:
                merchantImg.setAttribute("src", "images/marchand2.png");
                endGameFail();
                break;

            default:
                break;
        }
    }
}

//Question Change
function nextQuestion() {
    if (index < questions.length - 1) {
        index++;
        askQuestion(questions[index]);
    } else {
        optionsDiv.innerHTML = "";
        optionsDiv.classList.add("none");
        document.querySelectorAll('.choices').forEach(choice => {
            choice.removeEventListener('click', isAnswerCorrect);
        });
        document.querySelector("#blackBoard").innerHTML = "";
        printPlan();
    }
}

//Animation with the printer
function printPlan() {
    imprimante.classList.add("interaction");
    imprimante.addEventListener("click", function() {
        this.classList.remove("interaction");
        planItem.classList.remove("none");
        activateItems();
        setTimeout(function() {
            planItem.style.transform = "scaleY(1)";
        }, 500);

        setTimeout(function() {
            planItem.style.transform = "scaleY(0.5)";
            planItem.addEventListener("click", function() {
                document.querySelector("#phase1").classList.add("collected");
                this.classList.add("none");
                document.querySelector("#inventory").style.transform = "scaleY(1)";
                clearInterval(planMvt);
            });
            planMvt = setInterval(function() {
                let left = Math.floor(Math.random() * (300 - 1));
                let bottom = Math.floor(Math.random() * (300 - 1));
                console.log("ok");

                planItem.style.transform = "translate(" + left + "px, " + bottom + "px)";
            }, 800);
        }, 1000);


    }, { once: true });
}

//Collections of items
function activateItems() {
    huile.classList.add("interaction");
    ecrous.classList.add("interaction");
    merchantImg.classList.add("interaction");
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

/***********/
/*Last part*/
/***********/

let itemsCollected = 0;
let dialogues;
let nextDialogueID = 0;
let isDialogReceive = false;


//Merchant dialog recovery
fetch('../json/dialogue.json')
    .then((response) => response.json())
    .then((data) => {
        dialogues = data;
        dialogueReceive();
    })
    .catch((err) => {
        console.error(err);
    });

//Check if dialog is already received
function dialogueReceive() {
    isDialogReceive = true;
}

//Display of the merchant dialog
function dialogueMarchand() {
    if (isDialogReceive) {
        document.querySelector("#marchandInGame>p").style.opacity = "1";
        document.querySelector("#marchandInGame>p").innerHTML = dialogues[nextDialogueID].marchand;
        optionsDiv.classList.remove("none");
        optionsDiv.innerHTML = "";
        dialogues[nextDialogueID].joueur.forEach((choice, index) => {
            optionsDiv.innerHTML += "<p class=\"choices interaction\" currentID='" + nextDialogueID + "' nextID='" + dialogues[nextDialogueID].next[index] + "' onclick='updateNextDialogueID(this.getAttribute(\"nextID\"), this.getAttribute(\"currentID\"))'>" + choice + "</p>";
        });
        if (nextDialogueID >= 1) {
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

//Go to next dialog
function updateNextDialogueID(nextIndex, currentIndex) {
    nextDialogueID = nextIndex;
    if (dialogues[currentIndex].isNext) {
        dialogueMarchand();
    } else {
        closeDialogue();
    }
}

//Close dialog
function closeDialogue() {
    optionsDiv.classList.add("none");
    document.querySelector("#marchandInGame>p").style.opacity = "0";
}

//Game over
function endGameFail() {
    clearInterval(countdown);
    pauseMusic();
    playEndMusic("audio/fail.wav");
    divEndMessage.classList.remove("none");
    divEndMessage.style.opacity = "1";
    divEndMessage.innerHTML = "<div><p>Malhereusement pour toi tu as perdu. Tu n'étais pas digne d'avoir un bébé robot.</p><p>Mais tu peux toujours rééssayer si tu as envie ! (ou juste quitter le jeu aussi...)</p></div><button id='replayButton' class='boutons interaction'>Replay</button>";
    document.querySelector("#replayButton").addEventListener("click", function() {
        location.reload();
    });
}

//Game won
function endGameWin() {
    divEndMessage.classList.remove("none");
    setTimeout(function() {
        pauseMusic();
        playEndMusic("audio/win.mp3");
        mainSection.style.opacity = "0";
        clearInterval(countdown);
        divEndMessage.style.opacity = "1";
        divEndMessage.innerHTML = "<h2>Félicitation te voilà parent !</h2><p>Merci d'avoir joué à Robabies.</p><img src='images/bebe.png' alt='bébé robot'/><button id='replayButton' class='boutons interaction'>Replay</button>";
        document.querySelector("#replayButton").addEventListener("click", function() {
            location.reload();
        });
    }, 2000)

}

/***********/
/*Countdown*/
/***********/

let countdown;
let seconds = 0;
let minutes = 5;

//Start the countdown
function countdownStart() {
    countdown = setInterval(function() {
        if (seconds == 0) {
            seconds = 60;
            minutes--;
            if (minutes == 0) {
                document.querySelector("#countdown").style.color = "red"
            }
        }
        seconds--;
        document.querySelector("#countdown").innerHTML = "<p>" + numericalFormat(minutes) + ":" + numericalFormat(seconds) + "</p>";
    }, 1000);

    setTimeout(function() {
        endGameFail();
    }, 300000);
}

//Set numerical format
function numericalFormat(n) {
    return n > 9 ? "" + n : "0" + n;
}

/*******/
/*Music*/
/*******/

let music = document.querySelector("#music");
music.loop = true;

//Setting of the "music" buttons
document.querySelectorAll(".speaker").forEach(function(speaker) {
    speaker.addEventListener("click", function() {
        document.querySelectorAll(".speaker").forEach(function(speaker) {
            speaker.classList.toggle("paused");
        });
        if (this.classList.contains("paused")) {
            pauseMusic();
        } else {
            playMusic();

        }
    });
});

//Play
function playMusic() {
    music.play();
}

//Pause
function pauseMusic() {
    music.pause();
}

//Play the ending music
function playEndMusic(link) {
    document.querySelector("#endMusic").setAttribute("src", link);
    document.querySelector("#endMusic").play();
}

//Play the collected-items music
function itemCollectedMusic() {
    document.querySelector("#itemsCollectedSound").play();
}