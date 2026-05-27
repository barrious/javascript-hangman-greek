const greekAB = ["Α", "Β", "Γ", "Δ", "Ε", "Ζ", "Η", "Θ", "Ι", "Κ", "Λ", "Μ", "Ν", "Ξ", "Ο", "Π", "Ρ", "Σ", "Τ", "Υ", "Φ", "Χ", "Ψ", "Ω"];

const programmingWords = [
    "ΕΝΘΥΛΑΚΩΣΗ", "ΚΛΗΡΟΝΟΜΙΚΟΤΗΤΑ", "ΠΟΛΥΜΟΡΦΙΣΜΟΣ", "ΑΦΑΙΡΕΣΗ", "ΚΛΑΣΗ", "ΑΝΤΙΚΕΙΜΕΝΟ", "ΜΕΘΟΔΟΣ", "ΙΔΙΟΤΗΤΑ", "ΜΕΤΑΒΛΗΤΗ", 
    "ΣΥΝΑΡΤΗΣΗ", "ΠΑΡΑΜΕΤΡΟΣ", "ΟΡΙΣΜΑ", "ΠΙΝΑΚΑΣ", "ΔΟΜΗ", "ΔΕΙΚΤΗΣ", "ΑΛΓΟΡΙΘΜΟΣ", "ΣΥΝΘΗΚΗ", "ΒΡΟΓΧΟΣ", "ΕΠΑΝΑΛΗΨΗ", 
    "ΑΝΑΔΡΟΜΗ", "ΕΞΑΙΡΕΣΗ", "ΣΦΑΛΜΑ", "ΔΙΕΠΑΦΗ", "ΜΕΤΑΓΛΩΤΤΙΣΤΗΣ", "ΔΙΕΡΜΗΝΕΑΣ", "ΒΑΣΗ", "ΝΗΜΑ", "ΜΝΗΜΗ", "ΣΤΟΙΒΑ", "ΟΥΡΑ"
];

let currentWord = "";
let guessedLetters = [];
let mistakeCount = 0;
let mistakesDone = 0;       
let maximumMistakes = 5;    
let lettersFound = []; 
const ropeSound = new Audio("rope_swing.mp3");
const errorSound = new Audio("error.mp3");

// Επιλογή στοιχείων από το DOM
const alphabetContainer = document.getElementById("alphabet-container");
const resetButton = document.getElementById("reset-button");
const wordDisplay = document.getElementById("word-display");
const message = document.getElementById("message-board");
const numberOfMistakes = document.getElementById("mistakes");
const hangmanVisual = document.getElementById("hangman-visual");

const selectRandomWord = () => {
    const randomIndex = Math.floor(Math.random() * programmingWords.length);
    currentWord = programmingWords[randomIndex];
    lettersFound = new Array(currentWord.length).fill(false);
};

const showAlphabetToScreen = () => {
    alphabetContainer.innerHTML = "";
    greekAB.forEach(element => {
        let letterBtn = document.createElement("button");
        letterBtn.innerText = element;
        letterBtn.classList.add("alphabet-letter-btn");
        letterBtn.addEventListener("click", () =>{handleGuess(element, letterBtn)});
        alphabetContainer.appendChild(letterBtn);
    });
}

// Ενημερώνει την οθόνη με παύλες και σωστά γράμματα
const updateDisplay = () => {
    let found = "";

    for (let i = 0; i < currentWord.length; i++) {
        if (lettersFound[i]) {
            found += currentWord[i] + " "; 
        } else {
            found += " _ ";
        }
    }
    wordDisplay.textContent = found;
};

const checkWinLoss = () => {
    if (!lettersFound.includes(false)) {
        message.textContent = "ΚΕΡΔΙΣΕΣ! 🎉";
        message.className = "success";
        disableAllButtons();
        ropeSound.pause();

    } 
    else if (mistakesDone >= maximumMistakes) {
        message.innerHTML = `ΚΡΕΜΑΛΑ! <br> Η λέξη ήταν: ${currentWord}`;
        message.className = "error";
        disableAllButtons();
        ropeSound.pause();
    }
};

const handleGuess = (element, buttonClicked) => {
    // Ξεκινάει ο ήχος του σκοινιού αν δεν παίζει ήδη ---
    if (ropeSound.paused) {
        ropeSound.loop = true;
        ropeSound.volume = 0.4; // Χαμηλή ένταση για να μην ενοχλεί
        ropeSound.play();
    }

    buttonClicked.disabled = true;
    buttonClicked.classList.add("used");


    let userInput = element;
    if (currentWord.includes(userInput)) {
        for (let i = 0; i < currentWord.length; i++) {
            if (currentWord[i] === userInput) {
                lettersFound[i] = true;
            }
        }
        message.textContent = "Σωστά!";
        message.className = "success";
    } else { // Λάθος γράμμα
        mistakesDone++;
        numberOfMistakes.textContent = mistakesDone;
        message.textContent = "Λάθος! Δοκίμασε ξανά.";
        message.className = "error";
        errorSound.currentTime = 0; // Μηδενίζω τον χρόνο για να παίζει ακαριαία
        errorSound.play();

        // --- ΔΙΟΡΘΩΣΗ: Αλλάζουμε δυναμικά το src της εικόνας ---
        if (hangmanVisual && mistakesDone <= maximumMistakes) {
            hangmanVisual.src = `images/letter_${mistakesDone}.png`;
        }
    }

    updateDisplay();   
    checkWinLoss();    
};

const disableAllButtons = () =>{
    const allButtons = document.querySelectorAll(".alphabet-letter-btn");
    allButtons.forEach(btn => {btn.disabled = true;        
    });
}

const resetGame = () => {
    // Μηδενισμός του ήχου του σκοινιού για τον επόμενο γύρο
    ropeSound.pause();
    ropeSound.currentTime = 0;

    mistakesDone = 0;
    numberOfMistakes.textContent = "0";
    message.textContent = "";
    message.className = "";
    
    // Επαναφορά της εικόνας στο αρχικό στάδιο (letter_0.png) ---
    if (hangmanVisual) {
        hangmanVisual.src = "images/letter_0.png";
    }

    selectRandomWord(); 
    showAlphabetToScreen();
    updateDisplay();
};

selectRandomWord(); 
showAlphabetToScreen();
updateDisplay();

resetButton.addEventListener("click", resetGame);
window.addEventListener("keydown", (event)=>{
    const pressedKey = event.key.toUpperCase();
    const allButtons = document.querySelectorAll(".alphabet-letter-btn");

    allButtons.forEach(btn => {
        if (btn.innerText === pressedKey && !btn.disabled) {
            handleGuess(pressedKey, btn);
        }
    });
});