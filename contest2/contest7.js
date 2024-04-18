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

function divmod(num1, num2) {
    let mod = num1 % num2;
    let div = (num1-mod) / num2;
    return [ div, mod ]
}

(async () => {
    let [ t, ...data ] = (await input())
    for (let i = 0; i < t; i++) {
        let N = Number(data[i*2])
        let nums = data[i*2+1].split(" ").map(Number);

        let lengthArray = [];
        let currentLength = 1;
        let currentMin = nums[0];
        let j = 1;
        while (j <= N) {
            let num = j === N ? 0 : nums[j];
            if (currentLength+1 <= Math.min(currentMin, num)) {
                currentLength++;
                currentMin = Math.min(currentMin, num);
            } else {
                lengthArray.push(currentLength)
                currentLength = 1
                currentMin = num
            }

            j++;
        }
        console.log(lengthArray.length)
        console.log(lengthArray.join(" "))
    }
})();