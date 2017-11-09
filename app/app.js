var tress = require('tress');
var request = require('request');
var needle = require('needle');
var cheerio = require('cheerio');
var resolve = require('url').resolve;
var fs = require('fs');
var URL = 'https://pitercss.timepad.ru/events/';
var newAction = '';
var alarmStatus = '';

var configStatus = fs.readFile('config.js', 'utf8', function(err, contents) {
    if (contents == 0) {
        //находим новость
        var q = tress(function(url, callback) {
            needle.get(url, function(err, res){
                if (err) throw err;
                // парсим DOM
                var $ = cheerio.load(res.body);
                //информация о новости
                $('.t-card').each(function(i,item){
                    if($(item).hasClass('t-card_event__passed')) {
                        console.log( 'Нет активных мероприятий - ' + new Date() );
                    } else {
                        //если у заголовка нет статуса 'passed';
                        let href = $(item).children().children().next().children().children().attr('href');
                        newAction = href;
                    }
                });
                callback();
            });
        }, 10); // запускаем 10 параллельных потоков

//ищем внутри новости
        q.drain = function(){
            var q = tress(function(url, callback){
                needle.get(url, function(err, res){
                    if (err) {
                        return;
                    }
                    var $ = cheerio.load(res.body);
                    //информация о статусе регистрации
                    $('.b-actionbox__heading').each(function(i,item){
                        if ($(item).text() === 'Регистрация на событие закрыта') {
                            alarmStatus = 'Регистрация закрыта';
                            console.log( 'Есть активное событие, но регистрация в данный момент закрыта' ); //tmp
                        } else {
                            alarmStatus = 'Регистрация открыта! Успей зарегаться по ссылке: ' + newAction;
                            sendStatus(alarmStatus); // послать сообщение
                            console.log( 'Регистрация открыта! Тебе должно придти сообщение от бота' ); //tmp
                            // Пишу в конфиг запрет на дальнейшее выполнение скрипта
                            fs.writeFile("config.js", "1"); // "1" - запретить.
                        }
                    });
                    callback();
                });
            }, 10); // запускаем 10 параллельных потоков
            q.push(newAction);
        };

//telegram bot API:
        const TELEGRAM_BOT_TOKEN = '418099931:AAF7wgbCO_e29pqv4JM4UMiHoIwDfm3teBw';
        const Slimbot = require('slimbot');
        const slimbot = new Slimbot(TELEGRAM_BOT_TOKEN);

//метод, посылающий сообщение в мой chat_id (67363885);
        var sendStatus = function (message) {
            slimbot.sendMessage('67363885', message ).then(message => {

            });
        };

// Call API
// slimbot.startPolling(); // если нужно, чтобы бот висел в фоне и отслеживал действия пользователя
        q.push(URL)
        console.log('Скрипт выполнился!');
    } else {
        console.log('Сорян, конфиг блокирует выполнение скрипта');
    }
});

