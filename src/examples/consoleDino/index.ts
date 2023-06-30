import { spawnSync } from "node:child_process"


const gamePath = process.argv[1].replace('index.js', 'game.js')
// restart and exit functionality
while(true){
    const exitCode = spawnSync('node', [gamePath], {stdio: 'inherit'}).status

    if (exitCode === 0) process.exit()
}