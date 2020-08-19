import {Apeach} from './apeach.js';

export class WalkController {
    constructor() {
        this.img = new Image();
        this.img.onload = () => {
            this.loaded();
        }
        this.img.src = 'apeach_walk.png';

        this.items = [];

        this.cur = 0;
        this.isLoaded = false;
    }

    resize(stageWidth, stageHeight) {
        this.stageWidth = stageWidth;
        this.stageHeight = stageHeight;
    }

    loaded() {
        this.isLoaded = true;
        this.addApeach();

    }

    addApeach() {
        this.items.push(
            new Apeach(this.img, this.stageWidth)
        );
    }

    draw(ctx, t, dots) {
        if (this.isLoaded) {
            this.cur += 1;
            if (this.cur > 200) {
                this.cur = 0;
                this.addApeach();
            }

            for (let i = this.items.length - 1; i >= 0; i--) {
                const item = this.items[i];

                if (item.x < -item.width) {
                    this.items.splice(i, 1);
                } else {
                    item.draw(ctx, t, dots);
                }
            }
        }
    }
}