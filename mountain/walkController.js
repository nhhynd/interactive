import {Walk} from './walk.js';

export class WalkController {
    constructor() {
        this.items = [];
        this.cur = 0;
        this.isLoaded = false;
        this.images = [
            {
                src : 'con_walk.png',
                frame: 13,
                width: 495,
                height: 420,
                padding: 80,
                speed: 1,
                image: new Image()
            },
            {
                src : 'apeach_walk.png',
                frame: 15,
                width: 495,
                height: 420,
                padding: 50,
                speed: 2,
                image: new Image()
            },
            {
                src : 'ryan_walk.png',
                frame: 18,
                width: 495,
                height: 500,
                padding: 70,
                speed: 1.5,
                image: new Image()
            },
        ];

        const imagesCount = this.images.length;
        let loadedImages = 1;

        for(let i = 0; i < imagesCount; i++){
            this.images[i].image.src = this.images[i].src;

            this.images[i].image.onload = () => {
                loadedImages++;

                if(loadedImages == imagesCount){
                    this.loaded();
                }
            }
        }
    }

    resize(stageWidth, stageHeight) {
        this.stageWidth = stageWidth;
        this.stageHeight = stageHeight;
    }

    loaded() {
        this.isLoaded = true;
        this.addWalk();
    }

    addWalk() {
        const random = Math.round(Math.random() * (this.images.length - 1));

        this.items.push(
            new Walk(this.images[random], this.stageWidth)
        );
    }

    draw(ctx, t, dots) {
        if (this.isLoaded) {
            this.cur += 1;
            if (this.cur > 200) {
                this.cur = 0;
                this.addWalk();
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