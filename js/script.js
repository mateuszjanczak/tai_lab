    let preQuestions;

    fetch('https://quiztai.herokuapp.com/api/quiz')
        .then(resp => resp.json())
        .then(resp => {
            preQuestions = resp;
            length = preQuestions.length;
            enableStartBtn();
        });

    let startBtn = document.querySelector('.start');
    let restartBtn = document.querySelector('.restart');
    let showAnswersBtn = document.querySelector('.show-answers');

    let questionElem = document.querySelector('.question');
    let answersElem = document.querySelectorAll('.list-group-item');
    let progressBarElem = document.querySelector('.progress-bar');
    let introElem = document.querySelector(".intro");
    let listElem = document.querySelector(".list");
    let resultsElem = document.querySelector(".results");
    let resultAnswersElem = document.querySelector(".answers");
    let scoreElem = document.querySelector('.score');
    let lengthElem = document.querySelector('.length');
    let pointsElem = document.querySelector('.points');
    let tasksElem = document.querySelector('.tasks');

    let userScorePointElem = document.querySelector(".userScorePoint");
    let userPercentElem = document.querySelector(".userPercent");
    let globalAverageElem = document.querySelector(".globalAverage");
    let globalPercentElem = document.querySelector(".globalPercent");

    let index = 0;
    let length = 0;
    let points = 0;
    let interval;
    let selectedAnswers = [];

    const enableStartBtn = () => {
        startBtn.disabled = false;
    }

    const setTasks = (length) => {
        tasksElem.innerHTML = "";
        for(let i = 1; i <= length; i++){
            const elem = document.createElement('div');
            elem.setAttribute('id', 'task' + i);
            elem.classList.add('unknown');
            elem.innerText = i;
            tasksElem.append(elem);
        }
        pointsElem.innerHTML = length;
        lengthElem.innerText = length;
    }

    const startQuiz = (event) => {
        event.preventDefault();
        index = 0;
        points = 0;
        scoreElem.innerHTML = points;
        selectedAnswers = [];
        setTasks(length);
        setQuestion(index);
        activateAnswers();
        resultAnswersElem.classList.add('d-none');
        introElem.classList.add("d-none");
        listElem.classList.remove("d-none");
        resultsElem.classList.add("d-none");
    };

    const doAction = (event) => {
        if (event.target.innerHTML === preQuestions[index].correct_answer) {
            points++;
            scoreElem.innerText = points;
            markCorrect(event.target);
            markTaskCorrect();
        } else {
            markInCorrect(event.target);
            markTaskInCorrect();
        }
        selectedAnswers[index] = event.target.innerHTML;
        disableAnswers();
        clearInterval(interval);
        setTimeout(nextQuestion, 1000);
    }

    const setQuestion = (index) => {
        markTaskInProgress();
        progressBarElem.style.width = '100%';
        progressBarElem.classList.add('bg-info');
        progressBarElem.classList.remove('bg-danger');

        clearInterval(interval);
        interval = setInterval(function () {
            let progress = parseInt(progressBarElem.style.width) - 10;
            progressBarElem.style.width = progress + '%';
            if(progress < 30) {
                progressBarElem.classList.add('bg-danger');
                progressBarElem.classList.remove('bg-info');
            }

            if(progress === 0) {
                markTaskIgnored();
                nextQuestion();
            }
        }, 1000);

        questionElem.innerHTML = preQuestions[index].question;

        for(let i = 0; i < answersElem.length; i++) {
            answersElem[i].innerHTML = preQuestions[index].answers[i];
        }

        if (preQuestions[index].answers.length === 2) {
            answersElem[2].classList.add('d-none');
            answersElem[3].classList.add('d-none');
        } else {
            answersElem[2].classList.remove('d-none');
            answersElem[3].classList.remove('d-none');
        }
    }

    const nextQuestion = () => {
        index++;
        if (index >= preQuestions.length) {
            saveScore(points);
            listElem.classList.add('d-none');
            resultsElem.classList.remove('d-none');
            userScorePointElem.innerHTML = points;
            userPercentElem.innerHTML = getPercent(points);
        } else {
            setQuestion(index);
            activateAnswers();
        }
    }

    const saveScore = (score) => {
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

        let averagePoints = sum / scores.length;
        globalAverageElem.innerHTML = averagePoints.toFixed(2);
        globalPercentElem.innerHTML = getPercent(averagePoints);
    }

    const activateAnswers = () => {
        for (let i = 0; i < answersElem.length; i++) {
            answersElem[i].addEventListener('click', doAction);
            clearClass(answersElem[i]);
        }
    }

    const disableAnswers = () => {
        for (let i = 0; i < answersElem.length; i++) {
            answersElem[i].removeEventListener('click', doAction);
        }
    }

    const markCorrect = (elem) => {
        elem.classList.add('correct');
    }

    const markInCorrect = (elem) => {
        elem.classList.add('incorrect');
    }

    const markTask = (type) => {
        const task = getCurrentTask();
        clearClass(task);
        task.classList.add(type);
    }

    const markTaskInProgress = () => {
        markTask('current');
    }

    const markTaskCorrect = () => {
        markTask('correct');
    }

    const markTaskInCorrect = () => {
        markTask('incorrect');
    }

    const markTaskIgnored = () => {
        markTask('ignored');
    }

    const getCurrentTask = () => {
        return document.getElementById('task' + getIndexWithOffset());
    }

    const getIndexWithOffset = () => {
        return index + 1;
    }

    const clearClass = (elem) => {
        elem.classList.remove('correct');
        elem.classList.remove('incorrect');
        elem.classList.remove('unknown');
        elem.classList.remove('current');
    }

    const showAnswers = () => {
        resultAnswersElem.innerHTML = "";
        resultAnswersElem.classList.toggle('d-none');
        preQuestions.map((question, index) => {
            const header = document.createElement('h4');
            header.classList.add('mt-5');
            header.innerHTML = question.question;
            const items = document.createElement('ul');
            items.classList.add('list-group');
            question.answers.map(answer => {
                const item = document.createElement('li');
                item.classList.add('list-group-item');

                if(question.correct_answer === answer) {
                    markCorrect(item);
                } else if (selectedAnswers[index] === answer){
                    markInCorrect(item)
                }

                item.innerHTML = answer;
                items.append(item);
            })
            resultAnswersElem.append(header);
            resultAnswersElem.append(items);
        })
    }

    getPercent = (points) => {
        return ((points / length) * 100).toFixed(2);
    }

    for (let i = 0; i < answersElem.length; i++) {
        answersElem[i].addEventListener('click', doAction);
    }

    startBtn.addEventListener('click', startQuiz);
    restartBtn.addEventListener('click', startQuiz);
    showAnswersBtn.addEventListener('click', showAnswers)
