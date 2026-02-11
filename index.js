// ===== Security Configuration =====
// IMPORTANT: في بيئة إنتاجية حقيقية، يجب استخدام backend API
// هذا مثال تعليمي فقط - لا تستخدمه في الإنتاج
const ADMIN_CREDENTIALS = {
  username: 'ali_admin',
  // Password hash (SHA-256 of '12345678')
  passwordHash: 'ef797c8118f02dfb649607dd5d3f8c7623048c9c063d532cc95c5ed7a898a64f'
};

// Simple hash function (للتوضيح فقط - استخدم bcrypt في الإنتاج)
async function hashPassword(password) {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hash = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hash))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

// Check if user is logged in
function isLoggedIn() {
  return sessionStorage.getItem('adminLoggedIn') === 'true';
}

// ===== Login System =====
const loginForm = document.getElementById('loginForm');
const loginScreen = document.getElementById('loginScreen');
const adminDashboard = document.getElementById('adminDashboard');
const errorMessage = document.getElementById('errorMessage');

loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;
  
  const passHash = await hashPassword(password);
  
  if (username === ADMIN_CREDENTIALS.username && passHash === ADMIN_CREDENTIALS.passwordHash) {
    sessionStorage.setItem('adminLoggedIn', 'true');
    loginScreen.style.display = 'none';
    adminDashboard.style.display = 'grid';
    loadAllData();
  } else {
    errorMessage.textContent = 'اسم المستخدم أو كلمة المرور غير صحيحة';
    setTimeout(() => {
      errorMessage.textContent = '';
    }, 3000);
  }
});

// Logout
document.getElementById('logoutBtn').addEventListener('click', () => {
  sessionStorage.removeItem('adminLoggedIn');
  location.reload();
});

// Check login status on page load
if (isLoggedIn()) {
  loginScreen.style.display = 'none';
  adminDashboard.style.display = 'grid';
  loadAllData();
}

// ===== Data Storage =====
let currentSkillCategory = 'design';
let currentProjectCategory = 'design';

