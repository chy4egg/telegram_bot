import parseModule from './parseModule';
import chai from 'chai';
import chaiAsPromised from "chai-as-promised";
chai.should();
chai.use(chaiAsPromised);
const Parse = new parseModule('https://pitercss.timepad.ru/events/');


describe('parseModule', ()=>{
    describe('#parse()', ()=>{
        //errors check
        it ('should has no errors', () => {
            Parse.parse((resolve,reject)=> {
                resolve.should.not.exist(reject);
            })
        });
        //types check
        it ('check types that return', () => {
            Parse.parse((resolve,reject)=> {
                resolve.should.eventually.be.an('object');
                resolve.alarmStatus.should.eventually.be.a('boolean');
                resolve.alarmMessage.should.eventually.be.a('string');
            })
        });
    });
});