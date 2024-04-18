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

function countId(n) { // из номера ряда в порядковый номер его последнего элемента
    if (typeof n === "bigint") {
        return (n + n**2n) / 2n
    }
}

function pow2(num) {
    let x = num;
    let y = BigInt(0);
    while (x > y) {
        x = (x + y) / 2n;
        y = num / x;
    }
    return x;
}

(async () => {
    let [ [ N ] ] = (await input()).map(line => line.split(" ").map(BigInt));

    let rowId = pow2(2n*N);
    if (countId(rowId) < N) rowId++;

    let ost = N-countId(rowId)+rowId;

    let top;
    let bottom;
    if (rowId % 2n === 0n) {
        top = rowId-ost+1n
        bottom = ost 
    } else {
        top = ost;
        bottom = rowId-ost+1n
    }

    console.log(`${top}/${bottom}`)

})()