let words = [
    {
        word: "rainbow",
        hint: "Colorful arc seen in the sky after rain"
    },
    {
        word: "cloud",
        hint: "Mass of water droplets or ice crystals"
    },
    {
        word: "thunderstorm",
        hint: "Storm with thunder and lightning"
    },
    {
        word: "temperature",
        hint: "Degree of hotness or coldness"
    },
    {
        word: "hurricane",
        hint: "Intense tropical cyclone with strong winds"
    },
    {
        word: "forecast",
        hint: "Prediction of future weather conditions"
    },
    {
        word: "sunshine",
        hint: "Direct sunlight or the feeling it gives"
    },
    {
        word: "precipitation",
        hint: "Any form of water, such as rain or snow, that falls from the atmosphere"
    },
    {
        word: "windy",
        hint: "Having a lot of wind"
    },
    {
        word: "fog",
        hint: "Thick cloud of tiny water droplets near the ground"
    },
    {
        word: "freeze",
        hint: "Change from liquid to solid due to low temperature"
    },
    {
        word: "humidity",
        hint: "Amount of water vapor in the air"
    },
    {
        word: "drought",
        hint: "Extended period of abnormally low rainfall"
    },
    {
        word: "barometer",
        hint: "Instrument used for measuring atmospheric pressure"
    },
    {
        word: "cumulonimbus",
        hint: "Large dense cloud associated with thunderstorms"
    },
    {
        word: "blizzard",
        hint: "Severe snowstorm with strong winds"
    },
    {
        word: "cyclone",
        hint: "Large-scale atmospheric wind system rotating inward to an area of low atmospheric pressure"
    },
    {
        word: "evaporation",
        hint: "Process of a liquid turning into vapor"
    },
    {
        word: "iceberg",
        hint: "Large mass of ice floating in the sea"
    },
    {
        word: "aurora",
        hint: "Natural light display in the Earth's sky"
    },
    {
        word: "hailstorm",
        hint: "Storm with hail, ice balls falling from the sky"
    },
    {
        word: "monsoon",
        hint: "Seasonal wind pattern that brings heavy rains"
    },
    {
        word: "sleet",
        hint: "Frozen or partly frozen rain"
    },
];


const wordText = document.querySelector(".word"),
hintText = document.querySelector(".hint span"),
timeText = document.querySelector(".time b"),
inputField = document.querySelector("input"),
refreshBtn = document.querySelector(".refresh-word"),
checkBtn = document.querySelector(".check-word");

let correctWord, timer;

const initTimer = maxTime => {
    clearInterval(timer);
    timer = setInterval(() => {
        if(maxTime > 0) {
            maxTime--;
            return timeText.innerText = maxTime;
        }
        alert(`Time off! ${correctWord.toUpperCase()} was the correct word`);
        initGame();
    }, 1000);
}

const initGame = () => {
    initTimer(30);
    let randomObj = words[Math.floor(Math.random() * words.length)];
    let wordArray = randomObj.word.split("");
    for (let i = wordArray.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [wordArray[i], wordArray[j]] = [wordArray[j], wordArray[i]];
    }
    wordText.innerText = wordArray.join("");
    hintText.innerText = randomObj.hint;
    correctWord = randomObj.word.toLowerCase();;
    inputField.value = "";
    inputField.setAttribute("maxlength", correctWord.length);
}
initGame();

const checkWord = () => {
    let userWord = inputField.value.toLowerCase();
    if(!userWord) return alert("Please enter the word to check!");
    if(userWord !== correctWord) return alert(`Oops! ${userWord} is not a correct word`);
    alert(`Congrats! ${correctWord.toUpperCase()} is the correct word`);
    initGame();
}

refreshBtn.addEventListener("click", initGame);
checkBtn.addEventListener("click", checkWord);