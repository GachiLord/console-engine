import events from "./events/engineEvents.js";
import sleep from "../lib/sleep.js";
import engineEvents from "./events/engineEvents.js";

export default class Engine{

    constructor(){

        // create a viewUpdate listener
        engineEvents.on('update', async (view) => {
            console.clear()
            console.log(view)
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
        await sleep(frameTime)
        engineEvents.emit('rendered')
    }
    distruct(){
        console.clear()
    }
}