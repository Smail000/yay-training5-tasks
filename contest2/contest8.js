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
        [ N, M ],
        ...nums
    ] = (await input()).map(line => line.split(" ").map(Number))


    let max1 = undefined;
    let max2 = undefined;

    for (let y = 0; y < nums.length; y++) {
        for (let x = 0; x < nums[0].length; x++) {
            if (max1 === undefined) {
                max1 = [nums[y][x], x, y]
            } else if (max2 === undefined) {
                if (nums[y][x] >= max1[0]) {
                    max2 = max1;
                    max1 = [nums[y][x], x, y];
                } else {
                    max2 = [nums[y][x], x, y];
                }
            } else if (nums[y][x] >= max1[0]) {
                max2 = max1;
                max1 = [nums[y][x], x, y];
            } else if (nums[y][x] >= max2[0]) {
                max2 = [nums[y][x], x, y];
            }
        }
    }

    // console.log(max1)
    // console.log(max2)

    if (max1[1] === max2[1]) {
        // Вычеркиваем горизонтальную черту max1[1]
        // И ищем еще одно максимальное число для вертикальной черты
        let max3 = undefined
        for (let y = 0; y < nums.length; y++) {
            for (let x = 0; x < nums[0].length; x++) {
                if (x === max1[1]) {
                    continue;
                } else if (max3 === undefined || nums[y][x] > max3[0]) {
                    max3 = [nums[y][x], x, y]
                }
            }
        }
        console.log(max3[2]+1, max1[1]+1);
        return;
    } else if (max1[2] === max2[2]) {
        // Вычеркиваем вертикальную черту max1[2]
        // И ищем еще одно максимальное число для горизонтальной черты
        let max3 = undefined
        for (let y = 0; y < nums.length; y++) {
            for (let x = 0; x < nums[0].length; x++) {
                if (y === max1[2]) {
                    continue;
                } else if (max3 === undefined || nums[y][x] > max3[0]) {
                    max3 = [nums[y][x], x, y]
                }
            }
        }
        console.log(max1[2]+1, max3[1]+1);
        return;
    } else {
        // Пробуем два варинта вычеркивания

        // Первый по горизонтали
        let max3 = undefined
        for (let y = 0; y < nums.length; y++) {
            for (let x = 0; x < nums[0].length; x++) {
                if (x === max1[1] || y === max2[2]) {
                    continue;
                } else if (max3 === undefined || nums[y][x] > max3[0]) {
                    max3 = [nums[y][x], x, y]
                }
            }
        }

        // Первый по вертикали
        let max4 = undefined
        for (let y = 0; y < nums.length; y++) {
            for (let x = 0; x < nums[0].length; x++) {
                if (x === max2[1] || y === max1[2]) {
                    continue;
                } else if (max4 === undefined || nums[y][x] > max4[0]) {
                    max4 = [nums[y][x], x, y]
                }
            }
        }

        // console.log(max3)
        // console.log(max4)
        if (max4[0] > max3[0]) {
            console.log(max2[2]+1, max1[1]+1);
            return;
        } else {
            console.log(max1[2]+1, max2[1]+1)
            return;
        }
    }

    
})();