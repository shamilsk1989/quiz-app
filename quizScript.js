const questions = [
  {
    type: 'multiple-choice',
    question: 'What is the capital of France?',
    options: ['Berlin', 'Madrid', 'Paris', 'Lisbon'],
    correct: 2, // Index of correct option
    explanation: 'Paris is the capital of France.',
  },
  {
    type: 'true-false',
    question: 'The Earth is flat.',
    correct: false, // Correct answer for true/false questions
    explanation: 'The Earth is an oblate spheroid, not flat.',
  },
  {
    type: 'fill-in-the-blank',
    question: 'The chemical symbol for water is ___',
    correct: 'H2O', // Correct answer for fill-in-the-blank
    explanation: 'The chemical symbol for water is H2O.',
  },
];

let currentQuestion = 0;
let score = 0;

// Shuffle questions for randomness
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

const randomizedQuestions = shuffle(questions);

// Load the current question
function loadQuestion() {
  const questionElement = document.getElementById('question');
  const optionsElement = document.getElementById('options');

  // Clear previous content
  optionsElement.innerHTML = '';

  const question = randomizedQuestions[currentQuestion];
  questionElement.textContent = question.question;

  // Render the question type
  switch (question.type) {
    case 'multiple-choice':
      question.options.forEach((option, index) => {
        const button = document.createElement('button');
        button.textContent = option;
        button.className = 'option';
        button.onclick = () => handleMultipleChoice(index);
        optionsElement.appendChild(button);
      });
      break;

    case 'true-false':
      ['True', 'False'].forEach((option, index) => {
        const button = document.createElement('button');
        button.textContent = option;
        button.className = 'option';
        button.onclick = () => handleTrueFalse(option === 'True');
        optionsElement.appendChild(button);
      });
      break;

    case 'fill-in-the-blank':
      const input = document.createElement('input');
      input.type = 'text';
      input.id = 'fillInput';
      input.placeholder = 'Type your answer here';
      input.className = 'fill-input';
      optionsElement.appendChild(input);

      const submitButton = document.createElement('button');
      submitButton.textContent = 'Submit';
      submitButton.className = 'submit-btn';
      submitButton.onclick = () => handleFillInTheBlank(input.value);
      optionsElement.appendChild(submitButton);
      break;

    default:
      console.error('Unsupported question type');
  }

  document.getElementById('next').disabled = true; // Disable Next button initially
}

function handleMultipleChoice(selectedIndex) {
  const question = randomizedQuestions[currentQuestion];

  // Highlight the correct answer in green
  document.querySelectorAll('.option').forEach((btn, index) => {
    if (index === question.correct) {
      btn.style.backgroundColor = '#28a745'; // Correct: Green
      btn.style.color = 'white';
    }
    btn.disabled = true; // Disable all buttons after selection
  });

  // Update score if the selected option is correct
  if (selectedIndex === question.correct) {
    score++;
  }

  // Enable 'Next' button
  document.getElementById('next').disabled = false;
}

function handleTrueFalse(selectedAnswer) {
  const question = randomizedQuestions[currentQuestion];

  // Highlight the correct answer in green
  document.querySelectorAll('.option').forEach((btn) => {
    if ((btn.textContent === 'True') === question.correct) {
      btn.style.backgroundColor = '#28a745'; // Correct: Green
      btn.style.color = 'white';
    }
    btn.disabled = true; // Disable all buttons
  });

  // Update score if the selected answer is correct
  if (selectedAnswer === question.correct) {
    score++;
  }

  // Enable 'Next' button
  document.getElementById('next').disabled = false;
}

function handleFillInTheBlank(userInput) {
  const question = randomizedQuestions[currentQuestion];
  const inputElement = document.getElementById('fillInput');

  // Check if the user's answer matches the correct answer (case-insensitive)
  if (userInput.trim().toLowerCase() === question.correct.toLowerCase()) {
    inputElement.style.borderColor = '#28a745'; // Correct: Green border
    score++;
  } else {
    inputElement.style.borderColor = ''; // No border color for wrong input
  }

  inputElement.disabled = true; // Disable input
  document.getElementById('next').disabled = false;
}

// Navigate to the next question
function nextQuestion() {
  currentQuestion++;

  if (currentQuestion < randomizedQuestions.length) {
    loadQuestion();
  } else {
    showResults();
  }
}

// Show quiz results
function showResults() {
  const content = document.getElementById('content');

  const resultsHTML = `
    <div class="results-container">
      <h2 class="results-title">Quiz Results</h2>
      <p class="results-score">Your Score: <span>${score}</span> / ${
    randomizedQuestions.length
  }</p>
      <div class="results-questions">
        ${randomizedQuestions
          .map(
            (q, i) =>
              `<div class="result-item">
                <p class="result-question"><strong>${i + 1}. ${
                q.question
              }</strong></p>
                <p class="result-answer"><strong>Correct Answer:</strong> ${
                  q.type === 'multiple-choice' || q.type === 'fill-in-the-blank'
                    ? q.correct
                    : q.correct
                    ? 'True'
                    : 'False'
                }</p>
                <p class="result-explanation"><strong>Explanation:</strong> ${
                  q.explanation
                }</p>
              </div>`
          )
          .join('')}
      </div>
      <button class="restart-btn" onclick="restartQuiz()">Restart Quiz</button>
    </div>
  `;

  content.innerHTML = resultsHTML;
}

// Restart the quiz
function restartQuiz() {
  location.reload();
  // // Reset quiz variables
  // score = 0;
  // currentQuestion = 0;
  // shuffle(randomizedQuestions);

  // // Ensure the #quiz section exists before modifying
  // const quizElement = document.getElementById('quiz');

  // if (quizElement) {
  //   // Clear previous quiz content but retain styles
  //   quizElement.innerHTML = `
  //     <h2 id="question">Question will appear here</h2>
  //     <div id="options" class="options-container">
  //       <!-- Options will be dynamically added here -->
  //     </div>
  //     <button id="next" onclick="nextQuestion()" disabled>Next</button>
  //   `;

  //   // Reload the first question
  //   loadQuestion();
  // } else {
  //   console.error('Quiz element not found.');
  // }
}

// Initialize the quiz on page load
document.addEventListener('DOMContentLoaded', () => {
  loadQuestion();
});
