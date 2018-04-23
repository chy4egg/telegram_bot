import fs from "fs";

export default class {

    constructor(configPath){
        this.configPath = configPath;
    };

    // TODO: временно синхронный. С асинхронным проблемы.
    getConfig() {
        // let getStatus = fs.readFile(this.configPath, 'utf8', (err, contents) => {
        //     if (err) { console.log(err); }
        //     if (contents == 1) {
                
        //     } else if (contents == 0) {
                
        //     }
        // });
        let getStatus = fs.readFileSync(this.configPath, 'utf8');
        if (getStatus == 0) {
            return false;
        } else if (getStatus == 1) {
            return true;
        }
    }

    writeConfig(status) {
        if (status === true) {
            fs.writeFile("config.js", "1", ()=>{ console.log('config has been changed to "true"') }); // "1" - true.
        } else if (status === false) {
            fs.writeFile("config.js", "0", ()=>{ console.log('config has been changed to "false"') }); // "0" - false.
        }
    }
}