import Sprite from "./Sprite"


export interface Coor{
    x: number,
    y: number
}

export type Style = undefined|string|Array<Array<string>>

export type View = Array<Array<string>>
export interface SpriteState{
    show: boolean,
    coor: Coor,
    sprite: string,
    style: Style
}

export interface Map{
    getMap():View,
    setView(view: string):void,
    setOrigin(originSprite: Sprite):void
}

