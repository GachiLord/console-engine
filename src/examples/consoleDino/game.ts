import Scene from "../../core/Scene.js"
import Sprite from "../../core/Sprite.js"
import Player from './Player.js'
import Bar from "../../assets/Bar.js"
import Alert from "../../assets/Alert.js"


const scene = new Scene()
const sharp1 = new Player({x:4, y:4}, '🦀')
const floor = new Sprite({x: 0, y: 5}, '='.repeat(51), [ 'blue '.repeat(25).split(' ').slice(0,-1).concat('red '.repeat(25).split(' ')) ])
const enemy1 = new Sprite({x: 51, y: 4}, '🤬')
const speedBar = new Bar({x: 0, y: 8}, 'speed', 35)
const alert = new Alert('Do you wanna leave?')
const restartAlert = new Alert('Game is over', ["restart", "exit"])
// score
let totalScore = 0
const getScore = (n: number) => `score: ${n}`
const score = new Sprite({x: 0, y: 7}, getScore(totalScore))
// adds
scene.add(enemy1, 2)
scene.add(sharp1, 2)
scene.add(floor, 1)
scene.add(score, 0)
scene.add(speedBar, 0)
scene.add(alert, 0)
scene.add(restartAlert, 0)

// game state
let speed: number = 50
// add listener for collision
sharp1.on('collision', (e) => {
    if (e.sprites.includes(enemy1)){
        if (restartAlert.fireSync() === 1) scene.exit(undefined, true, 0)
        // disable alert to prevent another fire
        restartAlert.disable()
        // restart game
        scene.exit(undefined, true, 1)
    }
})
// add listener for stop game
scene.on('keypress', async (_: string, key: any) => {
    if (key.name === 'escape'){
        if (alert.fireSync() === 0) scene.exit(undefined, true, 0)
    }
})
// game loop
while(true){
    await enemy1.goStraight(-1, 'x', speed)
    enemy1.gotoSync({x: 51, y: 4})
    if (speed >= 15) speed -= 1
    if (totalScore < 0) totalScore = 0
    else totalScore++
    sharp1.setSpeed(speed)
    score.updateState({sprite: getScore(totalScore)}, 0)
    const newValue:number = Number(50 - speed)
    if (newValue >= 0) speedBar.updateValue( Math.round(newValue) )
}