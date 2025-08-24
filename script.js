// Poore game ke liye zaroori variables aur elements
const welcomeScreen = document.getElementById('welcome-screen');
const authScreen = document.getElementById('auth-screen');
const userInfoScreen = document.getElementById('user-info-screen');
const quizScreen = document.getElementById('quiz-screen');
const resultScreen = document.getElementById('result-screen');

const startBtn = document.getElementById('start-btn');
const showSignupBtn = document.getElementById('show-signup');
const loginForm = document.getElementById('login-form');
const signupForm = document.getElementById('signup-form');
const userInfoForm = document.getElementById('user-info-form');
const nextBtn = document.getElementById('next-btn');
const helplineBtn = document.getElementById('helpline-btn');
const restartBtn = document.getElementById('restart-btn');

const questionText = document.getElementById('question-text');
const optionsContainer = document.getElementById('options-container');
const displayUsername = document.getElementById('display-username');
const scoreDisplay = document.getElementById('score');
const finalScoreDisplay = document.getElementById('final-score');

let currentUser = {};
let currentQuestionIndex = 0;
let score = 0;
let isHelplineUsed = false;

let quizQuestions = []; // Questions JSON file se load honge

// --- JSON file se questions load karne ka function ---
async function loadQuestions() {
    try {
        const response = await fetch('questions.json');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        quizQuestions = await response.json();
        console.log('Questions loaded successfully!');
        // Questions load hone ke baad, welcome screen dikhao
        showScreen(welcomeScreen);
    } catch (error) {
        console.error('There was a problem loading the questions:', error);
        alert('Could not load quiz questions. Please try again later.');
    }
}

// --- Screens ko change karne ka function ---
function showScreen(screen) {
    const allScreens = document.querySelectorAll('.screen');
    allScreens.forEach(s => s.classList.remove('active'));
    screen.classList.add('active');
}

// --- Event Listeners ---
startBtn.addEventListener('click', () => {
    showScreen(authScreen);
});

showSignupBtn.addEventListener('click', (e) => {
    e.preventDefault();
    loginForm.style.display = 'none';
    signupForm.style.display = 'block';
});

// Signup Form ka logic
signupForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const username = document.getElementById('signup-username').value;
    const password = document.getElementById('signup-password').value;
    
    localStorage.setItem(username, JSON.stringify({ password: password, name: '', age: '', education: '' }));
    alert('Sign Up Successful! Please log in.');
    
    loginForm.style.display = 'block';
    signupForm.style.display = 'none';
});

// Login Form ka logic
loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;
    
    const storedUser = JSON.parse(localStorage.getItem(username));
    
    if (storedUser && storedUser.password === password) {
        currentUser.username = username;
        if (storedUser.name) {
            currentUser.name = storedUser.name;
            showScreen(quizScreen);
            displayUsername.textContent = `Welcome, ${currentUser.name}!`;
            loadQuestion();
        } else {
            showScreen(userInfoScreen);
        }
    } else {
        alert('Invalid Username or Password!');
    }
});

// User Info Form ka logic
userInfoForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('user-name').value;
    const age = document.getElementById('user-age').value;
    const education = document.getElementById('user-education').value;
    
    const storedUser = JSON.parse(localStorage.getItem(currentUser.username));
    storedUser.name = name;
    storedUser.age = age;
    storedUser.education = education;
    localStorage.setItem(currentUser.username, JSON.stringify(storedUser));
    
    currentUser.name = name;
    showScreen(quizScreen);
    displayUsername.textContent = `Welcome, ${currentUser.name}!`;
    loadQuestion();
});

// --- Quiz Game ka main logic ---
function loadQuestion() {
    isHelplineUsed = false;
    nextBtn.style.display = 'none';
    helplineBtn.disabled = false;
    optionsContainer.innerHTML = '';
    
    if (currentQuestionIndex < quizQuestions.length) {
        const questionData = quizQuestions[currentQuestionIndex];
        
        // Sawal ko 'question_roman' key se load kar rahe hain
        questionText.textContent = questionData.question_roman;
        
        // Options ko display kar rahe hain
        questionData.options.forEach(option => {
            const optionElement = document.createElement('div');
            optionElement.classList.add('option');
            optionElement.textContent = option;
            optionElement.addEventListener('click', () => selectOption(option, questionData.answer));
            optionsContainer.appendChild(optionElement);
        });
    } else {
        showResult();
    }
}

function selectOption(selectedOption, correctAnswer) {
    const options = document.querySelectorAll('.option');
    options.forEach(option => {
        // Sahi jawab check kar rahe hain
        if (option.textContent === correctAnswer) {
            option.classList.add('correct');
        } else {
            option.classList.add('incorrect');
        }
        option.style.pointerEvents = 'none';
    });

    if (selectedOption === correctAnswer) {
        score += 10;
    }

    scoreDisplay.textContent = `Score: ${score}`;
    nextBtn.style.display = 'block';
}

// Next button ka logic
nextBtn.addEventListener('click', () => {
    currentQuestionIndex++;
    loadQuestion();
});

// Helpline button ka logic
helplineBtn.addEventListener('click', () => {
    if (isHelplineUsed) {
        return;
    }
    
    alert('Ad will be shown here for helpline!'); // Fake Ad
    isHelplineUsed = true;
    helplineBtn.disabled = true;

    const currentQuestion = quizQuestions[currentQuestionIndex];
    const options = Array.from(document.querySelectorAll('.option'));
    
    let optionsToRemove = options.filter(opt => opt.textContent !== currentQuestion.answer);
    
    if (optionsToRemove.length > 1) {
        const randomIndex = Math.floor(Math.random() * optionsToRemove.length);
        optionsToRemove[randomIndex].style.opacity = 0.3;
        optionsToRemove[randomIndex].style.pointerEvents = 'none';
    }
});

function showResult() {
    showScreen(resultScreen);
    finalScoreDisplay.textContent = score;
}

restartBtn.addEventListener('click', () => {
    currentQuestionIndex = 0;
    score = 0;
    scoreDisplay.textContent = `Score: 0`;
    loadQuestion();
    showScreen(quizScreen);
});

// Sabse aakhir mein, game shuru karne ke liye questions load karo
loadQuestions();
