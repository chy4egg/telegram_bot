import configStatus from './modules/configStatus.js';
import telegramApi from './modules/telegramApi.js';
import parseModule from './modules/parseModule.js';

const CONFIG = new configStatus('config.js');
const TELEGRAM = new telegramApi('418099931:AAF7wgbCO_e29pqv4JM4UMiHoIwDfm3teBw');
const PARSER = new parseModule('https://pitercss.timepad.ru/events/');


console.log(CONFIG.configStatus);
CONFIG.writeConfig(false);
CONFIG.getConfig();
console.log(CONFIG.configStatus);

function main () {
    if (PARSER.parse().alarmStatus === true) {
        TELEGRAM.sendStatus(PARSER.parse().alarmMessage);
        CONFIG.writeConfig(false);
    } else {
        console.log(PARSER.parse().alarmMessage);
    }
}