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

function findLeft(nums, value) {
    let l = 0;
    let r = nums.length-1;

    if (nums.length === 0 || nums.length === 1) return 0;
    
    while (l+1 < r) {
        let m = Math.trunc((l+r) / 2);
        if (value <= nums[m]) {
            r = m;
        } else {
            l = m;
        }
    }

    if (r === 1 && nums[0] >= value) r = 0;

    return r
}

function findRight(nums, value) {
    let l = 0;
    let r = nums.length-1;
    
    if (nums.length === 0 || nums.length === 1) return 0;

    while (l+1 < r) {
        let m = Math.trunc((l+r) / 2);
        if (value < nums[m]) {
            r = m;
        } else {
            l = m;
        }
    }

    if (l === nums.length-2 && nums[nums.length-1] <= value) l = nums.length-1;

    return l
}

function countArea(N) {
    if (typeof N === "bigint") {
        return ( N**3n + 6n*N**2n + 5n*N**1n - 6n ) / 6n;
    } else {
        return ( N**3 + 6*N**2 + 5*N**1 - 6 ) / 6;
    }
}

function countShips(A) {
    let p = ((729*A**2 - 1029)**0.5 + 27*A )**(1/3)
    let s1 = ( p ) / (3**(2/3))
    let s2 = 7 / ( (3*p**3)**(1/3) )
    return s1 + s2 - 2;
}

function countShips_(A) {
    let p = pow2(729n*A**2n - 1029n) + 27n*A
    let s1 = pow3(p / 3n**2n)
    let s2 = 7n / ( pow3(3n*pow3(p)**3n) )
    return s1 + s2 - 2n;
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

function pow3(num) {
    let x = num;
    let y = BigInt(0);
    while (x > y) {
        x = (2n * x + num / (x * x)) / 3n;
        y = num / (x * x);
    }
    return x;
}

(async () => {
    let [ [ N ] ] = (await input()).map(line => line.split(" ").map(BigInt));

    if (N === 0n) {
        console.log(0);
        return
    }

    let predictValue = countShips_(N);
    
    let padding = 3n; 
    let i;
    for (i = predictValue-padding; countArea(i) <= N; i++) {}

    console.log(Number(i-1n));

})()