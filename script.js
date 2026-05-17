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
let lettersFound = []; // Ξεκινάει άδειος και θα γεμίζει μόλις επιλεγεί η λέξη

// Επιλογή στοιχείων από το DOM
const alphabetContainer = document.getElementById("alphabet-container");
const resetButton = document.getElementById("reset-button");
const wordDisplay = document.getElementById("word-display");
const message = document.getElementById("message-board");
const numberOfMistakes = document.getElementById("mistakes");

// Συναρτήση για την τυχαία επιλογή λέξης και εκκίνηση
const selectRandomWord = () => {
    const randomIndex = Math.floor(Math.random() * programmingWords.length);
    currentWord = programmingWords[randomIndex];
    
    // Τώρα που ξέρουμε τη λέξη, φτιάχνουμε τον πίνακα lettersFound με τόσα false όσα και τα γράμματά της
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
            found += currentWord[i] + " "; // Αν το γράμμα έχει βρεθεί → το εμφανίζω
        } else {
            // Αν το γράμμα δεν έχει βρεθεί → εμφανίζω _
            found += " _ ";
        }
    }
    wordDisplay.textContent = found;
};

// Έλεγχος για νίκη ή ήττα
const checkWinLoss = () => {
    // Αν δεν υπάρχει κανένα false → όλα τα γράμματα βρέθηκαν
    if (!lettersFound.includes(false)) {
        message.textContent = "ΚΕΡΔΙΣΕΣ! 🎉";
        message.className = "success";
        disableAllButtons();
    } 
    // Αν τα λάθη έφτασαν το όριο
    else if (mistakesDone >= maximumMistakes) {
        message.innerHTML = `ΚΡΕΜΑΛΑ! <br> Η λέξη ήταν: ${currentWord}`;
        message.className = "error";
        disableAllButtons();
    }
};

const handleGuess = (element, buttonClicked) => {
    buttonClicked.disabled = true;
    buttonClicked.classList.add("used");

    let userInput = element;
    if (currentWord.includes(userInput)) {
        // Βρίσκω όλες τις θέσεις όπου υπάρχει το γράμμα
        for (let i = 0; i < currentWord.length; i++) {
            if (currentWord[i] === userInput) {
                lettersFound[i] = true;
            }
        }
        message.textContent = "Σωστά!";
        message.className = "success";
    } else {// Λάθος γράμμα
        mistakesDone++;
        numberOfMistakes.textContent = mistakesDone;
        message.textContent = "Λάθος! Δοκίμασε ξανά.";
        message.className = "error";

        // --- ΕΔΩ ΜΠΑΙΝΕΙ Η ΕΜΦΑΝΙΣΗ ΤΗΣ ΕΙΚΟΝΑΣ ---
        const bodyPart = document.getElementById(`part-${mistakesDone}`);
        if (bodyPart) {
            bodyPart.classList.remove("hidden");
        }
    }

    updateDisplay();   // Ανανεώνω την εμφάνιση της λέξης
    checkWinLoss();    // Έλεγχος για νίκη/ήττα
};

const disableAllButtons = () =>{
    const allButtons = document.querySelectorAll(".alphabet-letter-btn");
    allButtons.forEach(btn => {btn.disabled = true;        
    });
}

const resetGame = () => {
    mistakesDone = 0;
    numberOfMistakes.textContent = "0";
    message.textContent = "";
    message.className = "";
    
    // Κρύβουμε πάλι τις εικόνες του σώματος
    document.querySelectorAll(".body-part").forEach(part => part.classList.add("hidden"));

    selectRandomWord(); // <-- Παράγει νέο lettersFound με το σωστό μήκος της νέας λέξης
    showAlphabetToScreen();
    updateDisplay();
};

selectRandomWord(); // <-- ΑΠΑΡΑΙΤΗΤΟ: Επιλέγει την πρώτη λέξη πριν σχεδιαστεί η οθόνη
showAlphabetToScreen();
updateDisplay();

resetButton.addEventListener("click", resetGame);
window.addEventListener("keydown", (event)=>{
    const pressedKey = event.key.toUpperCase();
    
    // Βρίσκω όλα τα κουμπιά του αλφαβήτου
    const allButtons = document.querySelectorAll(".alphabet-letter-btn");

    // 3. Ψάχνω αν κάποιο κουμπί έχει το γράμμα που πατήθηκε
    allButtons.forEach(btn => {
        if (btn.innerText === pressedKey && !btn.disabled) {
            // Αν το βρω και δεν είναι ήδη απενεργοποιημένο, το "πατώ"
            handleGuess(pressedKey, btn);
        }
    });
});
