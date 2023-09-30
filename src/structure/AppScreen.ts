import * as PIXI from "pixi.js";


export interface AppScreen extends PIXI.Container {

    assets: {
        [index: string]: PIXI.Texture<PIXI.Resource>;
    };

    container: PIXI.Container;

    show?(): Promise<void>;

    hide?(): Promise<void>;

    pause?(): Promise<void>;

    resume?(): Promise<void>;

    prepare?(): Promise<void>;

    reset?(): Promise<void>;

    update?(delta: number): void;

    resize?(width: number, height: number): void;

    blur?(): void;

    focus?(): void;

}
