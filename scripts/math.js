// Function to generate random number within range (min inclusive, max inclusive)
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Function to generate questions and answers
function generateQuestions() {
    // Initialize empty objects for questions and answers
    const questions = {
        addition: [],
        subtraction: [],
        multiplication: []
    };
    
    const answers = {
        addition: {},
        subtraction: {},
        multiplication: {}
    };

    // Generate 10 questions for each type
    for (let i = 1; i <= 10; i++) {
        // Addition (numbers 1-10)
        const add1 = getRandomInt(1, 10);
        const add2 = getRandomInt(1, 10);
        questions.addition.push(`${add1} + ${add2} = `);
        answers.addition[`add${i}`] = add1 + add2;

        // Subtraction (numbers 1-10)
        const num1 = getRandomInt(1, 10);
        const num2 = getRandomInt(1, num1); // Ensure num2 is smaller than num1
        questions.subtraction.push(`${num1} - ${num2} = `);
        answers.subtraction[`sub${i}`] = num1 - num2;

        // Multiplication (numbers 1-10)
        const mult1 = getRandomInt(1, 10);
        const mult2 = getRandomInt(1, 10);
        questions.multiplication.push(`${mult1} × ${mult2} = `);
        answers.multiplication[`mult${i}`] = mult1 * mult2;
    }

    return { questions, answers };
}

// Function to populate forms with questions
function populateForms() {
    // Populate Addition Form
    const additionForm = document.getElementById('additionForm');
    questions.addition.forEach((question, index) => {
        const questionDiv = additionForm.querySelector(`[id="add${index + 1}"]`).parentNode;
        questionDiv.innerHTML = `${index + 1}) ${question}<input type="number" id="add${index + 1}" required>`;
    });

    // Populate Subtraction Form
    const subtractionForm = document.getElementById('subtractionForm');
    questions.subtraction.forEach((question, index) => {
        const questionDiv = subtractionForm.querySelector(`[id="sub${index + 1}"]`).parentNode;
        questionDiv.innerHTML = `${index + 1}) ${question}<input type="number" id="sub${index + 1}" required>`;
    });

    // Populate Multiplication Form
    const multiplicationForm = document.getElementById('multiplicationForm');
    questions.multiplication.forEach((question, index) => {
        const questionDiv = multiplicationForm.querySelector(`[id="mult${index + 1}"]`).parentNode;
        questionDiv.innerHTML = `${index + 1}) ${question}<input type="number" id="mult${index + 1}" required>`;
    });
}

function checkAnswers(formId, answers) {
    const form = document.getElementById(formId);
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Remove previous results
        const oldResults = form.getElementsByClassName('result');
        while(oldResults.length > 0) {
            oldResults[0].remove();
        }

        let correct = 0;
        
        // Check each answer
        for(let key in answers) {
            const input = document.getElementById(key);
            const userAnswer = parseInt(input.value);
            const correctAnswer = answers[key];
            
            const resultDiv = document.createElement('div');
            resultDiv.className = 'result';
            
            if(userAnswer === correctAnswer) {
                resultDiv.textContent = `Question ${key.slice(-2) || key.slice(-1)}: Correct! 🌟`;
                resultDiv.classList.add('correct');
                correct++;
            } else {
                resultDiv.textContent = `Question ${key.slice(-2) || key.slice(-1)}: Wrong. The correct answer is ${correctAnswer} 💫`;
                resultDiv.classList.add('incorrect');
            }
            
            input.parentNode.appendChild(resultDiv);
        }

        const totalResult = document.createElement('div');
        totalResult.className = 'result';
        totalResult.textContent = `You got ${correct} out of 10 correct! ${correct === 10 ? '🎉 Perfect Score!' : 'Keep practicing! 💪'}`;
        form.appendChild(totalResult);
    });
}

// Generate questions and answers
const { questions, answers } = generateQuestions();

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Populate forms with questions
    populateForms();

    // Initialize the forms with the generated answers
    checkAnswers('additionForm', answers.addition);
    checkAnswers('subtractionForm', answers.subtraction);
    checkAnswers('multiplicationForm', answers.multiplication);
});

// Go Up Button functionality
window.addEventListener('scroll', function() {
    const goUpButton = document.getElementById('go-up');
    if (window.scrollY > 300) {
        goUpButton.style.display = 'block';
    } else {
        goUpButton.style.display = 'none';
    }
}); 