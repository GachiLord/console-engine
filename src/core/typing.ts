import Sprite from "./Sprite"


export type Style = undefined|string|Array<Array<string>>
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

export interface IMap{
    getMap():View,
    setView(view: string):void,
    setOrigin(originSprite: Sprite):void
}

