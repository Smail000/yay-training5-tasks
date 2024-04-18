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
    let [ [ N ], ...nums ] = (await input()).map(line => line.split(" ").map(Number));
    
    let feild = Array(N).fill(1).map(() => ([]));
    for (let [ y, x ] of nums) {
        feild[y-1].push(x);
    }

    let steps = 0;

    let i = 0;
    let emptyLine = -1;
    let extraShip = -1;
    while (i < N) {
        if (feild[i].length !== 1) {
            // Основная логика
            if (feild[i].length === 0 && emptyLine === -1) {
                emptyLine = i;
            } else if (feild[i].length > 1 && extraShip === -1) {
                extraShip = i
            }

            if (extraShip !== -1 && emptyLine !== -1) {
                // console.log(extraShip, emptyLine)
                feild[emptyLine].push(feild[extraShip].shift())
                steps += Math.abs(emptyLine - extraShip);
                i = Math.min(extraShip, emptyLine);
                emptyLine = -1;
                extraShip = -1;
                continue;
            }
        }

        i++;
    }

    let shipCounter = Array(N).fill(0);
    for (let [ ship ] of feild) {
        shipCounter[ship-1]++;
    }

    // console.log(shipCounter);

    
    let currentSteps = 0;
    for (let j = 0; j < N; j++) {
        currentSteps += shipCounter[j] * j;
    }

    let summatorL = 0;
    let summatorR = 0;
    for (let j = 0; j < N; j++) {
        summatorR += shipCounter[j];
    }
    
    let minSteps = currentSteps;
    // console.log(currentSteps)

    for (let j = 1; j < N; j++) {
        summatorL += shipCounter[j-1];
        summatorR -= shipCounter[j-1];
        currentSteps -= summatorR;
        currentSteps += summatorL;
        minSteps = Math.min(currentSteps, minSteps);
    }

    
    console.log(minSteps+steps);

})();