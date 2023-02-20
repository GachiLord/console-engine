import Engine from "./Engine.js"
import sceneEvents from "./events/sceneEvents.js"
import Sprite from "./Sprite.js"

export default class Scene{
    #layers = []
    #engine
    _resolution
    #renderHandler
    /**
     * A function that is called when a new instance of the class is created.
     * 
     * @constructor
     * @name Scene
     */
    constructor(resolution = {width: 50, height: 10}, renderHandler){
        this.#engine = new Engine()
        this._resolution = resolution
        this.#renderHandler = renderHandler

        sceneEvents.on('update', () => {
            this.#handleUpdate()
        })
        sceneEvents.on('distruct', () => {
            // remove scene
        })
    }

    /**
     * Creating a blank window and then adding the sprites to it.
     * 
     */
    #compose(){
        let view = []
        let width = this._resolution.width
        let height = this._resolution.height
        // create blank win
        for (let i = height; i > 0; i--) view.push([])
        view.forEach( item => {
            for (let j = 0; j < width; j++) item.push({char: ' ', owners: new Set() })
        } )
        // helpers
        const getCharByCoors = (coors) => {
            if (view[coors.y]) {
                if (view[coors.y][coors.x]) {
                    return view[coors.y][coors.x]
                }
            }
            return
        }
        const setCharByCoors = (coors, char, owners) => {
            view[coors.y][coors.x] = {char: char, owners: new Set(owners)}
        }
        const addOwnerByCoors = (coors, owner) => {
            view[coors.y][coors.x].owners.add(owner)
        }
        const setLocality = (coors, owner) => {
            // const char = getCharByCoors(coors)
            let localCharCoors = {x: coors.x, y: coors.y + 1}
            let localChar = getCharByCoors(localCharCoors)

            // helper
            const emitOrAdd = () => {
                if (localChar){
                    if (localChar.owners.size > 0 && !localChar.owners.has(owner) && localChar.char !== ' ') {
                        owner.trigger('collision', 
                        {
                            target: owner,
                            sprites: new Array(...localChar.owners)
                        }
                        )
                    }
                    // if (localChar.char === ' ') addOwnerByCoors(localCharCoors, owner)
                }
            }
            emitOrAdd()

            localCharCoors = {x: coors.x, y: coors.y - 1}
            localChar = getCharByCoors(localCharCoors)
            emitOrAdd()

            localCharCoors = {x: coors.x + 1, y: coors.y}
            localChar = getCharByCoors(localCharCoors)
            emitOrAdd()

            localCharCoors = {x: coors.x - 1, y: coors.y}
            localChar = getCharByCoors(localCharCoors)
            emitOrAdd()
        }
        // add sprites
        this.#layers.reverse().forEach( layer => {
            layer.forEach( item => {
                if (!item.getState().show) return
                let coor = item.getState().coor
                let sprite = item.getState().sprite
                // add sprite
                const lines = sprite.split('\n')
                lines.forEach( (line, y) => {
                    line.split('').forEach((char, x) => {
                        // add char if there is a place
                        const charCoors = {x: coor.x + x, y: coor.y + y}
                        // check touching
                        setLocality(charCoors, item)
                        if (getCharByCoors(charCoors)) setCharByCoors(charCoors, char, [item])
                    })
                } )
            } )
        } )
        // make view a string
        view = view.map( item => {
            return item.map( jtem => {
                return jtem.char
            } ).join('')
        } ).join('\n')

        return view
    }

    /**
     * A private method that is called when the scene is updated.
     * 
     */
    #handleUpdate(){
        if (this.#renderHandler) this.#renderHandler(this.#compose())
        else this.#engine.render(this.#compose())
    }

    /**
     * Emitting an event that is listened to by the scene.
     * 
     * @method
     * @name update
     * @kind method
     * @memberof Scene
     * @returns {void}
     */
    update(){
        sceneEvents.emit('update')
    }

    /**
     * Adding a sprite to the scene.
     * 
     * @method
     * @name add
     * @kind method
     * @memberof Scene
     * @param {Sprite} sprite
     * @param {number} level?
     * @returns {void}
     */
    add(sprite, level = 0){
        if (this.#layers.length <= level) {
            for (let i = level - this.#layers.length + 1; i > 0; i--){
                this.#layers.push([])
            }
        }
        this.#layers[level].push(sprite)
        sprite.setScene(this.#layers)
        this.update()
    }

    /**
     * Removing a sprite from the scene.
     * 
     * @method
     * @name remove
     * @kind method
     * @memberof Scene
     * @param {Sprite} sprite
     * @returns {void}
     */
    remove(sprite){
        this.#layers.forEach( layer => {
            layer.forEach( (item, i) => {
                if (sprite === item) layer.splice(i, 1)
            } )
        } )
    }

    /**
     * Clearing the scene.
     * 
     * @method
     * @name clear
     * @kind method
     * @memberof Scene
     * @returns {void}
     */
    clear(){
        this.#layers = []
        this.update()
    }
}