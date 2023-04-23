import sleep from "../lib/sleep.js"
import { randomUUID } from 'crypto'
import EventEmitter from "events"
import { AddError } from './errors.js'
import Scene from "./Scene.js"
import { ICoor, ISpriteState, Style, Layer } from "./typing.js"


class SpriteEvents extends EventEmitter{}


export default class Sprite{
    _sceneEvents: EventEmitter|any
    _spriteEvents = new SpriteEvents()
    #id = randomUUID()
    _style: Style
    _scene: Scene|any
    _layers: Array<Layer>|any
    _state: ISpriteState = {
        show: true,
        coor: {x: 0, y: 0},
        sprite: '#',
        style: undefined
    }
    _abilities = {
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

    on(eventName: string, callback = (...e:any[]) => {}){
        this._spriteEvents.on(eventName, callback)
    }
    
    once(eventName: string, callback = (...e:any[]) => {}){
        this._spriteEvents.once(eventName, callback)
    }

    trigger(eventName: string, ...data:any[]){
        this._spriteEvents.emit(eventName, ...data)
    }

    added(){

    }

    updated = () => {

    }

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
    setScene(scene: Scene|undefined, layers: Array<Array<Sprite>>|undefined, events: EventEmitter|undefined): void{
        this._scene = scene
        this._layers = layers
        this._sceneEvents = events
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
    async updateState(props: object, speedCoef: number = 1): Promise<void>{
        this.updateStateSync(props)
        if (speedCoef > 0) await sleep(speedCoef * 100)
    }

    updateStateSync(props: object){
        if (!this._scene || !this._sceneEvents || !this._layers) throw new AddError()
        this._state = {...this._state, ...props}
        this._sceneEvents.emit('update')
        this._spriteEvents.emit('update', props)
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
    async goStraight(endCoor: number, axis: string = 'x', speedCoef: number = 1): Promise<void>{
        // move sprite
        let coor = this._state.coor
        // why I cant use js normally???
        let key = axis as keyof typeof coor
        let startCoor: number = coor[key]
        const directionCoef = endCoor > startCoor ? 1: -1
        

        // get to coor if there is no stopGoing command
        while (startCoor !== endCoor && this._abilities.canMove){
            startCoor += directionCoef
            coor[key] = startCoor
            await this.updateState({coor: coor}, speedCoef)
        }
        // reset ability flag
        //this._abilities.canMove = true
    }

    goStraightSync(endCoor: number, axis: string = 'x'){
        // move sprite
        let coor = this._state.coor
        // why I cant use js normally???
        let key = axis as keyof typeof coor
        coor[key] = endCoor

        this.updateStateSync({coor: coor})
    }

    disableGoing(){
        this._abilities.canMove = false
    }

    enableGoing(){
        this._abilities.canMove = true
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
    async goto(coor: ICoor, speedCoef: number = 1): Promise<void>{
        await Promise.all([
            this.goStraight(coor.x, 'x', speedCoef),
            this.goStraight(coor.y, 'y', speedCoef)
        ])
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
}