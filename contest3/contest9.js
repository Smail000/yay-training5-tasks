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

class Competition {
    constructor (team1name="", team2name="", team1score=0, team2score=0) {
        this.team1name = team1name;
        this.team2name = team2name;
        this.team1score = team1score;
        this.team2score = team2score;

        this.team1goals = [];
        this.team2goals = [];

        this.pointer = !team1score ? this.team2goals : this.team1goals;
    }

    addGoal(name, time) {
        this.pointer.push([name, time]);
        if (this.pointer === this.team1goals && this.pointer.length === this.team1score) {
            this.pointer = this.team2goals
        }
    }

    getScoreByName(teamName) {
        let total = 0;
        let teamExist = false;
        if (this.team1name === teamName) {
            total += this.team1score;
            teamExist = true;
        }
        if (this.team2name === teamName) {
            total += this.team2score;
            teamExist = true;
        }
        return [ total, teamExist ];
    }

    getScoreByPlayer(playerName) {
        let total = 0;
        let playerExist = false;

        for (let [name, time] of this.team1goals) {
            if (name === playerName) {
                total++;
                playerExist = true;
            }
        }

        for (let [name, time] of this.team2goals) {
            if (name === playerName) {
                total++;
                playerExist = true;
            }
        }

        return [ total, playerExist ]
    }
}


