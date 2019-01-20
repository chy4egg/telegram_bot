import fs from "fs";

export default class {

    constructor(configPath) {
        this.configPath = configPath;
    };

    /**
     * Reads the config file info
     */
    getConfig() {
        let getStatus = fs.readFileSync(this.configPath, 'utf8');
	    // getStatus should be different then 0
	    return getStatus != 0;
    }

    /**
     * Writes the config file
     * 1 - ok (can parse)
     * 0 - error (can't parse)
     */
    writeConfig(status) {
        if (status === true) {
            fs.writeFile("config.js", "1", ()=>{ console.log('config has been changed to "true"') }); // "1" - true.
        }
        else if (status === false) {
            fs.writeFile("config.js", "0", ()=>{ console.log('config has been changed to "false"') }); // "0" - false.
        }
    }
}
