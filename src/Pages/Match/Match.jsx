import React, { Component } from 'react';
import './Match.css';
// import { Spring, animated } from 'react-spring'
import Axios from 'axios';
import Game from '../Game/Game.jsx';
import { ChatClient } from '../../Components/ChatClient'

class Match extends Component {
    API_URL = "https://www.comp680elgame.tk/";

    constructor(props) {
        super(props)
        this.state = {
            isLoading: false,
            game_id: 0,
            currUser: {},
            otherUser: {},
            msgTF: '',
            msgObj: null,
            messages: []
        }
        this.setupData()
        this.msgcallback = this.msgcallback.bind(this)
    }

    setupData() {
        var url = (window.location.href).split("/")
        const game_id = url.pop()
        const user_id = url.pop()
        if(game_id === undefined || user_id === undefined || game_id === '' || user_id === '') {
            alert(`Unable to load game: game_id ${game_id}, user_id ${user_id}`)
            window.location = '/'
        }
        console.log(`Fetching data: ${user_id}, ${game_id}`)
        this.fetchData(user_id, game_id)
    }

    fetchData(user_id, game_id) {
        Axios.get(this.API_URL + "game/" + game_id).then(
            (response) => {
                if(response['status'] === 200) {
                    const data = response['data']
                    const player1 = data['p1_user_id']
                    const player2 = data['p2_user_id']
                    const isCurrPlayer1 = player1 === parseInt(user_id)
                    this.setState({
                        game_id: parseInt(game_id),
                        currUser: { user_id : (isCurrPlayer1 ? player1 : player2) } ,
                        otherUser: { user_id : (isCurrPlayer1 ? player2 : player1) }
                    }, () => {
                        console.log(`callback called`)
                        this.fetchUsernames()
                        this.setupChat()
                    })
                }
            }
        ).catch(function(error) {
            alert(`Unable to load game: ${error}`)
            window.location = '/'
        });
    }

    fetchUsernames() {
        Axios.get(this.API_URL + "profile").then(
            (response) => {
                if (response.status === 200) {
                    response.data.forEach(profile => {
                        if (profile.user_id === this.state.otherUser.user_id) {
                            let otherUser = { ...this.state.otherUser }
                            otherUser.username = profile.username
                            this.setState({ otherUser: otherUser })
                        }
                        else if (profile.user_id === this.state.currUser.user_id) {
                            let currUser = { ...this.state.currUser }
                            currUser.username = profile.username
                            this.setState({ currUser: currUser })
                        }
                        if (this.state.currUser.username && this.state.otherUser.username) return
                    })
                    
                }
            }
        )    
    }

    sendMessage() {
        // make sure username is assigned.
        if (this.state.msgObj.username === undefined) {
            const msgObjTemp = this.state.msgObj
            msgObjTemp.username = this.state.currUser["username"]
            this.setState({ msgObj: msgObjTemp })
        }
        const msgObj = this.state.msgObj
        msgObj.sendMessage(this.state.msgTF)
        this.setState({ msgTF: '' })
    }

    setupChat() {
        const msgObj = new ChatClient(
            this.state.currUser['username'],
            this.state.currUser['user_id'],
            this.state.game_id,
            this.msgcallback
        )
        this.setState({ msgObj: msgObj })
    }

    msgcallback(message) {
        var msgs = this.state.messages
        console.log(message)
        console.log(message.message)
        console.log(message.sender_id)
        msgs.push(message)
        this.setState({ messages: msgs })
    }

    // Call method when keys pressed, and check if it's 'Enter' key
    sendKeyPressed(event) {
        var code = event.keyCode || event.which;
        if(code === 13) { this.sendMessage() }
    }

    messageView() {
        return(
            <div className="match-trailing-message">
                <div className="match-messages-list">
                    {this.state.messages.map((msgObj, k) => {
                        const isSent = msgObj.id === this.state.currUser["user_id"]
                        return(
                            <h1 className={isSent ? 'match-message-msgs-sent-title' : 'match-message-msgs-received-title'}>{`${msgObj.sender_id}: ${msgObj.message}`}</h1>
                        )
                    })}
                </div>
                <div className="match-message-divider"/>
                <div className="match-trailing-message-container">
                    <input type="text" className="match-trailing-message-input" onKeyPress={this.sendKeyPressed.bind(this)} placeholder="Type your message here..." value={this.state.msgTF} onChange={event => this.setState({ msgTF: event.target.value })} />
                    <button className="match-trailing-message-sendBtn" onClick={(e) => { this.sendMessage() }}>Send</button>
                </div>
            </div>
        )
    }

    render() {
        return(
            <div className={this.state.isLoading ? "match-disableInteraction" : ""}>
                <div className="match-container">
                    <div className="match-leading-container">
                        <div className="match-header">
                            <div className="match-logoImage"/>
                            <div className="match-username-container">
                                <h1 className="match-username">{this.state.currUser['username']}</h1>
                                <h1 className="match-VS">VS</h1>
                                <h1 className="match-username">{this.state.otherUser['username']}</h1>
                            </div>
                        </div>
                        <Game currUser={this.state.currUser} otherUser={this.state.otherUser}/>
                    </div>
                    <div className="match-divider"/>
                    <div className="match-trailing-container">
                        <h1 className="match-trailing-turn">Your Turn</h1>
                        { this.messageView() }
                    </div>
                </div>
            </div>
        )
    }
}

export default Match;
