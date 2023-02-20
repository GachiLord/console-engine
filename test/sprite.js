import {notEqual} from 'assert'
import Sprite from "../src/core/Sprite.js";
import Scene from "../src/core/Scene.js";






describe('Sprite', function () {
    describe('goto()', function () {
      const sharp1 = new Sprite({x:0, y:0}, '#')
      const sharp2 = new Sprite({x:50, y:0}, '#')
      // set a callback which updates finalView var, and create scene
      let finalView = ''
      function updateView(view){
          finalView = view
      }
      const scene = new Scene([300,300], updateView)

      scene.add(sharp1)
      scene.add(sharp2)
      sharp1.goto(50, 'x', 0)
      sharp2.goto(0, 'x', 0)

      it('should render anything except \'\' without errors', function () {
        notEqual(finalView, '' )
      })
    })
  });
