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

class FractionalObject {

}


class Runner {
    constructor(x1, v1, L) {
        this.doneDistance = x1;
        this.speed = v1;
        this.cycleDistance = L;
        this.direction = v1 === 0 ? 0 : v1 > 0 ? 1 : -1
    }

    getTimeToDone() { // () -> [ isPossible: boolean, time: number ]
        if (this.direction ===  0) {
            return [false, Infinity];
        } else if (this.direction === 1) {
            return [true, (this.cycleDistance - this.doneDistance) / this.speed]
        } else {
            return [true, (this.doneDistance) / -this.speed]
        }
    }

    cycleDone() {
        // this.direction === 0 быть не может
        if (this.direction === 1) {
            this.doneDistance = 0;
        } else {
            this.doneDistance = this.cycleDistance;
        }
    }

    runForTime(t) {
        this.doneDistance += this.speed * t;
    }

    static whenCross(r1, r2) { // ( r1: Runner, r2: Runner ) -> [ isPossible: boolean, time: number ]
        if (r1.speed === r2.speed) return [ false, Infinity ];
        let time = ( r2.doneDistance - r1.doneDistance ) / ( r1.speed - r2.speed );
        return [time >= 0, time];
    }

    static whenCrossParallel(r1, r2) { // ( r1: Runner, r2: Runner ) -> [ isPossible: boolean, time: number ]
        if (r1.speed === -r2.speed) return [false, Infinity];
        let time = ( r1.cycleDistance - r1.doneDistance - r2.doneDistance ) / ( r1.speed + r2.speed );
        return [time >= 0, time];
    }
}

(async () => {
    let [ L, x1, v1, x2, v2 ] = (await input())[0].split(" ").map(Number);

    if (x1 === x2 || (x1 === L && x2 === 0) || (x1 === 0 && x2 === L)) {
        console.log("YES");
        console.log(0);
        return;
    }

    if ((v1 === 0 && v2 === 0) || L === 0) {
        console.log("NO");
        return;
    }

    let r1 = new Runner(x1, v1, L);
    let r2 = new Runner(x2, v2, L);

    let [ ip1, t1 ] = Runner.whenCross(r1, r2);
    let [ ip2, t2 ] = Runner.whenCrossParallel(r1, r2);
    
    let [ ip3, t3 ] = r1.getTimeToDone();
    let [ ip4, t4 ] = r2.getTimeToDone();


    // console.log(`(${ip1 ? "+" : "-"}) t1 = ${t1}`);
    // console.log(`(${ip2 ? "+" : "-"}) t2 = ${t2}`);
    // console.log(`(${ip3 ? "+" : "-"}) t3 = ${t3}`);
    // console.log(`(${ip4 ? "+" : "-"}) t4 = ${t4}`);

    
    let events = [[ip1, t1, 1], [ip2, t2, 2], [ip3, t3, 3], [ip4, t4, 4]]
        .filter(value => value[0])
        .sort((a, b) => a[1] - b[1]);
    
    if (events[0][2] === 1) {
        console.log("YES");
        console.log(events[0][1])
        return;
    } else if (events[0][2] === 2) {
        console.log("YES");
        console.log(events[0][1])
        return
    }

    let bonusTime = events[0][1];
    if (events[0][2] === 3) {
        r1.cycleDone();
        r2.runForTime(bonusTime);
    } else {
        r2.cycleDone();
        r1.runForTime(bonusTime);
    }

    [ ip1, t1 ] = Runner.whenCross(r1, r2);
    [ ip2, t2 ] = Runner.whenCrossParallel(r1, r2);

    // console.log("Пересечение точки G")
    // console.log(`(${ip1 ? "+" : "-"}) t1 = ${t1}`);
    // console.log(`(${ip2 ? "+" : "-"}) t2 = ${t2}`);

    if (ip1 && t1 <= t2) {
        console.log("YES");
        console.log(t1+bonusTime);
        return;
    } else {
        console.log("YES");
        console.log(t2+bonusTime);
        return;
    }


})()

/*
10 8.5 -3 1 4

*/