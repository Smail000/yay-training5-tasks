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
    let [ m1, m2, where ] = (await input());

    let [ c11, c21 ] = m1.split(":").map(Number);
    let [ c12, c22 ] = m2.split(":").map(Number);
    where = Number(where);

    

    let total1 = c11 + c12;
    let total2 = c21 + c22;

    if (total1 > total2) {
        console.log(0);
        return;
    }

    let req = total2 - total1;
    c12 += req;

    // console.log(c11, c21, "\n", c12, c22)

    let g1 = 0
    let g2 = 0
    if (where === 1) {
        // д
        // г
        g1 = c12;
        g2 = c21;
    } else {
        // г
        // д
        g1 = c11;
        g2 = c22;
    }

    if ( g1 <= g2 ) {
        console.log(req+1);
        return;
    }


    console.log(req);
    return;
})();