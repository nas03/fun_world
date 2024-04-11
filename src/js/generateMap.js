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

        cars = generateCars(models, scene, zPosition, direction);
        lane.entities.push(cars)
    } else {
        const railroad = new Entity("railroad", models, 0, -0.4, zPosition);
        scene.add(railroad.model);
    }
    console.log(lanes)
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
    const numCars = generateRandomPosition(1, 3);
    for (let i = 0; i < numCars; i++) {
        const carXPosition = direction === "left" ? laneWidth : -laneWidth;
        const carZPosition = zPosition;
        const vehicle = new Entity("police_car", models, carXPosition, -0.2, carZPosition);
        vehicle.model.rotateY(direction === "left" ? -Math.PI / 2 : Math.PI / 2);
        cars.push(vehicle);
        scene.add(vehicle.model);
    }
    return cars;
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
export function animateVehicle(models, scene) {
    for (const lane of lanes) {
        if (lane.type === "road") {
          if (lane.entities.length === 0) {
            lane.entities = generateCars(models, scene, lane.zPosition, lane.direction);
          }
    
          for (const car of lane.entities) {
            console.log(car)
            // const carPos = car[0].model.position;
            const speed = lane.direction === "left" ? -0.05 : 0.05; // Adjust speed based on direction
            car.model.position.set(car.posX + speed, car.posY, car.posZ);
    
            // Check for car going out of bounds (optional)
            if (Math.abs(car.posX) > laneWidth) {
              // Remove car from scene and lane.cars if it goes out of bounds
              scene.remove(car.model);
              lane.entities.splice(lane.cars.indexOf(car), 1);
            }
          }
        }
      }
}