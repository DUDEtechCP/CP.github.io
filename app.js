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

function switchModal(closeId, openId) {
  closeModal(closeId);
  setTimeout(() => openModal(openId), 150); // slight delay for smooth transition
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

  const phyTotal = 28;
  const phyPct = Math.round((phyDone / phyTotal) * 100);
  document.getElementById('mtg-phy-count').innerText = `${phyDone}/${phyTotal} (${phyPct}%)`;
  document.getElementById('phy-progress-fill').style.width = `${phyPct}%`;

  const chemTotal = 22;
  const chemPct = Math.round((chemDone / chemTotal) * 100);
  document.getElementById('mtg-chem-count').innerText = `${chemDone}/${chemTotal} (${chemPct}%)`;
  document.getElementById('chem-progress-fill').style.width = `${chemPct}%`;

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

renderMTG();
/* ==========================================================
   6. TEST SCHEDULE DATA (NEET ACHIEVER TARGET 2027)
========================================================== */
const neetTestSchedule = [
  {
    date: "20/09/2026", type: "PRACTICE TEST",
    physics: "Basic Mathematics used in Physics, Vectors, Units, Dimensions And Measurement, Kinematics, Laws of Motion and Friction, Electrostatics",
    chemistry: "Chemical Kinetics, Solutions",
    biology: "Structural Organisation In Animals (Animal Tissue + Frog + Cockroach), Cell: The Unit of Life, Sexual Reproduction in Flowering Plants"
  },
  {
    date: "27/09/2026", type: "MINOR TEST-1",
    physics: "Basic Mathematics Used In Physics & Vectors, Unit, Dimensions and Measurement, Kinematics, Laws of Motion and Friction, Experimental Skills (Vernier calipers, Screw gauge)",
    chemistry: "Atomic Structure, Some basic concepts of Chemistry, Equilibrium, Redox reaction",
    biology: "Sexual Reproduction in Flowering Plants, Human Reproduction, Reproductive Health"
  },
  {
    date: "04/10/2026", type: "MINOR TEST-2",
    physics: "Work, Energy & Power, Circular Motion, Collisions & Centre of Mass, Rotational Motion, Experimental Skills (Metre Scale)",
    chemistry: "Chemical kinetics, Solution",
    biology: "The Living World, Biological Classification, Plant Kingdom, Animal Kingdom"
  },
  {
    date: "25/10/2026", type: "MINOR TEST-3",
    physics: "Properties of matter and Fluid Mechanics, Thermal Physics, Experimental Skills (Young's modulus, Surface tension, Viscosity, Specific heat)",
    chemistry: "Chemical Thermodynamics, Electrochemistry, Periodic Table",
    biology: "No specific biology topics listed for this date in schedule."
  },
  {
    date: "01/11/2026", type: "MINOR TEST-4",
    physics: "Gravitation, Oscillations (SHM), Wave Motion, Experimental Skills (Simple Pendulum, Resonance tube)",
    chemistry: "Chemical Bonding, Molecular Structure, d & f-block elements",
    biology: "Principles of Inheritance And Variation, Molecular Basis of Inheritance, Evolution, Morphology of Flowering Plants, Anatomy of Flowering Plants, Structural Organisation In Animals (Animal Tissue), Cockroach, Frog"
  },
  {
    date: "21/11/2026", type: "SEMI MAJOR TEST-1",
    physics: "Syllabus of Test No. 2, 3, 4 & 5 (Minor Test-1 to 4)",
    chemistry: "Syllabus of Test No. 2, 3, 4 & 5 (Minor Test-1 to 4)",
    biology: "Syllabus of Test No. 2, 3, 4 & 5 (Minor Test-1 to 4)"
  },
  {
    date: "06/12/2026", type: "MINOR TEST-5",
    physics: "Electrostatics, Capacitor, Current electricity, Experimental Skills (Resistivity using metre bridge, Ohm's law)",
    chemistry: "P-block elements (group 13 to 18 elements), Coordination Compounds",
    biology: "Human Health and Disease, Microbes In Human Welfare, Tissue Culture, Biotechnology: Principles And Processes, Biotechnology And Its Applications"
  },
  {
    date: "03/01/2027", type: "MINOR TEST-6",
    physics: "Magnetic effect of current and Magnetism, Electromagnetic Induction, Alternating current, Electromagnetic Waves, Experimental Skills (Galvanometer)",
    chemistry: "Nomenclature, Isomerism, General Organic Chemistry, Purification and Characterisation of Organic Compounds",
    biology: "Cell:The Unit of Life, Biomolecule with Enzyme, Cell Cycle And Cell Division, Photosynthesis in Higher Plants, Respiration in Plants, Plant Growth and Development"
  },
  {
    date: "17/01/2027", type: "MINOR TEST-7",
    physics: "Ray Optics and Optical Instruments, Wave optics, Experimental Skills (Mirrors, Lenses, Prism, Refractive index)",
    chemistry: "Hydrocarbons, Organic Compounds Containing Halogens (Haloalkanes and Haloarenes)",
    biology: "Organisms and Populations, Ecosystem, Biodiversity and its Conservation"
  },
  {
    date: "07/02/2027", type: "MINOR TEST-8",
    physics: "Modern Physics-I (Dual nature), Modern Physics-II (Nuclei) & Modern Physics-III (Atoms), Semiconductor and Electronics, Experimental Skills (Diodes, Zener diode, Resistors, Capacitors)",
    chemistry: "Organic Compounds Containing Oxygen and Nitrogen, Biomolecules, Principles related to practical chemistry",
    biology: "Breathing And Exchange Of Gases, Body Fluids And Circulation, Excretory Products And Their Elimination, Locomotion And Movement, Neural Control And Co-ordination, Chemical Co-ordination And Integration"
  },
  {
    date: "14/02/2027", type: "SEMI MAJOR TEST-2",
    physics: "Syllabus of Test No. 7, 8, 9 & 10 (Minor Test-5 to 8)",
    chemistry: "Syllabus of Test No. 7, 8, 9 & 10 (Minor Test-5 to 8)",
    biology: "Syllabus of Test No. 7, 8, 9 & 10 (Minor Test-5 to 8)"
  }
];

function renderTestSchedule() {
  const container = document.getElementById('schedule-list-container');
  if (!container) return;
  
  container.innerHTML = '';
  
  neetTestSchedule.forEach(test => {
    const card = document.createElement('div');
    card.className = 'test-card';
    
    card.innerHTML = `
      <div class="test-card-header">
        <span class="test-type-badge">${test.type}</span>
        <span class="test-date-badge"><i data-lucide="clock" style="width: 14px; height: 14px;"></i> ${test.date}</span>
      </div>
      <div class="test-syllabus-content">
        <div class="syllabus-row">
          <strong>Physics</strong>
          <p>${test.physics}</p>
        </div>
        <div class="syllabus-row">
          <strong>Chemistry</strong>
          <p>${test.chemistry}</p>
        </div>
        <div class="syllabus-row">
          <strong>Biology</strong>
          <p>${test.biology}</p>
        </div>
      </div>
    `;
    
    container.appendChild(card);
  });
  
  lucide.createIcons();
}

// Run render on load
renderTestSchedule();
/* ==========================================================
   7. TEST MARKS & ANALYSIS TRACKER
========================================================== */
let testMarksData = JSON.parse(localStorage.getItem('test_marks_data') || '{}');

function renderTestMarks() {
  const container = document.getElementById('marks-list-container');
  if (!container) return;
  
  container.innerHTML = '';

  // Loops through the exact same schedule data used in the Test Schedule tab
  neetTestSchedule.forEach((test, index) => {
    const data = testMarksData[index] || { score: '', analyzed: false };
    
    const row = document.createElement('div');
    // If analyzed is checked, it adds a green glow to the row
    row.className = `mark-row ${data.analyzed ? 'analyzed-row' : ''}`;
    
    row.innerHTML = `
      <div class="mark-info">
        <span class="mark-title">${test.type}</span>
        <span class="mark-date"><i data-lucide="calendar" style="width: 12px; height: 12px;"></i> ${test.date}</span>
      </div>
      <div class="mark-actions">
        <div class="mark-input-wrap">
          <input type="number" class="mark-input" value="${data.score}" placeholder="---" max="720" onchange="updateTestMark(${index}, this.value)" />
          <label>/ 720</label>
        </div>
        <label class="analyze-check">
          <input type="checkbox" ${data.analyzed ? 'checked' : ''} onchange="toggleAnalyze(${index}, this.checked)" />
          Analyzed
        </label>
      </div>
    `;
    container.appendChild(row);
  });
  
  lucide.createIcons();
}

function updateTestMark(index, value) {
  if (!testMarksData[index]) testMarksData[index] = { score: '', analyzed: false };
  testMarksData[index].score = value;
  localStorage.setItem('test_marks_data', JSON.stringify(testMarksData));
}

function toggleAnalyze(index, isChecked) {
  if (!testMarksData[index]) testMarksData[index] = { score: '', analyzed: false };
  testMarksData[index].analyzed = isChecked;
  localStorage.setItem('test_marks_data', JSON.stringify(testMarksData));
  
  // Re-render to trigger the green row highlight
  renderTestMarks();
}

// Initial Boot for Marks Tracker
renderTestMarks();