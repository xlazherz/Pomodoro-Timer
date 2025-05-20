let workDuration, restDuration, totalLoops;
let currentLoop = 0;      // How many loops completed so far
let isWorking = true;     // true = work phase, false = rest phase
let timer = null;

const countdownEl = document.getElementById('countdown');
const phaseEl = document.getElementById('phase');
const loopCountEl = document.getElementById('loopCount');


document.getElementById('startBtn').addEventListener('click', startPomodoro);
document.getElementById('stopBtn').addEventListener('click', stopPomodoro);
document.getElementById('resetBtn').addEventListener('click', resetPomodoro);
function parseTime(timeStr) {
  const [hh, mm, ss] = timeStr.split(':').map(Number);
  return (hh * 3600) + (mm * 60) + ss;
}

function formatTime(seconds) {
  const m = String(Math.floor(seconds / 60)).padStart(2, '0');
  const s = String(seconds % 60).padStart(2, '0');
  return `${m}:${s}`;
}


function startPomodoro() {
  if (timer) return; // prevent multiple timers

  const workMin = parseInt(document.getElementById('workMinutes').value) || 0;
  const workSec = parseInt(document.getElementById('workSeconds').value) || 0;
  const restMin = parseInt(document.getElementById('restMinutes').value) || 0;
  const restSec = parseInt(document.getElementById('restSeconds').value) || 0;

  workDuration = workMin * 60 + workSec;
  restDuration = restMin * 60 + restSec;
  totalLoops = parseInt(document.getElementById('loops').value) || 1;

  if (workDuration <= 0 || restDuration <= 0 || totalLoops <= 0) {
    alert("Please enter positive times and loops.");
    return;
  }

  currentLoop = 0;
  loopCountEl.textContent = totalLoops - currentLoop;
  isWorking = true;
hideTimeSettings(); // Hide settings when starting
  startPreCountdown(10); // ⏳ Pre-countdown of 10 seconds
}

function startPreCountdown(seconds) {
  let countdown = seconds;
  phaseEl.textContent = "Timer begins in...";
  countdownEl.textContent = countdown;

  timer = setInterval(() => {
    countdown--;
    countdownEl.textContent = countdown;

    if (countdown <= 0) {
      clearInterval(timer);
      timer = null;
      startPhase('work');
    }
  }, 1000);
}


function startPhase(phase) {
   let duration = phase === 'work' ? workDuration : restDuration;
  phaseEl.textContent = phase === 'work' ? 'Work' : 'Rest';

  updatePhaseColors(phase);

  let timeLeft = duration;
  countdownEl.textContent = formatTime(timeLeft);

  timer = setInterval(() => {
    timeLeft--;

    if (timeLeft < 0) {
      clearInterval(timer);
      timer = null;

      if (phase === 'rest') {
        // Completed one full loop (work + rest)
        currentLoop++;
        loopCountEl.textContent = totalLoops - currentLoop;

        if (currentLoop >= totalLoops) {
          phaseEl.textContent = "Done!";
          countdownEl.textContent = "00:00";
          updatePhaseColors('finished'); showTimeSettings();
          return;
        } else {
          startPhase('work');
        }
      } else {
        // Finished work phase, start rest phase
        startPhase('rest');
      }
    } else {
      countdownEl.textContent = formatTime(timeLeft);
    }
  }, 1000);
}


function stopPomodoro() {
  if (timer) {
    clearInterval(timer);
    timer = null;
  }
}

function resetPomodoro() {
  stopPomodoro();
  currentLoop = 0;
  loopCountEl.textContent = '0';
  countdownEl.textContent = '00:00';
  phaseEl.textContent = 'Ready';

  const container = document.querySelector('.container');
  container.classList.remove('work-phase', 'rest-phase', 'finished-phase');

  document.getElementById('workMinutes').value = 25;
  document.getElementById('workSeconds').value = 0;
  document.getElementById('restMinutes').value = 5;
  document.getElementById('restSeconds').value = 0;
  document.getElementById('loops').value = 3
  showTimeSettings();
}

function updateDisplay() {
  countdownEl.textContent = formatTime(remainingSeconds);
}

function updatePhaseColors(phase) {
  const container = document.querySelector('.container');
  container.classList.remove('work-phase', 'rest-phase', 'finished-phase');

  if (phase === 'work') {
    container.classList.add('work-phase');
  } else if (phase === 'rest') {
    container.classList.add('rest-phase');
  } else if (phase === 'finished') {
    container.classList.add('finished-phase');
  } else {
    // default/no phase
  }
}



function hideTimeSettings() {
  document.getElementById('timeSettings').style.display = 'none';
}

function showTimeSettings() {
  document.getElementById('timeSettings').style.display = 'block';
}

