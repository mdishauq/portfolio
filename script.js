// --- CONFIG --- 
const GITHUB_USER = 'mdishauq';
const GITHUB_REPO = 'portfolio'; // Change if repo name differs
const BRANCH = 'main';

const PROJECTS_API = `https://api.github.com/repos/${GITHUB_USER}/${GITHUB_REPO}/contents/projects`;
const SKILLS_API = `https://api.github.com/repos/${GITHUB_USER}/${GITHUB_REPO}/contents/skills`;
const CERTIFICATIONS_API = `https://api.github.com/repos/${GITHUB_USER}/${GITHUB_REPO}/contents/certifications`;

// --- 1. Loading Screen / Preloader and Content Loading ---
window.addEventListener('DOMContentLoaded', () => {
  const preloader = document.getElementById('preloader');
  const mainContent = document.getElementById('main-content');

  // Start loading all content ASAP
  loadProjects();
  loadSkills();
  loadCertifications();

  // Hide preloader and reveal content after minimum 7 seconds
  setTimeout(() => {
    document.body.classList.add('loaded');
    preloader.style.display = 'none';
    mainContent.style.display = 'block';
    setTimeout(() => {
      mainContent.style.opacity = 1;
    }, 60);
  }, 7000); // 7 seconds minimum
});

// --- 2. Navbar Section Highlight on Scroll ---
const navLinks = Array.from(document.querySelectorAll('.nav-link'));
const sectionIds = navLinks.map(link => link.getAttribute('href').substring(1));
const sections = sectionIds.map(id => document.getElementById(id));
window.addEventListener('scroll', () => {
  let currentSection = sectionIds[0];
  for (let i = 0; i < sections.length; i++) {
    if (sections[i] && window.scrollY + 80 >= sections[i].offsetTop) currentSection = sectionIds[i];
  }
  navLinks.forEach(link => link.classList.toggle('active', link.getAttribute('href').substring(1) === currentSection));
});

// --- 3. Section Fade-In Animations ---
function revealSectionsOnScroll() {
  const allSections = document.querySelectorAll('.section');
  allSections.forEach(section => {
    if (section.getBoundingClientRect().top < window.innerHeight - 60) section.classList.add('visible');
  });
}
window.addEventListener('scroll', revealSectionsOnScroll);
window.addEventListener('DOMContentLoaded', revealSectionsOnScroll);

// --- 4. AUTO-UPDATE: Fetch & Render Projects from GitHub ---
async function loadProjects() {
  try {
    const res = await fetch(PROJECTS_API);
    const files = await res.json();
    const jsonFiles = files.filter(file => file.name.endsWith('.json'));

    const projects = await Promise.all(jsonFiles.map(file =>
      fetch(file.download_url).then(r => r.json())
    ));

    const projectsSection = document.getElementById('projects-list');
    projectsSection.innerHTML = '';
    projects.forEach(project => {
      const card = document.createElement('div');
      card.className = 'project-card';

      let mediaElem;
      if (project.video) {
        mediaElem = document.createElement('video');
        mediaElem.src = `https://raw.githubusercontent.com/${GITHUB_USER}/${GITHUB_REPO}/${BRANCH}/projects/${project.video}`;
        mediaElem.controls = true;
        mediaElem.width = 320; mediaElem.height = 180;
      } else if (project.thumbnail) {
        mediaElem = document.createElement('img');
        mediaElem.src = `https://raw.githubusercontent.com/${GITHUB_USER}/${GITHUB_REPO}/${BRANCH}/projects/${project.thumbnail}`;
        mediaElem.alt = project.title + " thumbnail";
        mediaElem.width = 320; mediaElem.height = 180;
      }

      card.innerHTML = `
        <h3>${project.title}</h3>
        <p>${project.description}</p>
        <a href="${project.github}" target="_blank" rel="noopener">View on GitHub</a>
        <div class="tech-list">${Array.isArray(project.technologies) ? project.technologies.join(', ') : ''}</div>
      `;
      if (mediaElem) card.prepend(mediaElem);
      projectsSection.appendChild(card);
    });
  } catch (err) {
    console.error('Error loading projects:', err);
  }
}

