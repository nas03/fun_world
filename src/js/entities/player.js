import { Entity } from "./entity";
import { Vector3 } from "three";

class Player extends Entity {
    cameraOffset;
    #isJumping = false;

    constructor(type, models, x, y, z) {
        super(type, models, x, y, z);
    }

    move(event) {
        let keyCode = event.code;
        const movementDistance = 1;
        let deltaX = 0, deltaZ = 0;
        switch (keyCode) {
            case "ArrowLeft":
                deltaX = +movementDistance; // sang trai
                this.jump();
                break;
            case "ArrowRight":
                deltaX = -movementDistance; //phai
                this.jump();
                break;
            case "ArrowDown":
                deltaZ = -movementDistance; // xuong
                this.jump();
                break;
            case "ArrowUp":
                deltaZ = +movementDistance; // len
                this.jump();
                break;
        }

        // Update player position
        this.posX += deltaX;
        this.posX = Math.max(-10, Math.min(10, this.posX));
        this.posZ += deltaZ;
        this.posZ = Math.max(-10, Math.min(10, this.posZ));

        this.setPosition(this.posX, this.posY, this.posZ);

        this.cameraOffset = new Vector3(deltaX, 0, deltaZ);
    }

    jump() {
        if (!this.isJumping) {
            this.isJumping = true;
            this.jumpStartTime = Date.now();
            this.jumpStartPosY = this.model.position.y;
            this.animateJump();
        }
    }

    animateJump() {
        const jumpHeight = 0.75; // Độ cao của nhảy
        const jumpDuration = 400; // Thời gian của mỗi nhảy (milliseconds)

        const elapsedTime = Date.now() - this.jumpStartTime;
        const jumpProgress = Math.min(elapsedTime / jumpDuration, 1); // Ensure jump completes within duration
    
        const jumpPosY = this.jumpStartPosY + jumpHeight * Math.sin(Math.PI * jumpProgress);
    
        this.model.position.y = jumpPosY;
    
        if (elapsedTime < jumpDuration) {
            requestAnimationFrame(() => this.animateJump());
        } else {
            this.isJumping = false;
            // Reset player position to ground level
            this.model.position.y = this.jumpStartPosY;
        }
    }
}

export { Player }