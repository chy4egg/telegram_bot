import tress from "tress";
import request from "request";
import { get } from "needle";
import { load } from "cheerio";
import { resolve } from "url";

let newAction = "";
let alarmStatus = "";

export default class {

    constructor(url) {
        this.url = url;
    }

    parse() {

        return new Promise((resolve, reject)=> {

            let data = {
                alarmStatus : false,
                alarmMessage : ""
            }

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
                                data.alarmMessage = ( "There is an active event, but registration is closed: " + " - " + new Date() );
                                reject(data);
                            } else {
                                data.alarmStatus = true;
                                data.alarmMessage = ( "Registration is open! Here is the link: " + newAction );
                                resolve(data);
                            }
                        });
                        callback();
                    });
                }, 10); // запускаем 10 параллельных потоков
                q.push(newAction);
            };
            q.push(this.url);
        });
    }

    testParse(){
        return new Promise((resolve,reject)=>{
            setTimeout(function(){
                resolve("Success!");
            }, 250);
        })
    }
}
