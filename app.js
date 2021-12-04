// overlay object
// ** contains 1 function / handleStart
const overlay = {
    handleStart: () => {
        // variables
        const overlay = document.querySelector('.overlay');
        const heading = overlay.querySelector('h1');
        const p = overlay.querySelector('p');
        const btn = overlay.querySelector('button.overlay-btn');
        // overlay event listener to test for button clicked
        overlay.addEventListener('click', e => {
            if (e.target.textContent === `Let's Play` || e.target.textContent === 'Play Again?') {
                // calls getRandomPhrase from gameboard object
                gameboard.getRandomPhrase();
                // calls addPhraseToDisplay from gameboard object
                gameboard.addPhraseToDisplay();
                // transitions applied via css to overlay elements
                heading.classList.add('hide');
                p.classList.add('hide');
                p.textContent = 'Good Luck!'
                btn.classList.add('hide');
                // 1.2second timeout for overlay exit
                setTimeout(() => {
                    overlay.classList.remove('show');
                    p.style.display = 'none';
                }, 1200);
            }
            // condition for win/lose overlays that calls the resetGame function
            if (e.target.textContent === 'Play Again?') {
                resetGame();
            }
        });
    }
}

// theme object
// ** contains 1 function / handleThemeToggle
const theme = {
    // function to handle theme change from light to dark
    handleThemeToggle: () => {
        // variables
        const themeContainer = document.querySelector('.theme-toggle');
        const light = themeContainer.querySelector('.light');
        const dark = themeContainer.querySelector('.dark');
        // event listener on theme div to toggle clicked theme option
        themeContainer.addEventListener('click', e => {
            if (e.target === light) {
                document.body.classList = '';
            } else if (e.target === dark ) {
                document.body.classList.add('whoturnedoffthelights')
            }
        })
    }
}

// gameboard object
// ** holds information and logic about the gameboard (keyboard in another object)
// ** 2 functions - getRandomPhrase & addPhraseToDisplay
const gameboard = {
    // keys/values
    lives: 5,
    phrases: ['nubcake for life','need more coffee','console dot log it','bugs everywhere','stack overflow it','ole guily guily'],
    selectedPhrase: "",
    // getRandomPhrase function
    // ** takes the gameboard.phrases array as an arg
    // ** gets a random index in gameboard.phrases array
    // ** assigns that array item to the phrase variable and splits it
    // ** assigns that phrase to the gameboard.selectedPhrase key
    // ** returns a split phrase
    getRandomPhrase: (arr) => {
        const phraseIndex = Math.floor(Math.random() * gameboard.phrases.length);
        phrase = gameboard.phrases[phraseIndex].split("");
        gameboard.selectedPhrase = phrase;
        return phrase;
    },
    // addPhraseToDisplay function
    // ** loops through the split (gameboard.selectedPhrase) and creates an li for each character
    // ** if the li has a value, it adds a class of "letter" to it, otherwise adds a class of "space"
    // ** appends newly created li to the ul within <div class="phrase-display"><ul>{here}</ul></div>
    addPhraseToDisplay: () => {
        const phraseDisplay = document.querySelector('.phrase-display ul');
        gameboard.selectedPhrase.forEach((char => {
            const li = document.createElement('li');
            li.textContent = char;
            if (char !== ' ') {
                li.classList.add('letter');
            } else {
                li.classList.add('space');
            }
            phraseDisplay.appendChild(li);
        }))
    }   
}

// keyboard object
// ** contains 1 function / handleClicks
const keyboard = {
    currentClick: "",
    // handle clicks ...handles the clicks on the keyboard
    // contains the handleClickValidation function and the handleUpdatingHearts function
    handleClicks: () => {
        const keyboard = document.querySelector('.keyboard');
        keyboard.addEventListener('click', e => {
            if (e.target.tagName === 'LI') {
                e.target.classList.add('clicked');
                keyboard.currentClick = e.target.textContent.toLowerCase();
                handleClickValidation();
            }
        });
        // handleClickValidation 
        const handleClickValidation = () => {
            const phraseLetters = document.querySelectorAll('.phrase-display li');
            if (gameboard.selectedPhrase.includes(keyboard.currentClick)) {
                phraseLetters.forEach((letter, index) => {
                    if (letter.textContent === keyboard.currentClick) {
                        letter.classList.add('show')
                    }
                });
                scoreCheck.checkWin();
            } else {
                handleUpdatingHearts();
                scoreCheck.checkLoss();
            }
        }
        // handleUpdatingHearts
        const handleUpdatingHearts = () => {
            gameboard.lives -= 1;
            const hearts = document.querySelectorAll('.heart-display img');
            hearts[gameboard.lives].src = './assets/hearts/lostHeart.png';
            hearts[gameboard.lives].classList.add('lostheart');
        }
    }
}

// scoreCheck object
// ** contains 2 function / checkWin and checkLoss
const scoreCheck = {
    overlay:document.querySelector('.overlay'),
    heading: document.querySelector('.overlay h1'),
    p: document.querySelector('.overlay p'),
    btn:document.querySelector('.overlay button.overlay-btn'),
    keyboard: document.querySelector('.keyboard'),
    // checkWin
    checkWin: () => {
        const totalLettersToGuess = document.querySelectorAll('.phrase-display ul li.letter').length;
        const totalLettersGuessed = document.querySelectorAll('.letter.show').length;
        // console.log(lettersLeftToGuess)
        if (totalLettersToGuess === totalLettersGuessed) {
            scoreCheck.keyboard.style.pointerEvents = 'none';
            scoreCheck.heading.textContent = `Great work, you won!`;
            scoreCheck.heading.classList.remove('hide');
            scoreCheck.btn.textContent = 'Play Again?'
            scoreCheck.btn.classList.remove('hide');
            setTimeout(() => {
                scoreCheck.overlay.classList = 'overlay youkindadontsuck show';
            }, 500)
        }
    },
    // checkLoss
    checkLoss: () => {
        if (gameboard.lives <= 0) {
            scoreCheck.keyboard.style.pointerEvents = 'none';
            scoreCheck.heading.textContent = `You didn't win, bummer!`;
            scoreCheck.heading.classList.remove('hide');
            scoreCheck.btn.textContent = 'Play Again?'
            scoreCheck.btn.classList.remove('hide');
            setTimeout(() => {
                scoreCheck.overlay.classList = 'overlay youkindasuck show';
            }, 500)
        }
    },
}

// resetGame function
// ** also makes calls to gameboardGetRandomPhrase & gameboard.addPhraseToDisplay
const resetGame = () => {
    // reset phrase display
    const phraseDisplay = document.querySelector('.phrase-display ul')
    phraseDisplay.innerHTML = '';
    // reset keyboard UI
    const keyboard = document.querySelector('.keyboard');
    const keyboardKeys = keyboard.querySelectorAll('li');
    keyboard.style.pointerEvents = 'all';
    keyboardKeys.forEach((key) => {
        key.classList.remove('clicked');
    });
    // reset hearts
    const hearts = document.querySelectorAll('.heart-display img');
    hearts.forEach((img) => {
        img.classList.remove('lostheart');
        img.src = './assets/hearts/liveHeart.png';
    });
    // resets lives
    gameboard.lives = 5;
    // gets a new random phrase, splits it, and appends to DOM
    gameboard.getRandomPhrase();
    gameboard.addPhraseToDisplay();
}

// initial function calls
// starts game
overlay.handleStart();
// listens for keyboard(virtual) events
keyboard.handleClicks();
// handles theme switching
theme.handleThemeToggle();
