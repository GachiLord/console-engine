import Engine from "../core/Engine.js"


const e = new Engine()
const loadingDuration = 20

for (let i = 1; i <= loadingDuration; i++){
    let loading = ''
    for (let j = 0; j <= i; j++) loading += '='
    for (let j = i; j < loadingDuration - 1; j++) loading += ' '
    await e.render('[' + loading + '] ' + getPercent(loadingDuration, i))
}

function getPercent(maxNum = 100, curNum = 100){
    return Math.floor(curNum / maxNum * 100)
}