import configStatus from './modules/configStatus.js';
import telegramApi from './modules/telegramApi.js';
import parseModule from './modules/parseModule.js';

const CONFIG = new configStatus('config.js');
const TELEGRAM = new telegramApi('418099931:AAF7wgbCO_e29pqv4JM4UMiHoIwDfm3teBw');
const PARSER = new parseModule('https://pitercss.timepad.ru/events/');

function main () {
    if (PARSER.parse().alarmStatus === true) {
        TELEGRAM.sendStatus(PARSER.parse().alarmMessage);
        CONFIG.writeConfig(false);
    } else {
        console.log(PARSER.parse().alarmMessage);
        console.log(PARSER.parse());
        // TELEGRAM.sendStatus(PARSER.parse().alarmMessage);
    }
}

(function init () {
    PARSER.parse().then(
        result => {
          // первая функция-обработчик - запустится при вызове resolve
          console.log("Fulfilled: " + result); // result - аргумент resolve
        },
        error => {
          // вторая функция - запустится при вызове reject
          console.log("Rejected: " + error); // error - аргумент reject
        }
      );
}());