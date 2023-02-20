export class AddError extends Error{
    constructor(msg = 'sprite has not been added to scene. Use scene.add(sprite)'){
        super(msg)
        this.name = 'addError'
    }
}