import {WaveGroup} from './waveGroup.js';

class App {
  constructor() {
    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext('2d');
    this.pixelRatio = window.devicePixelRatio > 1 ? 2 : 1;

    document.body.appendChild(this.canvas);

    this.waveGroup = new WaveGroup();

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

    this.waveGroup.resize(this.stageWidth, this.stageHeight);
  }

  animate() {
    window.requestAnimationFrame(this.animate.bind(this));

    this.ctx.clearRect(0, 0, this.stageWidth, this.stageHeight);

    this.waveGroup.draw(this.ctx);
  }
}

window.addEventListener('load', () => {
  new App();
}, false);