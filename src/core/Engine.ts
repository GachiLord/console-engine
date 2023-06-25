import sleep from "../lib/sleep.js";
import { EventEmitter } from 'node:events';
import * as readline from 'node:readline';
import readlineSync from 'readline-sync'
import cliCursor from 'cli-cursor';

// events
class EngineEvents extends EventEmitter {}
const engineEvents = new EngineEvents()
// prepare console
cliCursor.hide()
readline.emitKeypressEvents(process.stdin)
if (process.stdin.setRawMode != null) {
    process.stdin.setRawMode(true)
}


export default class Engine{
    #debugInfo: any    
  
    constructor(keypressHandler: any) {
        // keypress listener
        process.stdin.on('keypress', (str, key) => {
            if (key && key.name === 'c' && key.ctrl) {
                this.exit()
            }
            keypressHandler(str, key)
        })
        // create a viewUpdate listener
        engineEvents.on('update', this.handleUpdate)
    }

    handleUpdate = (view: string) => {
        // clear and print
        const out = process.stdout
        out.cursorTo(0, 0)
        out.clearScreenDown()
        out.write(view)
        // log a dubug info
        if (this.#debugInfo !== undefined ) out.write('\n' + this.#debugInfo)
        // emit an event when rendering is complete
        engineEvents.emit('updated')
    }
    
    /**
     * console.log a given string.
     * 
     * @async
     * @method
     * @name render
     * @kind method
     * @memberof Engine
     * @param {string} view
     * @returns {Promise<void>}
     */
    async render(view: string, frameTime = 100): Promise<void>{
        engineEvents.emit('update', view)
        if (frameTime > 0) await sleep(frameTime) 
        engineEvents.emit('rendered')
    }

    renderSync(view: string){
        this.handleUpdate(view)
    }

    getEvents(){
        return engineEvents
    }

    getPressedKey(){
        const key = readlineSync.keyIn('', {hideEchoBack: true, mask: ''})
        process.stdin.setRawMode(true)
        process.stdin.resume()
        return key
    }

    setDebugInfo(info: any){
        this.#debugInfo = info
    }

    exit(msg: any = undefined, clear: boolean = true){
        if (msg) console.log(msg)
        else if(clear) console.clear()
        process.exit()
    }

    stop(msg: any = undefined, clear: boolean = true){
        engineEvents.removeAllListeners()
        process.stdin.removeAllListeners()

        if (msg) console.log(msg)
        else if(clear) console.clear()
    }
}
