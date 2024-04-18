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

(async () => {
    let [ NK, nums ] = (await input())

    let [ N, K ] = NK.split(" ").map(Number);
    K++;

    nums = nums.split(" ").map(Number);
    if (N === 1) {
        console.log(0)
        return;
    } else if (N === 2) {
        console.log(nums[1] - nums[0] >= 0 ? nums[1] - nums[0] : 0)
        return;
    }

    if (N < K) K = N;

    let maxStrategyIncome = 0;
    let start;

    for (start = 0; K < N+1; K++, start++) {
        let slice = nums.slice(start, K);
        let buy = slice[0];
        let sell = Math.max(...slice.slice(1));
        let sallery = sell - buy;
        // console.log(slice)
        maxStrategyIncome = Math.max(maxStrategyIncome, sallery >= 0 ? sallery : 0)
    }

    for (; start < K-2; start++) {
        let slice = nums.slice(start, K);
        let buy = slice[0];
        let sell = Math.max(...slice.slice(1));
        let sallery = sell - buy;
        // console.log(slice)
        maxStrategyIncome = Math.max(maxStrategyIncome, sallery >= 0 ? sallery : 0)
    }
    console.log(maxStrategyIncome)



    
})();