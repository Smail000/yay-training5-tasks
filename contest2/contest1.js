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
    let [ K, ...data ] = (await input())
    data = data.map(value => value.split(" ").map(Number))
    K = Number(K);

    let minL = data[0][0];
    let maxL = data[0][0];

    let minR = data[0][1];
    let maxR = data[0][1];

    for (let i = 1; i < data.length; i++) {
        let [l, r] = data[i];
        minL = Math.min(minL, l)
        minR = Math.min(minR, r)
        maxL = Math.max(maxL, l)
        maxR = Math.max(maxR, r)
    }
    console.log(minL, minR, maxL, maxR)
})();