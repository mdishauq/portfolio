// --- CONFIG (UNCHANGED) --- 
const GITHUB_USER = 'mdishauq';
const GITHUB_REPO = 'portfolio'; // Change if repo name differs
const BRANCH = 'main';

const PROJECTS_API = `https://api.github.com/repos/${GITHUB_USER}/${GITHUB_REPO}/contents/projects`;
const SKILLS_API = `https://api.github.com/repos/${GITHUB_USER}/${GITHUB_REPO}/contents/skills`;
const CERTIFICATIONS_API = `https://api.github.com/repos/${GITHUB_USER}/${GITHUB_REPO}/contents/certifications`;

// ---------------------------------------------------------------------
// --- 1. Loading Screen, Content Loading, & MULTI-PAGE NAVIGATION LOGIC ---
// ---------------------------------------------------------------------
window.addEventListener('DOMContentLoaded', () => {
    const preloader = document.getElementById('preloader');
    const mainContent = document.getElementById('main-content');

    // --- MULTI-PAGE ADAPTATION START ---
    
    // 1. Load content only if its container exists on the current page
    if (document.getElementById('projects-list')) loadProjects();
    if (document.getElementById('skills-list')) loadSkills();
    if (document.getElementById('certifications-list')) loadCertifications();
    
    // 2. Set the 'active' class on the correct navbar link based on the URL
    // This replaces the old scroll-based highlighting logic.
    const path = window.location.pathname.split('/').pop() || 'index.html'; // Gets filename
    const currentPageLink = document.querySelector(`.nav-link[href="${path}"]`);

    if (currentPageLink) {
        // Ensure only the current page link is active
        document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active'));
        currentPageLink.classList.add('active');
    }
    
    // --- MULTI-PAGE ADAPTATION END ---

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

// ---------------------------------------------------------------------
// --- NOTE: ORIGINAL SECTION 2 (SCROLL HIGHLIGHTING) HAS BEEN REMOVED ---
// ---------------------------------------------------------------------


// --- 3. Section Fade-In Animations (Kept, but primary animation is now in HTML) ---
function revealSectionsOnScroll() {
    const allSections = document.querySelectorAll('.section');
    allSections.forEach(section => {
        if (section.getBoundingClientRect().top < window.innerHeight - 60) section.classList.add('visible');
    });
}
window.addEventListener('scroll', revealSectionsOnScroll);
window.addEventListener('DOMContentLoaded', revealSectionsOnScroll);


// ---------------------------------------------------------------------
// --- 4. AUTO-UPDATE: Fetch & Render Projects from GitHub (With Safety Check) ---
// ---------------------------------------------------------------------
async function loadProjects() {
    const projectsSection = document.getElementById('projects-list');
    if (!projectsSection) return; // SAFETY CHECK

    try {
        const res = await fetch(PROJECTS_API);
        const files = await res.json();
        const jsonFiles = files.filter(file => file.name.endsWith('.json'));

        const projects = await Promise.all(jsonFiles.map(file =>
            fetch(file.download_url).then(r => r.json())
        ));

        // projectsSection.innerHTML = ''; // This line was outside the try block in the old code, moved inside for safety
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

// ---------------------------------------------------------------------
// --- 5. Load and Render Skills (With Safety Check) ---
// ---------------------------------------------------------------------
async function loadSkills() {
    const skillsSection = document.getElementById('skills-list');
    if (!skillsSection) return; // SAFETY CHECK

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

// ---------------------------------------------------------------------
// --- 6. Load and Render Certifications (With Safety Check) ---
// ---------------------------------------------------------------------
async function loadCertifications() {
    const certsSection = document.getElementById('certifications-list');
    if (!certsSection) return; // SAFETY CHECK

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

// --- 7. (Optional) Profile photo dynamic reload (UNCHANGED) ---
const profileImg = document.getElementById('profile-photo');
if (profileImg) {
    profileImg.src = `https://raw.githubusercontent.com/${GITHUB_USER}/${GITHUB_REPO}/${BRANCH}/images/profile.jpg`;
}

// --- 8. Mobile Menu Toggle (UNCHANGED) ---
document.addEventListener('DOMContentLoaded', () => {
    const menuBtn = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (menuBtn && navMenu) {
        menuBtn.addEventListener('click', () => {
            navMenu.classList.toggle('active');
        });
        // Close menu when a link is clicked
        navMenu.querySelectorAll('a').forEach(link =>
            // IMPORTANT: Closing on click works because links now navigate to a new page (which reloads the JS)
            link.addEventListener('click', () => navMenu.classList.remove('active'))
        );
    }
});
