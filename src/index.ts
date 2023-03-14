import Scene from "./core/Scene.js";
import Sprite from "./core/Sprite.js";
import GameMap from "./core/GameMap.js";
import Player from './assets/Player.js'
import sleep from "./lib/sleep.js";
import Bar from "./assets/Bar.js";


let gameIsGoing = true
const scene = new Scene(undefined, undefined)
const sharp1 = new Player({x:4, y:4}, `#`)
const floor = new Sprite({x: 0, y: 5}, '='.repeat(50))
const enemy1 = new Sprite({x: 51, y: 4}, '*')
const speedBar = new Bar({x: 0, y: 8}, 'speed', 30)
// score
const getScore = (n: number) => `score: ${n}`
let totalScore = 0
const score = new Sprite({x: 0, y: 7}, getScore(totalScore))
// adds
scene.add(sharp1, 1)
scene.add(floor, 0)
scene.add(enemy1, 1)
scene.add(score, 0)
scene.add(speedBar, 0)


// enemy1.on('collision', (e) => {
//     if (e.sprites.includes(enemy1)) process.exit()
    
// })
let speed: number = 0.5

// add listener for collision
enemy1.on('collision', (e) => {
    if (e.sprites.includes(sharp1)){
        speed += 0.01
        totalScore--
    }
    
})


while(gameIsGoing){
    if (gameIsGoing) await enemy1.goStraight(-1, 'x', speed)
    if (gameIsGoing) await enemy1.updateState({coor: {x: 51, y: 4}}, 0)
    if (speed >= 0.1) speed -= 0.01
    sharp1.setSpeed(speed)
    totalScore++
    score.updateState({sprite: getScore(totalScore)}, 0)
    const newValue:number = Number(((0.5 - speed)).toFixed(2))
    speedBar.updateValue( Math.round(newValue * 100) )
}