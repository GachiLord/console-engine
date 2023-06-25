# Console engine
Console engine is a JavaScript library for the development of interactive console apps such as games, editors and cli-tools. The library let you write apps in async style, giving full control over the execution.
## Features
 - color output
 - emoji support
 - blocking event loop
 - keypress events
 - builtin map support
 - collision events

## Getting started
### Installation
```shell
npm i console-engine
```
### Core concepts
#### Scene
The main class in console engine is the Scene. Scene generates final string that will be rendered in console, also it provides keypress events, layer management, map support and debug methods.
You can create only one instance of the Scene in your app:
```javascript
const scene = new Scene() // create Scene without args
// or
const scene = new Scene({height: 40, width: 70}) // create Scene providing size
```
Also you can provide "renderHandler" function to change render behavior or to create multiple scenes. "renderHandler" is a function that recives final string on every scene update. **If "renderHandler" is provided scene will not be rendered automatically.**
```javascript
const renderHandler = (view) => {
	// basic render implementation
	console.clear()
	console.log(view)
}
const scene = new Scene(undefined, renderHandler)
```
Scene.log() is a method that prints necessary info under the final string.
```javascript
scene.log('debug')
```

#### Sprite
Sprite is the base unit for building apps with console engine. To use a sprite add it to scene.

```javascript
const scene = new Scene()

const sprite = new Sprite({x:4, y:4}, '☮️')
const layerIndex = 0
const speed = 100 // lower == faster

scene.add(sprite, layerIndex)

// moving sprite
await sprite.goto({x: 0, y: 0}, speed)
// moving sprite in one direction
await sprite.goStraight(4, 'x', speed)
// catching events
sprite.on('collision', (e) => {
    // this event emmits when sprite hits another sprite
})
```
**Check [examples](https://github.com/GachiLord/console-engine/tree/master/examples "examples") for better understanding of Sprite and Scene.**

##### more about Sprite
Sprites have their own state, when it updates Scene is being rerendered.
```javascript
// example state
{
    show: true,
    coor: {x: 0, y: 0},
    sprite: '#',
    style: undefined
}
```
Also they have abilities that control update behavior.
```javascript
// if ability value is false, it will not update the state
{
	canMove: false, // cant update coor
	canChangeView: true, // can update view
}
```
To update the state asynchronously:
```javascript
const props = { sprite: '##' }
const speedCoef = 100
/*
updateState is very similiar to setState in react.js.
It updates only provided properties.
speedCoef is a time that will be taken to update state.
lower == faster
*/
await sprite.updateState(props, speedCoef)
```
To update the state synchronously:
```javascript
const props = { sprite: '##' }
// does the same as updateState without delay
sprite.updateStateSync(props)
```
#### Why are there async and sync methods?
These methods are required to block whole process. When you write async code in node.js you cant block execution of the program like in browser(`alert()`). In many apps it is not necessarily but if you develop a game, pause is one of the most important features.
```javascript
// add listener for pause
scene.on('keypress', async (_, key) => {
    if (key.name === 'escape'){
		// using builtin alert to exit
        if (alert.fireSync() === 0) scene.exit()
    }
})
```