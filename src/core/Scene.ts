import Engine from "./Engine.js"
import { EventEmitter } from 'node:events';
import defaultResolution from "../assets/defaultResolution.js";
import { ICoor, Style, Layer } from "./typing.js";
import Sprite from "./Sprite.js";
import GameMap from "./GameMap.js";
import ViewBuilder from "../lib/ViewBuilder.js";
import getStyled from "../lib/getStyled.js";


class SceneEvents extends EventEmitter {}
const sceneEvents = new SceneEvents()

export default class Scene{
    #layers: Array<Layer> = []
    #engine
    #map: GameMap|undefined
    #engineEvents 
    #resolution
    #renderHandler
    /**
     * A function that is called when a new instance of the class is created.
     * 
     * @constructor
     * @name Scene
     */
    constructor(resolution = defaultResolution, renderHandler: Function|undefined = undefined){
        const keypressHandler = (str: string, key: object) => {
          sceneEvents.emit('keypress', str, key)
        }

        this.#engine = new Engine(keypressHandler)
        this.#engineEvents = this.#engine.getEvents()
        this.#resolution = resolution
        this.#renderHandler = renderHandler

        sceneEvents.on('update', () => {
            this.#handleUpdate()
        })
    }

    getPressedKey(){
        return this.#engine.getPressedKey()
    }

