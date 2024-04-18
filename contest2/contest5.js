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

let debug = true;

(async () => {
    let [ N, ...nums ] = (await input())
    N = Number(N);
    let i = 1;
    nums = nums.map(value => value.split(" ").map(Number)).map(([ l, r ]) => ([ l, r, i++]));
    // console.log(nums);
    let maxR = undefined;
    let moreThenZero = [];


    let maxL = undefined;
    let lessOrEqualThenZero = [];

    for (let num of nums) {
        let [ l, r, i ] = num;
        if (l - r > 0) {
            // Это значение пойдет в moreThenZero
            if (maxR === undefined) {
                maxR = num;
            } else if (r > maxR[1] || (maxR[1] === r && l > maxR[0])) {
                moreThenZero.push(maxR);
                maxR = num;
            } else {
                moreThenZero.push(num);
            }
        } else {
            // Это значение пойдет в lessOrEqualThenZero
            if (maxL === undefined) {
                maxL = num;
            } else if (l > maxL[0]) {
                lessOrEqualThenZero.push(maxL)
                maxL = num;
            } else {
                lessOrEqualThenZero.push(num)
            }
        }
    }


    let answerRaw = [...moreThenZero];

    if (maxR !== undefined) {
        answerRaw.push(maxR)
    }

    if (maxL !== undefined) {
        answerRaw.push(maxL)
    }

    answerRaw = [...answerRaw, ...lessOrEqualThenZero];
    // console.log(answerRaw.map(([l, r, i]) => [l, r, l-r, i]))
    let max = 0;
    let sum = 0;

    for (let [l, r, i] of answerRaw) {
        sum += l;
        max = Math.max(max, sum);
        sum -= r;
    }

    console.log(max)
    
    console.log(answerRaw.map(([l, r, i]) => i).join(" "))
    
})();