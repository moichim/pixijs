export type SelectableScope = string|string[];
export type AvailableColors = "highlight"|"primary";

export type Layer = {
    land: SelectableScope,
    agents: SelectableScope
}

export type Colors = {
    [C in AvailableColors]: number;
};

export type Scene = {
    borders: SelectableScope,
    transitions: SelectableScope,
    background: SelectableScope,
    layers: Layer[],
    color: Colors
}