import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const scene = new THREE.Scene();
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement)

const fov = 50;
const aspect = window.innerWidth / window.innerHeight;
const camera = new THREE.PerspectiveCamera(fov, aspect, 0.1, 1000);
camera.position.set(0,0,10);

const controls = new OrbitControls( camera, renderer.domElement );
controls.target.set( 0, 0.5, 0 );
controls.update();
controls.enablePan = false;
controls.enableDamping = true;


const color = 0xFFFFFF;
const intensity = 3;
const light = new THREE.DirectionalLight(color, intensity);
light.position.set(-1, 2, 4);
scene.add(camera);
camera.add(light);

const chicken = new THREE.Object3D();
scene.add(chicken);

const bodyWidth = 1.75;
const bodyGeometry = new THREE.BoxGeometry(bodyWidth, 1, 1);
const bodyMaterial = new THREE.MeshStandardMaterial();
const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
chicken.add(body);

const wingsPositions = [0.5, -0.5];
const wingGeometry = new THREE.BoxGeometry(bodyWidth / 2, 0.5, 0.5);
const wingMaterial = new THREE.MeshStandardMaterial();
const wingMeshes = wingsPositions.map( (position) => {
    const wing = new THREE.Mesh(wingGeometry, wingMaterial);
    wing.position.z = position;
    body.add(wing);
    return wing;
});

const tailGeometry = new THREE.BoxGeometry(0.1, 0.5, 0.5);
const tailMaterial = new THREE.MeshStandardMaterial();
const tail = new THREE.Mesh(tailGeometry, tailMaterial);
tail.position.set(- bodyWidth / 2 - 0.1 / 2, 0.25, 0);
body.add(tail);

const radiusTop = 0.3;  
const radiusBottom =  0.3;  
const height =  0.1;  
const radialSegments = 6;  
const heightSegments =  1;  
const openEnded = false;  
const thetaStart = Math.PI * 0.75;  
const thetaLength = Math.PI * 1.5;  
const clawGeometry = new THREE.CylinderGeometry(
	radiusTop, radiusBottom, height,
	radialSegments, heightSegments,
	openEnded,
	thetaStart, thetaLength );
const clawMaterial = new THREE.MeshStandardMaterial({color: 0xFFA500});

const legGeometry = new THREE.BoxGeometry(0.25, 1, 0.25);
const legMaterial = new THREE.MeshStandardMaterial({color: 0xFFA500});
const legPositions = [[0, -0.5, -0.25], [0, -0.5, 0.25]];
const legMeshes = legPositions.map((position) => {
    const leg = new THREE.Mesh(legGeometry, legMaterial);
    leg.position.set(...position);
    const claw = new THREE.Mesh(clawGeometry, clawMaterial);
    claw.position.y = - (1 - 0.5);
    claw.position.x = 0.15;
    leg.add(claw);
    body.add(leg);
    return leg;
})

const headWidth = 1;
const headGeometry = new THREE.BoxGeometry();
const headMaterial = new THREE.MeshStandardMaterial();
const head = new THREE.Mesh(headGeometry, headMaterial);
head.position.set(bodyWidth / 2 - headWidth / 2, 1, 0);
chicken.add(head);

const combGeometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
const combMaterial = new THREE.MeshStandardMaterial({color: 0xFF0000})
const comb = new THREE.Mesh(combGeometry, combMaterial);
comb.position.y = 0.5;
head.add(comb);

const beakGeometry = new THREE.BoxGeometry(0.75, 0.25, 0.25);
const beakMaterial = new THREE.MeshStandardMaterial({color: 0xFFA500});
const beak = new THREE.Mesh(beakGeometry, beakMaterial);
beak.position.set(0.5, -0.5, 0);
head.add(beak);

const wattlesGeometry = new THREE.BoxGeometry(0.5, 0.25, 0.25);
const wattlesMaterial = new THREE.MeshStandardMaterial({color: 0xFF0000});
const wattles = new THREE.Mesh(wattlesGeometry, wattlesMaterial);
wattles.position.set(0.5, -0.5 - 0.25, 0);
head.add(wattles);

function animate() {
    requestAnimationFrame(animate);
    controls.update();
    
    renderer.render(scene, camera);
}

animate();