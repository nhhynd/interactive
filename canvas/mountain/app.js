import {Hill} from './hill.js';
import {Sun} from './Sun.js';
import {WalkController} from './walkController.js';

class App {
  constructor() {
    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext('2d');
    this.pixelRatio = window.devicePixelRatio > 1 ? 2 : 1;

    document.body.appendChild(this.canvas);

    this.hills = [
        new Hill('#ff7200', 0.2, 12),
        new Hill('#ff9c00', 0.5, 8),
        new Hill('#ffcd00', 1.4, 6),
    ];
    this.sun = new Sun();

    this.walkController = new WalkController();

    window.addEventListener('resize', this.resize.bind(this), false);

    this.resize();
    this.animate();
  }

  resize() {
    this.stageWidth = document.body.clientWidth;
    this.stageHeight = document.body.clientHeight;

    this.canvas.width = this.stageWidth * this.pixelRatio;
    this.canvas.height = this.stageHeight * this.pixelRatio;
    this.ctx.scale(this.pixelRatio, this.pixelRatio);

    for (let i = 0; i < this.hills.length; i++) {
      this.hills[i].resize(this.stageWidth, this.stageHeight);
    }

    this.walkController.resize(this.stageWidth, this.stageHeight);
    this.sun.resize(this.stageWidth, this.stageHeight);
  }

  animate(t) {
    window.requestAnimationFrame(this.animate.bind(this));

    this.ctx.clearRect(0, 0, this.stageWidth, this.stageHeight);

    this.sun.draw(this.ctx, t);

    let dots;
    for (let i = 0; i < this.hills.length; i++) {
      dots = this.hills[i].draw(this.ctx);
    }

    this.walkController.draw(this.ctx, t, dots);
  }
}

window.addEventListener('load', () => {
  new App();
}, false);