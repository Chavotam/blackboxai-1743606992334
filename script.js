// Quiz functionality
let currentQuestion = 0;
let score = 0;
let userAnswers = Array(quizData.length).fill(null);

// DOM elements
const questionText = document.getElementById('question-text');
const optionsContainer = document.getElementById('options');
const progressBar = document.getElementById('progress');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');

// Initialize quiz if on quiz page
if (window.location.pathname.includes('quiz.html')) {
    document.addEventListener('DOMContentLoaded', () => {
        loadQuestion();
        prevBtn.addEventListener('click', prevQuestion);
        nextBtn.addEventListener('click', nextQuestion);
    });
}

// Load question
function loadQuestion() {
    const question = quizData[currentQuestion];
    questionText.textContent = question.question;
    
    optionsContainer.innerHTML = '';
    question.options.forEach((option, index) => {
        const button = document.createElement('button');
        button.className = 'option-btn';
        if (userAnswers[currentQuestion] === index) {
            button.classList.add('selected');
        }
        button.textContent = option;
        button.onclick = () => selectOption(index);
        optionsContainer.appendChild(button);
    });

    // Update progress bar
    progressBar.style.width = `${(currentQuestion / quizData.length) * 100}%`;
    
    // Update button states
    prevBtn.disabled = currentQuestion === 0;
    nextBtn.textContent = currentQuestion === quizData.length - 1 ? 'Submit' : 'Next';
}

// Select option
function selectOption(index) {
    userAnswers[currentQuestion] = index;
    const buttons = document.querySelectorAll('.option-btn');
    buttons.forEach(btn => btn.classList.remove('selected'));
    buttons[index].classList.add('selected');
}

// Navigation
function nextQuestion() {
    if (userAnswers[currentQuestion] === null) {
        alert('Please select an answer');
        return;
    }

    if (currentQuestion < quizData.length - 1) {
        currentQuestion++;
        loadQuestion();
    } else {
        calculateScore();
    }
}

function prevQuestion() {
    if (currentQuestion > 0) {
        currentQuestion--;
        loadQuestion();
    }
}

// Calculate score
function calculateScore() {
    score = 0;
    quizData.forEach((question, index) => {
        if (userAnswers[index] !== null && 
            question.options[userAnswers[index]] === question.answer) {
            score++;
        }
    });
    
    // Store score and redirect
    localStorage.setItem('quizScore', score);
    window.location.href = 'results.html';
}

// Display results
if (window.location.pathname.includes('results.html')) {
    document.addEventListener('DOMContentLoaded', () => {
        const score = localStorage.getItem('quizScore') || 0;
        const percentage = Math.round((score / quizData.length) * 100);
        
        document.getElementById('score').textContent = score;
        document.getElementById('percentage').textContent = percentage;
        document.getElementById('score-bar').style.width = `${percentage}%`;
    });
}