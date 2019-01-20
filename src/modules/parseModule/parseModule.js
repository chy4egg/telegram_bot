import tress from "tress";
// import request from "request"; //TODO: need?
import { get } from "needle";
import { load } from "cheerio";
import { resolve } from "url";

let newAction = "";

/**
 * The url parser
 * @param parseData {Object}
 */
export default class {
    constructor(parseData) {
        //outer card
        this.url = parseData.outer.url;
        this.itemName = parseData.outer.itemName;
        this.passedItemName = parseData.outer.passedItemName;
        //inner card
        this.targetItem = parseData.inner.targetItem;
        this.errorText = parseData.inner.errorText;
    }

    parse() {
        const sItemName = this.itemName;
        const sPassedItemName = this.passedItemName;
        const sTargetItem = this.targetItem;
        const sErrorText = this.errorText;

        return new Promise((resolve, reject)=> {
            const data = {
                alarmStatus : false,
                alarmMessage : ""
            }
            const q = tress((url, callback) => {
                get(url, function (err, res) {
                    if (err || !res) throw err;

                    const $ = load(res.body); //parse DOM
                    $(sItemName).each(function (i, item) {
						//in case of passed event
                        if ($(item).hasClass(sPassedItemName)) {

                        } //if event has been past
                        else {
                            //if an active evend card
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
                const q = tress((url, callback) =>  {
                    get(url, (err, res) => {
                        if (err) return;
                        const $ = load(res.body);
                        //информация о статусе регистрации
                        $(sTargetItem).each(function (i, item) {

                            if ($(item).text() == sErrorText) {
                                data.alarmStatus = false;
                                data.alarmMessage = ( "There is an active event but registration is closed: " + " - " + new Date() );
                                resolve(data);
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
    };
}
