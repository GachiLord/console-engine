import Scene from "./core/Scene.js";
import Sprite from "./core/Sprite.js";
import GameMap from "./core/GameMap.js";
import Player from './assets/Player.js'

// let gameIsGoing = true
// const scene = new Scene(undefined)
// const sharp1 = new Player({x:4, y:4}, `#`)
// const floor = new Sprite({x: 0, y: 5}, '='.repeat(50))
// const enemy1 = new Sprite({x: 51, y: 4}, '*')
// // score
// const getScore = (n) => `score: ${n}`
// let totalScore = 0
// const score = new Sprite({x: 0, y: 7}, getScore(totalScore))
// // adds
// scene.add(sharp1, 1)
// scene.add(floor, 0)
// scene.add(enemy1, 1)
// scene.add(score, 0)

// // add listener for collision
// enemy1.on('collision', (e) => {
//     if (e.sprites.includes(sharp1)){
//         gameIsGoing = false
//         enemy1.stopGoing()
//     }
    
// })
// // enemy1.on('collision', (e) => {
// //     if (e.sprites.includes(enemy1)) process.exit()
    
// // })
// let speed = 0.5
// while(gameIsGoing){
//     if (gameIsGoing) await enemy1.goStraight(-1, 'x', speed)
//     if (gameIsGoing) await enemy1.updateState({coor: {x: 51, y: 4}}, 0)
//     speed -= 0.01
//     sharp1.setSpeed(speed)
//     totalScore++
//     score.updateState({sprite: getScore(totalScore)}, 0)
// }


const scene = new Scene()
const sharp1 = new Sprite({x: 0, y: 0})
const map = new GameMap(
    [`dsa             dasdsa`,
     `ffas;          asf     `,
     `fas;lfa                `,
    ].join('\n'),
    sharp1
    )

scene.add(sharp1)
scene.setMap(map)

while(true){
    await sharp1.goStraight(15, 'x')
    await sharp1.goStraight(0, 'x')
    await sharp1.goStraight(5, 'y')
    await sharp1.goStraight(0, 'y')
}