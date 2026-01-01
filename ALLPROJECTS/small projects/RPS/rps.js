
        // Game state
        const gameState = {
            playerScore: 0,
            computerScore: 0,
            isExtendedMode: false,
            choices: {
                classic: ['rock', 'paper', 'scissors'],
                extended: ['rock', 'paper', 'scissors', 'lizard', 'spock']
            },
            rules: {
                classic: {
                    rock: { beats: ['scissors'], message: 'Rock crushes Scissors' },
                    paper: { beats: ['rock'], message: 'Paper covers Rock' },
                    scissors: { beats: ['paper'], message: 'Scissors cut Paper' }
                },
                extended: {
                    rock: { beats: ['scissors', 'lizard'], message: 'Rock crushes Scissors and crushes Lizard' },
                    paper: { beats: ['rock', 'spock'], message: 'Paper covers Rock and disproves Spock' },
                    scissors: { beats: ['paper', 'lizard'], message: 'Scissors cut Paper and decapitate Lizard' },
                    lizard: { beats: ['paper', 'spock'], message: 'Lizard eats Paper and poisons Spock' },
                    spock: { beats: ['rock', 'scissors'], message: 'Spock vaporizes Rock and smashes Scissors' }
                }
            }
        };

        // DOM Elements
        const playerScoreElement = document.getElementById('player-score');
        const computerScoreElement = document.getElementById('computer-score');
        const playerChoiceElement = document.getElementById('player-choice');
        const computerChoiceElement = document.getElementById('computer-choice');
        const resultDisplay = document.getElementById('result-display');
        const classicChoices = document.getElementById('classic-choices');
        const extendedChoices = document.getElementById('extended-choices');
        const classicModeBtn = document.getElementById('classic-mode');
        const extendedModeBtn = document.getElementById('extended-mode');
        const resetBtn = document.getElementById('reset-btn');
        const howToPlayBtn = document.getElementById('how-to-play-btn');
        const howToPlayModal = document.getElementById('how-to-play-modal');
        const closeModalBtn = document.getElementById('close-modal-btn');
        const classicInstructions = document.getElementById('classic-instructions');
        const extendedInstructions = document.getElementById('extended-instructions');

        // Initialize the game
        function initGame() {
            // Set up event listeners
            document.querySelectorAll('.choice-btn').forEach(btn => {
                btn.addEventListener('click', handlePlayerChoice);
            });
            
            classicModeBtn.addEventListener('click', () => toggleGameMode(false));
            extendedModeBtn.addEventListener('click', () => toggleGameMode(true));
            resetBtn.addEventListener('click', resetGame);
            howToPlayBtn.addEventListener('click', showHowToPlay);
            closeModalBtn.addEventListener('click', hideHowToPlay);
            
            // Close modal when clicking outside
            howToPlayModal.addEventListener('click', (e) => {
                if (e.target === howToPlayModal) {
                    hideHowToPlay();
                }
            });
            
            // Update UI based on initial mode
            toggleGameMode(gameState.isExtendedMode);
        }

        // Handle player's choice
        function handlePlayerChoice(e) {
            // Determine which choice was made based on the button clicked
            let choice;
            if (e.target.classList.contains('choice-btn')) {
                // Button was clicked directly
                choice = e.target.querySelector('i').className.match(/fa-hand-(\w+)/)[1];
            } else if (e.target.tagName === 'I') {
                // Icon inside button was clicked
                choice = e.target.className.match(/fa-hand-(\w+)/)[1];
            } else {
                return;
            }
            
            // Update player's choice display
            updateChoiceDisplay(playerChoiceElement, choice);
            
            // Disable choice buttons during computer's turn
            document.querySelectorAll('.choice-btn').forEach(btn => {
                btn.disabled = true;
                btn.classList.add('opacity-50');
            });
            
            // Show computer is thinking
            computerChoiceElement.innerHTML = '<i class="fas fa-cog fa-spin text-red-500"></i>';
            computerChoiceElement.classList.add('computer-choice');
            
            // After a short delay, make computer's choice
            setTimeout(() => {
                const computerChoice = makeComputerChoice();
                updateChoiceDisplay(computerChoiceElement, computerChoice);
                computerChoiceElement.classList.remove('computer-choice');
                
                // Determine the winner
                const result = determineWinner(choice, computerChoice);
                displayResult(result, choice, computerChoice);
                
                // Re-enable choice buttons
                document.querySelectorAll('.choice-btn').forEach(btn => {
                    btn.disabled = false;
                    btn.classList.remove('opacity-50');
                });
            }, 1000);
        }

        // Update choice display
        function updateChoiceDisplay(element, choice) {
            element.innerHTML = `<i class="fas fa-hand-${choice} ${element === playerChoiceElement ? 'text-blue-500' : 'text-red-500'}"></i>`;
        }

        // Make computer's choice
        function makeComputerChoice() {
            const choices = gameState.isExtendedMode ? gameState.choices.extended : gameState.choices.classic;
            const randomIndex = Math.floor(Math.random() * choices.length);
            return choices[randomIndex];
        }

        // Determine the winner
        function determineWinner(playerChoice, computerChoice) {
            if (playerChoice === computerChoice) {
                return 'draw';
            }
            
            const rules = gameState.isExtendedMode ? gameState.rules.extended : gameState.rules.classic;
            
            if (rules[playerChoice].beats.includes(computerChoice)) {
                return 'player';
            } else {
                return 'computer';
            }
        }

        // Display the result
        function displayResult(result, playerChoice, computerChoice) {
            let resultText = '';
            let resultColor = '';
            
            const rules = gameState.isExtendedMode ? gameState.rules.extended : gameState.rules.classic;
            
            switch (result) {
                case 'player':
                    gameState.playerScore++;
                    resultText = `You win! ${rules[playerChoice].message}`;
                    resultColor = 'text-green-500';
                    break;
                case 'computer':
                    gameState.computerScore++;
                    resultText = `Computer wins! ${rules[computerChoice].message}`;
                    resultColor = 'text-red-500';
                    break;
                case 'draw':
                    resultText = "It's a draw!";
                    resultColor = 'text-gray-500';
                    break;
            }
            
            // Update scores
            playerScoreElement.textContent = gameState.playerScore;
            computerScoreElement.textContent = gameState.computerScore;
            
            // Display result
            resultDisplay.innerHTML = `<p class="${resultColor} font-medium result-text">${resultText}</p>`;
        }

        // Toggle between classic and extended mode
        function toggleGameMode(isExtended) {
            gameState.isExtendedMode = isExtended;
            
            if (isExtended) {
                classicChoices.classList.add('hidden');
                extendedChoices.classList.remove('hidden');
                classicModeBtn.classList.remove('active');
                extendedModeBtn.classList.add('active');
                classicInstructions.classList.add('hidden');
                extendedInstructions.classList.remove('hidden');
            } else {
                classicChoices.classList.remove('hidden');
                extendedChoices.classList.add('hidden');
                classicModeBtn.classList.add('active');
                extendedModeBtn.classList.remove('active');
                classicInstructions.classList.remove('hidden');
                extendedInstructions.classList.add('hidden');
            }
            
            // Reset choices display when changing modes
            playerChoiceElement.innerHTML = '<i class="fas fa-question text-blue-500"></i>';
            computerChoiceElement.innerHTML = '<i class="fas fa-question text-red-500"></i>';
            resultDisplay.innerHTML = '';
        }

        // Reset the game
        function resetGame() {
            gameState.playerScore = 0;
            gameState.computerScore = 0;
            playerScoreElement.textContent = '0';
            computerScoreElement.textContent = '0';
            playerChoiceElement.innerHTML = '<i class="fas fa-question text-blue-500"></i>';
            computerChoiceElement.innerHTML = '<i class="fas fa-question text-red-500"></i>';
            resultDisplay.innerHTML = '';
            
            // Re-enable buttons if they were disabled
            document.querySelectorAll('.choice-btn').forEach(btn => {
                btn.disabled = false;
                btn.classList.remove('opacity-50');
            });
            
            computerChoiceElement.classList.remove('computer-choice');
        }

        // Show how to play modal
        function showHowToPlay() {
            howToPlayModal.classList.remove('hidden');
        }

        // Hide how to play modal
        function hideHowToPlay() {
            howToPlayModal.classList.add('hidden');
        }

        // Initialize the game when the page loads
        window.addEventListener('DOMContentLoaded', initGame);