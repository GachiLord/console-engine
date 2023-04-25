import Sprite from "../core/Sprite";


export default class Prompt extends Sprite{
    text: string = ''
    input: string = ''

    constructor(text: string){
        super({x: 0, y: 0}, undefined, undefined, false)
        this.text = text
    }

    getPrompt(input: string){
        return this.text + input
    }

    added(): void {
        this._scene.on('keypress', (_: string, key: object) => {
            
        })
    }

    fire(){

    }

    fireSync(){

    }
}