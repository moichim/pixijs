import { Polygon, Rectangle, Ellipse } from "pixi.js"
import { Agents, Bundles, Layers } from "./Declarations"

export type LayerSpotMeta = {
    x: number,
    y: number,
    rotation: number
}

export type LayerMeta = {
    shift?: {x?: number, y?: number},
    spots?: LayerSpotMeta[],
    clip?: Polygon|Rectangle|Ellipse
}

type AgentMeta = {
    clip?: Polygon|Rectangle|Ellipse
}

type BundleManifest = {
    layers: {
        [A in Layers]: LayerMeta
    },
    agents: {
        [A in Agents]: AgentMeta
    },
    index: {
        [index:string]: LayerMeta|AgentMeta
    }
}

/** Override the bundle */
export type BundleManifestOverride = {
    layers?: {
        [A in Layers]?: LayerMeta
    },
    agents?: {
        [A in Agents]?: AgentMeta
    },
    index: {
        [index:string]: LayerMeta|AgentMeta
    }
}

export type ManifestType = {
    bundles: {
        [B in Bundles]: BundleManifest
    }
}

/** Override the default manifest */
export type ManifestOverride = {
    bundles: {
        [B in Bundles]?: BundleManifestOverride
    }
}

const buildAgents = () => {

    const result: any = {}

    for ( let a of Object.values( Agents ) ) {
        result[a] = {}
    }

    return result as {[A in Agents]:AgentMeta}

}

const buildLayers = () => {

    const result: any = {}

    for ( let a of Object.values( Layers ) ) {
        result[a] = {}
    }

    return result as {[A in Layers]:LayerMeta}

}

const buildBundle = () => {
    return {
        layers: buildLayers(),
        agents: buildAgents(),
        index: {}
    } as BundleManifest
}

export const buildDefaultManifest = () => {

    const bs: any = {};

    for ( let b of Object.values( Bundles ) ) {
        bs[b] = buildBundle();
    }

    return {
        bundles: bs
    } as ManifestType
}