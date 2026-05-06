const greekAB = ["Α", "Β", "Γ", "Δ", "Ε", "Ζ", "Η", "Θ", "Ι", "Κ", "Λ", "Μ", "Ν", "Ξ", "Ο", "Π", "Ρ", "Σ", "Τ", "Υ", "Φ", "Χ", "Ψ", "Ω"];
const lexi = "ΕΝΘΥΛΑΚΩΣΗ";  // Η λέξη που πρέπει να μαντέψει ο παίκτης
let mistakesDone = 0;       
let maximumMistakes = 5;    
let lettersFound = new Array(lexi.length).fill(false);// Πίνακας που δείχνει ποια γράμματα έχουν βρεθεί (true/false)

// Επιλογή στοιχείων από το DOM
const alphabetContainer = document.getElementById("alphabet-container");
const resetButton = document.getElementById("reset-button");
const wordDisplay = document.getElementById("word-display");
const message = document.getElementById("message-board");
const numberOfMistakes = document.getElementById("mistakes");


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

    for (let i = 0; i < lexi.length; i++) {
        if (lettersFound[i]) {
            found += lexi[i] + " "; // Αν το γράμμα έχει βρεθεί → το εμφανίζω
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
        message.innerHTML = `ΚΡΕΜΑΛΑ! <br> Η λέξη ήταν: ${lexi}`;
        message.className = "error";
        disableAllButtons();
    }
};

const handleGuess = (element, buttonClicked) => {
    buttonClicked.disabled = true;
    buttonClicked.classList.add("used");

    let userInput = element;
    if (lexi.includes(userInput)) {
        // Βρίσκω όλες τις θέσεις όπου υπάρχει το γράμμα
        for (let i = 0; i < lexi.length; i++) {
            if (lexi[i] === userInput) {
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
    lettersFound.fill(false);
    numberOfMistakes.textContent = "0";
    message.textContent = "";
    message.className = "";
    showAlphabetToScreen();
    updateDisplay();
};

showAlphabetToScreen();
updateDisplay(); // Αρχική εμφάνιση της άγνωστης λέξης με παύλες

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
