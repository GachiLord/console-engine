// scene

export class PosError extends Error{
    constructor(msg: string){
        super(msg)
        this.name = 'ReadError'
    }
}

// sprite

export class AddError extends Error{
    constructor(msg = 'sprite has not been added to the scene. Use scene.add(sprite)'){
        super(msg)
        this.name = 'AddError'
    }
}

// common

export class InvalidValue extends Error{
    constructor(msg = 'value is invalid'){
        super(msg)
        this.name = 'InvalidValue'
    }
}