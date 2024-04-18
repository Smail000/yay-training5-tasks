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
    let [ n, k, d ] = (await input())[0].split(" ").map(Number);

    n *= 10;
    let mod = k - (n % k);

    if (n % k === 0) {
        console.log(n.toString() + "0".repeat(d-1));
        return;
    }

    if (0 <= mod && mod <= 9) {
        n += mod;
    } else {
        console.log(-1);
        return;
    }

    console.log(n.toString() + "0".repeat(d-1));
    return;
    
})();