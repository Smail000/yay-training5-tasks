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

function getType(board, x, y) {
    return [
        getValue(board, x-1, y),
        getValue(board, x+1, y),
        getValue(board, x, y-1),
        getValue(board, x, y+1)
    ].map(Number).reduce((acc, i) => acc+i, 0)
}

function getValue(board, x, y) {
    return (x >= 0 & x <= 7 && y >= 0 && y <= 7 && board[y][x])
}

(async () => {
    let [ N, ...nums ] = (await input())
    N = Number(N);
    nums = nums.map(value => value.split(" ").map(Number));
    let board = [
        [ 0, 0, 0, 0, 0, 0, 0, 0 ],
        [ 0, 0, 0, 0, 0, 0, 0, 0 ],
        [ 0, 0, 0, 0, 0, 0, 0, 0 ],
        [ 0, 0, 0, 0, 0, 0, 0, 0 ],
        [ 0, 0, 0, 0, 0, 0, 0, 0 ],
        [ 0, 0, 0, 0, 0, 0, 0, 0 ],
        [ 0, 0, 0, 0, 0, 0, 0, 0 ],
        [ 0, 0, 0, 0, 0, 0, 0, 0 ],
    ]
    let perimetr = 0;

    for (let [ x, y ] of nums) {
        let type = getType(board, x-1, y-1); // количество true
        // console.log(type)
        if (type === 0) {
            perimetr += 4;
        } else if (type === 1) {
            perimetr += 2;
        } else if (type === 2) {
            perimetr += 0;
        } else if (type === 3) {
            perimetr += -2;
        } else {
            perimetr += -4;
        }
        board[y-1][x-1] = 1;
    }

    console.log(perimetr);
    



    
})();