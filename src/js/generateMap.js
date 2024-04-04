import { Entity } from './entities/entity.js';

const laneWidth = 10;
let lanes = [];
let cars = []
function generateRandomPosition(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}
function createLane(laneType, zPosition, models, scene) {
    const lane = {
        type: laneType,
        entities: [],
    };
    if (laneType === "field") {
        const grassLeft = new Entity("grass", models, -laneWidth / 2, -0.4, zPosition);
        scene.add(grassLeft.model);
        lane.entities.push(grassLeft);

        const grassRight = new Entity("grass", models, laneWidth / 2, -0.4, zPosition);
        scene.add(grassRight.model);
        lane.entities.push(grassRight);

        const numTrees = generateRandomPosition(1, 3);
        for (let i = 0; i < numTrees; i++) {
            const treeType = `tree${generateRandomPosition(0, 3)}`;
            const treeX = generateRandomPosition(-laneWidth / 2 + 0.5, laneWidth / 2 - 0.5);
            const tree = new Entity
                (treeType, models, treeX, 0, zPosition);
            scene.add(tree.model);
            lane.entities.push(tree);
        }
    } else {
        const blank_road = new Entity("blank_road", models, 0, -0.4, zPosition);
        scene.add(blank_road.model);
        lane.entities.push(blank_road);

        const stripe_road = new Entity("stripe_road", models, 0, -0.4, zPosition + 1);
        scene.add(stripe_road.model);
        lane.entities.push(stripe_road);
    }

    return lane;
}

export function generateLanes(numLanes, models, scene) {
    lanes = [];
    let zPosition = 0;
    for (let i = 0; i < numLanes; i++) {
        const laneType = i === 0 || i == 1 ? 'field' : generateRandomPosition(0, 2) === 0 ? 'field' : 'road';
        const lane = createLane(laneType, zPosition, models, scene);
        lanes.push(lane);
        zPosition += 1;
    }
}
export function generateCars(numCars, models, scene) {
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
