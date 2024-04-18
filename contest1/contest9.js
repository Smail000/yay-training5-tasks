const { createInterface } = require("readline");

function input() {
    return new Promise(function (resolve, reject) {
        const lines = [];
        createInterface({
            input: process.stdin,
            output: process.stdout,
        }).on("line", (line) => {
            lines.push(line.toString().trim());
        }).on("close", () => {
            resolve(lines)
        });
    })
}

function divmod(num1, num2) {
    let mod = num1 % num2;
    let div = (num1-mod) / num2;
    return [ div, mod ]
}

function isLeap(year) {
    return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0
}

function getDay(monthes, day, month) {
    return Object.values(monthes).slice(0, month).reduce((acc, i) => i+acc, 0)+day
}

(async () => {
    let [ N, year, ...dates] = (await input());
    N = Number(N);
    year = Number(year);

    let week = {
        "Monday": 0,
        "Tuesday": 0,
        "Wednesday": 0,
        "Thursday": 0,
        "Friday": 0,
        "Saturday": 0,
        "Sunday": 0
    }

    let monthes = {
        "January": 31,
        "February": 28 + Number(isLeap(year)),
        "March": 31,
        "April": 30,
        "May": 31,
        "June": 30,
        "July": 31,
        "August": 31,
        "September": 30,
        "October": 31,
        "November": 30,
        "December": 31
    }


    let weekShift = Object.keys(week).indexOf(dates.pop());

    for (let i = 0; i < weekShift; i++) {
        week[Object.keys(week)[i]]--;
    }

    for (let i = ((365+Number(isLeap(year))+weekShift) % 7); i < 7; i++) {
        week[Object.keys(week)[i]]--;
    }

    for (let date of dates) {
        let [ day, month ] = date.split(" ");
        day = Number(day);
        month = Object.keys(monthes).indexOf(month);
        let fullDay = getDay(monthes, day, month);
        week[Object.keys(week)[(fullDay - 1 + weekShift) % 7]]--;
    }

    let maxDay = "-";
    let maxValue = -Infinity

    let minDay = "-";
    let minValue = Infinity;

    for (let [day, value] of Object.entries(week)) {
        if (value > maxValue) {
            maxDay = day;
            maxValue = value;
        }

        if (value < minValue) {
            minDay = day;
            minValue = value;
        }
    }

    console.log(maxDay, minDay)

    

})()