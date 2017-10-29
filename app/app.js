var tress = require('tress');
var request = require('request');
var needle = require('needle');
var cheerio = require('cheerio');
var resolve = require('url').resolve;
var fs = require('fs');
var URL = 'https://pitercss.timepad.ru/events/';
var results = [];
var newAction = '';
var alarm = false;
var alarmStatus = '';

var q = tress(function(url, callback){
    needle.get(url, function(err, res){
        if (err) throw err;

        // парсим DOM
        var $ = cheerio.load(res.body);

        //информация о новости
        $('.t-card').each(function(i,item){
            //todo на продакшн поменять условия. Если не находит данный класс. (сейчас - если находит)
            if($(item).hasClass('t-card_event__passed')) {
                let href = $(item).children().children().next().children().children().attr('href');
                newAction = href;
            } else {
                console.log( 'false' );
            }
        });

        callback();
    });
}, 10); // запускаем 10 параллельных потоков

q.drain = function(){

    var q = tress(function(url, callback){
        needle.get(url, function(err, res){
            if (err) throw err;
            var $ = cheerio.load(res.body);
            //информация о статусе регистрации
            $('.b-actionbox__heading').each(function(i,item){
                if ($(item).text() === 'Регистрация на событие закрыта') {
                    alarmStatus = 'Регистрация закрыта';
                    alarm = false;
                } else {
                    alarmStatus = 'Регистрация открыта! Успей зарегаться по ссылке' + ' ' + newAction;
                    alarm = true;
                }
            });

            callback();
        });
    }, 10); // запускаем 10 параллельных потоков

    q.push(newAction);

};

q.push(URL);


//telegram bot
// const TOKEN = '418099931:AAF7wgbCO_e29pqv4JM4UMiHoIwDfm3teBw';
//
// const Telegraf = require('telegraf');
// const app = new Telegraf(TOKEN);
//
// app.command('start', function({ from, reply }) {
//     console.log('start', from)
//     return reply('Привет. Я - бот. Меня написал Александр Михайлов. По всем вопросам - chy4egg@gmail.com')
// });
//
// app.use(function(ctx){
//    ctx.reply( alarmStatus );
// });

// app.startPolling();


const TELEGRAM_BOT_TOKEN = '418099931:AAF7wgbCO_e29pqv4JM4UMiHoIwDfm3teBw';

const Slimbot = require('slimbot');
const slimbot = new Slimbot(TELEGRAM_BOT_TOKEN);

slimbot.sendMessage('67363885', 'ахахах работает))').then(message => {
    console.log(message);
    console.log(message.result);
});

// Call API
slimbot.startPolling();