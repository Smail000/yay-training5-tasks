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

async function solve() {
    let [ n, data ] = (await input());

    data = data.split(" ").map(Number).map(num => Math.abs(num % 2));

    let ans = (new Array(n-1)).fill("+");

    // console.log(data, ans, n)
    
    let sum = data.reduce((acc, i) => acc+i, 0);

    if (sum % 2 === 1) {
        console.log(ans.join(""));
        return;
    } else {
        let solved = false;
        for (let i = 0; i < n-1; i++) {
            if (( (data[i] + data[i+1]) === 1 ) || ( (data[i] + data[i+1]) === 2 )) {
                ans[i] = "x";
                solved = true;
                break;
            }
        }
        if (!solved) ans = [ "-1" ];
        console.log(ans.join(""));
        return;
    }

}

solve();
// let inp = ""

// inp = "0 0"; solve(inp.split(" ").length, inp);
// inp = "1 0"; solve(inp.split(" ").length, inp);
// inp = "0 1"; solve(inp.split(" ").length, inp);
// inp = "1 1"; solve(inp.split(" ").length, inp);

// inp = "0 0 0"; solve(inp.split(" ").length, inp);
// inp = "1 0 0"; solve(inp.split(" ").length, inp);
// inp = "0 1 0"; solve(inp.split(" ").length, inp);
// inp = "1 1 0"; solve(inp.split(" ").length, inp);

// inp = "0 0 1"; solve(inp.split(" ").length, inp);
// inp = "1 0 1"; solve(inp.split(" ").length, inp);
// inp = "0 1 1"; solve(inp.split(" ").length, inp);
// inp = "1 1 1"; solve(inp.split(" ").length, inp);