const wordList = [
    {
        word: "sunshine",
        hint: "Bright and warm weather"
    },
    {
        word: "rainstorm",
        hint: "Heavy precipitation accompanied by wind"
    },
    {
        word: "cloudy",
        hint: "Partially or completely covered sky"
    },
    {
        word: "windy",
        hint: "Having strong winds blowing"
    },
    {
        word: "thunder",
        hint: "Sound caused by lightning"
    },
    {
        word: "snowfall",
        hint: "Frozen precipitation in the form of flakes"
    },
    {
        word: "hailstorm",
        hint: "Frozen precipitation in the form of balls of ice"
    },
    {
        word: "foggy",
        hint: "Thick mist or low-lying cloud"
    },
    {
        word: "tornado",
        hint: "Violently rotating column of air"
    },
    {
        word: "lightning",
        hint: "Electrical discharge in the atmosphere"
    },
    {
        word: "temperature",
        hint: "Degree of hotness or coldness"
    },
    {
        word: "humidity",
        hint: "Amount of water vapor in the air"
    },
    {
        word: "barometer",
        hint: "Instrument used to measure air pressure"
    },
    {
        word: "precipitation",
        hint: "Any form of water falling from the sky"
    },
    {
        word: "forecast",
        hint: "Prediction of future weather conditions"
    },
    {
        word: "climate",
        hint: "Average weather conditions over a long period"
    },
    {
        word: "drought",
        hint: "Extended period of dry weather"
    },
    {
        word: "monsoon",
        hint: "Seasonal wind pattern causing heavy rainfall"
    },
    {
        word: "meteorology",
        hint: "Study of weather and climate"
    },
    {
        word: "cyclone",
        hint: "Large-scale atmospheric system with low pressure"
    }
];

const inputs = document.querySelector(".inputs"),
hintTag = document.querySelector(".hint span"),
guessLeft = document.querySelector(".guess-left span"),
wrongLetter = document.querySelector(".wrong-letter span"),
resetBtn = document.querySelector(".reset-btn"),
typingInput = document.querySelector(".typing-input");

let word, maxGuesses, incorrectLetters = [], correctLetters = [];

function randomWord() {
    let ranItem = wordList[Math.floor(Math.random() * wordList.length)];
    word = ranItem.word;
    maxGuesses = word.length >= 5 ? 8 : 6;
    correctLetters = []; incorrectLetters = [];
    hintTag.innerText = ranItem.hint;
    guessLeft.innerText = maxGuesses;
    wrongLetter.innerText = incorrectLetters;

    let html = "";
    for (let i = 0; i < word.length; i++) {
        html += `<input type="text" disabled>`;
        inputs.innerHTML = html;
    }
}
randomWord();

function initGame(e) {
    let key = e.target.value.toLowerCase();
    if(key.match(/^[A-Za-z]+$/) && !incorrectLetters.includes(` ${key}`) && !correctLetters.includes(key)) {
        if(word.includes(key)) {
            for (let i = 0; i < word.length; i++) {
                if(word[i] == key) {
                    correctLetters += key;
                    inputs.querySelectorAll("input")[i].value = key;
                }
            }
        } else {
            maxGuesses--;
            incorrectLetters.push(` ${key}`);
        }
        guessLeft.innerText = maxGuesses;
        wrongLetter.innerText = incorrectLetters;
    }
    typingInput.value = "";

    setTimeout(() => {
        if(correctLetters.length === word.length) {
            alert(`Congrats! You found the word ${word.toUpperCase()}`);
            return randomWord();
        } else if(maxGuesses < 1) {
            alert("Game over! You don't have remaining guesses");
            for(let i = 0; i < word.length; i++) {
                inputs.querySelectorAll("input")[i].value = word[i];
            }
        }
    }, 100);
}

resetBtn.addEventListener("click", randomWord);
typingInput.addEventListener("input", initGame);
inputs.addEventListener("click", () => typingInput.focus());
document.addEventListener("keydown", () => typingInput.focus());