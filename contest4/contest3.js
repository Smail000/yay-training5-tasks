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

function findAnswer(sums, l, s) {
    let N = sums.length;
    let lb = 0;
    l = Number(l)
    let rb = sums.length-l;

    if (rb < 0) return -1;

    while (lb <= rb) {
        let m = Math.trunc((lb+rb) / 2);
        let p1 = ( m === 0 ? 0n : sums[m-1] )
        let p2 = sums[m+l-1]
        if (p2 - p1 === s) {
            return m;
        } else if (s < p2 - p1) {
            rb = m - 1;
        } else {
            lb = m + 1;
        }
    }

    // console.log(lb, rb, l, s);
    return ( lb+l-1 < N && sums[lb+l-1] - ( lb === 0 ? 0n : sums[lb-1] ) === s ) ? lb : -1
}

class Map_2D {
    constructor() {
        this.map = new Map();
    }

    set(x, y, value) {
        if (!this.map.has(y)) {
            this.map.set(y, new Map());
        }

        this.map.get(y).set(x, value);
    }

    has(x, y) {
        return this.map.has(y) && this.map.get(y).has(x)
    }

    get(x, y) {
        return this.map.get(y).get(x)
    }


}

(async () => {
    let [
        [ N, M ],
        nums,
        ...pairs
    ] = (await input()).map(line => line.split(" ").map(BigInt));

    // console.time("1")

    // nums = new Array(2*10**5).fill(10n**9n)
    // for (let i = 1; i < 2*10**5; i++) [
    //     nums[i] = nums[i-1]+1n
    // ]

    // pairs = new Array(2*10**5).fill(0)
    // pairs[0] = [1n, 10n**16n]
    // for (let i = 1; i < 2*10**5; i++) {
    //     pairs[i] = [pairs[i-1][0]+1n, 10n**16n]
    // }

    // console.timeEnd("1")

    // console.time("2")
    for (let i = 1; i < nums.length; i++) {
        nums[i] = nums[i-1] + nums[i]
    }
    // console.timeEnd("2")

    let map = new Map_2D();
    let res = new Array(pairs.length).fill(-1);

    // console.time("3")
    for (let i = 0; i < pairs.length; i++) {
        let [l, s] = pairs[i];
        
        let ans;
        if (!map.has(l, s)) {
            // console.log("counted")
            ans = findAnswer(nums, l, s)
            map.set(l, s, ans);
        } else {
            // console.log("cached")
            ans = map.get(l, s);
        }
        
        if (ans !== -1) {
            res[i] = ans+1;
        }
    }

    console.log(res.join('\n'))
    // console.timeEnd("3")

})()