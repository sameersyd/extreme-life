import PubNub from 'pubnub';

/*
Usage:

let chatClient = new ChatClient(<user-name>, <unique-user-id>, <game-id>, <message-display-call-back-function>, [url-to-api]);

*/

class ChatClient {

    // considering getting keys from with in component.
    constructor(username, uuid, sessionid, msgcallback, apiurl = 'https://www.comp680elgame.tk:8000') {
        this.username = username;
        this.uuid = uuid;
        this.sessionid = sessionid;
        this.channel = this.get_channel(apiurl);
        this.callback = msgcallback;
        let keys = this.get_keys(apiurl);
        this.pubnub = this.connect(keys.pub, keys.sub);
        this.listenMessages = this.listenMessages.bind(this);
        this.listenStatus = this.listenStatus.bind(this);
        this.setupListener(this.pubnub);
    }

    setupListener(pubnub) {
        pubnub.addListener({
            message: this.listenMessages,
            status: this.listenStatus
        });
    }

    connect(pubKey, subKey) {
        var pubnub = new PubNub({
            publishKey: pubKey,
            subscribeKey: subKey,
            uuid: this.uuid,
            ssl: true
        });
        // subscribe to the channel with this.
        pubnub.subscribe({
            channels: [this.channel],
            withPresence: false
        });
        return pubnub;
    }

    get_channel(apiurl) {
        // get channel name from chat API.
        let http = new XMLHttpRequest();
        var params = 'sessionid=' + this.sessionid;
        http.open("GET", apiurl + '/getchannel?' + params, false);
        http.send();
        http.onload = () => {
            if (http.status === 200) {
                console.log(`Channel received.`);
            } else {
                console.log(`error ${http.status} ${http.statusText}`);
            }
        }
        return JSON.parse(http.responseText);
    }

    get_keys(apiurl) {
        // get keys from API.
        let http = new XMLHttpRequest();
        var params = 'channelname=' + this.channel;
        http.open("GET", apiurl + '/getkeys?' + params, false);
        http.send();
        http.onload = () => {
            if (http.status === 200) {
                console.log(`Received keys.`);
            } else {
                console.log(`error ${http.status} ${http.statusText}`);
            }
        }
        return JSON.parse(http.responseText);
    }

    submitUpdate(message) {
        if (!message.message) return;
        // send the message.
        this.pubnub.publish({
            channel: this.channel,
            message: {
                'entry': this.username,
                'update': message.message,
                'uuid': message.id
            }
        },
            // callback function which checks status and processing post-send.
            function (status, response) {
                if (status.error) { console.log(`ERROR: ${status.error}`); } 
                else { console.log(response); }
            }.bind(this));
    }

    sendMessage(message) {
        this.submitUpdate(new Message(this.uuid, this.username, message));
    }

    listenMessages(event) {
        const pushMessage = event.message.update !== "has joined."
        if(pushMessage) {
            this.callback(new Message(
                event.message.uuid,
                event.message.entry,
                event.message.update,
                event.timetoken
            ));
        }
    }

    listenStatus(event) {
        // this.callback(new Message(this.uuid, this.username, `subscribed to "${this.pubnub.getSubscribedChannels()}"`));
        // player has joined the chat.
        if (event.category === 'PNConnectedCategory') {
            this.submitUpdate(new Message(this.uuid, this.username, 'has joined.'));
        }
    }
}

class Message {
    constructor(id, sender_id, message, timetoken = Date.now()) {
        console.log(`id:${id}, sender_id:${sender_id}, message:${message}, timetoken:${timetoken}`);
        this.id = id;
        this.sender_id = sender_id;
        this.message = message;
        this.timetoken = Math.floor(timetoken / 1000);
    };
}

export { ChatClient, Message };