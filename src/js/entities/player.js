import { Entity } from "./entity";
import { Vector3 } from "three";
import { generateRandomPosition, createLane } from '../generateMap.js'
const counterDOM = document.getElementById('counter');

export class Player extends Entity {
  constructor(type, models, x, y, z, camera) {
    super(type, models, x, y, z);
    this.camera = camera;
    this.isJumping = false;
    this.duration = 400; // Thời gian mỗi animation
    this.counter = 0
  }

  play(models, scene) {
    const movementDistance = 1;
    let pressedKey = false;

    // Event listener for keydown
    document.addEventListener('keydown', (event) => {
      if (!pressedKey) {
        pressedKey = true;
        setTimeout(() => {
          pressedKey = false;
        }, this.duration)

        let keyCode = event.code;
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
            this.targetZ = this.posZ + deltaZ;
            const laneType = generateRandomPosition(0, 2) === 0 ? 'field' : 'road';
            createLane(laneType, this.targetZ + 15, models, scene)
            this.counter++;
            if (this.counter > this.ScoreNow) {
              this.ScoreNow = this.counter;
            }
            counterDOM.innerText = this.ScoreNow;
            break;
        }

        this.targetX = this.posX + deltaX;
        this.targetZ = this.posZ + deltaZ;

        this.setPosition(this.posX, 0, this.posZ);
        this.model.lookAt(this.targetX, 0, this.targetZ);

        const cameraOffset = new Vector3(deltaX, 0, deltaZ);
        this.camera.position.add(cameraOffset);
        this.camera.position.x = Math.max(-10, Math.min(10, this.camera.position.x));
        this.camera.position.z = Math.max(-10, Math.min(10, this.camera.position.z));
        this.camera.lookAt(this.model.position);

        // const cameraOffset = new Vector3(deltaX, 0, deltaZ);
        // this.camera.position.add(cameraOffset);
        // this.camera.position.x = Math.max(-laneWidth * lanes.length / 2, Math.min(laneWidth * lanes.length / 2, this.camera.position.x));
        // this.camera.position.z = Math.max(-lanes.length * 2, Math.min(lanes.length * 2, this.camera.position.z));

        // this.camera.lookAt(this.model.position);
      }
    })
  }

  jump() {
    if (!this.isJumping) {
      this.isJumping = true;
      this.startTime = Date.now();
      this.jumpStartPosY = this.model.position.y;
      this.animate();
    }
  }

  animate() {
    const jumpHeight = 0.75; // Độ cao của nhảy

    const elapsedTime = Date.now() - this.startTime;
    const progress = Math.min(elapsedTime / this.duration, 1); // Ensure jump completes within duration

    const jumpPosition = this.jumpStartPosY + jumpHeight * Math.sin(Math.PI * progress);
    const horizontalPosition = this.posX + (this.targetX - this.posX) * progress;
    const verticalPosition = this.posZ + (this.targetZ - this.posZ) * progress;

    this.model.position.y = jumpPosition;
    this.model.position.x = horizontalPosition;
    this.model.position.z = verticalPosition;

    if (elapsedTime < this.duration) {
      requestAnimationFrame(() => this.animate());
    } else {
      this.isJumping = false;
      // Reset player position to ground level
      this.model.position.y = this.jumpStartPosY;
      this.posX = Math.max(-10, Math.min(10, this.targetX));
      this.posZ = this.targetZ;
    }
  }
}