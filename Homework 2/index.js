const EventEmitter = require('events');

class MyEmitter extends EventEmitter {}

const emitterObject = new MyEmitter();
let [...timers] = process.argv.slice(2);
let dates = []

timeParser();

emitterObject.on('run', (dates) => createTimer(dates));
emitterObject.emit('run', dates);

/**
 * Парсит указанные значения в формат даты
 */
function timeParser() {
    timers.forEach((element, index, arr) => {
        if (!isValidDate(element, /^\d\d-\d\d-\d\d-\d\d-\d\d\d\d$/gm)) {
            console.error('Укажите таймер в формате HH-MM-dd-mm-yyyy');
            return process.exit(1);
        }

        arr[index] = element.split('-');
        dates.push(
            new Date(arr[index][4], arr[index][3] - 1, arr[index][2], arr[index][0], arr[index][1], 0, 0)
        );
    });
}

/**
 * Проверка введённой даты на соответствие формату
 * @param date {string}
 * @param regexp {string}
 * @returns {boolean}
 */
function isValidDate(date, regexp) {
    let result = date.match(regexp);

    return result !== null;
}

/**
 * Создаёт таймеры
 * @param dates {array}
 */
function createTimer(dates) {
    let endDates = [];
    let currDate = new Date();

    dates.forEach((element, index) => {
        if (!isCorrectTimer(currDate, element)) {
            console.error('Таймер, который указан', index + 1 + '-ым', 'меньше текущей даты, работаем без него.');
        }

        let diff = element - currDate;
        if (diff > 0) {
            endDates.push({
                date: element,
                ms: diff
            });
        }
    });

    runTimers(endDates, 1000)
}

function runTimers(dates, ms) {
    setInterval(() => {
        let text = '';

        if (dates.length === 0) {
            console.log('Все таймеры отработали. До встречи!');
            clearInterval();
            emitterObject.removeAllListeners('run');
            return process.exit(1);
        }

        dates.forEach((el, index, arr) => {
            el.ms -= ms;

            if (el.ms < 0) {
                console.log('Таймер, установленный до', el.date, 'успешно отработал.');
                arr.splice(index, 1);
            } else {
                let resultDate = msToDate(el.ms);
                text += 'Таймер до ' + el.date +
                    '. Осталось: '
                    + resultDate.hours + ':' + resultDate.minutes + ':' + resultDate.seconds
                    + ' ' + resultDate.days + ' days'
                    + ' ' + resultDate.months + ' months'
                    + ' ' + resultDate.years + ' years' + ' | ';
            }
        });
        if (dates.length > 0) console.log(text);
    }, ms)
}

/**
 * Проверка, чтобы таймер был больше указанной даты
 * @param date
 * @param timer
 * @returns {boolean}
 */
function isCorrectTimer(date, timer) {
    return date <= timer;
}

/**
 * Форматирует дату из миллисекунд в дни
 * @param ms
 * @returns {{hours: number, seconds: number, months: number, minutes: number, days: number, years: number}}
 */
function msToDate(ms) {
    let years = 0, months = 0, days = 0, hours = 0, minutes = 0, seconds = 0;

    if (ms >= 1000) {
        seconds = ms / 1000;
    }

    if (seconds >= 60) {
        minutes = Math.floor(seconds / 60);
        seconds -= minutes * 60;
    }

    if (minutes >= 60) {
        hours = Math.floor(minutes / 60);
        minutes -= hours * 60;
    }

    if (hours >= 24) {
        days = Math.floor(hours / 24);
        hours -= days * 24;
    }

    if (days >= 30) {
        months = Math.floor(days / 30);
        days -= months * 30;
    }

    if (months > 12) {
        years = Math.floor(months / 12);
        months -= years * 12;
    }

    return {
        years: Math.floor(years),
        months: Math.floor(months),
        days: Math.floor(days),
        hours: Math.floor(hours),
        minutes: Math.floor(minutes),
        seconds: Math.floor(seconds)
    };
}