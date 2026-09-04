// Initialize Icons
lucide.createIcons();

// Display Today's Date
const dateOptions = { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' };
document.getElementById('current-date').innerText = new Date().toLocaleDateString(undefined, dateOptions);

/* ==========================================================
   1. FOCUS STOPWATCH LOGIC
========================================================== */
let timerInterval = null;
let totalSeconds = parseInt(localStorage.getItem('study_seconds') || '0', 10);

function formatSeconds(sec) {
  const h = String(Math.floor(sec / 3600)).padStart(2, '0');
  const m = String(Math.floor((sec % 3600) / 60)).padStart(2, '0');
  const s = String(sec % 60).padStart(2, '0');
  return `${h}:${m}:${s}`;
}

function updateTimerDisplay() {
  document.getElementById('timer-display').innerText = formatSeconds(totalSeconds);
  const hours = (totalSeconds / 3600).toFixed(1);
  document.getElementById('stats-focus').innerText = `${hours}h`;
}

function toggleTimer() {
  const btnText = document.getElementById('timer-btn-text');
  const btnIcon = document.getElementById('timer-btn-icon');
  
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
    btnText.innerText = 'Resume Focus';
    btnIcon.setAttribute('data-lucide', 'play');
  } else {
    timerInterval = setInterval(() => {
      totalSeconds++;
      localStorage.setItem('study_seconds', totalSeconds);
      updateTimerDisplay();
    }, 1000);
    btnText.innerText = 'Pause';
    btnIcon.setAttribute('data-lucide', 'pause');
  }
  lucide.createIcons();
}

function resetTimer() {
  if (confirm('Reset your study time for today?')) {
    clearInterval(timerInterval);
    timerInterval = null;
    totalSeconds = 0;
    localStorage.setItem('study_seconds', '0');
    document.getElementById('timer-btn-text').innerText = 'Start Focus';
    document.getElementById('timer-btn-icon').setAttribute('data-lucide', 'play');
    updateTimerDisplay();
    lucide.createIcons();
  }
}

/* ==========================================================
   2. SCHEDULE & TO-DO LIST LOGIC
========================================================== */
let tasks = JSON.parse(localStorage.getItem('user_tasks') || '[]');

function saveTasks() {
  localStorage.setItem('user_tasks', JSON.stringify(tasks));
  renderTasks();
}

function handleAddTask(e) {
  e.preventDefault();
  const titleInput = document.getElementById('task-title');
  const timeInput = document.getElementById('task-time');
  
  if (!titleInput.value.trim()) return;

  tasks.push({
    id: Date.now(),
    title: titleInput.value.trim(),
    time: timeInput.value,
    completed: false
  });

  titleInput.value = '';
  timeInput.value = '';
  saveTasks();
}

function toggleTask(id) {
  tasks = tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t);
  saveTasks();
}

function deleteTask(id) {
  tasks = tasks.filter(t => t.id !== id);
  saveTasks();
}

function renderTasks() {
  const listEl = document.getElementById('task-list');
  listEl.innerHTML = '';
  
  let doneCount = 0;

  tasks.forEach(t => {
    if (t.completed) doneCount++;

    const li = document.createElement('li');
    li.className = `task-item ${t.completed ? 'done' : ''}`;
    
    li.innerHTML = `
      <div class="task-left">
        <input 
          type="checkbox" 
          ${t.completed ? 'checked' : ''} 
          onchange="toggleTask(${t.id})" 
        />
        <span class="task-text">${t.title}</span>
        ${t.time ? `<span class="task-time-tag">${t.time}</span>` : ''}
      </div>
      <button class="btn-delete" onclick="deleteTask(${t.id})">
        <i data-lucide="trash-2" style="width: 16px; height: 16px;"></i>
      </button>
    `;
    listEl.appendChild(li);
  });

  const pct = tasks.length === 0 ? 0 : Math.round((doneCount / tasks.length) * 100);
  document.getElementById('task-progress-fill').style.width = `${pct}%`;
  document.getElementById('stats-tasks').innerText = `${doneCount}/${tasks.length}`;

  lucide.createIcons();
}

/* ==========================================================
   3. DAILY LOG & REFLECTION
========================================================== */
let selectedMood = localStorage.getItem('diary_mood') || '🔥 Productive';

function setMood(mood) {
  selectedMood = mood;
  document.querySelectorAll('.mood-btn').forEach(btn => {
    btn.classList.toggle('active', btn.innerText === mood);
  });
}

function saveDiary() {
  const diaryText = document.getElementById('diary-text').value;
  localStorage.setItem('diary_text', diaryText);
  localStorage.setItem('diary_mood', selectedMood);
  alert('Reflection saved locally!');
}

function loadSavedDiary() {
  document.getElementById('diary-text').value = localStorage.getItem('diary_text') || '';
  setMood(selectedMood);
}

// Initial Boot
updateTimerDisplay();
renderTasks();
loadSavedDiary();

/* ==========================================================
   4. MULTI-PAGE MODAL ROUTER
========================================================== */
function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.add('open');
    lucide.createIcons();
  }
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.remove('open');
  }
}

