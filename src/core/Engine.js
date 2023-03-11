import sleep from "../lib/sleep.js";
import { EventEmitter } from 'node:events';
import * as readline from 'node:readline';


// events
class EngineEvents extends EventEmitter {}
const engineEvents = new EngineEvents()
// prepare console
readline.emitKeypressEvents(process.stdin);
if (process.stdin.setRawMode != null) {
  process.stdin.setRawMode(true);
}


export default class Engine{
    #debugInfo

    constructor(){
        // keypress listener
        process.stdin.on('keypress', (str, key) => {
            if (key && key.name === 'c' && key.ctrl) {
                console.log('Bye bye :)')
                process.exit()
            }
            engineEvents.emit('keypress', str, key)
        })
        // create a viewUpdate listener
        engineEvents.on('update', async (view) => {
            console.clear()
            console.log(view)
            if (this.#debugInfo !== undefined ) console.log(this.#debugInfo)
            // emit an event when rendering is complete
            engineEvents.emit('updated')
        })
    }
    
    /**
     * console.log a given string synchronously.
     * 
     * @async
     * @method
     * @name render
     * @kind method
     * @memberof Engine
     * @param {string} view
     * @returns {Promise<void>}
     */
    async render(view, frameTime = 100){
        engineEvents.emit('update', view)
        if (frameTime > 0) await sleep(frameTime) 
        engineEvents.emit('rendered')
    }
    distruct(){
        console.clear()
    }

    getEvents(){
        return engineEvents
    }

    setDebugInfo(info){
        this.#debugInfo = info
    }

    exit(){
        process.exit()
    }
}