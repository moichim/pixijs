import { Rectangle } from "pixi.js";
import { ManifestOverride, ManifestType, buildDefaultManifest } from "./Manifest/Builders";
import { Agents, Bundles, Layers } from "./Manifest/Declarations";

import merge from "ts-deepmerge";

const defaultManifest = buildDefaultManifest();

const overrides: ManifestOverride = {
    bundles: {
        [Bundles.dummy]: {
            layers: {
                [Layers.one]: {
                    shift: { x: -100 }
                },
                [Layers.two]: {
                    shift: { y: -1000 }
                }
            },
            agents: {
                [Agents.one]: {
                    clip: new Rectangle( 0, 0, 100,100 )
                }
            },
            index: {}
        }
    }
}


export const getBundleFilesManifest = (
    man: ManifestType,
    bundle: Bundles
) => {

    // console.log( Object.values( man.bundles[ bundle ] ) );

    if ( man.bundles )
        return Object.values( man.bundles[ bundle ] )
            .filter( b => Object.values(b).length > 0 )
            .reduce( ( status, current ) => {
                return {...status, ...current}
            }, {} );
    return {}
}



const mergeManifests = ( base: ManifestType, overrides: ManifestOverride ) => {

    const merged = merge(base, overrides) as ManifestType;

    Object.keys( merged.bundles ).forEach( b => {
        const bundle = merged.bundles[ b as Bundles ]!;
        bundle.index = getBundleFilesManifest( merged,  b as Bundles )
    } );

    return merged;

}

export const manifest = mergeManifests( defaultManifest, overrides ) as ManifestType;


