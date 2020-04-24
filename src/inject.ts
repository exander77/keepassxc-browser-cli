#!/usr/bin/env node
import {KeepassXCConnection} from "./KeepassXCConnection";
import {Configuration} from "./Configuration";

async function associate(config: Configuration, connection: KeepassXCConnection) {
    const dbHash = await connection.getDatabaseHash();

    // If we do not know this database yet or if the associate test fails, associate again
    if (!config.hasKey(dbHash) || !await connection.testAssociate(config.getKey(dbHash).id,
                                                                  config.getKey(dbHash).idKey)) {
        const associateRes = await connection.associate();

        config.saveKey(associateRes.dbHash, {
            id: associateRes.id,
            idKey: associateRes.idKey
        });
    }
}

var appArgs : object;

// @ts-ignore
require("electron").ipcRenderer.on('params', (event, message) => {
    appArgs = JSON.parse(message);
});

// @ts-ignore
export async function Inject(login) {
    //only first window intercepts appArgs
    if (!appArgs) return;

    let userindex : number = 0;
    let username : string = null;
    let url : string = null;
    const preselect : string = process.env.processEnvs;
    if (preselect) {
        let parts = preselect.split(/:(.*)$/);
        let c = 0;
        if (parts.length > 1) userindex = +parts[c++];
        if (parts[c]) {
          parts = parts[c].split(/:(.*)$/);
          username = parts[0];
          url = parts[1] || null;
        }
    }
    console.log("User data", username, userindex, url);

    // @ts-ignore
    if (window.location.href !== appArgs.targetUrl && window.location.href !== url) {
        throw new Error("Target URL does not match current URL");
    }

    const config = new Configuration("keepassxc-nativefier");

    await config.load();
    const connection = await KeepassXCConnection.create();

    try {
        await associate(config, connection);
        // @ts-ignore
        const logins = await connection.getLogins(appArgs.targetUrl);
        if (logins.length === 0) {
            throw new Error("No entries found for URL.");
        }
        let i : number = 0;
        for (let j : number = 0; i < logins.length; ++i) {
            if (username) {
                if (username === logins[i].login) {
                    if (userindex === j) return login(logins[i]);
                    j++;
                }
            } else {
                if (userindex === i) return login(logins[i]);
            }
        }
        throw new Error("No entries found for username/userindex.");
    } finally {
        connection.disconnect();
        await config.save();
    }
}
