import Sprite from "../core/Sprite.js";


export default class MsgBox extends Sprite{
    text = ''
    buttons: string[] = ['yes', 'no']

    constructor(text: string, buttons: undefined|string[] = undefined){
        super({x: 0, y: 0}, '', '', false)
        this.text = text
        if (buttons) this.buttons = buttons
    }

    added(){
        let currentIndex: number = 0
        
        this._sceneEvents.on('keypress', async (key: string) => {
            if (this.getState().show){
                switch(key){
                    case 'w':
                        if (currentIndex - 1 >= 0) currentIndex--
                        break
                    case 's':
                        if (currentIndex + 1 < this.buttons.length) currentIndex++
                        break
                }
                this.updateState({sprite: this.getModal(currentIndex)})
            }
        })
    }

    getModal(activeButtonIndex: number = 0){
        let modal = ''
        //let style: Style = Array(this.text.split('\n').length).fill('')

        modal += this.text
        this.buttons.forEach( (item, index) => {
            if (activeButtonIndex === index) modal += `\n=> ${item}` 
            else modal += `\n${item}`
        })


        return modal
    }

    fire(){
        this.show()
    }

}