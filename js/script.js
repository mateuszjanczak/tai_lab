let preQuestions;

fetch('https://quiztai.herokuapp.com/api/quiz')
    .then(resp => resp.json())
    .then(resp => {
        preQuestions = resp;
        setQuestion(0);
        activateAnswers();
    });

let next = document.querySelector('.next');
let previous = document.querySelector('.previous');
let question = document.querySelector('.question');
let questionNumber = document.querySelector('.question-number');
let answers = document.querySelectorAll('.list-group-item');
let list = document.querySelector(".list");
let results = document.querySelector(".results");
let userScorePoint = document.querySelector(".userScorePoint");
let average = document.querySelector(".average");
let pointsElem = document.querySelector('.score');
let restart = document.querySelector('.restart');
let index = 0;
let points = 0;

for (let i = 0; i < answers.length; i++) {
    answers[i].addEventListener('click', doAction);
}

function doAction(event) {
    if (event.target.innerHTML === preQuestions[index].correct_answer) {
        points++;
        pointsElem.innerText = points;
        markCorrect(event.target);
    }
    else {
        markInCorrect(event.target);
    }
    disableAnswers();
}

restart.addEventListener('click', function (event) {
    event.preventDefault();
    index = 0;
    points = 0;
    let userScorePoint = document.querySelector('.score');
    userScorePoint.innerHTML = points;
    setQuestion(index);
    activateAnswers();
    list.style.display = 'block';
    results.style.display = 'none';
});


function setQuestion(index) {
    question.innerHTML = preQuestions[index].question;
    questionNumber.innerHTML = index + 1 + " / " + preQuestions.length;

    answers[0].innerHTML = preQuestions[index].answers[0];
    answers[1].innerHTML = preQuestions[index].answers[1];
    answers[2].innerHTML = preQuestions[index].answers[2];
    answers[3].innerHTML = preQuestions[index].answers[3];

    if (preQuestions[index].answers.length === 2) {
        answers[2].style.display = 'none';
        answers[3].style.display = 'none';
    } else {
        answers[2].style.display = 'block';
        answers[3].style.display = 'block';
    }
}

next.addEventListener('click', function () {
    index++;
    if (index >= preQuestions.length) {
        saveScore(points);
        list.style.display = 'none';
        results.style.display = 'block';
        userScorePoint.innerHTML = points;
    } else {
        setQuestion(index);
        activateAnswers();
    }
});

function saveScore(score) {
    let scores;

    if(localStorage.getItem("scores") === null) {
        scores = [];
    } else {
        scores = JSON.parse(localStorage.getItem("scores"));
    }

    scores.push(parseInt(score));
    localStorage.setItem("scores", JSON.stringify(scores));

    let sum = 0;

    scores.forEach(item => {
        sum += item;
    });

    average.innerHTML = sum / scores.length;
}

previous.addEventListener('click', function () {
    if(index === 0) {
        return;
    }

    index--;
    setQuestion(index);
    activateAnswers();
});

function activateAnswers() {
    for (let i = 0; i < answers.length; i++) {
        answers[i].addEventListener('click', doAction);
        clearClass(answers[i]);
    }
}

function disableAnswers() {
    for (let i = 0; i < answers.length; i++) {
        answers[i].removeEventListener('click', doAction);
    }
}

function clearClass(elem) {
    elem.classList.remove('correct');
    elem.classList.remove('incorrect');
}

function markCorrect(elem) {
    elem.classList.add('correct');
}

function markInCorrect(elem) {
    elem.classList.add('incorrect');
}