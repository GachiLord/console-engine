import Engine from "./Engine.js"
import { EventEmitter } from 'node:events';
import defaultResolution from "../assets/defaultResolution.js";
import { ICoor, Style, Layer, IUpdateData } from "./typing.js";
import Sprite from "./Sprite.js";
import GameMap from "./GameMap.js";
import ViewBuilder from "../lib/ViewBuilder.js";
import getStyled from "../lib/getStyled.js";
import { char } from "./typing.js";


class SceneEvents extends EventEmitter {}
const sceneEvents = new SceneEvents()

export default class Scene{
    #layers: Array<Layer> = []
    #engine
    #map: GameMap|undefined
    #engineEvents 
    #resolution
    #renderHandler
    #layersCache: Array<char[][]> = []
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

        sceneEvents.on('update', (data: IUpdateData) => {
            this.#handleUpdate(data.layerIndex)
        })
    }

    getPressedKey(){
        return this.#engine.getPressedKey()
    }

    /**
     * Creating a blank window and then adding the sprites to it.
     * 
     */
    #compose(layerIndex: number|undefined){
        // clear cache and render whole layers if layerIndex is not provided
        if (layerIndex === undefined) this.#layersCache = []
        // resolution
        const width = this.#resolution.width
        const height = this.#resolution.height
        // create blank win
        const view: char[][] = ViewBuilder.getEmptyViewAsArray(height, width)
        // helpers
        function getStyleValue(style: Style, coors: ICoor):string|undefined{
            if (typeof style === 'string' || !style ) return style
            else if (style[coors.y]) return style[coors.y][coors.x]
        }
        function getChar(view: char[][], coor: ICoor){
            if (!view[coor.y]) return
            if (view[coor.y][coor.x]) return view[coor.y][coor.x]
        }
        function checkCollision(collisionData: {view: char[][], owner: Sprite, char: char, charCoors: ICoor}){
            const dirs = [
                {...collisionData.charCoors, y: collisionData.charCoors.y + 1},
                {...collisionData.charCoors, y: collisionData.charCoors.y - 1},
                {...collisionData.charCoors, x: collisionData.charCoors.x + 1},
                {...collisionData.charCoors, x: collisionData.charCoors.x - 1}
            ]

            dirs.forEach( dir => {
                const foundChar = getChar(collisionData.view, dir)
                if (!foundChar) return
                if (foundChar === collisionData.char || foundChar.char === ' ') return
                
                collisionData.owner.trigger('collision',
                    {
                        target: collisionData.owner,
                        sprites: [foundChar.owner],
                        char: foundChar.char
                    }
                )
                if (foundChar.owner instanceof Sprite) foundChar.owner.trigger('collision',
                    {
                        target: foundChar.owner,
                        sprites: [collisionData.owner],
                        char: collisionData.char.char
                    }
                )
            } )
        }
        function setChar(view: char[][], char: char, coor: ICoor){
            if (!view[coor.y]) return
            if (!view[coor.y][coor.x]) return
            // set char
            view[coor.y][coor.x] = char 
        }
        // add game map
        if (this.#map){
            this.#map.getMap().forEach( (item, index) => {
                item.forEach( (jtem, jndex) => {
                    view[index][jndex] = {char: jtem, owner: this.#map}
                } )
            } )
        }
        // add sprites
        this.#layers.forEach( (layer, index) => {
            if (layerIndex !== index && this.#layersCache[index]){
                return ViewBuilder.joinViews(view, this.#layersCache[index])
            }
            const layerView = ViewBuilder.getEmptyViewAsArray(height, width)

            layer.forEach( sprite => {
                const state = sprite.getState()
                if (!state.show) return
                
                ViewBuilder.getAsArray(state.sprite).forEach( (line, y) => {
                    line.forEach( (char, x) => {
                        // set char
                        const charCoor = {x: state.coor.x + x, y: state.coor.y + y}
                        const charStyle = getStyleValue(state.style, {x: x, y: y})
                        const charToSet = {char: getStyled(char, charStyle), owner: sprite, layerIndex: layerIndex}

                        setChar(layerView, charToSet, charCoor)
                        // check collision
                        checkCollision({view: layerView, owner: sprite, char: charToSet, charCoors: charCoor})
                    } )
                } ) 
            } )
            // join
            ViewBuilder.joinViews(view, layerView)
            // cache updated layer
            if (layerIndex === index) this.#layersCache[layerIndex] = layerView
        } )
        // make view a string
        return ViewBuilder.getAsString(view)
    }

    /**
     * A private method that is called when the scene is updated.
     * 
     */
    #handleUpdate(layerIndex: number|undefined = undefined){
        if (this.#renderHandler) this.#renderHandler(this.#compose(layerIndex))
        else this.#engine.render(this.#compose(layerIndex))
    }

    #handleUpdateSync(layerIndex: number|undefined = undefined){
        if (this.#renderHandler) this.#renderHandler(this.#compose(layerIndex))
        else this.#engine.renderSync(this.#compose(layerIndex))
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
    update(layerIndex: number|undefined = undefined): void{
        sceneEvents.emit('update', {layerIndex: layerIndex})
    }

    updateSync(layerIndex: number|undefined){
        this.#handleUpdateSync(layerIndex)
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
        sprite.setScene(this, this.#layers, level, sceneEvents)
        this.update(level)
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
                    sprite.setScene(undefined, undefined, undefined, undefined)
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
        this.#layersCache = []
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
        //this.update()
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
    exit(msg: any = undefined, clear: boolean|undefined = true, exitCode = 0){
        sceneEvents.emit('distruct')
        this.#engine.exit(msg, clear, exitCode)
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
