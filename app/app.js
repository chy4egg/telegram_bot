var myFunc = setInterval(function () {


    var tress = require('tress');
    var request = require('request');
    var needle = require('needle');
    var cheerio = require('cheerio');
    var resolve = require('url').resolve;
    var fs = require('fs');
    var URL = 'https://pitercss.timepad.ru/events/';
    var results = [];
    var newAction = '';
    var alarmStatus = '';

//находим новость
    var q = tress(function(url, callback){
        needle.get(url, function(err, res){
            if (err) throw err;
            // парсим DOM
            var $ = cheerio.load(res.body);
            //информация о новости
            $('.t-card').each(function(i,item){

                if($(item).hasClass('t-card_event__passed')) {
                    console.log( 'tick' );
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
                    } else {
                        alarmStatus = 'Регистрация открыта! Успей зарегаться по ссылке' + ' ' + newAction;
                        sendStatus(alarmStatus); // послать сообщение
                        clearInterval(myFunc); // сбросить слежение
                    }
                });
                callback();
            });
        }, 10); // запускаем 10 параллельных потоков
        q.push(newAction);
    };
    q.push(URL);


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
// slimbot.startPolling();


},1800000); //каждые 30 мин

