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

function check(ultimateMap, x, y) {
    return ultimateMap.has(y) && ultimateMap.get(y).has(x);
}


(async () => {
    let [ [ N ], ...nums ] = (await input()).map(line => line.split(" ").map(Number));

    let ultimateMap = new Map();

    for (let [x, y] of nums) {
        if (!ultimateMap.has(y)) {
            ultimateMap.set(y, new Set());
        }
        ultimateMap.get(y).add(x);
    }

    let result = undefined;

    for (let i = 0; i < N; i++) {
        for (let j = i+1; j < N; j++) {
            let p1 = nums[i];
            let p2 = nums[j];
            
            if ((p1[0] > p2[0]) || (p1[0] === p2[0] && p1[1] > p2[1])) {
                [p1, p2] = [p2, p1];
            }
            // console.log(p1[0], p1[1])
            // console.log(p2[0], p2[1])
            
            let dx = p2[0] - p1[0];
            let dy = p1[1] - p2[1];
            // console.log(dx, dy)

            let predict_p1 = check(ultimateMap, p1[0]-dy, p1[1]-dx);
            let predict_p2 = check(ultimateMap, p2[0]-dy, p2[1]-dx);

            let predict_p3 = check(ultimateMap, p1[0]+dy, p1[1]+dx);
            let predict_p4 = check(ultimateMap, p2[0]+dy, p2[1]+dx);

            if ((predict_p1 && predict_p2) || (predict_p3 && predict_p4)) {
                console.log(0);
                return;
            }

            if (predict_p1) {
                result = [p2[0]-dy, p2[1]-dx]
            } else if (predict_p2) {
                result = [p1[0]-dy, p1[1]-dx]
            } else if (predict_p3) {
                result = [p2[0]+dy, p2[1]+dx]
            } else if (predict_p4) {
                result = [p1[0]+dy, p1[1]+dx]
            }

            if (result === undefined) {
                result = [p1[0]-dy, p1[1]-dx, p2[0]-dy, p2[1]-dx]
            }


        }
    }

    console.log(result.length / 2);
    console.log(result[0], result[1])
    if (result.length === 4) {
        console.log(result[2], result[3])
    }

})()