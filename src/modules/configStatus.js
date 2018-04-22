import fs from "fs";

export default class {

    constructor(configPath){
        this.configPath = configPath;

        this.configStatus = true;

        this.getConfig = function () {
            fs.readFile(this.configPath, 'utf8', (err, contents) => {
                if (err) { console.log(err); }
                if (contents == 1) {
                    this.configStatus = true;
                } else if (contents == 0) {
                    this.configStatus = false;
                }
            });
        }
    };

    writeConfig(status) {
        if (status === true) {
            fs.writeFile("config.js", "1"); // "1" - разрешить.
        } else if (status === false) {
            fs.writeFile("config.js", "0"); // "0" - запретить.
        }
    }
}