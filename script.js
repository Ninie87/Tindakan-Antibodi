
// Simple canvas animation: antibodies chasing antigens; after a short sequence reveal quiz
const startBtn = document.getElementById('startBtn');
const status = document.getElementById('status');
const canvas = document.getElementById('battle');
const ctx = canvas.getContext('2d');
const quizDiv = document.getElementById('quiz');
const quizForm = document.getElementById('quizForm');
const submitQuiz = document.getElementById('submitQuiz');
const quizResult = document.getElementById('quizResult');
const scoreboard = document.getElementById('scoreboard');
const finalScore = document.getElementById('finalScore');

let animationRunning = false;

startBtn.addEventListener('click', () => {
  if (animationRunning) return;
  animationRunning = true;
  status.innerText = 'Battle in progress... Antibodies are attacking antigens!';
  runBattle().then(() => {
    status.innerText = 'Battle finished! Buka kuiz untuk semak kefahaman.';
    quizDiv.classList.remove('hidden');
    populateQuiz();
  });
});

function runBattle() {
  return new Promise(resolve => {
    let frame = 0;
    const interval = setInterval(() => {
      frame++;
      drawScene(frame);
      if (frame > 120) {
        clearInterval(interval);
        resolve();
      }
    }, 40);
  });
}

function drawScene(frame) {
  ctx.clearRect(0,0,canvas.width, canvas.height);
  // Draw antigen (red blob)
  ctx.beginPath();
  const antigenX = 480 - (frame*1.2);
  ctx.fillStyle = '#ff4d4d';
  ctx.arc(antigenX, 150, 28, 0, Math.PI*2);
  ctx.fill();

  // Draw several antibodies as blue Y-shapes moving right
  for (let i=0;i<6;i++) {
    const x = 80 + frame*(0.9 + i*0.02) + i*20;
    drawAntibody(x, 120 + i*10);
  }
}

function drawAntibody(x,y) {
  // simple Y-shape
  ctx.strokeStyle = '#1e90ff';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(x,y);
  ctx.lineTo(x+12,y-18);
  ctx.moveTo(x,y);
  ctx.lineTo(x-12,y-18);
  ctx.moveTo(x,y);
  ctx.lineTo(x,y+22);
  ctx.stroke();
}

// Quiz questions (5 MCQ)
const questions = [
  {
    q: "Apakah fungsi utama antibodi?",
    choices: ["Menghasilkan antigen","Menghancurkan sel darah merah","Mengenal pasti antigen dan melabelkannya","Menghasilkan toksin"],
    a: 2
  },
  {
    q: "Apakah yang dimaksudkan dengan antigen?",
    choices: ["Zat yang merangsang tindak balas imun","Sel antibodi","Virus sahaja","Bakteria sahaja"],
    a: 0
  },
  {
    q: "Antibodi dihasilkan oleh sel apakah?",
    choices: ["Neutrofil","Sel T","Sel B (limfosit B)","Eritrosit"],
    a: 2
  },
  {
    q: "Jenis antibodi yang utama dalam darah ialah:",
    choices: ["IgA","IgM","IgG","IgE"],
    a: 2
  },
  {
    q: "Satu cara antibodi membantu melawan patogen ialah:",
    choices: ["Mengikat antigen supaya fagosit dapat memakan patogen","Menukarkan antigen menjadi nutrien","Menjadikan antigen lebih cepat bergerak","Menghasilkan lebih antigen"],
    a: 0
  }
];

function populateQuiz() {
  quizForm.innerHTML = '';
  questions.forEach((item, idx) => {
    const div = document.createElement('div');
    div.innerHTML = `<p><strong>${idx+1}. ${item.q}</strong></p>`;
    item.choices.forEach((c, ci) => {
      const id = `q${idx}_c${ci}`;
      div.innerHTML += `<label><input type="radio" name="q${idx}" value="${ci}" id="${id}"> ${c}</label><br>`;
    });
    quizForm.appendChild(div);
  });
}

submitQuiz.addEventListener('click', () => {
  let score = 0;
  questions.forEach((item, idx) => {
    const sel = quizForm.querySelector(`input[name="q${idx}"]:checked`);
    if (sel && parseInt(sel.value) === item.a) score++;
  });
  quizResult.innerText = `Anda mendapat ${score} daripada ${questions.length}.`;
  scoreboard.classList.remove('hidden');
  finalScore.innerText = `Markah Kuiz: ${score}/${questions.length} (${Math.round((score/questions.length)*100)}%)`;
});
