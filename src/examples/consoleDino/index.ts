import Scene from "../../core/Scene.js";
import Sprite from "../../core/Sprite.js";
import Player from './Player.js'
import Bar from "../../assets/Bar.js";
import Alert from "../../assets/Alert.js";
import PromptSync from "prompt-sync";


const prompt = PromptSync()
const scene = new Scene()
const sharp1 = new Player({x:4, y:4}, '🦀')
const floor = new Sprite({x: 0, y: 5}, '='.repeat(51), [ 'blue '.repeat(25).split(' ').slice(0,-1).concat('red '.repeat(25).split(' ')) ])
const enemy1 = new Sprite({x: 51, y: 4}, '🤬')
const speedBar = new Bar({x: 0, y: 8}, 'speed', 30)
const alert = new Alert('Do you wanna leave?')
// score
const getScore = (n: number) => `score: ${n}`
let totalScore = 0
const score = new Sprite({x: 0, y: 7}, getScore(totalScore))
// adds
scene.add(alert, 0)
scene.add(sharp1, 1)
scene.add(floor, 0)
scene.add(enemy1, 1)
scene.add(score, 0)
scene.add(speedBar, 0)


let speed: number = 0.5
// add listener for collision
enemy1.on('collision', (e) => {
    if (e.sprites.includes(sharp1)){
        speed += 0.01
        totalScore--
    }
})
// add listener for stop game
scene.on('keypress', async (_: string, key: any) => {
    if (key.name === 'escape'){
        if (prompt('Do you wanna leave?(y/n):') === 'y') scene.exit()
    }
})


while(true){
    await enemy1.goStraight(-1, 'x', speed)
    await enemy1.updateState({coor: {x: 51, y: 4}}, 0)
    if (speed >= 0.1) speed -= 0.01
    if (totalScore < 0) totalScore = 0
    else totalScore++
    sharp1.setSpeed(speed)
    score.updateState({sprite: getScore(totalScore)}, 0)
    const newValue:number = Number(((0.5 - speed)).toFixed(2))
    if (newValue >= 0) speedBar.updateValue( Math.round(newValue * 100) )
}