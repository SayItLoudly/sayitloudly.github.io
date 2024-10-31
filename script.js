let words, index = 0, speaking = false, paused = false;
let synth = window.speechSynthesis;
let utterance;
let speed = 1; // Default speaking speed
let pauseDurationPerLetter = 250; // Default pause duration per letter
let pitch = 1; // Default pitch

function startOrRestart() {
    const startRestartBtn = document.getElementById("startRestartBtn");

    // Check if the button is in "Start" or "Restart" mode
    if (startRestartBtn.textContent === "Start") {
        startRestartBtn.textContent = "Restart";  // Change button text to "Restart" after the first click
        speak();  // Start speaking
    } else {
        restart();  // Restart from the beginning if it's already in "Restart" mode
    }
}

function speak() {
    const paragraph = document.getElementById("text").value;
    words = paragraph.split(" ");
    index = 0;
    speaking = true;
    paused = false;
    document.getElementById("stopResumeBtn").textContent = "Stop";
    speakWord();
}

function speakWord() {
    if (index < words.length && speaking) {
        const word = words[index];
        utterance = new SpeechSynthesisUtterance(formatWord(word));
        utterance.rate = speed;
        utterance.pitch = pitch;
        utterance.lang = 'en-US';

        synth.speak(utterance);

        const punctuationPause = (word.includes(".") || word.includes(",")) ? 600 : 300;
        const pauseDuration = word.length * pauseDurationPerLetter;

        utterance.onend = function() {
            index++;
            if (speaking && !paused) setTimeout(speakWord, pauseDuration);
        };
    }
}

function formatWord(word) {
    return word.replace(".", " fullstop").replace(",", " comma");
}

function stopOrResume() {
    if (paused) {
        paused = false;
        speaking = true;
        document.getElementById("stopResumeBtn").textContent = "Stop";
        speakWord();
    } else {
        synth.cancel();
        paused = true;
        speaking = false;
        document.getElementById("stopResumeBtn").textContent = "Resume";
    }
}

function restart() {
    synth.cancel();
    index = 0;
    speaking = true;
    paused = false;
    document.getElementById("stopResumeBtn").textContent = "Stop";
    speakWord();
}

function rereadLastTwoWords() {
    if (index >= 2) {
        synth.cancel();
        index -= 2;
        speaking = true;
        paused = false;
        document.getElementById("stopResumeBtn").textContent = "Stop";
        speakWord();
    }
}

function updateSpeed() {
    speed = document.getElementById("speedSlider").value / 150;
    document.getElementById("speedValue").textContent = document.getElementById("speedSlider").value;
}

function updatePause() {
    pauseDurationPerLetter = document.getElementById("pauseSlider").value;
    document.getElementById("pauseValue").textContent = pauseDurationPerLetter;
}

function updatePitch() {
    pitch = document.getElementById("pitchSlider").value;
    document.getElementById("pitchValue").textContent = pitch;
}
