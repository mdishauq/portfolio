// --- CONFIG --- 
const GITHUB_USER = 'mdishauq';
const GITHUB_REPO = 'portfolio';
const BRANCH = 'main';

const PROJECTS_API = `https://api.github.com/repos/${GITHUB_USER}/${GITHUB_REPO}/contents/projects`;
const SKILLS_API = `https://api.github.com/repos/${GITHUB_USER}/${GITHUB_REPO}/contents/skills`;
const CERTIFICATIONS_API = `https://api.github.com/repos/${GITHUB_USER}/${GITHUB_REPO}/contents/certifications`;

// ---------------------------------------------------------------------
// --- THREE.JS 3D ANIMATIONS ---
// ---------------------------------------------------------------------
let scene, camera, renderer, mesh;

function init3D() {
    const container = document.getElementById('canvas-container');
    if (!container) return;

    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    camera.position.z = 5;

    renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(300, 300);
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    // Detect current page and create appropriate 3D object
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    
    if (currentPage === 'index.html' || currentPage === '') {
        createMicrocontroller();
    } else if (currentPage === 'projects.html') {
        createBreadboard();
    } else if (currentPage === 'skills.html') {
        createICChip();
    } else if (currentPage === 'certifications.html') {
        createCircuitBoard();
    } else if (currentPage === 'contact.html') {
        createWiFiSignal();
    }

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x60a5fa, 0.5);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0x93c5fd, 1);
    pointLight.position.set(5, 5, 5);
    scene.add(pointLight);

    animate();
}

function createMicrocontroller() {
    const group = new THREE.Group();

    // Main board
    const boardGeometry = new THREE.BoxGeometry(3, 0.2, 2);
    const boardMaterial = new THREE.MeshPhongMaterial({ 
        color: 0x1e40af,
        emissive: 0x1e40af,
        emissiveIntensity: 0.2
    });
    const board = new THREE.Mesh(boardGeometry, boardMaterial);
    group.add(board);

    // MCU chip
    const chipGeometry = new THREE.BoxGeometry(1, 0.3, 1);
    const chipMaterial = new THREE.MeshPhongMaterial({ 
        color: 0x334155,
        emissive: 0x60a5fa,
        emissiveIntensity: 0.3
    });
    const chip = new THREE.Mesh(chipGeometry, chipMaterial);
    chip.position.y = 0.25;
    group.add(chip);

    // Pins
    for (let i = 0; i < 8; i++) {
        const pinGeometry = new THREE.BoxGeometry(0.1, 0.4, 0.1);
        const pinMaterial = new THREE.MeshPhongMaterial({ color: 0xfbbf24 });
        const pin1 = new THREE.Mesh(pinGeometry, pinMaterial);
        pin1.position.set(-1.5, -0.3, -0.8 + i * 0.25);
        group.add(pin1);

        const pin2 = new THREE.Mesh(pinGeometry, pinMaterial);
        pin2.position.set(1.5, -0.3, -0.8 + i * 0.25);
        group.add(pin2);
    }

    // LEDs
    const ledGeometry = new THREE.CylinderGeometry(0.1, 0.1, 0.3, 8);
    const ledMaterial = new THREE.MeshPhongMaterial({ 
        color: 0xff0000,
        emissive: 0xff0000,
        emissiveIntensity: 0.5
    });
    const led = new THREE.Mesh(ledGeometry, ledMaterial);
    led.position.set(1, 0.35, 0.7);
    group.add(led);

    mesh = group;
    scene.add(mesh);
}

function createBreadboard() {
    const group = new THREE.Group();

    // Breadboard base
    const boardGeometry = new THREE.BoxGeometry(4, 0.3, 2.5);
    const boardMaterial = new THREE.MeshPhongMaterial({ color: 0xf8f9fa });
    const board = new THREE.Mesh(boardGeometry, boardMaterial);
    group.add(board);

    // Power rails (red/blue lines)
    for (let i = 0; i < 2; i++) {
        const railGeometry = new THREE.BoxGeometry(3.8, 0.05, 0.1);
        const redMaterial = new THREE.MeshPhongMaterial({ color: 0xff0000 });
        const blueMaterial = new THREE.MeshPhongMaterial({ color: 0x0000ff });
        
        const redRail = new THREE.Mesh(railGeometry, redMaterial);
        redRail.position.set(0, 0.18, 1 - i * 2);
        group.add(redRail);

        const blueRail = new THREE.Mesh(railGeometry, blueMaterial);
        blueRail.position.set(0, 0.18, 0.8 - i * 2);
        group.add(blueRail);
    }

    // Components (resistors, LEDs)
    for (let i = 0; i < 5; i++) {
        // Resistor
        const resistorGeometry = new THREE.CylinderGeometry(0.08, 0.08, 0.8, 8);
        const resistorMaterial = new THREE.MeshPhongMaterial({ color: 0xfbbf24 });
        const resistor = new THREE.Mesh(resistorGeometry, resistorMaterial);
        resistor.position.set(-1.5 + i * 0.7, 0.55, 0);
        resistor.rotation.z = Math.PI / 2;
        group.add(resistor);

        // Wire legs
        const legGeometry = new THREE.CylinderGeometry(0.02, 0.02, 0.4, 8);
        const legMaterial = new THREE.MeshPhongMaterial({ color: 0x94a3b8 });
        const leg1 = new THREE.Mesh(legGeometry, legMaterial);
        leg1.position.set(-1.9 + i * 0.7, 0.35, 0);
        group.add(leg1);

        const leg2 = new THREE.Mesh(legGeometry, legMaterial);
        leg2.position.set(-1.1 + i * 0.7, 0.35, 0);
        group.add(leg2);
    }

    mesh = group;
    scene.add(mesh);
}

