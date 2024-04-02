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
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
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

// Load tất cả các model
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
function playGame(models) {
    if (models === null || models === undefined) {
        console.error("models null at main");
    }

    const player = new Player("chicken", models, 0, 0, 0);
    scene.add(player.model);

    const grass = new Entity("grass", models, 0, -0.4, 0);
    scene.add(grass.model);
    const tree0 = new Entity("tree0", models, 2, 0, 0);
    scene.add(tree0.model);
    const tree1 = new Entity("tree1", models, 4, 0, 0);
    scene.add(tree1.model);
    const tree2 = new Entity("tree2", models, -2, 0, 0);
    scene.add(tree2.model);
    const tree3 = new Entity("tree3", models, -4, 0, 0);
    scene.add(tree3.model);
    const blank_road = new Entity("blank_road", models, 0, -0.4, 1);
    scene.add(blank_road.model);
    const stripe_road = new Entity("stripe_road", models, 0, -0.4, 2);
    scene.add(stripe_road.model);

    const orange_car = new Entity("orange_car", models, -10, 0.2, 2);
    orange_car.model.rotateY(Math.PI / 2);
    cars.push(orange_car);
    scene.add(orange_car.model);

    const orange_car1 = new Entity("orange_car", models, -7, 0.2, 1);
    orange_car1.model.rotateY(Math.PI / 2);
    cars.push(orange_car1);
    scene.add(orange_car1.model);

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

function animate() {
    requestAnimationFrame(animate);
    const carArray = Object.values(cars);
    carArray.forEach(car => {
        const carPos = car.model.position; // Fix the access to position property
        car.model.position.set(carPos.x + 0.05, carPos.y, carPos.z); // Fix the setting of position
    });
    renderer.render(scene, camera);
}



animate(cars);