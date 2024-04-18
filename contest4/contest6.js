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

function findAnswer(sums, l, s) {
    let N = sums.length;
    let lb = 0;
    l = Number(l)
    let rb = sums.length-l;

    if (rb < 0) return -1;

    while (lb <= rb) {
        let m = Math.trunc((lb+rb) / 2);
        let p1 = ( m === 0 ? 0n : sums[m-1] )
        let p2 = sums[m+l-1]
        if (p2 - p1 === s) {
            return m;
        } else if (s < p2 - p1) {
            rb = m - 1;
        } else {
            lb = m + 1;
        }
    }

    // console.log(lb, rb, l, s);
    return ( lb+l-1 < N && sums[lb+l-1] - ( lb === 0 ? 0n : sums[lb-1] ) === s ) ? lb : -1
}

(async () => {
    let [
        [ w, h, n ],
        ...points
    ] = (await input()).map(line => line.split(" ").map(Number));

    // points.sort(([x1, y1], [x2, y2]) => x1 === x2 ? y1 - y2 : x1 - x2); // n*logn
    points.sort(([x1, ], [x2, ]) => x1 - x2); // n*logn

    if (points.length < 3) {
        return 1;
    }

    // console.log(points.slice(1).concat([[0, 0]]))`
    
    let leftPipe = new Map();
    let rightPipe = new Map();
    
    let value = points[0][0];
    let max = points[0][1];
    let min = points[0][1];

    

    let x;
    let y;
    let i;

    for (i = 1; i < points.length; i++) {
        x = points[i][0];
        y = points[i][1];
        if (value !== x) {
            leftPipe.set(value, [min, max]);
            value = x;
        }
        max = Math.max(max, y);
        min = Math.min(min, y);
    }
    leftPipe.set(value, [min, max]);

    let xs = Array.from(leftPipe.keys());

    value = points.at(-1)[0];
    max = points.at(-1)[1];
    min = points.at(-1)[1];

    for (i = points.length-2; i > -1; i--) {
        x = points[i][0];
        y = points[i][1];

        if (value !== x) {
            rightPipe.set(value, [min, max]);
            value = x;
        }
        max = Math.max(max, y);
        min = Math.min(min, y);
    }
    rightPipe.set(value, [min, max]);


    let l = 1;
    let r = w;
    let minPipeSize = Infinity;
    // for (let width = 1; width <= w; width++) {
    while (l <= r) {
        let width = Math.trunc((l+r) / 2);

        let leftPointer = 0;
        let rightPointer = 0;
        let maxPipeSize = [ Infinity, Infinity ];

        while (rightPointer < xs.length) {
            while (
                rightPointer !== xs.length-1 &&
                xs[rightPointer+1] - xs[leftPointer] + 1 <= width
            ) rightPointer++;
            let length = xs[rightPointer] - xs[leftPointer] + 1;
            if (length <= width) {
                let pipeSize;
                if (leftPointer === 0 && rightPointer === xs.length-1) {
                    pipeSize = 0;
                } else if (leftPointer === 0) {
                    let [ rightMin, rightMax ] = rightPipe.get(xs[rightPointer+1]);
                    pipeSize = rightMax-rightMin+1
                    
                } else if (rightPointer === xs.length-1) {
                    let [ leftMin, leftMax ] = leftPipe.get(xs[leftPointer-1]);
                    pipeSize = leftMax-leftMin+1;
                } else {
                    let [leftMin, leftMax ] = leftPipe.get(xs[leftPointer-1]);
                    let [rightMin, rightMax ] = rightPipe.get(xs[rightPointer+1]);
                    pipeSize = Math.max(leftMax, rightMax) - Math.min(leftMin, rightMin) + 1;
                }
                // maxPipeSize = (length > maxPipeSize[0] || (
                //     length === maxPipeSize[0] && pipeSize < maxPipeSize[1]
                // )) ? [ length, pipeSize ] : maxPipeSize;
                maxPipeSize = (pipeSize < maxPipeSize[1]) ? [ length, pipeSize ] : maxPipeSize;
                rightPointer++;
            } else {
                leftPointer++;
            }
        }
        // console.log(width, maxPipeSize, maxPipeSize[0] > maxPipeSize[1])
        minPipeSize = Math.min(minPipeSize, Math.max(...maxPipeSize))
        if (maxPipeSize[0]-maxPipeSize[1] >= 0) {
            r = width - 1;
        } else {
            l = width + 1;
        }
    }

    console.log(minPipeSize)



})()