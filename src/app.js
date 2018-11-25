import configStatus from './modules/configStatus/configStatus.js';
import telegramApi from './modules/telegramApi/telegramApi.js';
import parseModule from './modules/parseModule/parseModule.js';

const CONFIG = new configStatus('config.js');
const TELEGRAM = new telegramApi('418099931:AAF7wgbCO_e29pqv4JM4UMiHoIwDfm3teBw');
const PARSER = new parseModule({
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

/**
 * Does all the magic
 * if the config file and the alarm status are good - send me a message in telegram
 */
(function init () {
    PARSER.parse().then(
        result => {
            //if the event is available
            if (CONFIG.getConfig && result.alarmStatus === true) {
                console.log(result.alarmMessage);
                TELEGRAM.sendStatus(result.alarmMessage);
                CONFIG.writeConfig(false);
            }
            //if the event is unavailable
            else if(CONFIG.getConfig && result.alarmStatus === false) {
                console.log(result.alarmMessage);
            } else {
                console.log('Что-то пошло не так...Возможно, скрипт уже выполнился. Попробуйте перезагрузить конфиг.');
            }
        },
        error => {
            console.log('Error. Check the config file...');
        }
    ).catch((err)=>{
        console.log(err);
    });
}());
