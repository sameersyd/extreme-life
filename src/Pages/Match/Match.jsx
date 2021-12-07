import React, { Component } from 'react';
import './Match.css';
import { Spring, animated } from 'react-spring'
import Axios from 'axios';

class Match extends Component {

    constructor(props) {
        super(props)
        this.state = {
            isLoading: false,
            data: {},
            msgTF: ''
        }
    }

    // componentWillMount() {
    //     if(this.props.location.state !== undefined) {
    //         const data = this.props.location.state.data;
    //         this.setState({ data: data })
    //     } else { window.location = '/'; }
    // }

    matchView() {
        return(
            <div className="match-trailing-message">
                <div className="match-message-divider"/>
                <div className="match-trailing-message-container">
                    <input type="text" className="match-trailing-message-input" placeholder="Type your message here..." value={this.state.msgTF} onChange={event => this.setState({ msgTF: event.target.value })} />
                    <h1 className="match-trailing-message-sendBtn">Send</h1>
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
                                <h1 className="match-username">sameer_syd</h1>
                                <h1 className="match-VS">VS</h1>
                                <h1 className="match-username">cool_user</h1>
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