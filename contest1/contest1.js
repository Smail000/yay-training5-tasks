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

(async () => {
    const [ [ P, V ], [ Q, M ] ] = (await input()).map(line => line.split(" ").map(Number));
    

    let l1 = P - V;
    let r1 = P + V;
    let l2 = Q - M;
    let r2 = Q + M;

    if (l1 <= l2 && r1 >= r2) {
        console.log(V*2+1);
        return;
    } else if (l2 <= l1 && r2 >= r1) {
        console.log(M*2+1);
        return;
    } else {
        if (l1 <= l2 && l2 <= r1) {
            // Есть пересечение
            console.log(r2-l1+1);
            return;
        } else if (l2 <= l1 && l1 <= r2) {
            // есть пересечение
            console.log(r1-l2+1);
            return;
        }

        // Пересечений нет
        console.log(M*2+1 + V*2+1);

    }
})();