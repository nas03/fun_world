import { Vector3 } from 'three';
import { Car } from './entities/car.js';
import { Entity } from './entities/entity.js';

const laneWidth = 11;
let lanes = [];
let cars = []
export function generateRandomPosition(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}
export function createLane(laneType, direction, zPosition, models, scene) {
    let lane = {
        type: laneType,
        direction: direction,
        zPosition: zPosition,
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

        let car_entities = generateCars(models, scene, zPosition, direction);
        lane.entities.push(car_entities)
    } else {
        const railroad = new Entity("railroad", models, 0, -0.4, zPosition);
        scene.add(railroad.model);
    }
    console.log(lanes, cars)
    return { lane, cars };
}

export function generateLanes(models, scene) {
    let zPosition = 0;
    for (let i = -9; i <= 13; i++) {
        let randomNumber = generateRandomPosition(1, 10)
        const laneType = i <= 0 || i == 1 ? 'field' : randomNumber >= 1 && randomNumber <= 4 ? 'field' : randomNumber >= 5 && randomNumber <= 8 ? 'road' : 'railroad';
        const direction = Math.random() < 0.5 ? 'left' : 'right';

        const lane = createLane(laneType, direction, i, models, scene);
        lanes.push(lane.lane);
        zPosition += 1;
    }
    return { lanes, cars }
}
export function generateCars(models, scene, zPosition, direction) {
    // const numCars = generateRandomPosition(1, 3);
    // for (let i = 0; i < numCars; i++) {
    const carXPosition = direction === "left" ? laneWidth : -laneWidth;
    const carZPosition = zPosition;
    const vehicle = new Car(
        models,
        getCarType(generateRandomPosition(1, 10)),
        carXPosition, -0.2, carZPosition, direction
    );
    vehicle.model.rotateY(direction === "left" ? -Math.PI / 2 : Math.PI / 2);
    cars.push(vehicle);
    scene.add(vehicle.model);
    // }
    return vehicle;
}
function getCarType(randomNumber) {
    switch (randomNumber) {
        case 1:
        case 2:
            return 'orange_car';
        case 3:
        case 4:
            return 'blue_truck';
        case 5:
        case 6:
            return 'blue_car';
        case 7:
        case 8:
            return 'green_car';
        default:
            return 'police_car';
    }
}
export function deleteLane(scene) {
    if (lanes.length !== -1) {
        const laneToDelete = lanes[lanes.length - 1];
        console.log(laneToDelete)
        for (const entity of laneToDelete.entities) {
            scene.remove(entity.model);
        }

        // Remove the lane from the lanes array
        lanes.splice(lanes.length, 1);

    } else {
        console.warn(`Lane at zPosition not found.`);
    }
}
export function animateVehicle() {
    const carArray = Object.values(cars);
    carArray.forEach((car) => {
        const carPos = car.model.position;
        const direction = car.direction === "left" ? -1 : 1;
        const temp = (carPos.x + 0.05 * direction);
        if (Math.round(temp) == laneWidth * direction) {
            car.direction = (direction == -1 ? "right" : "left");
            car.model.rotateY(Math.PI);
        }

        car.model.position.set(temp, carPos.y, carPos.z);
    });
}