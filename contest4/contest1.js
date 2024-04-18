const { createInterface } = require("readline");


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

(async () => {

    let N;
    let nums;
    let K;
    let j = 0;
    let res = [];
    
    createInterface({
        input: process.stdin,
        output: process.stdout,
    }).on("line", (line) => {

        let data = line.toString().trim().split(" ").map(Number);

        if (j === 0) {
            N = data[0];
        } else if (j === 1) {
            nums = data;
            nums.sort((a, b) => a - b); // nlogn
        } else if (j === 2) {
            K = data[0];
        } else {

            if (j-3 < K) {
                let [ l, r ] = data;
        
                let lv = findLeft(nums, l);
                let rv = findRight(nums, r);
                
                if (lv > rv) {
                    res.push(0);
                } else if (lv === rv) {
                    if (nums[lv] >= l && nums[lv] <= r) {
                        res.push(1);
                    } else {
                        res.push(0);
                    }
                } else {
                    res.push(rv-lv+1);
                }
            }
        }
        j++;

    }).on("close", () => {
        console.log(res.join(" "))
    });
    
})()