(async () => {
    let data = await input();

    let history = [];
    let lastCompetition;

    let teamsPlayers = new Map();


    // console.log("=".repeat(10))
    for (let line of data) {

        if (line[0] === '"') {
            // Новый матч
            // "Juventus" - "Milan" 3:1
            let i = 1;

            let tmp = "";
            while (line[i] !== '"') {
                tmp += line[i];
                i++;
            }
            i++;

            let team1name = tmp;

            while (line[i] !== '"') i++;
            i++;

            tmp = "";
            while (line[i] !== '"') {
                tmp += line[i];
                i++;
            }

            let team2name = tmp;

            i += 2;

            tmp = "";
            while (line[i] !== ':') {
                tmp += line[i];
                i++;
            }
            i++;

            let team1score = Number(tmp);

            tmp = "";
            while (i < line.length) {
                tmp += line[i];
                i++;
            }

            let team2score = Number(tmp);


            lastCompetition = new Competition(team1name, team2name, team1score, team2score)
            history.push(lastCompetition)

        } else if (line[line.length-1] === "'") {
            let i = line.length-2;
            let tmp = ""
            while (line[i] !== " ") {
                tmp = line[i] + tmp;
                i--;
            }
            i--;

            let time = Number(tmp);

            tmp = "";
            while (i > -1) {
                tmp = line[i] + tmp;
                i--;
            }

            let playerName = tmp;

            if (lastCompetition.pointer === lastCompetition.team1goals) {
                teamsPlayers.set(playerName, lastCompetition.team1name)
            } else {
                teamsPlayers.set(playerName, lastCompetition.team2name)
            }


            lastCompetition.addGoal(playerName, time);

        } else {

            if (line.length > 16 && line.slice(0, 16) === "Total goals for ") {
                let teamName = line.slice(17, -1);

                let total = 0;

                for (let competition of history) {
                    total += competition.getScoreByName(teamName)[0];
                }

                console.log(total);


            } else if (line.length > 24 && line.slice(0, 24) === "Mean goals per game for ") {
                
                let teamName = line.slice(25, -1);

                let total = 0;
                let count = 0;

                for (let competition of history) {

                    let [score, exist] = competition.getScoreByName(teamName);
                    total += score;
                    count += exist;
                }

                console.log( total / count );


            } else if (line.length > 15 && line.slice(0, 15) === "Total goals by ") {
                let playerName = line.slice(15);
                let total = 0;

                for (let competition of history) {
                    total += competition.getScoreByPlayer(playerName)[0];
                }

                console.log(total);

            } else if (line.length > 23 && line.slice(0, 23) === "Mean goals per game by ") {
                let playerName = line.slice(23);
                let teamName = teamsPlayers.get(playerName);

                let total = 0;
                let count = 0;

                for (let competition of history) {
                    let [score, exist] = competition.getScoreByPlayer(playerName);
                    total += score;
                    count += (exist || competition.team1name === teamName || competition.team2name === teamName);
                }

                console.log( total / count );


            } else if (line.length > 16 && line.slice(0, 16) === "Goals on minute ") {
                let i = 16;
                let tmp = "";
                while (line[i] !== " ") {
                    tmp += line[i];
                    i++;
                }
                i += 4;

                let gameTime = Number(tmp);
                let playerName = line.slice(i);

                let total = 0;

                for (let competition of history) {
                    for (let [ name, time ] of competition.team1goals) {
                        if (name === playerName && time === gameTime) {
                            total++;
                        }
                    }

                    for (let [ name, time ] of competition.team2goals) {
                        if (name === playerName && time === gameTime) {
                            total++;
                        }
                    }
                }

                console.log(total);

            } else if (line.length > 15 && line.slice(0, 15) === "Goals on first ") {
                let i = 15;
                let tmp = "";
                while (line[i] !== " ") {
                    tmp += line[i];
                    i++;
                }
                i += 12;

                let gameTime = Number(tmp);
                let playerName = line.slice(i);

                let total = 0;

                for (let competition of history) {
                    for (let [ name, time ] of competition.team1goals) {
                        if (name === playerName && time <= gameTime) {
                            total++;
                        }
                    }
                    
                    for (let [ name, time ] of competition.team2goals) {
                        if (name === playerName && time <= gameTime) {
                            total++;
                        }
                    }
                }

                console.log(total);

                
            } else if (line.length > 14 && line.slice(0, 14) === "Goals on last ") {
                let i = 14;
                let tmp = "";
                while (line[i] !== " ") {
                    tmp += line[i];
                    i++;
                }
                i += 12;

                let gameTime = Number(tmp);
                let playerName = line.slice(i);

                let total = 0;

                for (let competition of history) {
                    for (let [ name, time ] of competition.team1goals) {
                        if (name === playerName && time > 90-gameTime) {
                            total++;
                        }
                    }
                    for (let [ name, time ] of competition.team2goals) {
                        if (name === playerName && time > 90-gameTime) {
                            total++;
                        }
                    }
                }

                console.log(total);


                
            } else if (line.length > 16 && line.slice(0, 16) === `Score opens by "`) {
                let teamName = line.slice(16, -1);
                let total = 0;

                for (let competition of history) {
                    let team1firstGoalTime = !competition.team1score ? Infinity : competition.team1goals[0][1];
                    let team2firstGoalTime = !competition.team2score ? Infinity : competition.team2goals[0][1];
                    if (competition.team1name === teamName && team1firstGoalTime < team2firstGoalTime) {
                        total++;
                    } else if (competition.team2name === teamName && team1firstGoalTime > team2firstGoalTime) {
                        total++;
                    }
                }

                console.log(total);

                
            } else if (line.length > 15 && line.slice(0, 15) === "Score opens by ") {
                let playerName = line.slice(15);
                let teamName = teamsPlayers.get(playerName) || "";

                let total = 0;

                for (let competition of history) {
                    let team1timeOpen = !competition.team1score ? Infinity : competition.team1goals[0][1];
                    let team2timeOpen = !competition.team2score ? Infinity : competition.team2goals[0][1];
                    if (competition.team1name === teamName && competition.team1score) {
                        if (team1timeOpen < team2timeOpen && competition.team1goals[0][0] === playerName) total++;
                    } else if (competition.team2name === teamName && competition.team2score) {
                        if (team1timeOpen > team2timeOpen && competition.team2goals[0][0] === playerName) total++;
                    }
                }

                console.log(total);

                
            }
        }

    }

    // console.log(lastCompetition)
})()