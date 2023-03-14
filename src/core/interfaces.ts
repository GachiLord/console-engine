import Sprite from "./Sprite"


export interface Coor{
    x: number,
    y: number
}

export interface SpriteState{
    show: boolean,
    coor: Coor,
    sprite: string
}

export interface Map{
    getMap():Array<Array<string>>,
    setView(view: string):void,
    setOrigin(originSprite: Sprite):void
}
