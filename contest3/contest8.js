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

class Map_2D {
    constructor() {
        this.map = new Map();
        this.max = 0;
    }

    toggle(x, y) {
        if (!this.map.has(y)) {
            this.map.set(y, new Map());
        }

        if (!this.map.get(y).has(x)) {
            this.map.get(y).set(x, 0);
        }

        this.map.get(y).set(x, this.map.get(y).get(x)+1); 

        this.max = Math.max(this.max, this.map.get(y).get(x));
    }
}

(async () => {
    let [ [ N ], ...nums ] = (await input()).map(line => line.split(" ").map(Number));

    let set1 = nums.slice(0, N);
    let set2 = nums.slice(N);

    let map = new Map_2D();
    for (let match of set1) {
        let [x10, y10, x11, y11] = match;
        if (x11 > x10 || (x11 === x10 && y11 > y10)) {
            [x10, y10, x11, y11] = [x11, y11, x10, y10];
        }
        let [dx1, dy1] = [x11-x10, y10-y11];

        for (let match of set2) {
            let [x20, y20, x21, y21] = match;
            if (x21 > x20 || (x21 === x20 && y21 > y20)) {
                [x20, y20, x21, y21] = [x21, y21, x20, y20];
            }
            let [dx2, dy2] = [x21-x20, y20-y21];

            if (dx1 === dx2 && dy1 === dy2) {
                map.toggle(x10-x20, y10-y20)
            }
        }
    }
    console.log(N - map.max);
})()