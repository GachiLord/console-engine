// scene

export class PosError extends Error{
    constructor(msg: string){
        super(msg)
        this.name = 'ReadError'
    }
}

// sprite

export class AddError extends Error{
    constructor(msg = 'sprite has not been added to the scene yet. Override sprite.added() to use the scene after addition. Use scene.add(sprite) to add sprite to the scene.'){
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