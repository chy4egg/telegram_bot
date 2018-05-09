import Slimbot from "slimbot";

export default class {
    constructor(token){
        const BOT = new Slimbot(token);
        this.token = token;
        //send message method
        this.sendStatus = (message)=> {
            BOT.sendMessage('67363885', message ).then(message => {});
        };
    }
}