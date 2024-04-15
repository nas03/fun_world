import { Entity } from "./entity";

export class Car extends Entity {

    constructor(models, x, y, z, direction) {
        super("police_car", models, x, y, z);
        this.direction = direction;
    } 
}