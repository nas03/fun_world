import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'; // Add '.js' extension
import { loadAllModels } from './loadModelFromDish.js';
import { Player } from './entities/player.js';
import { generateLanes, generateCars } from './generateMap.js';

const counterDOM = document.getElementById('counter');
let lanes;
let currentLane;
let currentColumn;

let previousTimestamp;
let startMoving;
let moves;
let stepStartTimestamp;
const cars = [];
var player;

//Camera
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(-2.61, 7, -5);

const renderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: true
});
renderer.setClearColor(0xcccccc);
renderer.shadowMap.enabled = true
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const orbit = new OrbitControls(camera, renderer.domElement);

//Light
const ambientLight = new THREE.AmbientLight(0xffffff, 4);
scene.add(ambientLight);

const modelPaths = [
    { path: '../assets/chicken.glb', type: "chicken" },
    { path: '../assets/grass.glb', type: "grass" },
    { path: '../assets/tree0.glb', type: "tree0" },
    { path: '../assets/tree1.glb', type: "tree1" },
    { path: '../assets/tree2.glb', type: "tree2" },
    { path: '../assets/tree3.glb', type: "tree3" },
    { path: '../assets/blank_road.glb', type: "blank_road" },
    { path: '../assets/stripe_road.glb', type: "stripe_road" },
    { path: '../assets/orange_car.glb', type: "orange_car" }
];

loadAllModels(modelPaths)
    .then((models) => {
        playGame(models);
    })
    .catch((error) => {
        console.error('Lỗi khi load model:', error);
    });

const initGame = () => {

}

initGame();

function playGame(models) {
    if (models === null || models === undefined) {
        console.error("models null at main");
    }

    player = new Player("chicken", models, 0, 0, 0);
    scene.add(player.model);

    generateLanes(10, models, scene);
    generateCars(10, models, scene)
    // Get player position after it's initialized
    const playerPosition = player.getPosition();

    // Event listener for keydown
    document.addEventListener('keydown', (event) => {
        if (!event.repeat) {
            player.move(event);
            camera.position.add(player.cameraOffset);

            camera.position.x = Math.max(-10, Math.min(10, camera.position.x));
            camera.position.z = Math.max(-10, Math.min(10, camera.position.z));

            camera.lookAt(player.model.position);
        }
    })
}

orbit.update();

const collisionThreshold = 1; // Defined ngưỡng va chạm

function checkCollisions() {
    for (let i = 0; i < cars.length; i++) {
        const car = cars[i];
        const carPosition = car.model.position;
        const distance = player.model.position.distanceTo(carPosition);
        // Nếu khoảng cách nhỏ hơn ngưỡng va chạm, xem như có va chạm
        if (distance < collisionThreshold) {
            endGame();
            return;
        }
    }

    /*const trees = [tree0, tree1, tree2, tree3];
    for (let i = 0; i < trees.length; i++) {
        const tree = trees[i];
        const treePosition = tree.model.position;
        const distanceToTree = player.model.position.distanceTo(treePosition);
        // Nếu khoảng cách nhỏ hơn ngưỡng va chạm với cây, xem như có va chạm
        if (distanceToTree < collisionThreshold) {
            // Lưu lại vị trí hợp lệ trước đó của người chơi
            player.lastValidPosition.copy(player.model.position);
            // Thiết lập lại vị trí của người chơi để ngăn chúng đi qua cây
            player.setPosition(player.lastValidPosition.x, player.lastValidPosition.y, player.lastValidPosition.z);
            return;
        }
    }*/
}

function endGame() {
    console.log("Game Over");
    player.setPosition(0, 0, 0);
}

function animate() {
    requestAnimationFrame(animate);
    checkCollisions();
    const carArray = Object.values(cars);
    carArray.forEach(car => {
        const carPos = car.model.position; // Fix the access to position property
        car.model.position.set(carPos.x + 0.05, carPos.y, carPos.z); // Fix the setting of position
    });
    renderer.render(scene, camera);
}

animate(cars);