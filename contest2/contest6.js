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
    let [
        [ N ],
        nums,
        [ A, B, K ]
    ] = (await input()).map(line => line.split(" ").map(Number))

    let startL;
    let endL;

    let startR;
    let endR;
    
    let ost;

    [ startR, ost ] = divmod(A, K);
    if (ost === 0 && startR > 0) startR--;

    [ endR, ost ] = divmod(B, K);
    if (ost === 0 && endR > 0) endR--;

    if (endR - startR + 1 >= N) {
        console.log(Math.max(...nums));
        return;
    }


    [ , startR ] = divmod(startR, N);
    [ , endR ] = divmod(endR, N);
    

    
    // console.log(startR, endR);
    

    let max;
    if (endR >= startR) {
        max = Math.max(...nums.slice(startR, endR+1))
    } else {
        max = Math.max(...nums.slice(startR), ...nums.slice(0, endR+1))
    }

    startL = N-endR;
    endL = N-startR;
    // console.log(startL, endL);

    if (endL >= startL) {
        max = Math.max(...nums.slice(startL, endL+1), max)
    } else {
        max = Math.max(...nums.slice(startL), ...nums.slice(0, endL+1), max)
    }

    console.log(max);



    
})();