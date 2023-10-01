import { GameObject } from "./GameObject";

export class ContainerGameObject extends GameObject {

    public static atCenter(): ContainerGameObject
    {
        const item = new ContainerGameObject;
        item.pivot.set( .5 );
        item.x = 0;
        item.y = 0;
        return item;
    }

}