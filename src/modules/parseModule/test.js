import parseModule from './parseModule';
import chai from 'chai';
import chaiAsPromised from "chai-as-promised";
chai.should();
chai.use(chaiAsPromised);
const Parse = new parseModule();

//TODO: протестировать метод parse вместо testParse
it ('must return a promise', () => {
    return Parse.testParse().should.eventually.equal("Success!");
});


