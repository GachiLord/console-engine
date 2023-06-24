import Scene from "../../core/Scene.js"
import Sprite from "../../core/Sprite.js"
import Player from './Player.js'
import Bar from "../../assets/Bar.js"
import Alert from "../../assets/Alert.js"


const scene = new Scene()
const sharp1 = new Player({x:4, y:4}, '🦀')
const floor = new Sprite({x: 0, y: 5}, '='.repeat(51), [ 'blue '.repeat(25).split(' ').slice(0,-1).concat('red '.repeat(25).split(' ')) ])
const enemy1 = new Sprite({x: 51, y: 4}, '🤬')
const speedBar = new Bar({x: 0, y: 8}, 'speed', 30)
const alert = new Alert('Do you wanna leave?')
// score
let totalScore = 0
const getScore = (n: number) => `score: ${n}`
const score = new Sprite({x: 0, y: 7}, getScore(totalScore))
// adds
scene.add(sharp1, 2)
scene.add(enemy1, 2)
scene.add(floor, 1)
scene.add(score, 0)
scene.add(speedBar, 0)
scene.add(alert, 0)


let speed: number = 50
// add listener for collision
enemy1.on('collision', (e) => {
    if (e.sprites.includes(sharp1)){
        speed += 1
        totalScore--
    }
})
// add listener for stop game
scene.on('keypress', async (_: string, key: any) => {
    if (key.name === 'escape'){
        if (alert.fireSync() === 0) scene.exit(undefined, false)
    }
})


while(true){
    await enemy1.goStraight(-1, 'x', speed)
    await enemy1.updateState({coor: {x: 51, y: 4}}, 0)
    if (speed >= 0.1) speed -= 1
    if (totalScore < 0) totalScore = 0
    else totalScore++
    sharp1.setSpeed(speed)
    score.updateState({sprite: getScore(totalScore)}, 0)
    const newValue:number = Number(50 - speed)
    if (newValue >= 0) speedBar.updateValue( Math.round(newValue) )
}