// --- 5. Load and Render Skills ---
async function loadSkills() {
  try {
    const res = await fetch(SKILLS_API);
    const files = await res.json();
    const jsonFiles = files.filter(file => file.name.endsWith('.json'));

    const skills = await Promise.all(jsonFiles.map(file =>
      fetch(file.download_url).then(r => r.json())
    ));

    const skillsSection = document.getElementById('skills-list');
    skillsSection.innerHTML = '';

    skills.forEach(skill => {
      const card = document.createElement('div');
      card.className = 'skill-card';

      let iconElem = null;
      if (skill.icon) {
        iconElem = document.createElement('img');
        iconElem.src = `https://raw.githubusercontent.com/${GITHUB_USER}/${GITHUB_REPO}/${BRANCH}/skills/${skill.icon}`;
        iconElem.alt = skill.name + " icon";
        iconElem.className = "skill-icon";
      }

      card.innerHTML = `
        <h4>${skill.name}</h4>
        <div class="skill-level">${skill.proficiency || ''}</div>
        <p>${skill.description || ''}</p>
      `;

      if (iconElem) card.prepend(iconElem);
      skillsSection.appendChild(card);
    });
  } catch (err) {
    console.error('Error loading skills:', err);
  }
}

// --- 6. Load and Render Certifications ---
async function loadCertifications() {
  try {
    const res = await fetch(CERTIFICATIONS_API);
    const files = await res.json();
    const jsonFiles = files.filter(file => file.name.endsWith('.json'));

    const certifications = await Promise.all(jsonFiles.map(file =>
      fetch(file.download_url).then(r => r.json())
    ));

    const certsSection = document.getElementById('certifications-list');
    certsSection.innerHTML = '';

    certifications.forEach(cert => {
      const card = document.createElement('div');
      card.className = 'cert-card';

      let imgElem = null;
      if (cert.certificate_image) {
        imgElem = document.createElement('img');
        imgElem.src = `https://raw.githubusercontent.com/${GITHUB_USER}/${GITHUB_REPO}/${BRANCH}/certifications/${cert.certificate_image}`;
        imgElem.alt = cert.title + " certificate";
      }

      card.innerHTML = `
        <h4>${cert.title}</h4>
        <div class="cert-issuer">${cert.issuer || ''}</div>
        <div class="cert-date">${cert.date || ''}</div>
        <p>${cert.description || ''}</p>
      `;

      if (imgElem) card.prepend(imgElem);

      if (cert.credential_url) {
        const link = document.createElement('a');
        link.href = cert.credential_url;
        link.target = "_blank";
        link.rel = "noopener";
        link.textContent = "View Credential";
        link.className = "cert-link";
        card.appendChild(link);
      }

      certsSection.appendChild(card);
    });
  } catch (err) {
    console.error('Error loading certifications:', err);
  }
}

// --- 7. (Optional) Profile photo dynamic reload ---
const profileImg = document.getElementById('profile-photo');
if (profileImg) {
  profileImg.src = `https://raw.githubusercontent.com/${GITHUB_USER}/${GITHUB_REPO}/${BRANCH}/images/profile.jpg`;
}

// --- Upgrade Tracker for reference ---
// 1. Loading Screen (Preloader)
// 2. Section Transitions/Animations
// 3. Typography/Fonts
// 4. Navbar Section Highlighting
// 5. Uniform Card Heights
// 6. Auto-update from GitHub (Projects, Skills, Certifications fetching + rendering)

// --- 8. Mobile Menu Toggle ---
document.addEventListener('DOMContentLoaded', () => {
  const menuBtn = document.querySelector('.menu-toggle');
  const navMenu = document.querySelector('.nav-menu');
  
  if (menuBtn && navMenu) {
    menuBtn.addEventListener('click', () => {
      navMenu.classList.toggle('active');
    });
    // Close menu when a link is clicked
    navMenu.querySelectorAll('a').forEach(link =>
      link.addEventListener('click', () => navMenu.classList.remove('active'))
    );
  }
});

