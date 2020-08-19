import {Polygon} from "./polygon.js";
import {ranNum} from "./utils.js";

class App {
  constructor() {
    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext('2d');
    this.pixelRatio = window.devicePixelRatio > 1 ? 2 : 1;
    this.isDown = false;
    this.moveX = 0;
    this.offsetX = 0;
    this.count = 10;
    this.polygons = [];

    document.body.appendChild(this.canvas);

    window.addEventListener('resize', this.resize.bind(this), false);
    window.addEventListener('pointerdown', this.onDown.bind(this), false);
    window.addEventListener('pointermove', this.onMove.bind(this), false);
    window.addEventListener('pointerup', this.onUp.bind(this), false);

    this.resize();
    this.animate();
  }

  resize() {
    this.stageWidth = document.body.clientWidth;
    this.stageHeight = document.body.clientHeight;

    this.canvas.width = this.stageWidth * this.pixelRatio;
    this.canvas.height = this.stageHeight * this.pixelRatio;
    this.ctx.scale(this.pixelRatio, this.pixelRatio);

    const x = this.stageWidth / 2;
    const y = this.stageHeight  + (this.stageHeight / 4);
    const radius = this.stageHeight / 1.5;

    this.polygon = new Polygon(x, y, radius, 15);
  }

  animate() {
    window.requestAnimationFrame(this.animate.bind(this));

    this.ctx.clearRect(0, 0, this.stageWidth, this.stageHeight);

    this.moveX *= 0.92;

      this.polygon.animate(this.ctx, this.moveX);
  }

  onDown(e) {
    this.isDown = true;
    this.moveX = 0;
    this.offsetX = e.clientX;
  }

  onMove(e) {
    if (this.isDown) {
      this.moveX = e.clientX - this.offsetX;
      this.offsetX = e.clientX;
    }
  }

  onUp(e) {
    this.isDown = false;

  }
}

window.addEventListener('load', () => {
  new App();
}, false);