function handleBackdropClick(e, modalId) {
  if (e.target.id === modalId) {
    closeModal(modalId);
  }
}

window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    document.querySelectorAll('.modal-backdrop.open').forEach(modal => {
      modal.classList.remove('open');
    });
  }
});

/* ==========================================================
   5. MTG SYLLABUS PLANNER (FROM PLANNER.XLSX)
========================================================== */
const mtgPlannerData = [
  {"id":"phy_1","subject":"Physics","chapter":"UNITS AND MEASUREMENTS","date":"31/08/2026","days":1},
  {"id":"phy_2","subject":"Physics","chapter":"MOTION IN A STRAIGHT LINE","date":"02/09/2026","days":2},
  {"id":"phy_3","subject":"Physics","chapter":"MOTION IN A PLANE","date":"05/09/2026","days":3},
  {"id":"phy_4","subject":"Physics","chapter":"LAWS OF MOTION","date":"08/09/2026","days":3},
  {"id":"phy_5","subject":"Physics","chapter":"WORK, ENERGY AND POWER","date":"10/09/2026","days":2},
  {"id":"phy_6","subject":"Physics","chapter":"SYSTEM OF PARTICLES & ROTATIONAL MOTION","date":"15/09/2026","days":5},
  {"id":"phy_7","subject":"Physics","chapter":"GRAVITATION","date":"18/09/2026","days":3},
  {"id":"phy_8","subject":"Physics","chapter":"MECHANICAL PROPERTIES OF SOLIDS","date":"19/09/2026","days":1},
  {"id":"phy_9","subject":"Physics","chapter":"MECHANICAL PROPERTIES OF FLUIDS","date":"22/09/2026","days":3},
  {"id":"phy_10","subject":"Physics","chapter":"THERMAL PROPERTIES OF MATTER","date":"26/09/2026","days":4},
  {"id":"phy_11","subject":"Physics","chapter":"THERMODYNAMICS","date":"28/09/2026","days":2},
  {"id":"phy_12","subject":"Physics","chapter":"KINETIC THEORY OF GASES","date":"30/09/2026","days":2},
  {"id":"phy_13","subject":"Physics","chapter":"OSCILLATIONS","date":"04/10/2026","days":4},
  {"id":"phy_14","subject":"Physics","chapter":"WAVES","date":"08/10/2026","days":4},
  {"id":"phy_15","subject":"Physics","chapter":"ELECTRIC CHARGES AND FIELDS","date":"12/10/2026","days":4},
  {"id":"phy_16","subject":"Physics","chapter":"ELECTROSTATIC POTENTIAL & CAPACITANCE","date":"16/10/2026","days":4},
  {"id":"phy_17","subject":"Physics","chapter":"CURRENT ELECTRICITY","date":"20/10/2026","days":4},
  {"id":"phy_18","subject":"Physics","chapter":"MOVING CHARGES AND MAGNETISM","date":"24/10/2026","days":4},
  {"id":"phy_19","subject":"Physics","chapter":"MAGNETISM AND MATTER","date":"26/10/2026","days":2},
  {"id":"phy_20","subject":"Physics","chapter":"ELECTROMAGNETIC INDUCTION","date":"30/10/2026","days":4},
  {"id":"phy_21","subject":"Physics","chapter":"ALTERNATING CURRENT","date":"04/11/2026","days":5},
  {"id":"phy_22","subject":"Physics","chapter":"WAVE OPTICS","date":"09/11/2026","days":5},
  {"id":"phy_23","subject":"Physics","chapter":"DUAL NATURE OF RADIATION & MATTER","date":"12/11/2026","days":3},
  {"id":"phy_24","subject":"Physics","chapter":"ATOMS","date":"14/11/2026","days":2},
  {"id":"phy_25","subject":"Physics","chapter":"NUCLEI","date":"16/11/2026","days":2},
  {"id":"phy_26","subject":"Physics","chapter":"SEMICONDUCTORS","date":"20/11/2026","days":4},
  {"id":"phy_27","subject":"Physics","chapter":"RAY OPTICS & OPTICAL INSTRUMENTS","date":"26/11/2026","days":6},
  {"id":"phy_28","subject":"Physics","chapter":"PRACTICAL PHYSICS","date":"30/11/2026","days":4},
  {"id":"chem_32","subject":"Chemistry","chapter":"SOME BASIC PRINCIPLES OF CHEMISTRY","date":"03/09/2026","days":2},
  {"id":"chem_33","subject":"Chemistry","chapter":"STRUCTURE OF ATOM","date":"05/09/2026","days":2},
  {"id":"chem_34","subject":"Chemistry","chapter":"PERIODIC TABLE","date":"07/09/2026","days":2},
  {"id":"chem_35","subject":"Chemistry","chapter":"CHEMICAL BONDING & ITS STRUCTURE","date":"10/09/2026","days":3},
  {"id":"chem_36","subject":"Chemistry","chapter":"THERMODYNAMICS","date":"15/09/2026","days":5},
  {"id":"chem_37","subject":"Chemistry","chapter":"EQUILIBRIUM","date":"20/09/2026","days":5},
  {"id":"chem_38","subject":"Chemistry","chapter":"GENERAL ORGANIC CHEMISTRY","date":"25/09/2026","days":5},
  {"id":"chem_39","subject":"Chemistry","chapter":"PRACTICAL ORGANIC CHEMISTRY","date":"26/09/2026","days":1},
  {"id":"chem_40","subject":"Chemistry","chapter":"HYDROCARBONS","date":"29/09/2026","days":3},
  {"id":"chem_41","subject":"Chemistry","chapter":"P-BLOCK ELEMENTS (13-14)","date":"01/10/2026","days":2},
  {"id":"chem_42","subject":"Chemistry","chapter":"REDOX REACTIONS","date":"03/10/2026","days":2},
  {"id":"chem_43","subject":"Chemistry","chapter":"SOLUTIONS","date":"05/10/2026","days":2},
  {"id":"chem_44","subject":"Chemistry","chapter":"ELECTROCHEMISTRY","date":"08/10/2026","days":3},
  {"id":"chem_45","subject":"Chemistry","chapter":"CHEMICAL KINETICS","date":"11/10/2026","days":3},
  {"id":"chem_46","subject":"Chemistry","chapter":"D-BLOCK ELEMENTS","date":"14/10/2026","days":3},
  {"id":"chem_47","subject":"Chemistry","chapter":"HALOALKANES AND HALOARENES","date":"17/10/2026","days":3},
  {"id":"chem_48","subject":"Chemistry","chapter":"ALCOHOL, PHENOL AND ETHER","date":"20/10/2026","days":3},
  {"id":"chem_49","subject":"Chemistry","chapter":"ALDEHYDES, KETONES & CARBOXYLIC ACIDS","date":"25/10/2026","days":5},
  {"id":"chem_50","subject":"Chemistry","chapter":"AMINES","date":"28/10/2026","days":3},
  {"id":"chem_51","subject":"Chemistry","chapter":"BIOMOLECULES","date":"31/10/2026","days":3},
  {"id":"chem_52","subject":"Chemistry","chapter":"PRACTICAL CHEMISTRY PRINCIPLES","date":"03/11/2026","days":3},
  {"id":"chem_53","subject":"Chemistry","chapter":"P-BLOCK ELEMENTS (15-18)","date":"TBD","days":"-"}
];

