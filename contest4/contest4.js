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

function countLength(nums, width) {
    let pointer = 0;
    let length = 1;

    for (let num of nums) {
        if (pointer+num > width) {
            pointer = num;
            length++;

            if (pointer > width) {
                return -1;
            }

            pointer++;
        } else {
            pointer += num+1;
        }
    }
    return length;
}


(async () => {
    let [
        [ W, N, M ],
        nums1,
        nums2
    ] = (await input()).map(line => line.split(" ").map(Number));

    // let [W, N, M] = [15, 6, 6]
    // let nums1 = [2, 2, 2, 3, 2, 2]
    // let nums2 = [3, 3, 5, 2, 4, 3]

    let l = Math.max(...nums1);
    let r = W - Math.max(...nums2);
    
    // console.log(countLength(nums2, 8))
    
    let res1;
    let res2;
    let min = Infinity;
    while (l <= r) {
        let m = Math.trunc((l+r) / 2);

        res1 = countLength(nums1, m);
        res2 = countLength(nums2, W-m);
        min = Math.min(min, Math.max(res1, res2))

        if (res2 >= res1) {
            r = m - 1;
        } else {
            l = m + 1;
        }
    }

    // console.log(l, r)
    console.log(min)


})()