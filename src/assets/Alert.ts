import Sprite from "../core/Sprite.js";


export default class Alert extends Sprite{
    text = ''
    buttons: string[] = ['yes', 'no']
    currentIndex: number = 0

    constructor(text: string, buttons: undefined|string[] = undefined, initialIndex: undefined|number = undefined){
        super({x: 0, y: 0}, '', '', false)
        this.text = text
        if (buttons) this.buttons = buttons
        if (initialIndex) this.currentIndex = initialIndex 
    }

    added(){
        let currentIndex: number = this.currentIndex
        this.updateState({sprite: this.#getModal(currentIndex)})
        
        this._sceneEvents.on('keypress', async (_: string, key: any) => {
            if (this.getState().show){
                switch(key.name){
                    case 'w':
                        if (currentIndex - 1 >= 0) currentIndex--
                        break
                    case 's':
                        if (currentIndex + 1 < this.buttons.length) currentIndex++
                        break
                    case 'return':
                        this.currentIndex = currentIndex
                        this.trigger('optionChosen', currentIndex)
                        break
                }
                this.updateState({sprite: this.#getModal(currentIndex)})
            }
        })
    }

    #getModal(activeButtonIndex: number = 0){
        let modal = ''

        modal += this.text
        this.buttons.forEach( (item, index) => {
            if (activeButtonIndex === index) modal += `\n=> ${item}`
            else modal += `\n${item}`
        })


        return modal
    }

    async fire(){
        this.show()
        const choice = new Promise( r => {
            this.once('optionChosen', () => {
                r(this.currentIndex)
                this.hide()
            })
        } )

        return await choice
    }

}