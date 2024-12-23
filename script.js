// Box timer setup (20, 30, 40 seconds)
const boxTimes = {
    1: 40, 2: 30, 3: 30, 4: 30, 5: 40,
    6: 30, 7: 40, 8: 30, 9: 40, 10: 30,
    11: 30, 12: 40, 13: 20, 14: 40, 15: 30,
    16: 30, 17: 40, 18: 30, 19: 40, 20: 30,
    21: 40, 22: 30, 23: 30, 24: 30, 25: 40
  };
  
  // Sample questions and answers with descriptions
  const questions = {
    1: {
      question: "What is the capital of France?",
      description: "This city is known for its iconic Eiffel Tower and is often referred to as the city of love.",
      correctAnswer: "Paris"
    },
    2: {
      question: "What is the largest ocean on Earth?",
      description: "This ocean spans more than 63 million square miles and covers about 30% of the Earth's surface.",
      correctAnswer: "Pacific Ocean"
    },
    3: {
      question: "What is the chemical symbol for water?",
      description: "This compound consists of two hydrogen atoms bonded to a single oxygen atom.",
      correctAnswer: "H2O"
    },
    4: {
      question: "What is the tallest mountain in the world?",
      description: "This peak is located in the Himalayas and stands at 29,032 feet above sea level.",
      correctAnswer: "Mount Everest"
    },
    5: {
      question: "What is the largest planet in our solar system?",
      description: "This planet is a gas giant and is known for its Great Red Spot and many moons.",
      correctAnswer: "Jupiter"
    }
  };
  
  // Initialize the game
  document.addEventListener('DOMContentLoaded', () => {
    setupGame();
    const boxes = document.querySelectorAll('.box');
    boxes.forEach(box => box.addEventListener('click', () => onBoxClick(parseInt(box.id.split('-')[1]))));
  });
  
  // Function to set up the game board (add colors and setup event listeners)
  function setupGame() {
    const boxes = document.querySelectorAll('.box');
    
    boxes.forEach(box => {
      const boxNumber = parseInt(box.id.split('-')[1]);
      const time = boxTimes[boxNumber];
  
      // Apply the color based on the time allocation
      if (time === 20) {
        box.style.backgroundColor = 'pink'; // Fluorescent pink
      } else if (time === 30) {
        box.style.backgroundColor = 'lightblue'; // Fluorescent blue
      } else if (time === 40) {
        box.style.backgroundColor = 'lightgreen'; // Fluorescent green
      }
  
      // Reset box styles in case the game was reset
      box.classList.remove('claimed', 'blackhole');
      box.style.color = 'black'; // Default text color
    });
  
    // Hide the timer container initially
    document.getElementById('timer-container').style.visibility = 'hidden';
  
    // Clear any previous question display
    const questionDisplay = document.getElementById('question-display');
    questionDisplay.textContent = ''; // Clear question on setup
  }
  
  // When a box is clicked
  function onBoxClick(boxNumber) {
    const box = document.getElementById(`box-${boxNumber}`);
  
    // Check if the box is already claimed or "gone to blackhole"
    if (box.classList.contains('claimed') || box.classList.contains('blackhole')) {
      return;
    }
  
    // Start the timer for this box
    startTimerForBox(boxNumber);
  
    // Display the question for this box (Descriptive question and answer)
    const question = questions[boxNumber];
    if (question) {
      displayQuestion(question);
    }
  
    // Disable box while question is answered
    box.classList.add('claimed');
  }
  
  // Start the timer for each box
  function startTimerForBox(boxNumber) {
    const box = document.getElementById(`box-${boxNumber}`);
    const timerContainer = document.getElementById('timer-container');
    const timerElement = document.getElementById('timer');
    const time = boxTimes[boxNumber];
  
    // Show the timer container
    timerContainer.style.visibility = 'visible';
  
    // Start the countdown for the timer
    let seconds = time;
    let minutes = Math.floor(seconds / 60);
    seconds = seconds % 60;
    timerElement.textContent = `${formatTime(minutes)}:${formatTime(seconds)}`;
  
    const timerInterval = setInterval(() => {
      seconds--;
      if (seconds < 0) {
        seconds = 59;
        minutes--;
      }
      timerElement.textContent = `${formatTime(minutes)}:${formatTime(seconds)}`;
      
      if (minutes === 0 && seconds === 0) {
        clearInterval(timerInterval);
      }
    }, 1000);
  }
  
  // Format time to always display two digits (e.g., 02:09)
  function formatTime(time) {
    return time < 10 ? '0' + time : time;
  }
  
  // Display the question with a description and handle timer reset
  function displayQuestion(question, player) {
    const questionDisplay = document.getElementById('question-display');
    const playerDisplay = document.getElementById('player-turn');
  
    // Display question, description, and current player
    questionDisplay.innerHTML = `
        <strong>Question:</strong> ${question.question} <br><br>
        <strong>Description:</strong> ${question.description} <br><br>
        <strong>Player ${player}'s turn</strong>
    `;
    
    // Show the current player in a dedicated element (you can style this as needed)
    playerDisplay.textContent = `Player ${player}, it's your turn!`;
  
    // Placeholder logic for player answers
    const answerTime = boxTimes[13]; // Example, you can replace this with the real time logic for the box
    setTimeout(() => {
      questionDisplay.innerHTML = ''; // Clear the question after the timer ends
  
      // Logic to check if the answer was correct and update the game state
      // For now, let's just reset the turn after some time
      switchPlayer(); // Move to the next player after timeout
    }, answerTime * 1000); // Clear after allotted time
  }
  
  // Function to switch turns between players
  function switchPlayer() {
    currentPlayer = currentPlayer === 1 ? 2 : 1; // Toggle between player 1 and player 2
    assignQuestion(currentPlayer); // Get and display a new question for the new player
    // Optionally, you can reset the box or change the box styles to indicate the player
    resetBoxForNextTurn();
  }
  
  // Reset the box to available state for the next player's turn
  function resetBoxForNextTurn() {
    const boxes = document.querySelectorAll('.box');
    boxes.forEach(box => {
      if (!box.classList.contains('claimed') && !box.classList.contains('blackhole')) {
        box.classList.remove('claimed');
        box.style.backgroundColor = ''; // Reset the background color to default
      }
    });
  }
  
  // Function to assign a random question to the current player
  function assignQuestion(player) {
    let question;
    do {
      question = getRandomQuestion(); // Fetch a random question from the pool
    } while (answeredQuestions.includes(question)); // Ensure that the question hasn't been asked already
    answeredQuestions.push(question);
    
    displayQuestion(question, player); // Display the question and set up the turn for the current player
  }
  
  // Fetch a random question from the available pool of questions
  function getRandomQuestion() {
    const questionNumbers = Object.keys(questions);
    const randomIndex = Math.floor(Math.random() * questionNumbers.length);
    return questions[questionNumbers[randomIndex]];
  }
  
  // Handle the answer checking and claim
  function handlePlayerAnswer(playerAnswer, boxNumber) {
    const correctAnswer = questions[boxNumber].correctAnswer;
    const box = document.getElementById(`box-${boxNumber}`);
  
    if (playerAnswer.toLowerCase() === correctAnswer.toLowerCase()) {
      alert('Correct answer! You claim the box!');
      box.classList.add('claimed');
      box.style.backgroundColor = 'lightgreen'; // Mark as claimed
      // Update player score (this logic needs to be implemented)
    } else {
      alert('Incorrect answer. Next player gets a chance!');
      // Let the opponent try or reset the box if both fail (blackhole logic)
    }
  }
  
  // Handle the blackhole scenario if both players fail to answer
  function resetBoxToBlackhole(boxNumber) {
    const box = document.getElementById(`box-${boxNumber}`);
    box.classList.add('blackhole'); // Mark the box as blackhole
    box.textContent = 'Blackhole'; // Label the box as blackhole
    box.style.backgroundColor = 'black'; // Set background to black
  }
  
  // Player turn management
  let answeredQuestions = [];
  let currentPlayer = 1; // Player 1 starts
  startTimer();
  