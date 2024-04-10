import { Entity } from './entities/entity.js';

const laneWidth = 10;
let lanes = [];
let cars = []
export function generateRandomPosition(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}
export function createLane(laneType, zPosition, models, scene) {
    const lane = {
        type: laneType,
        direction: generateRandomPosition(0, 1) ? 'left' : 'right',
        entities: [],
    };
    if (laneType === "field") {
        const grass = new Entity("grass", models, 0, -0.4, zPosition);
        scene.add(grass.model);
        lane.entities.push(grass);

        if (zPosition !== 0) {
            const numTrees = generateRandomPosition(1, 3);
            for (let i = 0; i < numTrees; i++) {
                const treeType = `tree${generateRandomPosition(0, 3)}`;
                const treeX = generateRandomPosition(-laneWidth, laneWidth);
                const tree = new Entity(treeType, models, treeX, 0, zPosition);
                scene.add(tree.model);
                lane.entities.push(tree);
            }
        }

    } else if (laneType === 'road') {
        const stripe_road = new Entity("stripe_road", models, 0, -0.4, zPosition);
        scene.add(stripe_road.model);
        lane.entities.push(stripe_road);

        cars = generateCars(models, scene, zPosition)
    } else {
        const railroad = new Entity("railroad", models, 0, -0.4, zPosition);
        scene.add(railroad.model);
        lane.entities.push(railroad);
    }

    return { lane, cars };
}

export function generateLanes(models, scene) {
    let zPosition = 0;
    for (let i = -9; i <= 15; i++) {
        let randomNumber = generateRandomPosition(1, 10)
        const laneType = i <= 0 || i == 1 ? 'field' : randomNumber >= 1 && randomNumber <= 4 ? 'field' : randomNumber >= 5 && randomNumber <= 8 ? 'road' : 'railroad';
        const lane = createLane(laneType, i, models, scene);
        lanes.push(lane.lane);
        zPosition += 1;
    }
    return { lanes, cars }
}
export function generateCars(models, scene, zPosition) {
    const numCars = generateRandomPosition(1, 3);
    for (let i = 0; i < numCars; i++) {
        const carXPosition = generateRandomPosition(-laneWidth / 2 + 1, laneWidth / 2 - 1);
        const carZPosition = zPosition;
        const orange_car = new Entity("police_car", models, carXPosition, -0.2, carZPosition);
        orange_car.model.rotateY(Math.PI / 2);
        cars.push(orange_car);
        scene.add(orange_car.model);
    }
    return cars;
}
