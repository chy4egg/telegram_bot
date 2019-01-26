import ConfigStatus from './modules/ConfigStatus/ConfigStatus';
import TelegramApi from './modules/TelegramApi/TelegramApi';
import ParseModule from './modules/ParseModule/ParseModule';

const CONFIG = new ConfigStatus('config.js');
const TELEGRAM = new TelegramApi('418099931:AAF7wgbCO_e29pqv4JM4UMiHoIwDfm3teBw');
const PARSER = new ParseModule({
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
(function init() {
  PARSER.parse().then(
    (result) => {
      // if the event is available
      if (CONFIG.getConfig && result.alarmStatus === true) {
        console.log(result.alarmMessage);
        TELEGRAM.sendStatus(result.alarmMessage);
        CONFIG.writeConfig(false);
      }
      // if the event is unavailable
      else if (CONFIG.getConfig && result.alarmStatus === false) {
        console.log(result.alarmMessage);
      } else {
        console.log('Что-то пошло не так...Возможно, скрипт уже выполнился. Попробуйте перезагрузить конфиг.');
      }
    }
  ).catch((err) => {
    console.log(err);
  });
}());
