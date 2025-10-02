// --- CONFIG (UNCHANGED) --- 
const GITHUB_USER = 'mdishauq';
const GITHUB_REPO = 'portfolio'; // Change if repo name differs
const BRANCH = 'main';

const PROJECTS_API = `https://api.github.com/repos/${GITHUB_USER}/${GITHUB_REPO}/contents/projects`;
const SKILLS_API = `https://api.github.com/repos/${GITHUB_USER}/${GITHUB_REPO}/contents/skills`;
const CERTIFICATIONS_API = `https://api.github.com/repos/${GITHUB_USER}/${GITHUB_REPO}/contents/certifications`;


// ---------------------------------------------------------------------
// --- PRELOADER VISIBILITY LOGIC (IMMEDIATE EXECUTION FIX) ---
// This runs BEFORE DOMContentLoaded to check sessionStorage and hide the loader instantly if needed.
// ---------------------------------------------------------------------

const preloader = document.getElementById('preloader');
const mainContent = document.getElementById('main-content');
const hasVisited = sessionStorage.getItem('hasVisited'); 

if (preloader && mainContent) {
    if (hasVisited) {
        // If flag exists, hide the preloader immediately
        preloader.style.display = 'none';
        mainContent.style.display = 'block';
    } else {
        // If flag does NOT exist (first load), ensure main content is hidden initially 
        // until the script inside DOMContentLoaded reveals it after 7 seconds.
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
// --- 3, 4, 5. Content Loading Functions (UNCHANGED from previous version) ---
// ---------------------------------------------------------------------
async function loadProjects() {
    const projectsSection = document.getElementById('projects-list');
    if (!projectsSection) return; 
    // ... rest of loadProjects logic ...
}

async function loadSkills() {
    const skillsSection = document.getElementById('skills-list');
    if (!skillsSection) return;
    // ... rest of loadSkills logic ...
}

async function loadCertifications() {
    const certsSection = document.getElementById('certifications-list');
    if (!certsSection) return;
    // ... rest of loadCertifications logic ...
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
