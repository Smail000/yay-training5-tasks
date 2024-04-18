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
    let [ N, nums ] = (await input())
    N = Number(N);
    nums = nums.split(" ").map(Number);

    let max = 0
    let sum = nums[0]
    for (let i = 1; i < N; i++) {
        if (nums[i] > max) max = nums[i];
        sum += nums[i]; 
    }

    if (sum >= max*2) {
        console.log(sum)
    } else {
        console.log(max*2 - sum)
    }


    
})();