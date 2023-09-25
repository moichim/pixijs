import { Container } from "pixi.js";
import { Parallaxes } from "../../elements/parallax/parallaxes";
import { Parallax } from "../../elements/parallax/parallax";

export class Quest {

    public numbers: Container[] = [];

    constructor(
        public question: string,
        public validate: ( number: number ) => boolean,
        public generateCorrect: () => number[],
        public generateFalse: () => number[]
    ) {}

    protected addNumber( 
        number: number,
        parallax: Parallax
    ) {

    }

    public mount( parallax: Parallaxes ) {

    }

    public unmount( parallax: Parallaxes ) {

    }

}