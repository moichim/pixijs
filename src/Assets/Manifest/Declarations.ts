export enum Bundles {
    draft = "draft",
    dummy = "dummy",
    normal = "normal",
    paper = "paper"
}

export type AvailableScenes = keyof Bundles;

export enum Layers {
    one = "layer_1",
    two = "layer_2",
    three = "layer_3",
    four = "layer_4",
    five = "layer_5"
}

export const layers: [
    Layers.one,
    Layers.two,
    Layers.three,
    Layers.four,
    Layers.five
] = [
    Layers.one,
    Layers.two,
    Layers.three,
    Layers.four,
    Layers.five
]

export enum Agents {
    one = "agent_1_small",
    two = "agent_2_small",
    three = "agent_2_small",
    four = "agent_1_big",
    five = "agent_2_big",
    six = "agent_3_big",
}

export const agents: [
    Agents.one,
    Agents.two,
    Agents.three,
    Agents.four,
    Agents.five,
    Agents.six
] = [ 
    Agents.one,
    Agents.two,
    Agents.three,
    Agents.four,
    Agents.five,
    Agents.six
];


export const roles = [
    ...agents,
    ...layers
]