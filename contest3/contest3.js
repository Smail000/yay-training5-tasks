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
    let [ [ N ], nums ] = (await input()).map(line => line.split(" ").map(Number));

    let min = nums[0];
    let max = nums[0];
    
    for (let num of nums) {
        min = Math.min(min, num);
        max = Math.max(max, num);
    }

    let feild = new Array(max - min + 2).fill(0);
    let uniq = new Set();

    for (let num of nums) {
        feild[num-min]++;
        uniq.add(num)
    }

    let res = Infinity;
    for (let num of uniq.values()) {
        let m = feild[num-min];
        let r = feild[num-min+1];
        res = Math.min(res, N - (m+r));
        // console.log(m, r, res)
    }
    console.log(res);

})()