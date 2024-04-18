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
    let [ N, ...nums ] = (await input());
    N = Number(N);
    let map = new Map();
    for (let i = 0; i < N*2; i++) {
        if (i % 2 === 0) continue;
        for (let title of nums[i].split(" ")) {
            if (!map.has(title)) {
                map.set(title, 0);
            }
            map.set(title, map.get(title)+1)
        }
    }

    let result = []
    for (let [ key, value ] of map.entries()) {
        if (value === N) {
            result.push(key)
        }
    }

    result.sort();
    console.log(result.length);
    console.log(result.join(" "));
})()