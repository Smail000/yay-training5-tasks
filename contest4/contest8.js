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


function findMinWin(pairs, rectangles, i) {
    let height = pairs[i][0];

    let l = i;
    let r = pairs.length-1;

    while (l <= r) {
        let m = Math.trunc( (l+r) / 2 );

        let slice = rectangles[m];
        let mHeight = pairs[m][0];
        let newHeight = height+slice;

        if (mHeight >= newHeight) {
            r = m - 1;
        } else {
            l = m + 1;
        }
    }

    // return r
    let sliceId = l;
    let slice = rectangles[sliceId];
    
    l = height+slice;
    r = pairs[sliceId][0];

    while (l <= r) {
        let m = Math.trunc( (l+r) / 2 );

        // (r-m)*(pairs.length-i-1)

        if (m >= height+slice+(pairs[sliceId][0]-m)*(pairs.length-sliceId)) {
            r = m - 1;
        } else {
            l = m + 1;
        }
    }

    // let lastHeight = height+slice+(pairs[sliceId][0]-l)*(pairs.length-sliceId)
    console.log(l, r, pairs[sliceId][0])
    if (l > r) l = r;
    return [ l-pairs[i][0]+1, sliceId]

}

(async () => {
    let [
        [ N ],
        ...pairs
    ] = (await input()).map(line => line.split(" ").map(Number));
    // ] = (await inputTXT("03")).split("\n").map(line => line.split(" ").map(Number));
    pairs = pairs.slice(0, N)
    // input.txt

    let sourceOrder = [...pairs]

    if (pairs.length === 1) {
        console.log(pairs[0][1].toString())
        console.log("1")
        console.log(pairs[0][0].toString())
        return;
    }

    // Сорировка ведрами // 2n (2*10**5)
    let feild = new Array(10**5).fill(0).map(() => []);
    for (let pair of pairs) {
        feild[pair[0]].push(pair);
    }
    let j = 0;
    for (let i = 0; i < feild.length; i++) {
        for (let pair of feild[i]) {
            pairs[j] = pair;
            j++
        }
    }

    let bestPrice = pairs.at(-1)[1] === -1 && pairs.at(-2)[1] === -1 ? [ undefined, undefined, undefined ] : (
        pairs.at(-1)[1] !== -1 && pairs.at(-2)[1] === -1 ? [ pairs.length-1, pairs.at(-1)[1], pairs.length-1 ] : (
            pairs.at(-1)[1] === -1 && pairs.at(-2)[1] !== -1 ? [ pairs.length-2, pairs.at(-2)[1] + Math.trunc((pairs.at(-1)[0] - pairs.at(-2)[0]) / 2) + 1, pairs.length-1 ] : (
                pairs.at(-1)[1] < pairs.at(-2)[1] + Math.trunc((pairs.at(-1)[0] - pairs.at(-2)[0]) / 2) + 1 ? (
                    [ pairs.length-1, pairs.at(-1)[1], pairs.length-1 ]
                ) : (
                    [ pairs.length-2, pairs.at(-2)[1] + Math.trunc((pairs.at(-1)[0] - pairs.at(-2)[0]) / 2) + 1, pairs.length-1 ]
                )
            )
        )
    );


    
    let winPrices = new Array(pairs.length).fill(0)
    // winPrices[pairs.length-1] = 0;
    winPrices[pairs.length-2] = Math.trunc((pairs.at(-1)[0] - pairs.at(-2)[0]) / 2) + 1;
    
    let rectangles = new Array(pairs.length).fill(0); // [sum, lengthX, lengthY]
    rectangles[pairs.length-2] = pairs.at(-1)[0] - pairs.at(-2)[0]


    for (let i = pairs.length-3; i > -1; i--) {
        rectangles[i] = rectangles[i+1] + (pairs[i+1][0]-pairs[i][0])*(pairs.length-i-1)

        let [price, sliceId] = findMinWin(pairs, rectangles, i)
        // console.log(price, sliceId)
        winPrices[i] = price;
        
        if (pairs[i][1] !== -1) {
            if (bestPrice[1] === undefined || bestPrice[1] > pairs[i][1]+winPrices[i]) {
                bestPrice = [ i, pairs[i][1]+winPrices[i], sliceId ]
            }

        }
        
    }

    // console.log("rectangles", rectangles)
    // console.log("winPrices", winPrices)
    // console.log("pairs", pairs)
    // console.log("bestPrice", bestPrice)
    // console.log("sourceOrder", sourceOrder)
    let sourceHeight = pairs[bestPrice[0]][0]
    console.log(bestPrice[1].toString()) // Лучшая цена
    console.log((sourceOrder.indexOf(pairs[bestPrice[0]])+1).toString())

    if (bestPrice[0] === pairs.length-1) {
        console.log(sourceOrder.map(_ => _[0]).join(" "))
        return;
    }

    let height = pairs[bestPrice[0]][0];
    pairs[bestPrice[0]][0] = height + rectangles[bestPrice[2]];
    for (let i = pairs.length-1; i > bestPrice[2]; i--) {
        pairs[i][0] = pairs[bestPrice[2]][0]
    }

    // Тест
    let sliceId = bestPrice[2]
    let slice = rectangles[sliceId];
    l = height+slice;
    r = pairs[sliceId][0];

    while (l <= r) {
        let m = Math.trunc( (l+r) / 2 );

        // (r-m)*(pairs.length-i-1)

        if (m >= height+slice+(pairs[sliceId][0]-m)*(pairs.length-bestPrice[0]-1)) {
            r = m - 1;
        } else {
            l = m + 1;
        }
    }

    // console.log(l, r)
    height += (pairs[sliceId][0]-r)*(pairs.length-sliceId) + slice;
    pairs[bestPrice[0]][0] = height;
    // console.log(height)

    for (let i = sliceId; i < pairs.length; i++) {
        pairs[i][0] = r;
    }

    let i = sliceId;
    // console.log("pairs", pairs)
    
    // console.log(pairs[bestPrice[0]][0], sourceHeight+bestPrice[1]-pairs[bestPrice[0]][1])
    while (pairs[bestPrice[0]][0] < sourceHeight+bestPrice[1]-pairs[bestPrice[0]][1] && i < pairs.length) {
        pairs[bestPrice[0]][0]++;
        pairs[i][0]--;
        i++;
    }

    console.log(sourceOrder.map(_ => _[0]).join(" "))
})();