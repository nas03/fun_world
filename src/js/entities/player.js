import { Entity } from "./entity";
import { Vector3 } from "three";
import * as THREE from 'three';
// import * as TWEEN from '@tweenjs/tween.js';

export class Player extends Entity {
    cameraOffset;
    isJumping = false;

    constructor(type, models, x, y, z) {
        super(type, models, x, y, z);
    }

    move(event, camera) {
        let keyCode = event.code;
        const movementDistance = 1;
        let deltaX = 0, deltaZ = 0;

        switch (keyCode) {
            case "ArrowLeft":
                deltaX = +movementDistance; // sang trai
                this.jump(camera);
                break;
            case "ArrowRight":
                deltaX = -movementDistance; //phai
                this.jump(camera);
                break;
            case "ArrowDown":
                deltaZ = -movementDistance; // xuong
                this.jump(camera);
                break;
            case "ArrowUp":
                deltaZ = +movementDistance; // len
                this.jump(camera);
                break;
        }

        // Update player position
        this.targetX = this.posX + deltaX;
        this.targetZ = this.posZ + deltaZ;

        this.setPosition(this.posX, 0, this.posZ);
        this.model.lookAt(this.targetX, 0, this.targetZ);


        this.cameraOffset = new Vector3(deltaX, 0, deltaZ);
    }



    jump(camera) {
        if (!this.isJumping) {
            this.isJumping = true;
            this.startTime = Date.now();
            this.jumpStartPosY = this.model.position.y;
            this.animate(camera);
        }
    }


    animate(camera) {
        const jumpHeight = 0.75; // Độ cao của nhảy
        const duration = 400; // Thời gian của mỗi nhảy (milliseconds)

        const elapsedTime = Date.now() - this.startTime;
        const progress = Math.min(elapsedTime / duration, 1); // Ensure jump completes within duration

        const jumpPosition = this.jumpStartPosY + jumpHeight * Math.sin(Math.PI * progress);
        const horizontalPosition = this.posX + (this.targetX - this.posX) * progress;
        const verticalPosition = this.posZ + (this.targetZ - this.posZ) * progress;

        this.model.position.y = jumpPosition;
        this.model.position.x = horizontalPosition;
        this.model.position.z = verticalPosition;

        const boundingBox = new THREE.Box3().setFromObject(this.model);
        const center = new THREE.Vector3();
        boundingBox.getCenter(center);


        camera.position.set(center.x + 3, 10, center.z - 6)
        const targetPosition = new THREE.Vector3(center.x, 0, center.z)
        camera.lookAt(targetPosition)

        if (elapsedTime < duration) {
            requestAnimationFrame(() => this.animate(camera));
        } else {
            this.isJumping = false;
            // Reset player position to ground level
            this.model.position.y = this.jumpStartPosY;
            this.posX = Math.max(-10, Math.min(10, this.targetX));
            this.posZ = Math.max(-10, Math.min(10, this.targetZ));
        }
    }
}