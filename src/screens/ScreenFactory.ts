import { Scene } from "../Assets/Scopes";

export class ScreenFactory {

    protected static scenes = [ "dummy", "normal", "draft" ];

    protected static colors = [ 0xdaf999, 0xfffccc, 0x345abc ];



    public static getRandomScreen(): Scene
    {
        return {
            background: ScreenFactory.pickScene(),
            borders: ScreenFactory.pickScene(),
            color: {
                primary: ScreenFactory.pickColor(),
                highlight: ScreenFactory.pickColor()
            },
            transitions: ScreenFactory.pickScene(),
            layers: [1,2,3,4,5].map( () => {
                return {
                    land: ScreenFactory.pickScene(),
                    agents: ScreenFactory.pickScene(),
                }
            } )
        }
    }

    public static getMonoScene( key: string ): Scene
    {
        return {
            background: key,
            borders: key,
            color: {
                primary: ScreenFactory.pickColor(),
                highlight: ScreenFactory.pickColor()
            },
            transitions: key,
            layers: [1,2,3,4,5].map( () => {
                return {
                    land: key,
                    agents: key,
                }
            } )
        }
    }

    protected static pickColor() {
        return ScreenFactory.colors[ Math.floor( Math.random() * ScreenFactory.colors.length )  ]!;
    }

    protected static pickScene(): string|string[]
    {
        if ( Math.random() > .5 ) {
            return ScreenFactory.pickSingleScene();
        }
        return [ 1,2 ].map( () => {
            return ScreenFactory.pickSingleScene();
        } )
    }

    protected static pickSingleScene() {
        const dice = Math.random() * ScreenFactory.scenes.length;
        for ( let i = 1; i < ScreenFactory.scenes.length; i++ ) {
            if ( dice < i ) {
                return ScreenFactory.scenes[ Math.floor( i ) ];
            }
        }

        return ScreenFactory.scenes[0];
    }

}