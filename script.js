
const lexi = "ΕΝΘΥΛΑΚΩΣΗ";  // Η λέξη που πρέπει να μαντέψει ο παίκτης
let mistakesDone = 0;       // Μετρητής λαθών
let maximumMistakes = 5;    // Μέγιστος αριθμός επιτρεπόμενων λαθών
let typedLetters = "";      // Γράμματα που έχει ήδη δώσει ο παίκτης
let lettersFound = new Array(lexi.length).fill(false);// Πίνακας που δείχνει ποια γράμματα έχουν βρεθεί (true/false)

// Επιλογή στοιχείων από το DOM
const inputField = document.getElementById("user-input");
const guessButton = document.getElementById("guess-button");
const resetButton = document.getElementById("reset-button");
const wordDisplay = document.getElementById("word-display");
const message = document.getElementById("message-board");
const numberOfMistakes = document.getElementById("mistakes");

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
        guessButton.disabled = true; // το παιχνίδι σταματάει
    } 
    
    // Αν τα λάθη έφτασαν το όριο → ήττα
    else if (mistakesDone >= maximumMistakes) {
        message.innerHTML = `ΚΡΕΜΑΛΑ! <br> Η λέξη ήταν: ${lexi}`;
        message.className = "error";
        guessButton.disabled = true;
    }
};

const handleGuess = () => {

    let userInput = inputField.value.toUpperCase();
    inputField.value = ""; // Καθαρίζω το input
    inputField.focus();    // Επαναφέρω τον κέρσορα στο input

    // Έλεγχοι εγκυρότητας
    if (userInput === "") { message.textContent = "Δεν έδωσες κάποιο γράμμα!"; return;}
    if (userInput.length > 1) { message.textContent = "Μόνο ένα γράμμα τη φορά!"; return;}
    if (!/[Α-Ω]/.test(userInput)) { message.textContent = "Μόνο γράμματα και μάλιστα ελληνικά παρακαλώ!"; return;}
    if (typedLetters.includes(userInput)) { message.textContent = "Το έχεις ήδη δώσει!"; return;}

    typedLetters += userInput;

    // Έλεγχος αν το γράμμα υπάρχει στη λέξη
    if (lexi.includes(userInput)) {

        // Βρίσκω όλες τις θέσεις όπου υπάρχει το γράμμα
        for (let i = 0; i < lexi.length; i++) {
            if (lexi[i] === userInput) {
                lettersFound[i] = true;
            }
        }

        message.textContent = "Σωστά!";
        message.className = "success";

    } else {
        // Λάθος γράμμα → αυξάνουμε τα λάθη
        mistakesDone++;
        numberOfMistakes.textContent = mistakesDone;

        message.textContent = "Λάθος! Δοκίμασε ξανά.";
        message.className = "error";
    }

    updateDisplay();   // Ανανεώνουμε την εμφάνιση της λέξης
    checkWinLoss();    // Έλεγχος για νίκη/ήττα
};

// Επαναφορά παιχνιδιού
const resetGame = () => {
    mistakesDone = 0;
    typedLetters = "";
    lettersFound.fill(false);

    numberOfMistakes.textContent = "0";
    message.textContent = "";
    message.className = "";
    guessButton.disabled = false;
    inputField.value = "";

    updateDisplay();
};

updateDisplay(); // Αρχική εμφάνιση της άγνωστης λέξης με παύλες

resetButton.addEventListener("click", resetGame);
guessButton.addEventListener("click", handleGuess);
inputField.addEventListener("keydown", (event) => {  // Για να γίνει υποβολή και με Enter πλήκτρο
    if (event.key === "Enter") { handleGuess(); }
});

