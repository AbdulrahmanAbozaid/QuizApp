// importing
import { url, getQues, select as $ } from "./question.js";

// Set Elemnts
let count = $(".questions_count .count");
let qTitle = $(".quiz_area");
let answersContent = $(".quiz_answers");
let submitBtn = $(".submit_answer");
let spans = $(".spans");
let startBtn = $(".start_quiz");
let startQuizSec = $(".startQuiz");

// Set Options
let qCount;
let timer;
let catgy;
let rightAnswered = 0;
let currentIndex = 0;
let countDownInterval;

// call to fetch
startBtn.addEventListener("click", () => {
  let countQ = $(".q_count");
  let interVal = $(".count_down");
  let categorySelect = $(".qCatgs");
  let mod = $(".mod");

  if (countQ.value && interVal.value && categorySelect.value) {
    qCount = +countQ.value;
    timer = +interVal.value;
    catgy = +categorySelect.value;
    if (qCount > 22 && (catgy === 27 || catgy === 28)) {
      alert("no more then 21 in this Category");
    } else if (catgy === 23 && qCount > 50) {
    } else if (catgy === 19 && qCount > 14) {
      alert("no more then 14 in this Category");
    } else {
      countQ.value = null;
      interVal.value = null;
      startQuizSec.remove();
      mod.remove();
      getQuestions();
    }
  }
});

// Fetch

async function getQuestions() {
  let qData = await getQues(qCount, catgy);

  //qCount Ele
  count.innerHTML = qCount;
  $(".defCategory").innerHTML = qData[0].category;

  //create
  let currentElement = qData[currentIndex];
  createQuestions(currentElement);
  renderBullets(qCount);
  countDown(timer, qCount);

  //submit
  submitBtn.addEventListener("click", () => {
    let rightAns = qData[currentIndex].correct_answer;

    currentIndex++;
    check(rightAns);

    qTitle.innerHTML = "";
    answersContent.innerHTML = "";
    createQuestions(qData[currentIndex], qCount);

    handleBulls();
    clearInterval(countDownInterval);
    countDown(timer, qCount);

    showResult(qCount, rightAnswered);
  });
}

// Functions

function createQuestions(obj, count = qCount) {
  if (currentIndex < count) {
    let { correct_answer, incorrect_answers } = obj;
    let ansArr = [...incorrect_answers, correct_answer].sort();
    let Ansz = {};
    Ansz = {
      answer_1: ansArr[0],
      answer_2: ansArr[1],
      answer_3: ansArr[2],
      answer_4: ansArr[3],
    };

    let qHead = document.createElement("h2");
    qHead.className = "question_title";
    let qHeadText = obj.question;
    qHead.innerHTML = qHeadText;
    qTitle.appendChild(qHead);
    for (let i = 0; i < 4; i++) {
      let answer = document.createElement("div");
      answer.className = "answer";
      let answerPoint = document.createElement("input");
      answerPoint.className = "answer_point";
      answerPoint.type = "radio";
      answerPoint.name = "question";
      answerPoint.id = `answer_${i + 1}`;
      let ansLabel = document.createElement("label");
      ansLabel.htmlFor = `answer_${i + 1}`;
      let qLab = Ansz[`answer_${i + 1}`];
      ansLabel.innerHTML = qLab;
      answerPoint.dataset.answer = Ansz[`answer_${i + 1}`];

      if (i === 0) {
        answerPoint.checked = true;
      }

      answer.append(answerPoint, ansLabel);
      answersContent.appendChild(answer);
    }
  }
}

function check(ans) {
  let afterChecked = document.getElementsByName("question");
  let curr;
  for (let i = 0; i < afterChecked.length; i++) {
    if (afterChecked[i].checked) {
      curr = afterChecked[i].dataset.answer;
    }
  }
  if (curr == ans) {
    rightAnswered++;
    console.log(rightAnswered);
  }
  console.log(ans);
}

function renderBullets(count) {
  for (let i = 0; i < count; i++) {
    let bullet = document.createElement("span");
    bullet.className = "bull";
    i === 0 ? bullet.classList.add("on") : null;
    spans.appendChild(bullet);
  }
}

function handleBulls(count = qCount) {
  let bulls = document.querySelectorAll(".bull");
  Array.from(bulls).forEach((ele, index) => {
    if (currentIndex <= count) {
      if (currentIndex === index) {
        ele.classList.add("on");
      }
    }
  });
}

function showResult(count = qCount, Answered) {
  let results = $(".results");
  if (currentIndex === count) {
    let rate =
      Answered > parseInt(count / 2) && Answered < count
        ? "good"
        : Answered === count
        ? "perfect"
        : "bad";
    let resultArea = `
        <div class="result_area">
        <span class="${rate}">${rate}!</span>
        You Answered ${Answered} from ${count}
        `;

    $(".quiz_info").remove();
    qTitle.remove();
    answersContent.remove();
    $(".bullets").remove();

    results.innerHTML = resultArea;
    submitBtn.innerHTML = "Replay";
    submitBtn.addEventListener("click", () => {
      location.reload();
    });
  }
}

function countDown(time, count) {
  let countDownEle = $(".count_down");
  let minuts, seconds;
  if (currentIndex < count) {
    countDownInterval = setInterval(() => {
      minuts = parseInt(time / 60);
      seconds = parseInt(time % 60);

      countDownEle.innerHTML = `${minuts < 10 ? `0${minuts}` : minuts}:${
        seconds < 10 ? `0${seconds}` : seconds
      }`;
      if (--time < 0) {
        clearInterval(countDownInterval);
        submitBtn.click();
      }
    }, 1000);
  }
}
