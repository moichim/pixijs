export type SelectableScope = string|string[];
export type Colors = "highlight"|"primary";

export type Layer = {
    land: SelectableScope,
    agents: SelectableScope
}

export type Scene = {
    borders: SelectableScope,
    transitions: SelectableScope,
    background: SelectableScope,
    layers: Layer[],
    color: {
        [C in Colors ]: number
    }
}