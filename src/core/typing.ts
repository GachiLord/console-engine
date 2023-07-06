import Sprite from "./Sprite"
import GameMap from "./GameMap"
import EventEmitter from "node:events"


export type Style = undefined|string|Array<Array<string>>
export type char = { char: string, owner: Sprite|GameMap|undefined, layerIndex?: number }
export type View = Array<Array<string>>
export type Layer = Array<Sprite>

export interface ICoor{
    x: number,
    y: number
}

export interface ISpriteState{
    show: boolean,
    coor: ICoor,
    sprite: string,
    style: Style
}

export interface ISriteAbilities{
    canMove?: boolean,
    canChangeView?: boolean,
}

export interface IMap{
    getMap():View,
    setView(view: string):void,
    setOrigin(originSprite: Sprite):void
}

export interface IUpdateData{
    layerIndex: number
}

// scene events
export type keypressData = { sequence: string, name: string, ctrl: boolean, meta: boolean, shift: boolean }

export interface ISceneEventMap{
    'keypress': (str: string, key: keypressData) => void
    'update': (data: IUpdateData) => void
    'distruct': () => void
}

export interface ISceneEvents{
    on<E extends keyof ISceneEventMap>(type: E, listener: ISceneEventMap[E]): void;
    once<E extends keyof ISceneEventMap>(type: E, listener: ISceneEventMap[E]): void;
    emit<E extends keyof ISceneEventMap>(type: E, ...params: any[]): void; // it seems there is nothing to do with this any :(
}

// sprite events
export interface ISpriteEventMap{
    'added': () => void
    'updated': () => void
    'collision': (e : {
        target: Sprite,
        sprites: Sprite[],
        char: string
    }) => void
}

export interface ISpriteEvents{
    on<E extends keyof ISpriteEventMap>(type: E, listener: ISpriteEventMap[E]): void;
    once<E extends keyof ISpriteEventMap>(type: E, listener: ISpriteEventMap[E]): void;
    emit<E extends keyof ISpriteEventMap>(type: E, ...params: any[]): void; // it seems there is nothing to do with this any :(
}
