import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'; // Add '.js' extension
import { loadAllModels } from './loadModelFromDish.js';
import { Entity } from './entities/entity.js';
import { Player } from './entities/player.js';

const counterDOM = document.getElementById('counter');
let lanes;
let currentLane;
let currentColumn;

let previousTimestamp;
let startMoving;
let moves;
let stepStartTimestamp;

// camera trong game
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(-4.61, 5, -5);

const renderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: true
});
renderer.setClearColor(0xcccccc);
renderer.shadowMap.enabled = true
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const orbit = new OrbitControls(camera, renderer.domElement);

const axesHelper = new THREE.AxesHelper();
scene.add(axesHelper);

const ambientLight = new THREE.AmbientLight(0xffffff, 3);
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
        console.log('Các model đã được load:', models);
        // Thực hiện các thao tác khác với các model đã load ở đây
        playGame(models);
    })
    .catch((error) => {
        console.error('Lỗi khi load model:', error);
    });

const cars = [];
var player;
let roadLength = 20;
let laneWidth = 2;
function generateRandomPosition(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

function createLane(laneType, zPosition, models) {
    const lane = {
        type: laneType,
        entities: [],
    };
    // Place grass on either side of the lane
    const grassLeft = new Entity("grass", models, -laneWidth / 2, -0.4, zPosition);
    scene.add(grassLeft.model);
    lane.entities.push(grassLeft);

    const grassRight = new Entity("grass", models, laneWidth / 2, -0.4, zPosition);
    scene.add(grassRight.model);
    lane.entities.push(grassRight);

    // Place road in the center
    const roadSegment = new Entity(laneType === 'field' ? "blank_road" : "stripe_road", models, 0, -0.4, zPosition);
    scene.add(roadSegment.model);
    lane.entities.push(roadSegment);

    // Place trees randomly on the sides (optional)
    /*
    const numTrees = generateRandomPosition(1, 3); // Adjust number of trees per lane
    for (let i = 0; i < numTrees; i++) {
      const treeType = `tree${generateRandomPosition(0, 3)}`; // Select random tree model
      const treeX = generateRandomPosition(-laneWidth / 2 + 0.5, laneWidth / 2 - 0.5);
      const tree = new Entity
      (treeType, models, treeX, -0.4, zPosition);
      scene.add(tree.model);
      lane.entities.push(tree);
    }
    */

    return lane;
}

function generateLanes(numLanes,models) {
    lanes = [];
    let zPosition = 0;
    for (let i = 0; i < numLanes; i++) {
        const laneType = i === 0 ? 'field' : generateRandomPosition(0, 2) === 0 ? 'field' : 'road';
        const lane = createLane(laneType, zPosition, models);
        lanes.push(lane);
        zPosition += 1;
    }
}

function generateCars(numCars, models) {
    for (let i = 0; i < numCars; i++) {
        const laneIndex = generateRandomPosition(0, lanes.length - 1);
        const carZPosition = lanes[laneIndex].zPosition - 0.5;
        const carXPosition = generateRandomPosition(-laneWidth / 2 + 0.5, laneWidth / 2 - 0.5);
        const orange_car = new Entity("orange_car", models, carXPosition, 0.2, carZPosition);
        orange_car.model.rotateY(Math.PI / 2);
        cars.push(orange_car);
        scene.add(orange_car.model);
    }
}
function playGame(models) {
    if (models === null || models === undefined) {
        console.error("models null at main");
    }

    player = new Player("chicken", models, 0, 0, 0);
    scene.add(player.model);

    generateLanes(100, models); 
    generateCars(10, models);

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