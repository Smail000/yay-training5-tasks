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
    let [ myArmy, enemyHealth, enemyIncome ] = (await input()).map(Number);
    let enemyArmy = 0;

    if (enemyHealth <= myArmy) {
        console.log(1);
        return
    }

    let i = 1; // ход
    enemyHealth -= myArmy;
    enemyArmy += enemyIncome;

    if (myArmy <= enemyIncome && myArmy <= enemyHealth) {
        console.log(-1);
        return;
    }

    // Далее
    // Либо income меньше myArmy, что позволяет остаточным уроном бить enemyHealth
    // Либо сразу вынести enemyHealth, чтобы потом добить enemyArmy

    if (myArmy <= enemyHealth && myArmy > enemyIncome) {
        let canDamagePerTurn = myArmy - enemyIncome
        let needToDamage = enemyHealth - myArmy;
        let [ div, mod ] = divmod(needToDamage, canDamagePerTurn);
        if ( mod !== 0 ) div += 1;
        enemyHealth -= div*canDamagePerTurn;
        i += div;
    }

    let min = undefined;

    while (enemyHealth >= 0) {
        // Теперь myArmy >= enemyHealth

        // Пробую добить казарму
        let beatHealth = {
            myArmy, enemyHealth, enemyIncome, enemyArmy, i
        }
        beatHealth.i++;
        beatHealth.enemyArmy -= beatHealth.myArmy - enemyHealth;
        beatHealth.myArmy -= beatHealth.enemyArmy;

        while (beatHealth.myArmy > 0 && beatHealth.enemyArmy > 0) {
            beatHealth.i++;
            beatHealth.enemyArmy -= beatHealth.myArmy;
            beatHealth.myArmy -= beatHealth.enemyArmy;
        }

        // console.log(myArmy, enemyHealth, enemyIncome, enemyArmy, i, beatHealth.myArmy, beatHealth.i);

        if (beatHealth.myArmy > 0) {
            if (min === undefined) min = beatHealth.i
            min = Math.min(min, beatHealth.i);
        }

        if (myArmy > enemyArmy) {
            i++;
            enemyHealth -= myArmy - enemyArmy;
            if (enemyArmy <= 0) break;
            continue;
        } else {
            break;
        }
        
        
        // console.log(beatHealth.myArmy, beatHealth.enemyHealth, beatHealth.enemyIncome, beatHealth.enemyArmy, beatHealth.i);
        console.log(-1)
        return;

    }

    if (min === undefined) min = -1;
    console.log(min)
    return;


})();