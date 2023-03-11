import Bar from "../src/assets/Bar.js";
import {equal} from 'assert'
import { describe, it } from "mocha";


describe('assets', function(){
    describe('Bar', function(){
        const bar = new Bar()

        it('Should work for positive values(10)', function(){
            equal(bar.getBar(10), '[########                                        ]')
        })
        it('Should work for negative values(-5)', function(){
            equal(bar.getBar(-5), '[                                                ]')
        })
        it('Should work for negative length(-45)', function(){
            bar.length = -45
            equal(bar.getBar(35), '[]')
        })
        it('Should work for positive length(50)', function(){
            bar.length = 50
            equal(bar.getBar(0), '[                                                ]')
        })
    })
})