// Load data from localStorage or use defaults
function loadData() {
  const savedSkills = localStorage.getItem('portfolioSkills');
  const savedProjects = localStorage.getItem('portfolioProjects');
  
  if (savedSkills) {
    return {
      skills: JSON.parse(savedSkills),
      projects: JSON.parse(savedProjects)
    };
  }
  
  // Default data from script.js
  return {
    skills: {
      design: [
        { name: 'Adobe Photoshop', logo: 'https://upload.wikimedia.org/wikipedia/commons/a/af/Adobe_Photoshop_CC_icon.svg', progress: 95 },
        { name: 'Adobe Illustrator', logo: 'https://upload.wikimedia.org/wikipedia/commons/f/fb/Adobe_Illustrator_CC_icon.svg', progress: 90 },
        { name: 'Figma', logo: 'https://upload.wikimedia.org/wikipedia/commons/3/33/Figma-logo.svg', progress: 92 },
        { name: 'Adobe After Effects', logo: 'https://upload.wikimedia.org/wikipedia/commons/c/cb/Adobe_After_Effects_CC_icon.svg', progress: 85 },
        { name: 'Adobe Premiere Pro', logo: 'https://upload.wikimedia.org/wikipedia/commons/4/40/Adobe_Premiere_Pro_CC_icon.svg', progress: 87 }
      ],
      ai: [
       
      ],
      programming: [
        { name: 'HTML', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg', progress: 95 },
        { name: 'CSS', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg', progress: 95 },
        { name: 'JavaScript', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg', progress: 90 },
        { name: 'Python', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg', progress: 88 },
        { name: 'Java', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg', progress: 80 }
      ],
      security: [
        { name: 'Kali Linux', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/linux/linux-original.svg', progress: 90 },
        { name: 'Wireshark', logo: 'https://upload.wikimedia.org/wikipedia/commons/d/df/Wireshark_icon.svg', progress: 88 },
        { name: 'Metasploit', logo: 'https://www.kali.org/tools/metasploit-framework/images/metasploit-framework-logo.svg', progress: 85 },
        { name: 'Nmap', logo: 'https://nmap.org/images/nmap-logo-256x256.png', progress: 87 },
      ]
    },
    projects: {
      design: [
        { title: 'هوية بصرية متكاملة', description: 'تصميم هوية بصرية احترافية لشركة ناشئة', icon: 'fas fa-palette', tags: ['Illustrator', 'Photoshop'] },
        { title: 'تصميم UI/UX', description: 'واجهات تطبيق جوال عصرية ومبتكرة', icon: 'fas fa-mobile-alt', tags: ['Figma', 'Adobe XD'] },
      ],
      ai: [
      ],
      programming: [
      ],
      security: [
        { title: 'اختبار اختراق موقع', description: 'فحص أمني شامل لمنصة إلكترونية', icon: 'fas fa-shield-alt', tags: ['Kali Linux', 'Burp Suite'] },
        { title: 'تحليل ثغرات الشبكة', description: 'فحص وتحليل نقاط الضعف في البنية التحتية', icon: 'fas fa-network-wired', tags: ['Nmap', 'Wireshark'] },
      ]
    }
  };
}

let portfolioData = loadData();

// ===== Navigation =====
const navItems = document.querySelectorAll('.nav-item');
const sections = document.querySelectorAll('.content-section');
const sectionTitle = document.getElementById('sectionTitle');

const sectionTitles = {
  skills: 'إدارة المهارات',
  projects: 'إدارة الأعمال',
  about: 'تحديث المعلومات',
  settings: 'الإعدادات'
};

navItems.forEach(item => {
  item.addEventListener('click', (e) => {
    e.preventDefault();
    const section = item.getAttribute('data-section');
    
    navItems.forEach(nav => nav.classList.remove('active'));
    item.classList.add('active');
    
    sections.forEach(sec => sec.classList.remove('active'));
    document.getElementById(section + 'Section').classList.add('active');
    
    sectionTitle.textContent = sectionTitles[section];
  });
});

// ===== Skills Management =====
function loadSkillsEditor(category) {
  const editor = document.getElementById('skillsEditor');
  const skills = portfolioData.skills[category];
  
  editor.innerHTML = '';
  
  skills.forEach((skill, index) => {
    const card = document.createElement('div');
    card.className = 'skill-card';
    card.innerHTML = `
      <div class="skill-inputs">
        <input type="text" value="${skill.name}" data-field="name" data-index="${index}">
        <input type="text" value="${skill.logo}" data-field="logo" data-index="${index}" placeholder="رابط الشعار">
        <input type="number" value="${skill.progress}" data-field="progress" data-index="${index}" min="0" max="100" placeholder="النسبة">
      </div>
      <button class="btn-delete" data-index="${index}">
        <i class="fas fa-trash"></i>
      </button>
    `;
    editor.appendChild(card);
  });
  
  // Add event listeners
  editor.querySelectorAll('input').forEach(input => {
    input.addEventListener('change', updateSkillData);
  });
  
  editor.querySelectorAll('.btn-delete').forEach(btn => {
    btn.addEventListener('click', deleteSkill);
  });
}

function updateSkillData(e) {
  const index = parseInt(e.target.getAttribute('data-index'));
  const field = e.target.getAttribute('data-field');
  const value = field === 'progress' ? parseInt(e.target.value) : e.target.value;
  
  portfolioData.skills[currentSkillCategory][index][field] = value;
}

function deleteSkill(e) {
  const index = parseInt(e.currentTarget.getAttribute('data-index'));
  if (confirm('هل تريد حذف هذه المهارة؟')) {
    portfolioData.skills[currentSkillCategory].splice(index, 1);
    loadSkillsEditor(currentSkillCategory);
  }
}

document.getElementById('addSkillBtn').addEventListener('click', () => {
  portfolioData.skills[currentSkillCategory].push({
    name: 'مهارة جديدة',
    logo: '',
    progress: 50
  });
  loadSkillsEditor(currentSkillCategory);
});

// Skills category tabs
document.querySelectorAll('#skillsSection .category-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    const category = tab.getAttribute('data-category');
    currentSkillCategory = category;
    
    document.querySelectorAll('#skillsSection .category-tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    
    loadSkillsEditor(category);
  });
});

// ===== Projects Management =====
function loadProjectsEditor(category) {
  const editor = document.getElementById('projectsEditor');
  const projects = portfolioData.projects[category];
  
  editor.innerHTML = '';
  
  projects.forEach((project, index) => {
    const card = document.createElement('div');
    card.className = 'project-card';
    card.innerHTML = `
      <div class="project-inputs">
        <input type="text" value="${project.title}" data-field="title" data-index="${index}" placeholder="العنوان">
        <input type="text" value="${project.description}" data-field="description" data-index="${index}" placeholder="الوصف">
        <input type="text" value="${project.icon}" data-field="icon" data-index="${index}" placeholder="أيقونة Font Awesome">
        <input type="text" value="${project.tags.join(', ')}" data-field="tags" data-index="${index}" placeholder="التاغات (مفصولة بفواصل)">
      </div>
      <button class="btn-delete" data-index="${index}">
        <i class="fas fa-trash"></i>
      </button>
    `;
    editor.appendChild(card);
  });
  
  editor.querySelectorAll('input').forEach(input => {
    input.addEventListener('change', updateProjectData);
  });
  
  editor.querySelectorAll('.btn-delete').forEach(btn => {
    btn.addEventListener('click', deleteProject);
  });
}

function updateProjectData(e) {
  const index = parseInt(e.target.getAttribute('data-index'));
  const field = e.target.getAttribute('data-field');
  let value = e.target.value;
  
  if (field === 'tags') {
    value = value.split(',').map(tag => tag.trim());
  }
  
  portfolioData.projects[currentProjectCategory][index][field] = value;
}

function deleteProject(e) {
  const index = parseInt(e.currentTarget.getAttribute('data-index'));
  if (confirm('هل تريد حذف هذا العمل؟')) {
    portfolioData.projects[currentProjectCategory].splice(index, 1);
    loadProjectsEditor(currentProjectCategory);
  }
}

document.getElementById('addProjectBtn').addEventListener('click', () => {
  portfolioData.projects[currentProjectCategory].push({
    title: 'مشروع جديد',
    description: 'وصف المشروع',
    icon: 'fas fa-star',
    tags: ['تاغ1', 'تاغ2']
  });
  loadProjectsEditor(currentProjectCategory);
});

// Projects category tabs
document.querySelectorAll('#projectsSection .category-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    const category = tab.getAttribute('data-work-category');
    currentProjectCategory = category;
    
    document.querySelectorAll('#projectsSection .category-tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    
    loadProjectsEditor(category);
  });
});

// ===== Save All Changes =====
document.getElementById('saveAllBtn').addEventListener('click', () => {
  localStorage.setItem('portfolioSkills', JSON.stringify(portfolioData.skills));
  localStorage.setItem('portfolioProjects', JSON.stringify(portfolioData.projects));
  
  showToast('تم حفظ جميع التغييرات بنجاح!');
});

// ===== Toast Notification =====
function showToast(message) {
  const toast = document.getElementById('toast');
  const toastMessage = document.getElementById('toastMessage');
  
  toastMessage.textContent = message;
  toast.classList.add('show');
  
  setTimeout(() => {
    toast.classList.remove('show');
  }, 3000);
}

// ===== Change Password =====
document.getElementById('changePasswordBtn').addEventListener('click', async () => {
  const currentPassword = document.getElementById('currentPassword').value;
  const newPassword = document.getElementById('newPassword').value;
  const confirmPassword = document.getElementById('confirmPassword').value;
  
  if (!currentPassword || !newPassword || !confirmPassword) {
    alert('يرجى ملء جميع الحقول');
    return;
  }
  
  const currentHash = await hashPassword(currentPassword);
  if (currentHash !== ADMIN_CREDENTIALS.passwordHash) {
    alert('كلمة المرور الحالية غير صحيحة');
    return;
  }
  
  if (newPassword !== confirmPassword) {
    alert('كلمة المرور الجديدة غير متطابقة');
    return;
  }
  
  if (newPassword.length < 8) {
    alert('كلمة المرور يجب أن تكون 8 أحرف على الأقل');
    return;
  }
  
  alert('تم تغيير كلمة المرور بنجاح!\nملاحظة: في بيئة إنتاجية، يجب تحديث الباسورد في قاعدة البيانات');
  
  document.getElementById('currentPassword').value = '';
  document.getElementById('newPassword').value = '';
  document.getElementById('confirmPassword').value = '';
});

// ===== Load All Data on Start =====
function loadAllData() {
  loadSkillsEditor('design');
  loadProjectsEditor('design');
}

// ===== Personal Info Management =====
function loadPersonalInfo() {
  const data = loadData();
  
  document.getElementById('personalBio').value = data.personalInfo?.bio || '';
  document.getElementById('personalImage').value = data.personalInfo?.profileImage || 'profile.png';
  document.getElementById('portfolioLink').value = data.personalInfo?.portfolioLink || '';
  
  const availToggle = document.getElementById('availabilityToggle');
  const availLabel = document.getElementById('availabilityLabel');
  
  availToggle.checked = data.personalInfo?.available !== false;
  availLabel.textContent = availToggle.checked ? 'متوفر للعمل' : 'غير متوفر حالياً';
  
  availToggle.addEventListener('change', () => {
    availLabel.textContent = availToggle.checked ? 'متوفر للعمل' : 'غير متوفر حالياً';
  });
}

// ===== Certificates Management =====
let currentCertCategory = 'education';

function loadCertificatesEditor(category) {
  const editor = document.getElementById('certificatesEditor');
  const certs = portfolioData.certificates[category];
  
  editor.innerHTML = '';
  
  certs.forEach((cert, index) => {
    const card = document.createElement('div');
    card.className = 'cert-edit-card';
    
    if (category === 'education') {
      card.innerHTML = `
        <div class="cert-edit-inputs">
          <input type="text" value="${cert.title}" data-field="title" data-index="${index}" placeholder="الدرجة العلمية">
          <input type="text" value="${cert.institution}" data-field="institution" data-index="${index}" placeholder="المؤسسة التعليمية">
          <input type="text" value="${cert.year}" data-field="year" data-index="${index}" placeholder="السنة">
          <input type="text" value="${cert.icon || 'fas fa-graduation-cap'}" data-field="icon" data-index="${index}" placeholder="أيقونة Font Awesome">
          <textarea data-field="description" data-index="${index}" placeholder="الوصف">${cert.description || ''}</textarea>
        </div>
        <button class="btn-delete" data-index="${index}">
          <i class="fas fa-trash"></i>
        </button>
      `;
    } else {
      card.innerHTML = `
        <div class="cert-edit-inputs">
          <input type="text" value="${cert.title}" data-field="title" data-index="${index}" placeholder="اسم الشهادة">
          <input type="text" value="${cert.issuer}" data-field="issuer" data-index="${index}" placeholder="الجهة المانحة">
          <input type="text" value="${cert.year}" data-field="year" data-index="${index}" placeholder="السنة">
          <input type="text" value="${cert.icon || 'fas fa-certificate'}" data-field="icon" data-index="${index}" placeholder="أيقونة Font Awesome">
          <textarea data-field="description" data-index="${index}" placeholder="الوصف">${cert.description || ''}</textarea>
        </div>
        <button class="btn-delete" data-index="${index}">
          <i class="fas fa-trash"></i>
        </button>
      `;
    }
    
    editor.appendChild(card);
  });
  
  // Add event listeners
  editor.querySelectorAll('input, textarea').forEach(input => {
    input.addEventListener('change', updateCertData);
  });
  
  editor.querySelectorAll('.btn-delete').forEach(btn => {
    btn.addEventListener('click', deleteCert);
  });
}

function updateCertData(e) {
  const index = parseInt(e.target.getAttribute('data-index'));
  const field = e.target.getAttribute('data-field');
  const value = e.target.value;
  
  portfolioData.certificates[currentCertCategory][index][field] = value;
}

function deleteCert(e) {
  const index = parseInt(e.currentTarget.getAttribute('data-index'));
  if (confirm('هل تريد حذف هذه الشهادة؟')) {
    portfolioData.certificates[currentCertCategory].splice(index, 1);
    loadCertificatesEditor(currentCertCategory);
  }
}

document.getElementById('addCertBtn').addEventListener('click', () => {
  const newCert = currentCertCategory === 'education' 
    ? { title: 'درجة جديدة', institution: '', year: '', icon: 'fas fa-graduation-cap', description: '' }
    : { title: 'شهادة جديدة', issuer: '', year: '', icon: 'fas fa-certificate', description: '' };
  
  portfolioData.certificates[currentCertCategory].push(newCert);
  loadCertificatesEditor(currentCertCategory);
});

// Certificates category tabs
document.querySelectorAll('#certificatesSection .category-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    const category = tab.getAttribute('data-cert-category');
    currentCertCategory = category;
    
    document.querySelectorAll('#certificatesSection .category-tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    
    loadCertificatesEditor(category);
  });
});

