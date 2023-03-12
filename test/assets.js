import Bar from "../src/assets/Bar.js";
import {equal} from 'assert'
import { describe, it } from "mocha";


describe('assets', function(){
    describe('Bar', function(){
        const bar = new Bar()

        it('Should work for positive values(10)', function(){
            equal(bar.getBar(10), '[##########                                        ]')
        })
        it('Should work for value = 0', function(){
            equal(bar.getBar(0), '[                                                  ]')
        })
        it('Should work when length(50) < value', function(){
            equal(bar.getBar(70), '[##################################################]')
        })
    })
})