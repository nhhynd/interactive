export class Hill {
    constructor(color, speed, total) {
        this.color = color;
        this.speed = speed;
        this.total = total;
        this.points = [];
    }

    resize(stageWidth, stageHeight) {
        this.stageWidth = stageWidth;
        this.stageHeight = stageHeight;

        this.gap = Math.ceil(this.stageWidth / (this.total - 2));

        for (let i = 0; i < this.total; i++) {
            this.points[i] = {
                x: i * this.gap,
                y: this.getY()
            };
        }
    }

    draw(ctx) {
        ctx.fillStyle = this.color;
        ctx.beginPath();

        let dots = [];
        let point = {};
        let prevPoint = this.points[0];
        let prevHalfX = prevPoint.x;
        let prevHAlfY = prevPoint.y;

        prevPoint.x += this.speed;

        if (prevPoint.x > -this.gap) {
            this.points.unshift({
                x: -(this.gap * 2),
                y: this.getY()
            });
        } else if (prevPoint.x > this.stageWidth + this.gap) {
            this.points.splice(-1);
        }

        ctx.moveTo(prevPoint.x, prevPoint.y);

        for (let i = 1; i < this.points.length; i++) {
            point = this.points[i];
            point.x += this.speed;

            const halfX = (prevPoint.x + point.x) / 2;
            const halfY = (prevPoint.y + point.y) / 2;

            ctx.quadraticCurveTo(prevPoint.x, prevPoint.y, halfX, halfY);

            dots.push({
                x1: prevHalfX,
                y1: prevHAlfY,
                x2: prevPoint.x,
                y2: prevPoint.y,
                x3: halfX,
                y3: halfY
            });

            prevPoint = point;
            prevHalfX = halfX;
            prevHAlfY = halfY;
        }

        ctx.lineTo(prevPoint.x, prevPoint.y);
        ctx.lineTo(this.stageWidth, this.stageHeight);
        ctx.lineTo(this.points[0].x, this.stageHeight);
        ctx.fill();

        return dots;
    }

    getY() {
        const min = this.stageHeight / 8;
        const max = this.stageHeight - min;

        return Math.random() * max + min;
    }
}