function createICChip() {
    const group = new THREE.Group();

    // Chip body
    const chipGeometry = new THREE.BoxGeometry(2, 0.4, 1.5);
    const chipMaterial = new THREE.MeshPhongMaterial({ 
        color: 0x1e293b,
        emissive: 0x1e40af,
        emissiveIntensity: 0.2
    });
    const chip = new THREE.Mesh(chipGeometry, chipMaterial);
    group.add(chip);

    // Pins
    for (let i = 0; i < 8; i++) {
        const pinGeometry = new THREE.BoxGeometry(0.15, 0.15, 0.5);
        const pinMaterial = new THREE.MeshPhongMaterial({ color: 0x94a3b8 });
        
        const pin1 = new THREE.Mesh(pinGeometry, pinMaterial);
        pin1.position.set(-1.2, 0, -0.6 + i * 0.2);
        group.add(pin1);

        const pin2 = new THREE.Mesh(pinGeometry, pinMaterial);
        pin2.position.set(1.2, 0, -0.6 + i * 0.2);
        group.add(pin2);
    }

    // Chip label indent
    const labelGeometry = new THREE.CircleGeometry(0.15, 32);
    const labelMaterial = new THREE.MeshPhongMaterial({ 
        color: 0x60a5fa,
        emissive: 0x60a5fa,
        emissiveIntensity: 0.5
    });
    const label = new THREE.Mesh(labelGeometry, labelMaterial);
    label.position.set(-0.6, 0.21, 0.5);
    label.rotation.x = -Math.PI / 2;
    group.add(label);

    // Text marking
    for (let i = 0; i < 3; i++) {
        const lineGeometry = new THREE.BoxGeometry(1.2, 0.02, 0.05);
        const lineMaterial = new THREE.MeshPhongMaterial({ color: 0xe0e7ff });
        const line = new THREE.Mesh(lineGeometry, lineMaterial);
        line.position.set(0, 0.21, -0.3 + i * 0.2);
        group.add(line);
    }

    mesh = group;
    scene.add(mesh);
}

function createCircuitBoard() {
    const group = new THREE.Group();

    // PCB base
    const boardGeometry = new THREE.BoxGeometry(3.5, 0.15, 3);
    const boardMaterial = new THREE.MeshPhongMaterial({ 
        color: 0x059669,
        emissive: 0x059669,
        emissiveIntensity: 0.1
    });
    const board = new THREE.Mesh(boardGeometry, boardMaterial);
    group.add(board);

    // Copper traces
    for (let i = 0; i < 8; i++) {
        const traceGeometry = new THREE.BoxGeometry(0.05, 0.02, 2.8);
        const traceMaterial = new THREE.MeshPhongMaterial({ color: 0xfbbf24 });
        const trace = new THREE.Mesh(traceGeometry, traceMaterial);
        trace.position.set(-1.5 + i * 0.4, 0.09, 0);
        group.add(trace);
    }

    // Components
    for (let i = 0; i < 6; i++) {
        const compGeometry = new THREE.BoxGeometry(0.4, 0.3, 0.4);
        const compMaterial = new THREE.MeshPhongMaterial({ 
            color: 0x1e293b,
            emissive: 0x3b82f6,
            emissiveIntensity: 0.3
        });
        const comp = new THREE.Mesh(compGeometry, compMaterial);
        comp.position.set(-1.2 + (i % 3) * 1.2, 0.23, -0.8 + Math.floor(i / 3) * 1.6);
        group.add(comp);
    }

    // Solder points
    for (let x = -1.5; x <= 1.5; x += 0.3) {
        for (let z = -1.3; z <= 1.3; z += 0.3) {
            const solderGeometry = new THREE.SphereGeometry(0.04, 8, 8);
            const solderMaterial = new THREE.MeshPhongMaterial({ color: 0x94a3b8 });
            const solder = new THREE.Mesh(solderGeometry, solderMaterial);
            solder.position.set(x, 0.09, z);
            group.add(solder);
        }
    }

    mesh = group;
    scene.add(mesh);
}

