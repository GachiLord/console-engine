export default class PosError extends Error{
    constructor(msg){
        super(msg)
        this.name = 'ReadError'
    }
}