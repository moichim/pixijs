import { Bundle, borders } from "./Bundle";


/** Borders selected for the current scene */
export type BorderSelection = {
    [A in typeof borders[number]]?: string
}

/** Transitions selected for the current scene */
export type TransitionSelection = {
    [index:string]: string
}

export class Borders {

    selection: {
        borders: BorderSelection,
        transitions: TransitionSelection
    } = {
        borders: {},
        transitions: {}
    };

    transitionElements: HTMLDivElement[] = [];
    borderElements: Map<typeof borders[number], HTMLDivElement> = new Map;

    borderPositions: {
        [P in typeof borders[number]]: string
    } = {
        border_bottom: "center bottom",
        border_left: "left center",
        border_right: "right center",
        border_top: "center top"
    }

    transitionPositions = {
        close: {
            "transition_0": "0px 0px",
            "transition_1": "-1200px 0px",
            "transition_2": "0px -800px",
            "transition_3": "-1200px -800px",
        },
        open: {
            "transition_0": "-600px -400px",
            "transition_1": "-600px -400px",
            "transition_2": "-600px -400px",
            "transition_3": "-600px -400px",
        }
    }

    constructor() { }

    public init() {

        // Initialise all border elements
        borders.forEach( border => this.prepareBorderElement( border ) );

        // Initialise all transition elements
        for ( let i = 0; i < 4; i++ ) {
            this.prepareTransitionElement( i );
        }

        this.setBorderProperties();

        // Initialise base properties
        // if ( this.borderElements.get( "border_bottom" )?.style.transition == "" ) 
            this.setinitialProperties();

    }

    /** Append images to the masks */
    public appendImages() {

        // Append images to borders
        Object.keys( this.selection.borders ).map( key => {

            let element = this.borderElements.get( key as typeof borders[number] )!;

            const image = this.selection.borders[key as typeof borders[number] ];

            const url = `url(${image})`;

            element.style.maskImage = url;
            element.style.webkitMaskImage = url;

        } );

        // Append images to transitions
        this.transitionElements.forEach( element => {

            const availableScopes = Object.entries( this.selection.transitions );
            const selectedScope = availableScopes[ Math.floor( Math.random() * availableScopes.length ) ];

            const image = this.selection.transitions[ selectedScope[0] ];

            const cssValue = `url(${image})`;
            element.style.maskImage = cssValue;
            element.style.webkitMaskImage = cssValue;

        } );

    }

    public setinitialProperties() {
        this.setClosedProperties();
        this.setBorderProperties();
    }

    public setBorderProperties() {

        Object.keys( this.selection.borders ).map( key => {

            let element = this.borderElements.get( key as typeof borders[number] )!;

            const cssValue = this.borderPositions[key as typeof borders[number]];
            element.style.maskPosition = cssValue;
            element.style.webkitMaskPosition = cssValue;
            element.style.position = "relative";

        } );
    }

    public setClosedProperties() {

        Object.values( this.transitionElements ).forEach( ( element, index ) => {

            const cssValue = this.transitionPositions["close"][`transition_${index}` as keyof ThisParameterType<"transitionPositions"> ];
            element.style.maskPosition = cssValue;
            element.style.webkitMaskPosition = cssValue;
            element.style.position = "relative";

        } );

    }

    public setOpenProperties() {
        Object.values( this.transitionElements ).forEach( ( element, index ) => {

            const cssValue = this.transitionPositions["open"][`transition_${index}` as keyof ThisParameterType<"transitionPositions"> ];
            element.style.maskPosition = cssValue;
            element.style.webkitMaskPosition = cssValue;
            element.style.position = "relative";

        } );
    }


    public addTransition( result: ReturnType<Bundle["registerRequest"]> ) {
        this.selection.transitions[ result.scope ] = result.file;
    }

    public addBorder( result: ReturnType<Bundle["registerRequest"]> ) {
        this.selection.borders[ result.usage as typeof borders[number] ] = result.file;
    }


    protected prepareBorderElement(
        key: typeof borders[number]
    ) {
        const element = document.getElementById( key ) as HTMLDivElement;
        if ( element.style.maskRepeat == "" )
            element.style.maskRepeat = "no-repeat";
        if ( element.style.transition == "" ) 
            element.style.transition = "all 2s ease-in-out";
        this.borderElements.set( key, element );
    }

    protected prepareTransitionElement(
        index: number
    ) {
        const element = document.getElementById( `transition_${index}` ) as HTMLDivElement;
        element.style.maskRepeat = "no-repeat";
        element.style.transition = "all 2s ease-in-out";
        this.transitionElements.push( element )
    }

    


}