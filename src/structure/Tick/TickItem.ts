import { Container } from "pixi.js"

export interface TickItem {
    key: string,
    object: Container,
    register: () => void,
    unregister: () => void,
    update: () => void,
    start: () => void,
    stop: () => void,
    pause: () => void,
    resume: () => void
}