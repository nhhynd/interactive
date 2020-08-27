import {ranNum} from "./utils.js";

const PI2 = Math.PI * 2;

export class Polygon {
  constructor(x, y, radius, sides) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.sides = sides;
    this.rotate = 0;
    this.colors = [];

    for (let i = 0; i < this.sides; i++) {
      this.colors[i] = `rgba(${ranNum(0, 255)}, ${ranNum(0, 255)}, ${ranNum(0, 255)}, 1)`;
    }
  }

  animate(ctx, moveX) {
    ctx.save();
    const angle = PI2 / this.sides;
    const angle2 = PI2 / 4;

    ctx.translate(this.x, this.y);

    this.rotate += moveX * 0.008;
    ctx.rotate(this.rotate);

    for (let i = 0; i < this.sides; i++) {
      const x = this.radius * Math.cos(angle * i);
      const y = this.radius * Math.sin(angle * i);

      ctx.save();
      ctx.fillStyle = this.colors[i];
      ctx.translate(x, y);
      ctx.rotate(((360 / this.sides) * i + 45) * Math.PI / 180);
      ctx.beginPath();

      for (let j = 0; j < 4; j++)  {
        const x2 = 220 * Math.cos(angle2 * j);
        const y2 = 220 * Math.sin(angle2 * j);
        (j === 0) ? ctx.moveTo(x2, y2) : ctx.lineTo(x2, y2);
      }

      ctx.fill();
      ctx.closePath();
      ctx.restore();
    }

    ctx.restore();
  }
}