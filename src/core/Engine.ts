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
console.clear()
readline.emitKeypressEvents(process.stdin)
if (process.stdin.setRawMode != null) {
    process.stdin.setRawMode(true)
}


export default class Engine{
    #debugInfo: any
    #viewCache: undefined|string    
  
    constructor(keypressHandler: any) {
        // keypress listener
        process.stdin.on('keypress', (str, key) => {
            if (key && key.name === 'c' && key.ctrl) {
                this.exit(undefined, true, 0)
            }
            keypressHandler(str, key)
        })
        // create a viewUpdate listener
        engineEvents.on('update', this.handleUpdate)
    }

    handleUpdate = (view: string) => {
        const out = process.stdout
        const finalView = this.#debugInfo ? view + '\n' + this.#debugInfo: view
        const linesToUpdate = this.#getDiff(finalView)
        
        linesToUpdate.forEach( (line, y) => {
            out.cursorTo(0, y)
            out.clearLine(1)
            out.write(line)
        } )
        engineEvents.emit('updated')
        // cache view
        this.#viewCache = finalView
    }

    #getDiff(view: string): Map<number, string>{
        const diff: Map<number, string> = new Map()

        if (!this.#viewCache) {
            view.split('\n').forEach( (line, i) => diff.set(i, line) )
            return diff
        }

        const compared = this.#viewCache.split('\n')
        view.split('\n').forEach( (line, index) => {
            if (compared[index] !== line) diff.set(index, line)
        } )

        return diff
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
        engineEvents.emit('updated')
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

    exit(msg: any = undefined, clear: boolean = true, exitCode = 1){
        if (msg) console.log(msg)
        else if(clear) console.clear()
        process.exit(exitCode)
    }

    stop(msg: any = undefined, clear: boolean = true){
        engineEvents.removeAllListeners()
        process.stdin.removeAllListeners()

        if (msg) console.log(msg)
        else if(clear) console.clear()
    }
}
