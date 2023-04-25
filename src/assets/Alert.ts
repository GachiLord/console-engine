import Sprite from "../core/Sprite.js";


export default class Alert extends Sprite{
    text = ''
    buttons: string[] = ['yes', 'no']
    currentIndex: number = 0

    constructor(text: string, buttons: undefined|string[] = undefined, initialIndex: undefined|number = undefined){
        super({x: 0, y: 0}, '', undefined, false)
        this.text = text
        if (buttons) this.buttons = buttons
        if (initialIndex) this.currentIndex = initialIndex 
    }

    added(){
        let currentIndex: number = this.currentIndex
        this.updateState({sprite: this.#getModal(currentIndex)})
        
        this._sceneEvents.on('keypress', async (key: string) => {
            if (this.getState().show){
                switch(key){
                    case 'w':
                        if (currentIndex - 1 >= 0) currentIndex--
                        break
                    case 's':
                        if (currentIndex + 1 < this.buttons.length) currentIndex++
                        break
                    case ' ':
                        this.currentIndex = currentIndex
                        this.trigger('optionChosen', currentIndex)
                        break
                }
                this.updateState({sprite: this.#getModal(currentIndex)})
            }
        })
    }

    #getModal(activeButtonIndex: number = 0){
        const size = this._scene.getResolution()
        let modal = ''

        modal += this.text + '\n'
        this.buttons.forEach( (item, index) => {
            if (activeButtonIndex === index) modal += `=> ${item}\n`
            else modal += `${item}\n`
        })

        let view = modal.split('\n').map( item => {
            const deltaWidth = size.width - item.length 
            if (deltaWidth > 0) return item += ' '.repeat(deltaWidth)
            else return item
        } )
        const deltaHeight = size.height - view.length
        if (deltaHeight > 0) {
            const blankLines = Array(deltaHeight).fill(' '.repeat(size.width))
            view = view.concat(blankLines)
        }

        return view.join('\n')
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

    fireSync(){
        this.show()
        let currentIndex: number = this.currentIndex
        this.updateStateSync({sprite: this.#getModal(currentIndex)})

        while(true){
            const key = this._scene.getPressedKey()
            
            if(key === 'w'){
                if (currentIndex - 1 >= 0) currentIndex--
            }
            else if(key === 's'){
                if (currentIndex + 1 < this.buttons.length) currentIndex++
            }
            else if(key === ' '){            
                this.currentIndex = currentIndex
                break
            }
            this.updateStateSync({sprite: this.#getModal(currentIndex)})
        }

        this.hide()

        return currentIndex
    }

}