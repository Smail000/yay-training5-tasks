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

function rotateBoard(board) { // транспонирует матрицу
    let newBoard = [];
    for (let i = 0; i < board[0].length; i++) {
        let line = "";
        for (let j = 0; j < board.length; j++) {
            line += board[j][i];
        }
        newBoard.push(line);
    }
    return newBoard;
}

function countAndCheck(string) {
    let count = 0;
    let hasSpace = false;
    let lastLetter = "."
    let isInside = false
    // console.log(string)
    for (let letter of string) {
        if (letter === "#") count++;
        if (lastLetter === "#" && letter === ".") isInside = true;
        if (isInside && letter === "#") hasSpace = true;
        lastLetter = letter
    }
    return [ hasSpace, count ]
}

function countValuePerLine(board) {
    let valueArray = [];
    let lastValue = undefined;
    let hasSpace = false
    for (let line of [ ...board, "" ]) {
        if (lastValue === undefined || line !== lastValue[2]) {
            if (lastValue !== undefined) valueArray.push(lastValue);
            let [ hasSpaceInString, count ] = countAndCheck(line);
            if (hasSpaceInString) hasSpace = true;
            lastValue = [ 1, count, line ];
        } else {
            lastValue[0]++;
        }
    }
    // valueArray = valueArray.at(0).at(2) === ".".repeat(board[0].length) ? valueArray.slice(1) : valueArray
    // valueArray = valueArray.at(-1).at(2) === ".".repeat(board[0].length) ? valueArray.slice(0, -1) : valueArray
    return [ hasSpace, valueArray.filter((value) => value.at(2) !== ".".repeat(board[0].length)) ];
}

function printBoard(board) {
    for (let line of board) {
        console.log(line)
    }
}

function specialReplace(string, mode=0) {
    // Внимание! Под словом "элемент" имеется ввиду вхождение "#"
    // node = 0 => первый элемент будет "a", остальные "b"
    // node = 1 => все элементы будут "a"
    // mode = 2 => все элементы будут "b"
    let firstEnter = false;
    let newString = ""
    for (let letter of string) {
        if (letter === ".") {
            newString += letter;
            continue;
        } else if (letter === "#") {

            if (mode === 0) {
                if (!firstEnter) {
                    firstEnter = true;
                    newString += "a"
                } else {
                    newString += "b"
                }
            } else if (mode === 1) {
                newString += "a"
            } else {
                newString += "b"
            }

        }
    }
    return newString
}

(async () => {
    let [ , ...board ] = (await input())

    let [ hasSpace1, valueArray1 ] = countValuePerLine(board)
    // console.log(hasSpace1, valueArray1);

    if (valueArray1.length === 0 ||
        (
            valueArray1.length === 1 && 
            valueArray1[0][0] === 1 && 
            valueArray1[0][1] === 1
        )) {
        console.log("NO");
        return;
    } else 
    
    if (!hasSpace1 && valueArray1.length < 3) {
        console.log("YES")

        if (valueArray1.length === 1) {
            // обработка для одного прямоугольника
            let i;
            for (i = 0; board[i] !== valueArray1[0][2]; i++) {}
            if (valueArray1[0][1] === 1) {
                board[i] = specialReplace(board[i], 1)
                i++;
                let j;
                for (j = 0; j < valueArray1[0][0]-1; j++) {
                    board[i+j] = specialReplace(board[i+j], 2);
                }
            } else {
                for (j = 0; j < valueArray1[0][0]; j++) {
                    board[i+j] = specialReplace(board[i+j], 0);
                }
            }
        }

        if (valueArray1.length === 2) {
            // обработка для двух прямоугольников
            let i;
            for (i = 0; board[i] !== valueArray1[0][2]; i++) {}
            let j;
            for (j = 0; j < valueArray1[0][0]; j++) {
                board[i+j] = specialReplace(board[i+j], 1);
            }
            i += j;
            for (; board[i] !== valueArray1[1][2]; i++) {}
            for (j = 0; j < valueArray1[1][0]; j++) {
                board[i+j] = specialReplace(board[i+j], 2);
            }
        }

        // console.log(hasSpace1, valueArray1);
        printBoard(board)
        return;

    }

    // console.log(hasSpace1, valueArray1);
    // console.log(countAndCheck(valueArray1[0][2])[1])

    let rotatedBoard = rotateBoard(board)
    let [ hasSpace2, valueArray2 ] = countValuePerLine(rotatedBoard)
    // console.log(hasSpace2, valueArray2);
    
    if (!hasSpace2 && valueArray2.length < 3) {
        console.log("YES")

        if (valueArray2.length === 1) {
            // обработка для одного прямоугольника
            let i;
            for (i = 0; rotatedBoard[i] !== valueArray2[0][2]; i++) {}
            if (valueArray2[0][1] === 1) {
                rotatedBoard[i] = specialReplace(rotatedBoard[i], 1)
                i++;
                let j;
                for (j = 0; j < valueArray2[0][0]; j++) {
                    rotatedBoard[i+j] = specialReplace(rotatedBoard[i+j], 2);
                }
            } else {
                for (j = 0; j < valueArray2[0][0]; j++) {
                    rotatedBoard[i+j] = specialReplace(rotatedBoard[i+j], 0);
                }
            }
        }

        if (valueArray2.length === 2) {
            // обработка для двух прямоугольников
            let i;
            for (i = 0; rotatedBoard[i] !== valueArray2[0][2]; i++) {}
            let j;
            for (j = 0; j < valueArray2[0][0]; j++) {
                rotatedBoard[i+j] = specialReplace(rotatedBoard[i+j], 1);
            }
            i += j;
            for (; rotatedBoard[i] !== valueArray2[1][2]; i++) {}
            for (j = 0; j < valueArray2[1][0]; j++) {
                rotatedBoard[i+j] = specialReplace(rotatedBoard[i+j], 2);
            }
        }

        printBoard(rotateBoard(rotatedBoard))
        return;
    }
    console.log("NO");
    return;

})();