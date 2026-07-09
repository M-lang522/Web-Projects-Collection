import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// ============================================
// 1. SETUP SCENE
// ============================================
const container = document.getElementById('three-container');
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x0a0a0a);

const camera = new THREE.PerspectiveCamera(30, window.innerWidth / window.innerHeight, 0.1, 50);
camera.position.set(0, 0.5, 8);

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.2;
container.appendChild(renderer.domElement);

// ============================================
// 2. CONTROLS (Auto-rotate)
// ============================================
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableZoom = false;
controls.enablePan = false;
controls.enableRotate = false;
controls.autoRotate = true;
controls.autoRotateSpeed = 0.8;
controls.target.set(0, 0, 0);
controls.update();

// ============================================
// 3. LIGHTS
// ============================================
const ambientLight = new THREE.AmbientLight(0x222233, 0.4);
scene.add(ambientLight);

const keyLight = new THREE.DirectionalLight(0xffffff, 2.5);
keyLight.position.set(3, 4, 5);
scene.add(keyLight);

const fillLight = new THREE.DirectionalLight(0x88ff88, 1.8);
fillLight.position.set(-4, 2, 3);
scene.add(fillLight);

const rimLight = new THREE.DirectionalLight(0x00ff44, 2);
rimLight.position.set(0, -2, -5);
scene.add(rimLight);

const glowLight = new THREE.PointLight(0x44ff88, 2, 10);
glowLight.position.set(0, 0, 3);
scene.add(glowLight);

// ============================================
// 4. LOAD MODEL
// ============================================
const loader = new GLTFLoader();
let model = null;
let modelGroup = new THREE.Group();
scene.add(modelGroup);

// Store initial state for zoom animation
let modelLoaded = false;

loader.load(
    'assets/models/circuit_board_4k.glb',
    (gltf) => {
        model = gltf.scene;
        modelLoaded = true;
        
        // Customize colors: White + Light Green
        model.traverse((child) => {
            if (child.isMesh) {
                if (child.material) {
                    child.material.color.setHex(0xf5fff5);
                    child.material.emissive = new THREE.Color(0x44ff88);
                    child.material.emissiveIntensity = 0.15;
                    child.material.metalness = 0.2;
                    child.material.roughness = 0.5;
                    child.material.needsUpdate = true;
                }
            }
        });

        // START: Model is far away (zoomed out)
        model.position.set(0, 0, -5);
        model.scale.set(0.3, 0.3, 0.3);
        model.rotation.x = -0.5;
        
        modelGroup.add(model);

        console.log('✅ Circuit board loaded!');
    },
    undefined,
    (error) => {
        console.error('❌ Error loading model:', error);
    }
);

// ============================================
// 5. PARTICLES
// ============================================
const particlesGeometry = new THREE.BufferGeometry();
const particleCount = 500;
const positions = new Float32Array(particleCount * 3);
for (let i = 0; i < particleCount * 3; i++) {
    positions[i] = (Math.random() - 0.5) * 20;
}
particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

const particlesMaterial = new THREE.PointsMaterial({
    size: 0.02,
    transparent: true,
    opacity: 0.6,
    color: 0x88ff88,
    blending: THREE.AdditiveBlending,
});
const particles = new THREE.Points(particlesGeometry, particlesMaterial);
scene.add(particles);

// ============================================
// 6. SCROLL SYSTEM - ZOOM + OPEN EFFECT
// ============================================
let scrollProgress = 0;
let targetScroll = 0;
const progressBar = document.getElementById('progressBar');
const sections = document.querySelectorAll('.section, .hero-section');

window.addEventListener('scroll', () => {
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    targetScroll = window.scrollY / maxScroll;
    
    if (progressBar) {
        progressBar.style.width = `${targetScroll * 100}%`;
    }
});

// ============================================
// 7. MAIN ANIMATION LOOP - ZOOM + OPEN
// ============================================
function updateScrollAnimation() {
    scrollProgress += (targetScroll - scrollProgress) * 0.05;
    
    if (model && modelLoaded) {
        // === ZOOM IN: From far away to center ===
        // Position Z: -5 (far) → 0 (center)
        const zStart = -5;
        const zEnd = 0;
        const zProgress = Math.min(scrollProgress * 2, 1); // Faster zoom
        model.position.z = zStart + (zEnd - zStart) * zProgress;
        
        // === SCALE: Small → Full size ===
        const scaleStart = 0.3;
        const scaleEnd = 1.5;
        const scaleProgress = Math.min(scrollProgress * 1.8, 1);
        const scale = scaleStart + (scaleEnd - scaleStart) * scaleProgress;
        model.scale.set(scale, scale, scale);
        
        // === OPEN UP: Rotation X flattens ===
        // Start tilted, end flat (opens up)
        const rotXStart = -0.5;
        const rotXEnd = 0.5;
        const rotProgress = Math.min(scrollProgress * 1.2, 1);
        model.rotation.x = rotXStart + (rotXEnd - rotXStart) * rotProgress;
        
        // === ROTATION Y: Spins as it opens ===
        model.rotation.y += 0.005 * (1 + scrollProgress * 2);
        
        // === FLOATING: Gentle bob after opening ===
        const floatOffset = Math.sin(Date.now() * 0.001 * 0.5) * 0.03;
        if (scrollProgress > 0.3) {
            model.position.y += floatOffset * 0.01 * (scrollProgress - 0.3);
        }
        
        // === MOVE TO SIDE: After opening, slide to the side ===
        if (scrollProgress > 0.4) {
            const sideProgress = Math.min((scrollProgress - 0.4) * 1.5, 1);
            model.position.x = sideProgress * 1.2;
            model.position.y = -sideProgress * 0.3;
        }
        
        // === GLOW: Fade as model moves ===
        if (glowLight) {
            glowLight.intensity = 2 - scrollProgress * 1.8;
        }
    }

    // Section visibility
    sections.forEach((section) => {
        const rect = section.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight * 0.75 && rect.bottom > 0;
        if (isVisible) {
            section.classList.add('visible');
        }
    });

    requestAnimationFrame(updateScrollAnimation);
}

updateScrollAnimation();

// ============================================
// 8. FLOATING ANIMATION
// ============================================
function animateFloating() {
    const time = Date.now() * 0.001;
    
    if (model && modelLoaded) {
        // Subtle tilt after opening
        if (scrollProgress > 0.3) {
            model.rotation.z = Math.sin(time * 0.3) * 0.02;
        }
    }
    
    if (particles) {
        particles.rotation.y += 0.0005;
    }
    
    requestAnimationFrame(animateFloating);
}

animateFloating();

// ============================================
// 9. RESIZE HANDLER
// ============================================
window.addEventListener('resize', () => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
});

// ============================================
// 10. RENDER LOOP
// ============================================
function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}

animate();

// ============================================
// 11. SHOW HERO ON LOAD
// ============================================
setTimeout(() => {
    const hero = document.querySelector('.hero-section');
    if (hero) hero.classList.add('visible');
}, 300);