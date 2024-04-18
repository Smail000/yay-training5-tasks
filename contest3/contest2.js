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

function getMap(word) {
    let map = new Map();
    for (let letter of word) {
        if (!map.has(letter)) {
            map.set(letter, 0);
        }
        map.set(letter, map.get(letter)+1)
    }
    return map
}

(async () => {
    let [ word1, word2 ] = (await input());
    if (word1.length !== word2.length) {
        console.log("NO");
        return;
    }
    let map1 = getMap(word1);
    let map2 = getMap(word2);

    for (let [ key, value ] of map1.entries()) {
        if (!map2.has(key) || map2.get(key) !== value) {
            console.log("NO")
            return;
        }
    }
    console.log("YES");
    return;
})()