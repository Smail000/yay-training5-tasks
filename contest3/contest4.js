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
    let [ [ N, K ], nums ] = (await input()).map(line => line.split(" ").map(Number));

    let map = new Map();

    for (let i = 0; i < N; i++) {
        let num = nums[i];
        if (!map.has(num)) {
            map.set(num, i);
        } else {
            if (i - map.get(num) <= K) {
                console.log("YES");
                return;
            }
            map.set(num, i)
        }
    }
    console.log("NO");
    return;

})()