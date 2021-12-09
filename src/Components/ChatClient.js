import PubNub from 'pubnub';

/*
Usage:

let chatClient = new ChatClient(<user-name>, <unique-user-id>, <game-id>, <message-display-call-back-function>, [url-to-api]);
chatClient.pubnub.addListener({
  message: function (event) {
    chatClient.listenMessages(event);
  },
  status: function (event) {
    chatClient.listenStatus(event);
  }
});

*/

class ChatClient {
    // considering getting keys from with in component.
    constructor(username, uuid, sessionid, msgcallback, apiurl='http://localhost:8000') {
        this.apiurl = apiurl;
        this.username = username;
        this.uuid = uuid;
        this.sessionid = sessionid;
        this.channel = this.get_channel(apiurl);
        let keys = this.get_keys(apiurl);
        this.callback = msgcallback;
        this.pubnub = this.connect(keys.pub, keys.sub);
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

    get_channel() {
        // get channel name from chat API.
        let http = new XMLHttpRequest();
        var params = 'sessionid=' + this.sessionid;
        console.log('params in getchannel: ' + params);
        http.open("GET", this.apiurl + '/getchannel?' + params, false);
        http.send();
        http.onload = () => {
            if (http.status === 200) {
                console.log(`Channel received.`);
            } else {
                console.log(`error ${http.status} ${http.statusText}`);
            }
        }
        var res = http.responseText;
        console.log('res: ' + res);
        return JSON.parse(http.responseText);
    }

    get_keys() {
        // get keys from API.
        let http = new XMLHttpRequest();
        var params = 'channelname=' + this.channel;
        console.log('params in getkeys: ' + params);
        http.open("GET", this.apiurl + '/getkeys?' + params, false);
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
                message: { 'entry': this.username, 'update': message.message }
            },
            // callback function which checks status and processing post-send.
            function (status, response) {
                if (status.error) {
                    console.log(`ERROR: ${status.error}`);
                }
                else {
                    this.callback(new Message(
                        message.id,
                        message.sender_id,
                        `Message sent.`,
                        response.timetoken
                    ));
                }
            }.bind(this));
    }

    sendMessage(message) {
        let id = null;
        this.submitUpdate(new Message(id, this.username, message));
    }

    listenMessages(event) {
        var id = null;
        this.callback(new Message(
            id,
            event.message.entry,
            event.message.update,
            event.timetoken
        ));
    }

    listenStatus(event) {
        let id = null;
        this.callback(new Message(id, this.username, `subscribed to "${this.pubnub.getSubscribedChannels()}"`));
        // player has joined the chat.
        if (event.category === 'PNConnectedCategory') {
            this.submitUpdate(new Message(id, this.username, 'has joined.'));
        }
    }    
}

// let message_counter = 
// find out what id is for.
class Message {
    constructor(id, sender_id, message, timetoken=Date.now()) {
        console.log(`id:${id}, sender_id:${sender_id}, message:${message}, timetoken:${timetoken}`);
        this.id = id;
        this.sender_id = sender_id;
        this.message = message;
        this.timetoken = Math.floor(timetoken / 1000);
    };
}

export {ChatClient, Message};