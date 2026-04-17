// ===================== DATA LOKAL (TUGAS & MATA KULIAH) =====================
let tasks = JSON.parse(localStorage.getItem('tugas-kuliah-app') || '[]');

// Inisialisasi daftar mata kuliah
const defaultCourses = [
  "Digital Transformation",
  "Enterprise Architecture",
  "Internet of Things",
  "Manajemen Proyek",
  "Metode Penelitian",
  "Software Quality Assurance",
  "Software Startup Business"
];
let courses = JSON.parse(localStorage.getItem('mata-kuliah-app'));
if (!courses) {
  courses = defaultCourses;
  localStorage.setItem('mata-kuliah-app', JSON.stringify(courses));
}

function saveTasks() {
  localStorage.setItem('tugas-kuliah-app', JSON.stringify(tasks));
}

function saveCourses() {
  localStorage.setItem('mata-kuliah-app', JSON.stringify(courses));
}

// ===================== UTILS =====================
function esc(s) {
  return String(s)
    .replace(/&/g,'&amp;')
    .replace(/</g,'&lt;')
    .replace(/>/g,'&gt;')
    .replace(/"/g,'&quot;');
}

function formatDate(str) {
  if (!str) return '';
  const d = new Date(str);
  return d.toLocaleString('id-ID', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' }).replace(/\./g, ':');
}

function isOverdue(str) {
  if (!str) return false;
  const now = new Date();
  return new Date(str) < now;
}

const PRIORITY_COLORS = {
  tinggi: { bg: 'rgba(239, 68, 68, 0.2)', text: '#fca5a5', dot: '#ef4444' },
  normal: { bg: 'rgba(255, 255, 255, 0.1)', text: '#cbd5e1', dot: '#94a3b8' },
  rendah: { bg: 'rgba(16, 185, 129, 0.2)', text: '#6ee7b7', dot: '#10b981' }
};

// ===================== RENDER MATA KULIAH =====================
function renderCourses() {
  const selectEl = document.getElementById('inp-course');
  const listContainer = document.getElementById('course-list-container');
  const currentVal = selectEl.value;

  // Render untuk Pilihan Dropdown
  selectEl.innerHTML = '<option value="" disabled selected>Pilih mata kuliah...</option>';
  
  // Render untuk List di dalam Modal Edit
  listContainer.innerHTML = '';

  // Sortir mata kuliah sesuai abjad
  const sortedCourses = [...courses].sort();

  sortedCourses.forEach(courseName => {
    // Masukkan ke Dropdown
    const opt = document.createElement('option');
    opt.value = courseName;
    opt.textContent = courseName;
    selectEl.appendChild(opt);

    // Masukkan ke List Modal Edit (Dengan styling bawaan card tugas)
    listContainer.innerHTML += `
      <div class="task-card" style="padding:10px 16px; margin-bottom:6px; align-items:center;">
        <div class="task-body">
          <div class="task-title" style="font-size:14px; font-weight:600;">${esc(courseName)}</div>
        </div>
        <button class="task-del" style="opacity:1;" onclick="deleteCourse('${esc(courseName)}')" title="Hapus">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/></svg>
        </button>
      </div>`;
  });
  
  // Kembalikan pilihan jika ada dan belum terhapus
  if (currentVal && courses.includes(currentVal)) {
    selectEl.value = currentVal;
  } else {
    selectEl.value = "";
  }
}

// ===================== RENDER TUGAS =====================
function renderAll() {
  const active = tasks.filter(t => !t.done);
  const done = tasks.filter(t => t.done);

  document.getElementById('badge-active').textContent = active.length;
  document.getElementById('badge-done').textContent = done.length;

  renderList('list-active', active, 'aktif');
  renderList('list-done', done, 'done');

  // Stats bar
  const statsWrap = document.getElementById('stats-bar-wrap');
  if (done.length > 0) {
    statsWrap.innerHTML = `
      <div class="stats-bar">
        <div class="stats-icon">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
        </div>
        <div>
          <div class="stats-count">${done.length} tugas</div>
          <div class="stats-text">berhasil diselesaikan</div>
        </div>
      </div>`;
  } else {
    statsWrap.innerHTML = '';
  }
}

function renderList(containerId, list, type) {
  const el = document.getElementById(containerId);
  if (list.length === 0) {
    if (type === 'aktif') {
      el.innerHTML = `
        <div class="empty-state">
          <div class="empty-icon">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#9a9390" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="4"/><path d="M9 12l2 2 4-4"/>
            </svg>
          </div>
          <p>Tidak ada tugas aktif.<br>Tap tombol + untuk menambahkan tugas baru.</p>
        </div>`;
    } else {
      el.innerHTML = `
        <div class="empty-state">
          <div class="empty-icon">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#9a9390" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="9"/><polyline points="12 7 12 12 15 15"/>
            </svg>
          </div>
          <p>Belum ada tugas yang selesai.<br>Centang tugas aktif untuk memindahkannya ke sini.</p>
        </div>`;
    }
    return;
  }

  // Group by course
  const grouped = {};
  list.forEach(t => {
    if (!grouped[t.course]) grouped[t.course] = [];
    grouped[t.course].push(t);
  });

  let html = '';
  for (const course in grouped) {
    const count = grouped[course].length;
    html += `<div class="section-label">${esc(course)} (${count})</div>`;
    grouped[course].forEach(t => {
      const over = isOverdue(t.date) && !t.done;
      const pr = PRIORITY_COLORS[t.priority] || PRIORITY_COLORS.normal;
      const priorityBadge = t.priority !== 'normal'
        ? `<span style="display:inline-block;font-size:10px;font-weight:600;letter-spacing:0.05em;text-transform:uppercase;background:${pr.bg};color:${pr.text};padding:2px 7px;border-radius:99px;margin-left:8px;">${esc(t.priority)}</span>`
        : '';

      html += `
        <div class="task-card" data-id="${t.id}">
          <div class="check-outer ${t.done ? 'checked' : ''}" onclick="toggleTask(${t.id})"></div>
          <div class="task-body">
            <div class="task-course-tag">${esc(t.course)}</div>
            <div class="task-title ${t.done ? 'done' : ''}">${esc(t.text)}${priorityBadge}</div>
            ${t.notes ? `<div class="task-notes">${esc(t.notes)}</div>` : ''}
            ${t.date ? `<div class="task-deadline ${over ? 'overdue' : ''}">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
              ${formatDate(t.date)}${over ? ' — terlambat' : ''}
            </div>` : ''}
          </div>
          <button class="task-del" onclick="deleteTask(${t.id})" title="Hapus tugas">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/></svg>
          </button>
        </div>`;
    });
  }
  el.innerHTML = html;
}

// ===================== ACTIONS MATA KULIAH =====================
function addCourse() {
  const input = document.getElementById('inp-new-course');
  const rawValue = input.value;
  
  if(!rawValue.trim()) return;

  // Memecah teks berdasarkan koma jika ingin menambah banyak sekaligus
  const courseNames = rawValue.split(',').map(name => name.trim()).filter(name => name !== '');

  courseNames.forEach(name => {
    // Hindari duplikasi
    if (!courses.includes(name)) {
      courses.push(name);
    }
  });

  saveCourses();
  renderCourses();
  input.value = '';
}

function deleteCourse(courseName) {
  if(confirm(`Hapus mata kuliah "${courseName}" dari daftar pilihan? (Tugas yang sudah memakai mata kuliah ini tidak akan hilang)`)) {
      courses = courses.filter(c => c !== courseName);
      saveCourses();
      renderCourses();
  }
}

// ===================== ACTIONS TUGAS =====================
function toggleTask(id) {
  const t = tasks.find(x => x.id === id);
  if (t) { t.done = !t.done; saveTasks(); renderAll(); }
}

function deleteTask(id) {
  if (!confirm('Hapus tugas ini?')) return;
  tasks = tasks.filter(x => x.id !== id);
  saveTasks(); renderAll();
}

function addTask() {
  const text = document.getElementById('inp-task').value.trim();
  const course = document.getElementById('inp-course').value;
  const date = document.getElementById('inp-date').value;
  const notes = document.getElementById('inp-notes').value.trim();
  const priority = document.getElementById('inp-priority').value;

  if (!text) { alert('Nama tugas tidak boleh kosong.'); return; }
  if (!course) { alert('Pilih mata kuliah terlebih dahulu.'); return; }

  tasks.unshift({ id: Date.now(), text, course, date, notes, priority, done: false });
  saveTasks(); renderAll(); closeModal();

  document.getElementById('inp-task').value = '';
  document.getElementById('inp-course').value = '';
  document.getElementById('inp-date').value = '';
  document.getElementById('inp-notes').value = '';
  document.getElementById('inp-priority').value = 'normal';
}

// ===================== TAB =====================
function switchTab(tab) {
  ['active', 'done'].forEach(t => {
    document.getElementById('page-' + t).classList.toggle('active', t === tab);
    document.getElementById('tab-' + t).classList.toggle('active', t === tab);
  });
  document.getElementById('fab').style.display = tab === 'active' ? 'flex' : 'none';
}

// ===================== MODAL =====================
function openModal() {
  document.getElementById('overlay').classList.add('open');
  document.getElementById('fab').classList.add('open');
  setTimeout(() => document.getElementById('inp-task').focus(), 300);
}

function closeModal() {
  document.getElementById('overlay').classList.remove('open');
  document.getElementById('fab').classList.remove('open');
}

function openCourseModal() {
  document.getElementById('overlay-course').classList.add('open');
}

function closeCourseModal() {
  document.getElementById('overlay-course').classList.remove('open');
}

document.getElementById('fab').addEventListener('click', openModal);

document.getElementById('overlay').addEventListener('click', function(e) {
  if (e.target === this) closeModal();
});

document.getElementById('overlay-course').addEventListener('click', function(e) {
  if (e.target === this) closeCourseModal();
});

document.getElementById('inp-task').addEventListener('keydown', function(e) {
  if (e.key === 'Enter') document.getElementById('inp-course').focus();
});

document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') {
    closeModal();
    closeCourseModal();
  }
});

