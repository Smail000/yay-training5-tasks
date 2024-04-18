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
    let [ values, ...document ] = await input();

    // Проверка на отсутствие элементов
    if (document.length === 0 || document[0].trim() === "") {
        return;
    }

    // Обработка констант
    const [ W, H, C ] = values.split(" ").map(Number);

    // Обработка документа
    let editedDocument = "";
    for (let line of document) {
        if (line.trim() === "") {
            editedDocument += "\n ";
        } else {
            editedDocument += line.trim() + " ";
        }
    }

    // Парсинг документа в JSON
    let nodesArray = []; // Массив обработынных элементов
    let mode = 0; // 0 - слово, 1 - изображение;
    let tmp1 = ""; // левый параметр (или слово)

    let tmp2 = ""; // Правый параметр
    let imgMode = 0; // 0 - левый параметр; 1 - правый параметр
    let tmpObj = {}; // Временный объект для хранения изображения
    for (let letter of editedDocument) {

        if (letter === "(") {
            mode = 1;
            continue;
        }

        if (mode === 0) {
            if (letter === " ") {
                if (tmp1 !== "") nodesArray.push({ type: tmp1 === "\n" ? "line" : "text", value: tmp1 });
                tmp1 = "";
                continue;
            } else {
                tmp1 += letter;
                continue;
            }
        }

        if (mode === 1) {
            if (letter === "=") {
                imgMode = 1;
            } else if ([" ", ")"].includes(letter)) {
                if (["dx", "dy", "width", "height"].includes(tmp1)) tmp2 = Number(tmp2);
                tmpObj[tmp1] = tmp2;
                tmp1 = "";
                tmp2 = "";
                imgMode = 0;

                if (letter === ")") {
                    tmpObj.type = "image";
                    nodesArray.push(tmpObj);
                    tmpObj = {};
                    mode = 0;
                }
            } else {
                if (imgMode === 0) {
                    tmp1 += letter;
                } else {
                    tmp2 += letter;
                }
            }
        }
    }

    // console.log(nodesArray)

    // Обработка документа

    let i = 0; // id элемента, который обрабатывается в данный момент
    let cursorX = 0; // Положение курсора относительно оси X
    let lastPose = { x: 0, y: 0 }; // позиция последнего установленного элемента (используется только для floating)
    let topLine = 0; // Верхнаяя граница
    let bottomLine = H; // Нижнаяя граница
    let isNewFragment = true; // находитя ли курсор в начале фрагмента
    let isNewLine = true; // находится ли курсор в начале новой строки
    let isAvailable = true; // находится ли курсор в доступном для размещения элемента месте
    
    let notPassedSurroundedArray = []; // массив для изображений surrounded, которые еще могут встретиться
    // { r: number, l: number, b: number }[]

    while (i < nodesArray.length) {
        notPassedSurroundedArray = notPassedSurroundedArray.filter(({b}) => topLine < b);
        // console.log("-", isAvailable, cursorX, topLine, bottomLine, nodesArray[i], isNewFragment, lastPose)

        if (isAvailable) {
            if (nodesArray[i].type === "text") {
                
                lastPose.x = cursorX+(nodesArray[i].value.length+Number(!isNewFragment)) * C;
                lastPose.y = topLine;
                
                cursorX += (nodesArray[i].value.length+Number(!isNewFragment)) * C;
                isNewFragment = false;
                isNewLine = false;
            } else if (nodesArray[i].type === "line") {

                lastPose.x = 0;

                cursorX = 0;
                topLine = topLine = Math.max(notPassedSurroundedArray.map(({b}) => b).reduce((acc, b) => Math.max(acc, b), 0), bottomLine);
                bottomLine = topLine + H;
                isNewFragment = true;
                isNewLine = true;
                lastPose.y = topLine;

            } else if (nodesArray[i].type === "image") {
                if (nodesArray[i].layout === "floating") {
                    let leftX = lastPose.x+nodesArray[i].dx;
                    console.log(
                        leftX < 0 ? 0 : leftX+nodesArray[i].width > W ? W-nodesArray[i].width : leftX,
                        lastPose.y+nodesArray[i].dy
                    )
                    lastPose.x = (leftX < 0 ? 0 : leftX+nodesArray[i].width > W ? W-nodesArray[i].width : leftX) + nodesArray[i].width
                    lastPose.y = lastPose.y+nodesArray[i].dy
                    // Просто помещаем, для него ничего не нужно;
                } else if (nodesArray[i].layout === "embedded") {
                    console.log(
                        cursorX+Number(!isNewFragment)*C,
                        topLine
                    )
                    lastPose.x = cursorX + Number(nodesArray[i].width) + Number(!isNewFragment)*C;
                    lastPose.y = topLine;
                    cursorX += Number(nodesArray[i].width) + Number(!isNewFragment)*C;
                    bottomLine = Math.max(bottomLine, topLine + Number(nodesArray[i].height));
                    isNewFragment = false;
                    isNewLine = false;
                } else {
                    // surrounded
                    console.log(
                        cursorX,
                        topLine
                    )
                    placeSurrounded(
                        notPassedSurroundedArray,
                        cursorX,
                        cursorX+Number(nodesArray[i].width),
                        topLine+Number(nodesArray[i].height)
                    )
                    lastPose.x = cursorX + Number(nodesArray[i].width);
                    lastPose.y = topLine;
                    cursorX += Number(nodesArray[i].width)
                    isNewFragment = true;
                    isNewLine = false;

                }
            }
            i++;
            isAvailable = false;
            continue;
        } else {
            if (nodesArray[i].type === "line" || (nodesArray[i].type === "image" && nodesArray[i].layout === "floating")) {
                isAvailable = true;
                continue;
            }




            let [ hasPlace, pos, newFragment] = findAvaliablePlace(
                cursorX,
                nodesArray[i],
                notPassedSurroundedArray,
                W,
                C,
                isNewFragment
            );

            if (!hasPlace) {
                cursorX = 0;
                topLine = bottomLine;
                bottomLine += H;
                isNewFragment = true;
                isNewLine = true;
                lastPose.x = 0;
                lastPose.y = topLine;
            } else {
                isNewFragment = newFragment;
                cursorX = pos;
                isAvailable = true;
            }
        }
    }
    
})();

