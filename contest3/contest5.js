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
    let [ [ N1 ], nums1, [ N2 ], nums2, [ N3 ], nums3 ] = (await input()).map(line => line.split(" ").map(Number));

    let map = new Map();

    for (let num of nums1) {
        if (!map.has(num)) {
            map.set(num, [0, 0, 0]);
        }
        map.get(num)[0] = 1
    }

    for (let num of nums2) {
        if (!map.has(num)) {
            map.set(num, [0, 0, 0]);
        }
        map.get(num)[1] = 1
    }

    for (let num of nums3) {
        if (!map.has(num)) {
            map.set(num, [0, 0, 0]);
        }
        map.get(num)[2] = 1
    }

    let result = [];
    for (let [ key, value ] of map.entries()) {
        if (value.reduce((acc, i) => i+acc, 0) > 1) {
            result.push(key)
        }
    }
    console.log(result.sort((a, b) => a - b).join(" "))

})()