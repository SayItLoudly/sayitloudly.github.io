let words = [];
let index = 0;
let speaking = false;
let paused = false;
let synth = window.speechSynthesis;
let utterance;
let speed = 1;
let pauseDurationPerLetter = 250;
let pitch = 1;
let selectedLanguage = 'en-IN';

// Set the language and accent
function setLanguage(languageCode) {
    selectedLanguage = languageCode;
    if (speaking) {
        stopSpeech();  // Stop current speech if the language changes
    }
}

// Start or restart reading
function startOrRestart() {
    const startRestartBtn = document.getElementById("startRestartBtn");

    if (startRestartBtn.textContent === "Start") {
        startRestartBtn.textContent = "Restart";
        speak();
    } else {
        restart();
    }
}

// Start speaking from the beginning
function speak() {
    const paragraph = document.getElementById("text").value;
    if (!paragraph) return;  // Exit if no text is entered

    words = paragraph.split(" ");
    index = 0;
    speaking = true;
    paused = false;
    document.getElementById("stopResumeBtn").textContent = "Stop";
    speakWord();
}

// Reads each word individually with dynamic pauses
function speakWord() {
    if (index < words.length && speaking) {
        const word = words[index];
        utterance = new SpeechSynthesisUtterance(formatWord(word));
        utterance.rate = speed;
        utterance.pitch = pitch;
        utterance.lang = selectedLanguage;

        synth.speak(utterance);

        const punctuationPause = /[.,!?;:()&]/.test(word) ? 600 : 300;
        const pauseDuration = word.length * pauseDurationPerLetter;

        utterance.onend = function() {
            index++;
            if (speaking && !paused) {
                setTimeout(speakWord, pauseDuration + punctuationPause);
            }
        };
    }
}

// Formats the word to handle punctuation and pauses
function formatWord(word) {
    return word
        .replace(/([.,!?;:()&])/g, ' $1 ')
        .replace(".", " fullstop")
        .replace(",", " comma")
        .replace("!", " exclamation")
        .replace("?", " questionmark")
        .replace(":", " colon")
        .replace(";", " semicolon")
        .replace("&", " and")
        .replace("(", " openparenthesis")
        .replace(")", " closeparenthesis")
        .trim();
}

// Stop or resume the reading process
function stopOrResume() {
    if (paused) {
        paused = false;
        speaking = true;
        document.getElementById("stopResumeBtn").textContent = "Stop";
        speakWord();
    } else {
        stopSpeech();
        paused = true;
        document.getElementById("stopResumeBtn").textContent = "Resume";
    }
}

// Restart reading from the beginning
function restart() {
    stopSpeech();
    index = 0;
    speaking = true;
    paused = false;
    document.getElementById("stopResumeBtn").textContent = "Stop";
    speakWord();
}

// Cancel any ongoing speech
function stopSpeech() {
    synth.cancel();
    speaking = false;
}

// Update speed based on slider input
function updateSpeed() {
    speed = document.getElementById("speedSlider").value / 150;
    document.getElementById("speedValue").textContent = document.getElementById("speedSlider").value;
}

// Update pause duration based on slider input
function updatePause() {
    pauseDurationPerLetter = document.getElementById("pauseSlider").value;
    document.getElementById("pauseValue").textContent = pauseDurationPerLetter;
}

// Update pitch based on slider input
function updatePitch() {
    pitch = document.getElementById("pitchSlider").value;
    document.getElementById("pitchValue").textContent = pitch;
}

// Reset and prepare to read new text when input is changed
document.getElementById("text").addEventListener("input", function() {
    stopSpeech();  // Stop any ongoing speech
    index = 0;     // Reset index to start from the beginning
    speaking = false;  // Ensure speaking will restart with new text
    document.getElementById("startRestartBtn").textContent = "Start";  // Reset button to "Start"
});
