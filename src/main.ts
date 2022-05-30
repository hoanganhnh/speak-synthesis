import "./styles/style.css";

const synth = window.speechSynthesis;

const inputForm = document.querySelector("form");
const inputTxt = document.querySelector(".txt") as HTMLInputElement;
const voiceSelect = document.querySelector("select");

const pitch = document.querySelector("#pitch") as HTMLInputElement;
const pitchValue = document.querySelector(".pitch-value");
const rate = document.querySelector("#rate") as HTMLInputElement;
const rateValue = document.querySelector(".rate-value");

let voices: string | any[] = [];

function populateVoiceList() {
    voices = synth
        .getVoices()
        .sort((a: SpeechSynthesisVoice, b: SpeechSynthesisVoice) => {
            const aname = a.name.toUpperCase();
            const bname = b.name.toUpperCase();
            if (aname < bname) {
                return -1;
            } else if (aname === bname) {
                return 0;
            } else {
                return 1;
            }
        });

    const selectedIndex =
        voiceSelect!.selectedIndex < 0 ? 0 : voiceSelect!.selectedIndex;
    voiceSelect!.innerHTML = "";

    for (let i = 0; i < voices.length; i++) {
        const option = document.createElement("option");
        option.textContent = voices[i].name + " (" + voices[i].lang + ")";

        if (voices[i].default) {
            option.textContent += " -- DEFAULT";
        }
        option.setAttribute("data-lang", voices[i].lang);
        option.setAttribute("data-name", voices[i].name);

        voiceSelect!.appendChild(option);
    }

    voiceSelect!.selectedIndex = selectedIndex;
}

populateVoiceList();

if (speechSynthesis.onvoiceschanged !== undefined) {
    speechSynthesis.onvoiceschanged = populateVoiceList;
}

function speak() {
    if (synth.speaking) {
        console.error("speechSynthesis.speaking");
        return;
    }

    if (inputTxt.value) {
        const utterThis = new SpeechSynthesisUtterance(inputTxt.value);
        utterThis.onend = function (event) {
            console.log(event);
            console.log("SpeechSynthesisUtterance.onend");
        };
        utterThis.onerror = function (event) {
            console.log(event);
            console.error("SpeechSynthesisUtterance.onerror");
        };

        const selectedOption =
            voiceSelect!.selectedOptions[0].getAttribute("data-name");

        for (let i = 0; i < voices.length; i++) {
            if (voices[i].name === selectedOption) {
                utterThis.voice = voices[i];
                break;
            }
        }
        /**
         * @see https://developer.mozilla.org/en-US/docs/Web/API/SpeechSynthesisUtterance/pitch
         */
        utterThis.pitch = parseInt(pitch!.value, 10);
        /**
         * @see https://developer.mozilla.org/en-US/docs/Web/API/SpeechSynthesisUtterance/rate
         */
        utterThis.rate = parseInt(rate!.value, 10);

        synth.speak(utterThis);
    }
}

inputForm!.onsubmit = function (event) {
    event.preventDefault();
    speak();

    inputTxt!.blur();
};

pitch.onchange = function () {
    pitchValue!.textContent = pitch.value;
};

rate.onchange = function () {
    rateValue!.textContent = rate.value;
};

voiceSelect!.onchange = function () {
    speak();
};
