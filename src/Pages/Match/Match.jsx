import React, { Component } from 'react';
import './Match.css';
import { Spring, animated } from 'react-spring'
import Axios from 'axios';

class Match extends Component {

    constructor(props) {
        super(props)
        this.state = {
            isLoading: false,
            currUser: {},
            otherUser: {},
            msgTF: ''
        }
        this.setupData()
    }

    setupData() {
        var url = (window.location.href).split("/")
        const game_id = url.pop()
        const user_id = url.pop()
        if(game_id === undefined || user_id === undefined || game_id === '' || user_id === '') {
            alert('Unable to load game')
            window.location = '/'
        }
        this.fetchData(user_id, game_id)
    }

    fetchData(user_id, game_id) {
        Axios.get("http://localhost:8000/game/" + game_id).then(
            (response) => {
                if(response['status'] === 200) {
                    const data = response['data']
                    const player1 = data['player1_req']
                    const player2 = data['player2_req']
                    const isCurrPlayer1 = player1['user_id'] === parseInt(user_id)
                    this.setState({
                        currUser: isCurrPlayer1 ? player1 : player2,
                        otherUser: isCurrPlayer1 ? player2 : player1
                    })
                    console.log(player1)
                }
            }
        ).catch(function(error) {
            alert('Unable to load game')
            window.location = '/'
        });
    }

    sendMessage() {
        this.setState({ msgTF: '' })
    }

    matchView() {
        return(
            <div className="match-trailing-message">
                <div className="match-message-divider"/>
                <div className="match-trailing-message-container">
                    <input type="text" className="match-trailing-message-input" placeholder="Type your message here..." value={this.state.msgTF} onChange={event => this.setState({ msgTF: event.target.value })} />
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
                    </div>
                    <div className="match-divider"/>
                    <div className="match-trailing-container">
                        <h1 className="match-trailing-turn">Your Turn</h1>
                        { this.matchView() }
                    </div>
                </div>
            </div>
        )
    }
}

export default Match;