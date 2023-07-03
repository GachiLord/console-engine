import Sprite from "./Sprite"
import GameMap from "./GameMap"


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