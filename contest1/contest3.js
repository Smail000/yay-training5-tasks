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

(async () => {
    let [ n, ...data ] = (await input());
    let value = 0;

    for (num of data.map(Number)) {
        let [ total, ost ]  = divmod(num, 4);

        if (ost === 3 || ost === 2) total += 2;
        if (ost === 1) total += 1;

        value += total;

    }

    console.log(value)

})();