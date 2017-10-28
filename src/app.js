var tress = require('tress');
var needle = require('needle');
var cheerio = require('cheerio');
var resolve = require('url').resolve;
var fs = require('fs');

// var URL = 'http://www.ferra.ru/ru/techlife/news/';
var URL = 'https://pitercss.timepad.ru/events/';
var results = [];
var newAction = '';
var alarm = false;

var q = tress(function(url, callback){
    needle.get(url, function(err, res){
        if (err) throw err;

        // парсим DOM
        var $ = cheerio.load(res.body);

        // //информация о новости
        // if($('.b_infopost').contents().eq(2).text().trim().slice(0, -1) === 'Алексей Козлов'){
        //     results.push({
        //         title: $('h1').text(),
        //         date: $('.b_infopost>.date').text(),
        //         href: url,
        //         size: $('.newsbody').text().length
        //     });
        // }

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

        //список новостей
        // $('.b_rewiev p>a').each(function() {
        //     q.push($(this).attr('href'));
        // });

        //паджинатор
        // $('.bpr_next>a').each(function() {
        //     // не забываем привести относительный адрес ссылки к абсолютному
        //     q.push(resolve(URL, $(this).attr('href')));
        // });

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
                    console.log('регистрация закрыта');
                    alarm = false;
                } else {
                    console.log( 'Круто, регистрация открыта' );
                    alarm = true;
                }
            });

            callback();
        });
    }, 10); // запускаем 10 параллельных потоков

    q.push(newAction);

};

q.push(URL);