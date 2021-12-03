const overlay = {
    handleStart: () => {
        const overlay = document.querySelector('.overlay');
        const heading = overlay.querySelector('h1');
        const p = overlay.querySelector('p');
        const btn = overlay.querySelector('button.overlay-btn');
        overlay.addEventListener('click', e => {
            if (e.target.textContent === `Let's Play` || e.target.textContent === 'Play Again?') {
                gameboard.getRandomPhrase();
                gameboard.addPhraseToDisplay();
                heading.classList.add('hide');
                p.classList.add('hide');
                p.textContent = 'Good Luck!'
                btn.classList.add('hide');
                setTimeout(() => {
                    overlay.classList.remove('show');
                    p.style.display = 'none';
                }, 1200);
            } 
            if (e.target.textContent === 'Play Again?') {
                resetGame();
            }
            
        });
    }
}

const theme = {
    handleThemeToggle: () => {
        const themeContainer = document.querySelector('.theme-toggle');
        const light = themeContainer.querySelector('.light');
        const dark = themeContainer.querySelector('.dark');
        themeContainer.addEventListener('click', e => {
            if (e.target === light) {
                document.body.classList = '';
            } else {
                document.body.classList.add('whoturnedoffthelights')
            }
        })
    }
}

const gameboard = {
    lives: 5,
    phrases: [
        'nubcake for life',
        'need more coffee',
        'console dot log it',
        'bugs everywhere',
        'stack overflow it',
        'ole guily guily'
    ],
    selectedPhrase: "",
    getRandomPhrase: (arr) => {
        const phraseIndex = Math.floor(Math.random() * gameboard.phrases.length);
        phrase = gameboard.phrases[phraseIndex].split("");
        gameboard.selectedPhrase = phrase;
        return phrase;
    },
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


const keyboard = {
    currentClick: "",
    handleClicks: () => {
        const keyboard = document.querySelector('.keyboard');
        keyboard.addEventListener('click', e => {
            if (e.target.tagName === 'LI') {
                e.target.classList.add('clicked');
                keyboard.currentClick = e.target.textContent.toLowerCase();
                handleClickValidation();
            }
        });
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
        const handleUpdatingHearts = () => {
            gameboard.lives -= 1;
            const hearts = document.querySelectorAll('.heart-display img');
            hearts[gameboard.lives].src = './assets/hearts/lostHeart.png';
            hearts[gameboard.lives].classList.add('lostheart');
        }
    }
}

const scoreCheck = {
    overlay:document.querySelector('.overlay'),
    heading: document.querySelector('.overlay h1'),
    p: document.querySelector('.overlay p'),
    btn:document.querySelector('.overlay button.overlay-btn'),
    keyboard: document.querySelector('.keyboard'),
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


const resetGame = () => {
    const phraseDisplay = document.querySelector('.phrase-display ul')
    phraseDisplay.innerHTML = '';

    const keyboard = document.querySelector('.keyboard');
    const keyboardKeys = keyboard.querySelectorAll('li');
    
    keyboard.style.pointerEvents = 'all';
    keyboardKeys.forEach((key) => {
        key.classList.remove('clicked');
    });

    const hearts = document.querySelectorAll('.heart-display img');
    hearts.forEach((img) => {
        img.classList.remove('lostheart');
        img.src = './assets/hearts/liveheart.png';
    });

    gameboard.lives = 5;

    gameboard.getRandomPhrase();
    gameboard.addPhraseToDisplay();

}



overlay.handleStart();
keyboard.handleClicks();
theme.handleThemeToggle();
