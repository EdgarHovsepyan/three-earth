import * as THREE from "three";
import "./style/main.css";

// Globe Shaders
import vertexShader from "./shaders/vertex.glsl";
import fragmentShader from "./shaders/fragment.glsl";

// Atmosphere Shaders
import atmosphereVertexShader from "./shaders/atmosphereVertex.glsl";
import atmosphereFragmentShader from "./shaders/atmosphereFragment.glsl";

// Animations
import gsap from "gsap";

/**
 * Sizes
 */
const sizes = {};
sizes.width = window.innerWidth;
sizes.height = window.innerHeight;

window.addEventListener("resize", () => {
  // Save sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
});

/**
 * Environnements
 */
// Scene
const scene = new THREE.Scene();

// Camera
const camera = new THREE.PerspectiveCamera(
  38,
  sizes.width / sizes.height,
  0.1,
  1000
);
camera.position.z = 8;
camera.position.y = 5;
// camera.lookAt(0, 2.5, 0);
scene.add(camera);

// Sphere
const sphere = new THREE.Mesh(
  new THREE.SphereBufferGeometry(5, 150, 150),
  new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
    uniforms: {
      globeTexture: {
        value: new THREE.TextureLoader().load("./assets/world.jpg"),
      },
    },
  })
);

sphere.rotation.x = Math.PI / 4;
sphere.rotation.z = Math.PI / 4;

const group = new THREE.Group();
group.add(sphere);

// Atmosphere
const atmosphere = new THREE.Mesh(
  new THREE.SphereBufferGeometry(5, 150, 150),
  new THREE.ShaderMaterial({
    vertexShader: atmosphereVertexShader,
    fragmentShader: atmosphereFragmentShader,
    blending: THREE.AdditiveBlending,
    side: THREE.BackSide,
  })
);

atmosphere.scale.set(1.1, 1.1, 1.1);

group.add(atmosphere);

scene.add(group);

// Stars

const starGeometry = new THREE.BufferGeometry();
const starmaterial = new THREE.PointsMaterial({
  color: 0xffffff,
});

const starVertices = [];
for (let i = 0; i < 1000; i++) {
  const x = (Math.random() - 0.5) * 1000;
  const y = (Math.random() - 0.5) * 1000;
  const z = -Math.random() * 500;
  starVertices.push(x, y, z);
}

starGeometry.setAttribute(
  "position",
  new THREE.Float32BufferAttribute(starVertices, 3)
);

const stars = new THREE.Points(starGeometry, starmaterial);
scene.add(stars);

// Renderer
const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector("#canvas"),
  antialias: true,
});
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(sizes.width, sizes.height);

const mouse = new THREE.Vector2();

/**
 * Loop
 */
const animate = () => {
  // Update
  sphere.rotation.y += 0.003;
  gsap.to(group.rotation, {
    x: mouse.y * 0.1,
    y: mouse.x * 0.3,
    duration: 2,
  });

  // Render
  renderer.render(scene, camera);

  // Keep looping
  window.requestAnimationFrame(animate);
};

animate();

/**
 * Mouse Move
 */
addEventListener("mousemove", (e) => {
  mouse.x = (e.clientX / innerWidth) * 2 - 1;
  mouse.y = (e.clientY / innerHeight) * 2 + 1;
});
