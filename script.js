// --- CONFIG (UNCHANGED) --- 
const GITHUB_USER = 'mdishauq';
const GITHUB_REPO = 'portfolio';
const BRANCH = 'main';

const PROJECTS_API = `https://api.github.com/repos/${GITHUB_USER}/${GITHUB_REPO}/contents/projects`;
const SKILLS_API = `https://api.github.com/repos/${GITHUB_USER}/${GITHUB_REPO}/contents/skills`;
const CERTIFICATIONS_API = `https://api.github.com/repos/${GITHUB_USER}/${GITHUB_REPO}/contents/certifications`;

// ---------------------------------------------------------------------
// --- PRELOADER VISIBILITY LOGIC (IMMEDIATE EXECUTION FIX) ---
// This runs globally, checking sessionStorage immediately upon script load.
// ---------------------------------------------------------------------

const preloader = document.getElementById('preloader');
const mainContent = document.getElementById('main-content');
const hasVisited = sessionStorage.getItem('hasVisited'); 

if (preloader && mainContent) {
    if (hasVisited) {
        // If flag exists, hide the preloader immediately before DOM is fully loaded
        preloader.style.display = 'none';
        mainContent.style.display = 'block';
    } else {
        // If flag does NOT exist, ensure main content starts hidden 
        mainContent.style.display = 'none';
    }
}

// ---------------------------------------------------------------------
// --- 1. DOM Content Loaded, Content Loading, & MULTI-PAGE NAVIGATION ---
// ---------------------------------------------------------------------
window.addEventListener('DOMContentLoaded', () => {
    
    // 1. Load content only if its container exists on the current page
    if (document.getElementById('projects-list')) loadProjects();
    if (document.getElementById('skills-list')) loadSkills();
    if (document.getElementById('certifications-list')) loadCertifications();
    
    // 2. Set the 'active' class on the correct navbar link based on the URL
    const path = window.location.pathname.split('/').pop() || 'index.html'; 
    const currentPageLink = document.querySelector(`.nav-link[href="${path}"]`);

    if (currentPageLink) {
        document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active'));
        currentPageLink.classList.add('active');
    }
    
    // 3. Handle Preloader Visibility (One-Time Load Logic)
    if (!hasVisited) {
        // Only run the long delay if this is the first load
        setTimeout(() => {
            document.body.classList.add('loaded');
            if (preloader) preloader.style.display = 'none';
            if (mainContent) mainContent.style.display = 'block';
            setTimeout(() => {
                if (mainContent) mainContent.style.opacity = 1;
                // Set the flag after the preloader has been successfully hidden
                sessionStorage.setItem('hasVisited', 'true'); 
            }, 60);
        }, 7000); // 7 seconds minimum delay for the first load
    } else {
        // If already visited, ensure the smooth fade-in happens instantly
        if (mainContent) mainContent.style.opacity = 1;
    }
});

// ---------------------------------------------------------------------
// --- 2. Section Fade-In Animations (UNCHANGED) ---
// ---------------------------------------------------------------------
function revealSectionsOnScroll() {
    const allSections = document.querySelectorAll('.section');
    allSections.forEach(section => {
        if (section.getBoundingClientRect().top < window.innerHeight - 60) section.classList.add('visible');
    });
}
window.addEventListener('scroll', revealSectionsOnScroll);
window.addEventListener('DOMContentLoaded', revealSectionsOnScroll);


// ---------------------------------------------------------------------
// --- 3, 4, 5. Content Loading Functions (UNCHANGED) ---
// ---------------------------------------------------------------------
async function loadProjects() {
    const projectsSection = document.getElementById('projects-list');
    if (!projectsSection) return; 
    try {
        const res = await fetch(PROJECTS_API);
        const files = await res.json();
        const jsonFiles = files.filter(file => file.name.endsWith('.json'));

        const projects = await Promise.all(jsonFiles.map(file =>
            fetch(file.download_url).then(r => r.json())
        ));

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

async function loadSkills() {
    const skillsSection = document.getElementById('skills-list');
    if (!skillsSection) return;
    try {
        const res = await fetch(SKILLS_API);
        const files = await res.json();
        const jsonFiles = files.filter(file => file.name.endsWith('.json'));

        const skills = await Promise.all(jsonFiles.map(file =>
            fetch(file.download_url).then(r => r.json())
        ));

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

async function loadCertifications() {
    const certsSection = document.getElementById('certifications-list');
    if (!certsSection) return;
    try {
        const res = await fetch(CERTIFICATIONS_API);
        const files = await res.json();
        const jsonFiles = files.filter(file => file.name.endsWith('.json'));

        const certifications = await Promise.all(jsonFiles.map(file =>
            fetch(file.download_url).then(r => r.json())
        ));

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

// --- 6. (Optional) Profile photo dynamic reload (UNCHANGED) ---
const profileImg = document.getElementById('profile-photo');
if (profileImg) {
    profileImg.src = `https://raw.githubusercontent.com/${GITHUB_USER}/${GITHUB_REPO}/${BRANCH}/images/profile.jpg`;
}

// --- 7. Mobile Menu Toggle (UNCHANGED) ---
document.addEventListener('DOMContentLoaded', () => {
    const menuBtn = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (menuBtn && navMenu) {
        menuBtn.addEventListener('click', () => {
            navMenu.classList.toggle('active');
        });
        navMenu.querySelectorAll('a').forEach(link =>
            link.addEventListener('click', () => navMenu.classList.remove('active'))
        );
    }
});