function createWiFiSignal() {
    const group = new THREE.Group();

    // Central antenna/transmitter
    const baseGeometry = new THREE.CylinderGeometry(0.2, 0.3, 0.8, 8);
    const baseMaterial = new THREE.MeshPhongMaterial({ 
        color: 0x1e40af,
        emissive: 0x60a5fa,
        emissiveIntensity: 0.3
    });
    const base = new THREE.Mesh(baseGeometry, baseMaterial);
    group.add(base);

    const antennaGeometry = new THREE.CylinderGeometry(0.05, 0.05, 1.5, 8);
    const antennaMaterial = new THREE.MeshPhongMaterial({ color: 0x94a3b8 });
    const antenna = new THREE.Mesh(antennaGeometry, antennaMaterial);
    antenna.position.y = 1.15;
    group.add(antenna);

    // Signal waves (will pulse in animation)
    for (let i = 0; i < 3; i++) {
        const waveGeometry = new THREE.TorusGeometry(0.8 + i * 0.6, 0.05, 8, 32);
        const waveMaterial = new THREE.MeshPhongMaterial({ 
            color: 0x60a5fa,
            emissive: 0x60a5fa,
            emissiveIntensity: 0.7,
            transparent: true,
            opacity: 0.6 - i * 0.15
        });
        const wave = new THREE.Mesh(waveGeometry, waveMaterial);
        wave.rotation.x = Math.PI / 2;
        wave.userData.index = i;
        group.add(wave);
    }

    mesh = group;
    scene.add(mesh);
}

let rotation = 0;
function animate() {
    requestAnimationFrame(animate);
    rotation += 0.005;

    if (mesh) {
        // Special animation for WiFi signal
        if (window.location.pathname.includes('contact.html')) {
            mesh.rotation.y += 0.01;
            mesh.children.forEach(child => {
                if (child.userData.index !== undefined) {
                    const scale = 1 + Math.sin(rotation * 3 - child.userData.index) * 0.2;
                    child.scale.set(scale, scale, scale);
                    child.material.opacity = 0.6 - child.userData.index * 0.15 + Math.sin(rotation * 3 - child.userData.index) * 0.2;
                }
            });
        } else {
            mesh.rotation.x = Math.sin(rotation) * 0.2;
            mesh.rotation.y += 0.01;
            mesh.rotation.z = Math.cos(rotation) * 0.1;
        }
    }

    renderer.render(scene, camera);
}

// Handle window resize
window.addEventListener('resize', () => {
    if (renderer && camera) {
        const container = document.getElementById('canvas-container');
        if (container) {
            const size = Math.min(container.clientWidth, container.clientHeight);
            renderer.setSize(size, size);
            camera.aspect = 1;
            camera.updateProjectionMatrix();
        }
    }
});

// ---------------------------------------------------------------------
// --- PRELOADER VISIBILITY LOGIC ---
// ---------------------------------------------------------------------
const preloader = document.getElementById('preloader');
const mainContent = document.getElementById('main-content');
const hasVisited = sessionStorage.getItem('hasVisited'); 

if (preloader && mainContent) {
    if (hasVisited) {
        preloader.style.display = 'none';
        mainContent.style.display = 'block';
    } else {
        mainContent.style.display = 'none';
    }
}

// ---------------------------------------------------------------------
// --- DOM Content Loaded, Content Loading, & MULTI-PAGE NAVIGATION ---
// ---------------------------------------------------------------------
window.addEventListener('DOMContentLoaded', () => {
    
    // 1. Initialize 3D scene
    init3D();
    
    // 2. Load content only if its container exists on the current page
    if (document.getElementById('projects-list')) loadProjects();
    if (document.getElementById('skills-list')) loadSkills();
    if (document.getElementById('certifications-list')) loadCertifications();
    
    // 3. Set the 'active' class on the correct navbar link based on the URL
    const path = window.location.pathname.split('/').pop() || 'index.html'; 
    const currentPageLink = document.querySelector(`.nav-link[href="${path}"]`);

    if (currentPageLink) {
        document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active'));
        currentPageLink.classList.add('active');
    }
    
    // 4. Handle Preloader Visibility (One-Time Load Logic)
    if (!hasVisited) {
        setTimeout(() => {
            document.body.classList.add('loaded');
            if (preloader) preloader.style.display = 'none';
            if (mainContent) mainContent.style.display = 'block';
            setTimeout(() => {
                if (mainContent) mainContent.style.opacity = 1;
                sessionStorage.setItem('hasVisited', 'true'); 
            }, 60);
        }, 2500);
    } else {
        if (mainContent) mainContent.style.opacity = 1;
    }
});

// ---------------------------------------------------------------------
// --- Section Fade-In Animations ---
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
// --- Content Loading Functions ---
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

// --- Profile photo dynamic reload ---
const profileImg = document.getElementById('profile-photo');
if (profileImg) {
    profileImg.src = `https://raw.githubusercontent.com/${GITHUB_USER}/${GITHUB_REPO}/${BRANCH}/images/profile.jpg`;
}

// --- Mobile Menu Toggle ---
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