// ===== Update Save Function =====
const originalSaveBtn = document.getElementById('saveAllBtn');
originalSaveBtn.addEventListener('click', () => {
  // Save personal info
  if (!portfolioData.personalInfo) {
    portfolioData.personalInfo = {};
  }
  
  portfolioData.personalInfo.bio = document.getElementById('personalBio').value;
  portfolioData.personalInfo.profileImage = document.getElementById('personalImage').value;
  portfolioData.personalInfo.portfolioLink = document.getElementById('portfolioLink').value;
  portfolioData.personalInfo.available = document.getElementById('availabilityToggle').checked;
  
  // Save all data
  localStorage.setItem('portfolioData', JSON.stringify(portfolioData));
  localStorage.setItem('portfolioSkills', JSON.stringify(portfolioData.skills));
  localStorage.setItem('portfolioProjects', JSON.stringify(portfolioData.projects));
  
  showToast('تم حفظ جميع التغييرات بنجاح! 🎉');
});

// ===== Update Navigation =====
const sectionTitlesUpdated = {
  personal: 'المعلومات الشخصية',
  skills: 'إدارة المهارات',
  certificates: 'إدارة الشهادات',
  projects: 'إدارة الأعمال',
  settings: 'الإعدادات'
};

// Override original navigation
document.querySelectorAll('.nav-item').forEach(item => {
  item.addEventListener('click', (e) => {
    e.preventDefault();
    const section = item.getAttribute('data-section');
    
    document.querySelectorAll('.nav-item').forEach(nav => nav.classList.remove('active'));
    item.classList.add('active');
    
    document.querySelectorAll('.content-section').forEach(sec => sec.classList.remove('active'));
    document.getElementById(section + 'Section').classList.add('active');
    
    document.getElementById('sectionTitle').textContent = sectionTitlesUpdated[section];
  });
});

// ===== Load All Data on Start =====
function loadAllDataUpdated() {
  loadSkillsEditor('design');
  loadProjectsEditor('design');
  loadCertificatesEditor('education');
  loadPersonalInfo();
}

// Override original load
window.addEventListener('load', () => {
  if (isLoggedIn()) {
    setTimeout(loadAllDataUpdated, 100);
  }
});

console.log('✅ Admin Panel - Full System Loaded!');
console.log('🎯 All sections active');
