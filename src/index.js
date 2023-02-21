import Scene from "./core/Scene.js";
import Srite from './core/Sprite.js'


const sharp1 = new Srite({x:0, y:0}, `# #\n---`)
const sharp2 = new Srite({x:10, y:0}, `***`)
async function cirleMove(sprite){
    let canGo = true
    sprite.on('collision', (e) => { sprite.stopGoing(); canGo = false; })
    while (canGo){
        if (canGo) await sprite.goto({x: 15, y:0}, 1)
        if (canGo) await sprite.goto({x: 0, y:0}, 1)
    }
}
async function sideBySideMove(sprite){
    let canGo = true
    //sprite.on('collision', (e) => { sprite.stopGoing(); canGo = false })
    while (canGo){
        if (canGo) await sprite.goStraight(10, 'x', 1)
        if (canGo) await sprite.goStraight(0, 'x', 1)
    }
}
const scene = new Scene({width: 50, height: 10})
scene.add(sharp1, 0)
scene.add(sharp2, 1)

cirleMove(sharp1)
sideBySideMove(sharp2)
// sharp1.goStraight(10, 'x')
// sharp2.goStraight(0, 'x')