    /**
     * Creating a blank window and then adding the sprites to it.
     * 
     */
    #compose(){
        let view: any = []
        let width = this.#resolution.width
        let height = this.#resolution.height
        // create blank win
        for (let i = height; i > 0; i--) view.push([])
        view.forEach( (item: { char: string; owners: Set<Sprite>, layerIndex: undefined|number}[]) => {
            for (let j = 0; j < width; j++) item.push({char: ' ', owners: new Set(), layerIndex: undefined })
        } )
        // helpers
        const getValueByCoors = (container: any, coors: ICoor) => {
            if (container[coors.y]){
                if (container[coors.y][coors.x]){
                    return container[coors.y][coors.x]
                }
            }
            return
        }
        const getCharByCoors = (coors: ICoor) => {
            return getValueByCoors(view, coors)
        }
        const getStyleValue = (style: Style, coors: ICoor):string|undefined => {
            if (typeof style === 'string' || !style ) return style
            else {
                if (style[coors.y]) return style[coors.y][coors.x]
            }
        }
        const setCharByCoors = (coors: ICoor, char: string, style: string|undefined, owners: Array<Sprite>, layerIndex: number) => {
            let charToSet = view[coors.y][coors.x]
            if (charToSet.layerIndex !== 0 || layerIndex === 0) {
                view[coors.y][coors.x] = {char: getStyled(char, style), owners: new Set(owners), layerIndex: layerIndex}
            }
        }
        const setLocality = (coors: ICoor, owner: Sprite) => {
            // const char = getCharByCoors(coors)
            let localCharCoors = {x: coors.x, y: coors.y + 1}
            let localChar = getCharByCoors(localCharCoors)
            
            // helper
            const emitOrAdd = () => {
                if (localChar){
                    if (localChar.owners.size > 0 && !localChar.owners.has(owner) && localChar.char !== ' ' && localChar.layerIndex !== 0) {
                        owner.trigger('collision',
                        {
                            target: owner,
                            sprites: new Array(...localChar.owners),
                            char: localChar.char
                        }
                        )
                    }
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
        // add game map
        if (this.#map){
            this.#map.getMap().forEach( (item, index) => {
                item.forEach( (jtem, jndex) => {
                    view[index][jndex] = {char: jtem, owners: new Set([this.#map])}
                } )
            } )
        }
        // add sprites
        this.#layers.forEach( (layer, layerIndex) => {
            layer.forEach( item => {
                if (!item.getState().show) return
                let coor = item.getState().coor
                let sprite = item.getState().sprite
                let style = item.getState().style
                // add sprite
                const lines = sprite.split('\n')
                lines.forEach( (line: string, y: number) => {
                    ViewBuilder.getAsArray(line)[0].forEach((char: string, x: number) => {
                        // add char if there is a place
                        const charCoors = {x: coor.x + x, y: coor.y + y}
                        const charStyle = getStyleValue(style, {x: x, y: y})
                        // check touching
                        setLocality(charCoors, item)
                        if (getCharByCoors(charCoors)) setCharByCoors(charCoors, char, charStyle, [item], layerIndex)
                    })
                } )
            } )
        } )
        // make view a string
        return ViewBuilder.getAsString(view)
    }

    /**
     * A private method that is called when the scene is updated.
     * 
     */
    #handleUpdate(){
        if (this.#renderHandler) this.#renderHandler(this.#compose())
        else this.#engine.render(this.#compose())
    }

    #handleUpdateSync(){
        if (this.#renderHandler) this.#renderHandler(this.#compose())
        else this.#engine.renderSync(this.#compose())
    }

    /**
     * Force update of the scene.
     * 
     * @method
     * @name update
     * @kind method
     * @memberof Scene
     * @returns {void}
     */
    update(): void{
        sceneEvents.emit('update')
    }

    updateSync(){
        this.#handleUpdateSync()
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
    add(sprite: Sprite, level: number = 0): void{
        if (this.#layers.length <= level) {
            for (let i = level - this.#layers.length + 1; i > 0; i--){
                this.#layers.push([])
            }
        }
        this.#layers[level].push(sprite)
        sprite.setScene(this, this.#layers, sceneEvents)
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
    remove(sprite: Sprite): void{
        this.#layers.forEach( layer => {
            layer.forEach( (item, i) => {
                if (sprite === item) {
                    layer.splice(i, 1)
                    sprite.setScene(undefined, undefined, undefined)
                }
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
    clear(): void{
        this.#layers = []
        this.update()
    }

    /**
     * A method that allows you to display debug information in the console.
     * 
     * @method
     * @name log
     * @kind method
     * @memberof Scene
     * @param {any} data
     * @returns {void}
     */
    log(data: any): void{
        this.#engine.setDebugInfo(data)
        this.update()
    }
    /**
     * Setting the map of the scene.
     * 
     * @method
     * @name setMap
     * @kind method
     * @memberof Scene
     * @param {any} map
     * @returns {void}
     */
    setMap(map: any): void{
        this.#map = map
        this.update()
    }
    /**
     * Removing the map from the scene.
     * 
     * @method
     * @name removeMap
     * @kind method
     * @memberof Scene
     * @returns {void}
     */
    removeMap(): void{
        this.#map = undefined
        this.update()
    }

    /**
     * process.exit analog
     * 
     * @method
     * @name exit
     * @kind method
     * @memberof Scene
     * @param {any} msg?
     * @param {boolean | undefined} clear?
     * @returns {void}
     */
    exit(msg: any = undefined, clear: boolean|undefined = true){
        sceneEvents.emit('distruct')
        this.#engine.exit(msg, clear)
    }

    /**
     * disables rendering, but does not delete scene and sprites. Useful for post exit work.
     * 
     * @method
     * @name stop
     * @kind method
     * @memberof Scene
     * @param {any} msg?
     * @param {boolean | undefined} clear?
     * @returns {void}
     */
    stop(msg: any = undefined, clear: boolean|undefined = true){
        this.#engine.stop(msg, clear)
    }

    getResolution(){
        return this.#resolution
    }

    on(eventName: string, callback = (...e:any[]) => {}){
        sceneEvents.on(eventName, callback)
    }
    
    once(eventName: string, callback = (...e:any[]) => {}){
        sceneEvents.once(eventName, callback)
    }

    trigger(eventName: string, ...data:any[]){
        sceneEvents.emit(eventName, ...data)
    }
}
