import tress from "tress";
import request from "request";
import { get } from "needle";
import { load } from "cheerio";
import { resolve } from "url";
let newAction = "";
let alarmStatus = "";
let data = {
    alarmStatus : false,
    alarmMessage : ""
}

export default class {

    constructor(url) {
        this.url = url;
    }

    parse() {
        const q = tress((url, callback)=> {
            get(url, function (err, res) {
                if (err) throw err;
                var $ = load(res.body); //parse DOM
                $(".t-card").each(function (i, item) {
                    if ($(item).hasClass("t-card_event__passed")) {} //if event has been past
                    else {
                        //если у заголовка нет статуса 'passed' (т.е. есть активные мероприятия)
                        let href = $(item)
                            .children()
                            .children()
                            .next()
                            .children()
                            .children()
                            .attr("href");
                        newAction = href;
                    }
                });
                callback();
            });
        }, 10); // запускаем 10 параллельных потоков

        //ищем внутри новости
        q.drain = function () {
            var q = tress(function (url, callback) {
                get(url, function (err, res) {
                    if (err) {
                        return;
                    }
                    var $ = load(res.body);

                    //информация о статусе регистрации
                    $(".b-actionbox__heading").each(function (i, item) {
                        if ($(item).text() == "Регистрация на событие закрыта") {
                            data.alarmStatus = false;
                            data.alarmMessage = "Есть активное событие, но регистрация в данный момент закрыта";
                        } else {
                            data.alarmStatus = true;
                            data.alarmMessage = "Регистрация открыта!";
                        }
                    });
                    callback();
                });
            }, 10); // запускаем 10 параллельных потоков
            q.push(newAction);
        };
        q.push(this.url);

        return data;
    };
}