// ===================== INIT =====================
renderCourses(); // Render daftar mata kuliah di dropdown
renderAll();     // Render tugas

// ===================== SPACE ANIMATION =====================
const canvas = document.getElementById('space-canvas');
const ctx = canvas.getContext('2d');
let width, height, spaceStars = [];
let mouse = { x: -1000, y: -1000 };

function resizeCanvas() {
  width = canvas.width = window.innerWidth;
  height = canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

for (let i = 0; i < 150; i++) {
  spaceStars.push({
    x: Math.random() * width,
    y: Math.random() * height,
    r: Math.random() * 1.5 + 0.5,
    dx: (Math.random() - 0.5) * 0.5,
    dy: (Math.random() - 0.5) * 0.5,
    color: `rgba(255, 255, 255, ${Math.random() * 0.8 + 0.2})`
  });
}

window.addEventListener('mousemove', e => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
});
window.addEventListener('mouseout', () => {
  mouse.x = -1000;
  mouse.y = -1000;
});

function animateSpace() {
  let grd = ctx.createLinearGradient(0, 0, 0, height);
  grd.addColorStop(0, '#050510');
  grd.addColorStop(1, '#1a1025');
  ctx.fillStyle = grd;
  ctx.fillRect(0, 0, width, height);

  spaceStars.forEach(star => {
    star.x += star.dx;
    star.y += star.dy;
    if (star.x < 0) star.x = width;
    if (star.x > width) star.x = 0;
    if (star.y < 0) star.y = height;
    if (star.y > height) star.y = 0;

    let dx = mouse.x - star.x;
    let dy = mouse.y - star.y;
    let dist = Math.sqrt(dx * dx + dy * dy);
    
    if (dist < 150) {
      star.x -= dx * 0.01;
      star.y -= dy * 0.01;
      ctx.beginPath();
      ctx.moveTo(star.x, star.y);
      ctx.lineTo(mouse.x, mouse.y);
      ctx.strokeStyle = `rgba(139, 92, 246, ${1 - dist / 150})`;
      ctx.lineWidth = 0.5;
      ctx.stroke();
    }
    
    ctx.beginPath();
    ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
    ctx.fillStyle = star.color;
    ctx.fill();
  });
  requestAnimationFrame(animateSpace);
}
animateSpace();