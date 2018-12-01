import parseModule from './parseModule';
import chai from 'chai';
import chaiAsPromised from "chai-as-promised";
chai.should();
chai.use(chaiAsPromised);
const expect = chai.expect;
const Parse = new parseModule({
    outer: {
        url: 'https://pitercss.timepad.ru/events/',
        itemName: '.t-card',
        passedItemName: '.t-card_event__passed'
    },
    inner: {
        targetItem: '.b-actionbox__heading',
        errorText: 'Регистрация на событие закрыта',
    }
});

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