function placeSurrounded(surroundedArray, leftBorder, rightBorder, bottomBorder) {
    let i;
    for (i = 0; i < surroundedArray.length; i++) {
        if (surroundedArray[i].r > leftBorder) {
            surroundedArray.splice(i, 0, { r: rightBorder, l: leftBorder, b: bottomBorder })
            return;
        }
    }
    surroundedArray.splice(i, 0, { r: rightBorder, l: leftBorder, b: bottomBorder })
}

// -> [ hasPlace: boolean, cursorPos: number, isNewFragment: boolean ]
function findAvaliablePlace(cursorX, element, surroundedArray, W, C, isNewFragment) {

    let elementWidth;
    if (element.type === "text") {
        elementWidth = (element.value.length) * C; // +Number(!isNewFragment)
    } else {
        elementWidth = element.width
    }

    if (element.layout === "floating") {
        return [cursorX+elementWidth <= W, cursorX, isNewFragment]
    }

    let availablePlace = [];
    let leftBorder = 0;
    let i;
    for (i = 0; i < surroundedArray.length; i++) {
        availablePlace.push([ leftBorder, surroundedArray[i].l ])
        leftBorder = surroundedArray[i].r;
    }
    availablePlace.push([leftBorder, W])

    availablePlace = availablePlace.filter(([ l, r ]) => r >= cursorX)
    if (availablePlace[0][0] < cursorX) availablePlace[0][0] = cursorX;

    for (let [ l, r ] of availablePlace) {
        if ( l === cursorX && !isNewFragment && (element.type === "text" || element.layout === "embedded") ) {
            if (r - l >= elementWidth + C) {
                return [true, l, false]
            }
        } else {
            if (r - l >= elementWidth) {
                return [true, l, true]
            }
        }
    }
    return [false, -1, isNewFragment]

}