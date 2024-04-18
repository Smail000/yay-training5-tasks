const { createInterface } = require("readline");
const fs = require('fs');

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

function inputTXT(filePath) {
    return new Promise((resolve, reject) => {
      fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      });
    });
  }

function divmod(num1, num2) {
    let mod = num1 % num2;
    let div = (num1-mod) / num2;
    return [ div, mod ]
}

function countFeild(feild=[""]) {
    let total = 0;
    for (let line of feild) {
        for (let letter of line) {
            if (letter === "#") total++;
        }
    }
    return total;
}

function countSquares(feild) {
    let newFeild = new Array(feild.length).fill(0).map(() => new Array(feild[0].length).fill(0))

    for (let i = 0; i < feild[0].length; i++) {
        if (feild[0][i] === "#") newFeild[0][i] = 1;
    }

    for (let j = 0; j < feild.length; j++) {
        if (feild[j][0] === "#") newFeild[j][0] = 1;
    }

    for (let i = 1; i < feild.length; i++) {
        for (let j = 1; j < feild[0].length; j++) {
            newFeild[i][j] = feild[i][j] === "#" ? (
                Math.min(newFeild[i][j-1], newFeild[i-1][j], newFeild[i-1][j-1]) + 1
            ) : 0;
        }
    }

    return newFeild;
}

function findAnswer(feild, k) {
    for (let i = k; i < feild.length-k; i++) {
        for (let j = k; j < feild[0].length-k; j++) {
            if (
                feild[i][j] >= k &&
                feild[i-k][j] >= k &&
                feild[i+k][j] >= k &&
                feild[i][j-k] >= k &&
                feild[i][j+k] >= k
            ) return true;
        }
    }
    return false;
}

(async () => {
    let [
        nums,
        ...feild
    ] = (await inputTXT("input.txt")).split("\n");
    // ] = (await input());

    // feild = modify(feild);
    // console.log("")
    
    let count = countFeild(feild);
    
    feild = countSquares(feild)
    // console.log(feild.join("\n"))

    let l = 1;
    let r = Math.trunc((count / 5)**0.5) + 1

    while (l <= r) {
        let m = Math.trunc((l+r) / 2)
        if (m === 1) {
            r = 1;
            break;
        }
        if (findAnswer(feild, m)) {
            l = m + 1
        } else {
            r = m - 1
        }
    }
    console.log(r)


})();