import { BundledFile } from "../../Assets/AssetsManager";
import { GameObject } from "../GameObject";
import { Agent } from "./Agent";

export class Spot extends GameObject {

    protected free: boolean = true;

    public constructor(
        public initX: number,
        public initY: number,
        public initRotation: number
    ) {
        super();
        this.x = initX;
        this.y = initY;
        this.rotation = initRotation * (Math.PI / 180.0);

        // this.interactive = false;
        // this.interactiveChildren = false;
    }

    public isFree() { return this.free; }
    public setFree( value: boolean ) { this.free = value; }

    public addAgent( file: BundledFile, colors: any ) {

        const agent = new Agent( file, colors );

        this.free = false;

        this.addGameObject( agent );

    }

}