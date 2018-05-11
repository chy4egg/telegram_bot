import parseModule from './parseModule';
import chai from 'chai';
import chaiAsPromised from "chai-as-promised";
chai.should();
chai.use(chaiAsPromised);
const expect = chai.expect;
const Parse = new parseModule('https://pitercss.timepad.ru/events/');


describe('parseModule', ()=> {
    describe('#parse()', ()=> {
        //errors check
        it ('should return a promise', ()=> {
            expect(Parse.parse()).to.be.a('promise');
        });
        //types check
        it ('check types that return', ()=> {
            Parse.parse().then((resolve)=> {
                resolve.should.eventually.be.an('object');
                resolve.alarmStatus.should.eventually.be.a('boolean');
                resolve.alarmMessage.should.eventually.be.a('string');
            });
        });
    });
});