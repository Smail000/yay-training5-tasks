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

(async () => {
    let board = (await input()).map(line => line.split(""));

    R_array = []; // ладья
    B_array = []; // слон

    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            // console.log(i, j)
            if (board[i][j] === "R") R_array.push({i, j});
            if (board[i][j] === "B") B_array.push({i, j});
        }
    }

    for (let R of R_array) {

        let i = R.i+1;
        let j = R.j;
        while (
            0 <= i && i < 8 && 0 <= j && j < 8 && ["*", "+"].includes(board[i][j])
        ) {
            board[i][j] = "+";
            i++;
        }

        i = R.i-1;
        j = R.j;
        while (
            0 <= i && i < 8 && 0 <= j && j < 8 && ["*", "+"].includes(board[i][j])
        ) {
            board[i][j] = "+";
            i--;
        }

        i = R.i;
        j = R.j+1;
        while (
            0 <= i && i < 8 && 0 <= j && j < 8 && ["*", "+"].includes(board[i][j])
        ) {
            board[i][j] = "+";
            j++;
        }

        i = R.i;
        j = R.j-1;
        while (
            0 <= i && i < 8 && 0 <= j && j < 8 && ["*", "+"].includes(board[i][j])
        ) {
            board[i][j] = "+";
            j--;
        }
    }

    for (let B of B_array) {

        let i = B.i+1;
        let j = B.j+1;
        while (
            0 <= i && i < 8 && 0 <= j && j < 8 && ["*", "+"].includes(board[i][j])
        ) {
            board[i][j] = "+";
            i++;
            j++;
        }

        i = B.i-1;
        j = B.j+1;
        while (
            0 <= i && i < 8 && 0 <= j && j < 8 && ["*", "+"].includes(board[i][j])
        ) {
            board[i][j] = "+";
            i--;
            j++;
        }

        i = B.i-1;
        j = B.j-1;
        while (
            0 <= i && i < 8 && 0 <= j && j < 8 && ["*", "+"].includes(board[i][j])
        ) {
            board[i][j] = "+";
            j--;
            i--;
        }

        i = B.i+1;
        j = B.j-1;
        while (
            0 <= i && i < 8 && 0 <= j && j < 8 && ["*", "+"].includes(board[i][j])
        ) {
            board[i][j] = "+";
            j--;
            i++;
        }
    }
    
    let count = 0;
    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            if (board[i][j] === "*") count++;
        }
    }

    // Лог
    // for (let line of board) {
    //     console.log(line.join(""));
    // }
    console.log(count)

    
})();