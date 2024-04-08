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
        const grass = new Entity("grass", models, 0, -0.4, zPosition);
        scene.add(grass.model);
        lane.entities.push(grass);

        const numTrees = generateRandomPosition(1, 3);
        for (let i = 0; i < numTrees; i++) {
            const treeType = `tree${generateRandomPosition(0, 3)}`;
            const treeX = generateRandomPosition(-laneWidth, laneWidth);
            const tree = new Entity
                (treeType, models, treeX, 0, zPosition);
            scene.add(tree.model);
            lane.entities.push(tree);
        }
    } else {
        // const blank_road = new Entity("blank_road", models, 0, -0.4, zPosition);
        // scene.add(blank_road.model);
        // lane.entities.push(blank_road);

        const stripe_road = new Entity("stripe_road", models, 0, -0.4, zPosition );
        scene.add(stripe_road.model);
        lane.entities.push(stripe_road);

        const numCars = generateRandomPosition(1, 3); // Adjust car density as desired
        for (let i = 0; i < numCars; i++) {
          const carXPosition = generateRandomPosition(-laneWidth / 2 + 1, laneWidth / 2 - 1); // Adjust car positioning within lane
          const carZPosition = zPosition - 0.5;
          const orange_car = new Entity("orange_car", models, carXPosition, 0.2, carZPosition);
          orange_car.model.rotateY(Math.PI / 2);
          cars.push(orange_car);
          scene.add(orange_car.model);
        }
    }

    return lane;
}

export function generateLanes(models, scene) {
    lanes = [];
    let zPosition = 0;
    for (let i = -9; i <= 12; i++) {
        const laneType = i <= 0 || i == 1 ? 'field' : generateRandomPosition(0, 2) === 0 ? 'field' : 'road';
        const lane = createLane(laneType, i, models, scene);
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
    return cars;
}
