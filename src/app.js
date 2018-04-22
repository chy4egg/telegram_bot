import configStatus from './modules/configStatus.js';
import telegramApi from './modules/telegramApi.js';
import parseModule from './modules/parseModule.js';

const CONFIG = new configStatus('config.js');
const TELEGRAM = new telegramApi('418099931:AAF7wgbCO_e29pqv4JM4UMiHoIwDfm3teBw');
const PARSER = new parseModule('https://pitercss.timepad.ru/events/');

(function init () {

    PARSER.parse().then(
        result => {
          if (CONFIG.getConfig && result.alarmStatus === true) {
            console.log(result.alarmMessage);
            TELEGRAM.sendStatus(result.alarmMessage);
            CONFIG.writeConfig(false); 
          } else {
            console.log('Что-то пошло не так...Возможно, скрипт уже выполнился. Попробуйте перезагрузить конфиг.');
          }
        },
        error => {
            console.log(error.alarmMessage);
            // TELEGRAM.sendStatus(error.alarmMessage);
        }
      );

}());