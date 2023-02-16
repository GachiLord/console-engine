import events from "./events.js";

export default class Engine{
    #frameTime

    constructor(frameTime = 100){
        this.#frameTime = frameTime

        // create a viewUpdate listener
        events.on('update', async (view) => {
            console.clear()
            console.log(view)
            // emit an event when rendering is complete
            events.emit('updated')
        })
    }
    
    #sleep(ms){
        return new Promise(resolve => setTimeout(resolve, ms));
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
    async render(view){
        events.emit('update', view)
        await this.#sleep(this.#frameTime)
        events.emit('rendered')
    }
}