let mtgCompleted = JSON.parse(localStorage.getItem('mtg_completed_ids') || '[]');

function renderMTG() {
  const phyContainer = document.getElementById('mtg-physics-list');
  const chemContainer = document.getElementById('mtg-chemistry-list');
  if (!phyContainer || !chemContainer) return;

  phyContainer.innerHTML = '';
  chemContainer.innerHTML = '';

  let phyDone = 0;
  let chemDone = 0;

  mtgPlannerData.forEach(item => {
    const isDone = mtgCompleted.includes(item.id);
    if (isDone) {
      if (item.subject === 'Physics') phyDone++;
      else chemDone++;
    }

    const row = document.createElement('div');
    row.className = `mtg-row ${isDone ? 'done' : ''}`;
    row.innerHTML = `
      <div class="mtg-left">
        <input type="checkbox" ${isDone ? 'checked' : ''} onchange="toggleMTG('${item.id}')" />
        <span class="mtg-ch-title">${item.chapter}</span>
      </div>
      <div class="mtg-right">
        <span class="mtg-date-badge">${item.date}</span>
        <span class="mtg-days-badge">${item.days !== '-' ? item.days + 'd' : '-'}</span>
      </div>
    `;

    if (item.subject === 'Physics') {
      phyContainer.appendChild(row);
    } else {
      chemContainer.appendChild(row);
    }
  });

  // Physics Stats & Progress Bar
  const phyTotal = 28;
  const phyPct = Math.round((phyDone / phyTotal) * 100);
  document.getElementById('mtg-phy-count').innerText = `${phyDone}/${phyTotal} (${phyPct}%)`;
  document.getElementById('phy-progress-fill').style.width = `${phyPct}%`;

  // Chemistry Stats & Progress Bar
  const chemTotal = 22;
  const chemPct = Math.round((chemDone / chemTotal) * 100);
  document.getElementById('mtg-chem-count').innerText = `${chemDone}/${chemTotal} (${chemPct}%)`;
  document.getElementById('chem-progress-fill').style.width = `${chemPct}%`;

  // Overall Total
  const totalDone = phyDone + chemDone;
  const overallPct = Math.round((totalDone / 50) * 100);
  document.getElementById('mtg-overall-text').innerText = `${totalDone}/50 Completed (${overallPct}%)`;
}

function toggleMTG(id) {
  if (mtgCompleted.includes(id)) {
    mtgCompleted = mtgCompleted.filter(x => x !== id);
  } else {
    mtgCompleted.push(id);
  }
  localStorage.setItem('mtg_completed_ids', JSON.stringify(mtgCompleted));
  renderMTG();
}

// Initial Boot of MTG
renderMTG();