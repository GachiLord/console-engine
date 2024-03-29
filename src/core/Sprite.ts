import sleep from "../lib/sleep.js"
import { randomUUID } from 'crypto'
import EventEmitter from "events"
import { AddError } from './errors.js'
import Scene from "./Scene.js"
import { ICoor, ISpriteState, Style, Layer, ISriteAbilities, ISceneEvents, ISpriteEvents, ISpriteEventMap } from "./typing.js"


class SpriteEvents extends EventEmitter implements ISpriteEvents{}


export default class Sprite{
    readonly #id = randomUUID()
    #sceneEvents: ISceneEvents|undefined
    #scene: Scene|undefined
    #layers: Array<Layer>|undefined
    #layerIndex: undefined|number = undefined
    readonly _spriteEvents = new SpriteEvents()
    _style: Style
    _state: ISpriteState = {
        show: true,
        coor: {x: 0, y: 0},
        sprite: '#',
        style: undefined
    }
    _abilities: ISriteAbilities = {
        canMove: true,
        canChangeView: true,
    }

    /**
     * A constructor function. It is called when a new instance of the class is created.
     * 
     * @constructor
     * @name Sprite
     * @param {{x: number, y: number}} coor
     * @param {string} sprite view of the sprite
     * @param {boolean} show show sprite or not
     */
    constructor(coor: ICoor, sprite: string = '#', style: undefined|Style = undefined, show: boolean = true){
        this._state.coor = coor
        this._state.sprite = sprite
        this._state.show = show
        this._state.style = style

        // listen for lifecycle events
        this._spriteEvents.on('added', () => { this.added() })
        this._spriteEvents.on('update', () => { this.updated() })
    }

    on<E extends keyof ISpriteEventMap>(eventName: E, listener: ISpriteEventMap[E]){
        this._spriteEvents.on(eventName, listener)
    }
    
    once<E extends keyof ISpriteEventMap>(eventName: E, listener: ISpriteEventMap[E]){
        this._spriteEvents.once(eventName, listener)
    }

    trigger<E extends keyof ISpriteEventMap>(eventName: E, ...data:any[]){
        this._spriteEvents.emit(eventName, ...data)
    }

    off<E extends keyof ISpriteEventMap>(eventName: E, listener: (...args: any[]) => void){
        this._spriteEvents.off(eventName, listener)
    }

    removeAllListeners<E extends keyof ISpriteEventMap>(eventName?: E){
        this._spriteEvents.removeAllListeners(eventName)
    }

    added(){}

    updated(){}

    /**
     * Setting the scene for the sprite.
     * 
     * @method
     * @name setScene
     * @kind method
     * @memberof Sprite
     * @param {any} scene
     * @returns {void}
     */
    setScene(scene: Scene|undefined, layers: Array<Array<Sprite>>|undefined, layerIndex: number|undefined, events: ISceneEvents|undefined): void{
        this.#scene = scene
        this.#layers = layers
        this.#sceneEvents = events
        this.#layerIndex = layerIndex
        this._spriteEvents.emit('added')
    }

    /**
     * Updating state by speed
     * 
     * @async
     * @method
     * @name updateState
     * @kind method
     * @memberof Sprite
     * @param {Object} props
     * @param {number} speedCoef?
     * @returns {Promise<void>}
     */
    async updateState(props: object, speedCoef: number = 100): Promise<boolean>{
        this.#setState(props)
        if (speedCoef > 0) await sleep(speedCoef)
        // emit events
        this._sceneEvents.emit('update', { layerIndex: this._layerIndex })
        this._spriteEvents.emit('update', { layerIndex: this._layerIndex })
        // set state
        return this.#setState(props)
    }

    updateStateSync(props: object): boolean {
        const updateResult = this.#setState(props)
        this._scene.updateSync(this._layerIndex)
        return updateResult
    }

    #setState(props: object){
        if (!this.#scene || !this.#sceneEvents || !this.#layers || this.#layerIndex === undefined) throw new AddError()
        // check abilities
        const flags = Object.keys(props)
        if (flags.includes('coor') && !this._abilities.canMove) return false
        if ((flags.includes('sprite') || flags.includes('show')) && !this._abilities.canChangeView) return false
        // set state
        this._state = {...this._state, ...props}

        return true
    }

    /**
     * A getter method. It returns the state of the sprite.
     * 
     * @method
     * @name getState
     * @kind method
     * @memberof Sprite
     * @returns {{ show: boolean; coor: { x: number; y: number; }; sprite: string; }}
     */
    getState(): ISpriteState{
        return this._state
    }

    getAbilities(){
        return this._abilities
    }

    get id(){
        return this.#id
    }

    get _scene(): Scene{
        if (this.#scene) return this.#scene
        else throw new AddError()
    }

    get _layers(): Array<Layer>{
        if (this.#layers) return this.#layers
        else throw new AddError()
    }

    get _sceneEvents(): ISceneEvents{
        if (this.#sceneEvents) return this.#sceneEvents
        else throw new AddError()
    }

    get _layerIndex(): number{
        if (this.#layerIndex !== undefined) return this.#layerIndex
        else throw new AddError()
    }

    /**
     * moving the sprite only in one direction
     * 
     * @async
     * @method
     * @name goStraight
     * @kind method
     * @memberof Sprite
     * @param {number} endCoor
     * @param {string} axis x or y
     * @param {number} speedCoef frame update speed
     * @returns {Promise<void>}
     */
    async goStraight(endCoor: number, axis: string = 'x', speedCoef: number = 100): Promise<void>{
        // move sprite
        let coor = this._state.coor
        // why I cant use js normally???
        let key = axis as keyof typeof coor
        let startCoor: number = coor[key]
        const directionCoef = endCoor > startCoor ? 1: -1
        
        // get to coor
        while (startCoor !== endCoor){
            startCoor += directionCoef
            coor[key] = startCoor
            await this.updateState({coor: coor}, speedCoef)
        }
    }

    goStraightSync(endCoor: number, axis: string = 'x'){
        let coor = this._state.coor
        let key = axis as keyof typeof coor
        coor[key] = endCoor

        this.updateStateSync({coor: coor})
    }

    setAbilities(props: ISriteAbilities){
        this._abilities = {...this._abilities, ...props}
    }

    /**
     * A method that moves the sprite to the given coordinates.
     * 
     * @async
     * @method
     * @name goto
     * @kind method
     * @memberof Sprite
     * @param {{x: number, y: number}} coor
     * @param {any} speedCoef frame update speed
     * @returns {Promise<void>}
     */
    async goto(coor: ICoor, speedCoef: number = 100): Promise<void>{
        await Promise.all([
            this.goStraight(coor.x, 'x', speedCoef),
            this.goStraight(coor.y, 'y', speedCoef)
        ])
    }
    
    gotoSync(coor: ICoor){
        if (!this._abilities.canMove) return
        this.updateStateSync({coor: coor})
    }

    /**
     * A method that hides the sprite.
     * 
     * @method
     * @name hide
     * @kind method
     * @memberof Sprite
     * @returns {void}
     */
    hide(): void{
        this.updateStateSync({show: false})
    }

    /**
     * A method that shows the sprite.
     * 
     * @method
     * @name show
     * @kind method
     * @memberof Sprite
     * @returns {void}
     */
    show(): void{
        this.updateStateSync({show: true})
    }

    toString(){
        return this._state.sprite
    }
}