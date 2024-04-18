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

class Client {
    constructor (uniqueId=0, packetLimit=1, hasPackets=0) {
        this.uniqueId = uniqueId;
        this.packetLimit = packetLimit;
        this.packets = new Set(!hasPackets ? [] : new Array(hasPackets).fill(1).map((packet, i) => i+1))
        this.isFull = !!hasPackets;
        this.timeslot = 0;
        this.que = [];
        this.worth = new Map();
    }

    addQue(client, packetId) {
        this.que.push([client, packetId]);
    }

    scream() {
        console.log(`Client: ${this.uniqueId}`)
    }

    acceptQuery() {
        if (!this.que.length) return [-1, -1];
        let clientToAccept;
        let clientToAcceptWorth;
        let packetToSend;
        // console.log(this.uniqueId, this.worth)
        for (let [ client, packetId ] of this.que) {
            let clientWorth = !this.worth.has(client.uniqueId) ? 0 : this.worth.get(client.uniqueId);
            // console.log(client.uniqueId, client.worth)
            if (clientToAccept === undefined || clientToAcceptWorth < clientWorth || (
                    clientWorth === clientToAcceptWorth && client.packets.size < clientToAccept.packets.size
                )
            ) {
                clientToAccept = client;
                clientToAcceptWorth = clientWorth;
                packetToSend = packetId;
            }
        }
        
        this.que = [];
        // clientToAccept.scream()
        return [clientToAccept, packetToSend]

    }

    recievePacket(client, packetId) {
        // this.toggleWorth(client);
        this.packets.add(packetId);
        if (this.packets.size === this.packetLimit) {
            this.isFull = true;
        }
    }

    toggleWorth(client) {
        if (!this.worth.has(client.uniqueId)) {
            this.worth.set(client.uniqueId, 0);
        }
        this.worth.set(client.uniqueId, this.worth.get(client.uniqueId)+1)
    }
}

function findPacketToRecieve(client=new Client(), rareness=new Map()) {
    let choosedPacket;
    let choosedPacketRare; 
    for (let [ packetId, rare ] of rareness.entries()) {
        if (!client.packets.has(packetId) && ( choosedPacket === undefined || choosedPacketRare > rare )) {
            choosedPacket = packetId;
            choosedPacketRare = rare;
        }
    }
    return choosedPacket;
}

function findSender(Reciever=new Client(), clients=[new Client()], packetToRecieve=0) {
    let choosedClient;
    for (let client of clients) {
        if (client !== Reciever && (
            choosedClient === undefined || (
                client.packets.has(packetToRecieve) && client.packets.size < choosedClient.packets.size
            )
        )) {
            choosedClient = client;
        }
    }
    return choosedClient;
}


(async () => {
    let [ [ N, K ] ] = (await input()).map(line => line.split(" ").map(Number));

    // let N = 100;
    // let K = 200;

    let clients = new Array(N).fill(0).map((_, i) => !i ? new Client(i+1, K, K) : new Client(i+1, K, 0));

    let rareness = new Map();
    for (let i = 1; i <= K; i++) {
        rareness.set(i, 0);
    }
    let totalSends = 0;

    let timeSlot = 1
    while ((N-1) * K > totalSends) {
        // console.log(`Timeslot: ${timeSlot}\nTotal sends: ${totalSends}`)
        
        for (let client of clients) {
            if (!client.isFull) {
                let packetToRecieve = findPacketToRecieve(client, rareness);
                let Sender = findSender(client, clients, packetToRecieve);
                Sender.addQue(client, packetToRecieve);
                // console.log(`${client.uniqueId} запросил ${packetToRecieve} у ${Sender.uniqueId}`)
                client.timeslot++;
            }
        }
        
        let toggleArray = []
        for (let client of clients) {
            // console.log(clients)
            let [clientToAccept, packetSended] = client.acceptQuery();
            
            if (packetSended === -1) continue;
            clientToAccept.recievePacket(client, packetSended);
            toggleArray.push([clientToAccept, client])

            rareness.set(packetSended, rareness.get(packetSended) + 1)

            totalSends++;
        }

        for (let [clientToAccept, client] of toggleArray) {
            clientToAccept.toggleWorth(client)
        }

        // for (let client of clients) {
        //     console.log(client.packets)
        // }

        timeSlot++;
    }

    console.log(clients.slice(1).map(client => client.timeslot).join(" "))
})()