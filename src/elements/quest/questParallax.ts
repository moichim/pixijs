import { Container, Resource, Texture } from "pixi.js";
import { SpriteParallax } from "../parallax/parallaxes/spriteParallax";
import { Agent } from "./agent";
import { Parallaxes } from "../parallax/parallaxes";

export class QuestParallax extends SpriteParallax {

    public members: Agent[] = [];

    protected occupied: number[] = [];

    declare parent: Parallaxes;

    protected agents = new Container();

    public constructor(
        public readonly image: Texture<Resource>,
        public readonly slots: number[],
        public readonly assets: {
            [index:string]: Texture<Resource>
        }
    ) {
        super( image );
        
    }

    public addNumber( number: number ) {

        const free = this.pickFreeSlot();

        if ( free === false ) {
            throw new Error;
        }

        const agent = new Agent( number, this.assets.bird );
        agent.pivot.set( .5 );

        agent.mount();
        agent.start();

        this.agents.addChild( agent );
        

    }

    public stopAnimations() {
        this.members.map( item => item.stopAnimations() );
    }

    public pauseAnimations() {
        this.members.map( item => item.pauseAnimations() );
    }

    public resumeAnimations() {
        this.members.map( item => item.resumeAnimations() );
    }

    protected pickFreeSlot() {

        const free = this.slots
            .filter( item => ! this.occupied.includes( item ) )
            .sort( (a,b) => Math.random() - 0.5 );

        if ( free.length === 0 ) 
            return false;

        return free;

    }

    public mount() {

        this.agents.pivot.set( .5 );

        this.content.addChild( this.agents );

        super.mount();
    }

}