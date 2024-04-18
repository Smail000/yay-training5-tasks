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
    let [ dicts, words ] = (await input()).map(line => line.split(" "))

    let dict = new Map();
    for (let word of dicts) {
        if (!dict.has(word.length)) {
            dict.set(word.length, [])
        }
        dict.get(word.length).push(word)
    }

    let keys = [...dict.keys()].sort((a, b) => a - b)

    let result = []
    for (let word of words) {
        let isDone = false;
        for (let length of keys) {
            if (length <= word.length) {
                if (dict.get(length).includes(word.slice(0, length))) {
                    result.push(word.slice(0, length));
                    isDone = true;
                    break;
                }
            } else {
                break;
            }
        }
        if (!isDone) {
            result.push(word);
        }
    }

    console.log(result.join(" "))

})()