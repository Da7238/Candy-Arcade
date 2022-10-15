const mouths = [...document.querySelectorAll('.mouth')];
const scoreEl = document.querySelector('.score span');
let score = 0;

function run(){
    const i = Math.floor(Math.random() * mouths.length);
    const mouth = mouths[i];
    let timer;

    const img = document.createElement('img');
    img.classList.add('candy');
    img.src = 'imgs/candy.png';

    img.addEventListener('click', () => {
        score += Math.round(getRandomNumRange(1,10));
        scoreEl.textContent = score;
        img.src = 'imgs/candy-hit.png';
        clearTimeout(timer);
        setTimeout(() => {
            mouth.removeChild(img);
            run();
        }, 500);
    })
    mouth.appendChild(img)
    timer = setTimeout(() => {
        mouth.removeChild(img);
        run();
    }, getRandomNumRange(200, 1000));
}
run();

function getRandomNumRange(start, end) {
    return Math.random() * (end - start) + start;
}

function startTimer(duration, display) {
    var timer = duration, minutes, seconds;
    setInterval(function () {
      minutes = parseInt(timer / 60, 10);
      seconds = parseInt(timer % 60, 10);

      minutes = minutes < 10 ? "0" + minutes : minutes;
      seconds = seconds < 10 ? "0" + seconds : seconds;

      display.textContent = minutes + ":" + seconds;

      if (--timer < 0) {
        alert("game over");
        timer = duration;
        score = 0;
        scoreEl.textContent = score;
      }
    }, 1000);
  }

  window.onload = function () {
    let time = 30,
    display = document.querySelector('#time');
    startTimer(time, display);
  };