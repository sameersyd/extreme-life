import React, { Component } from 'react';
import './Match.css';
import { Spring, animated } from 'react-spring'
import Axios from 'axios';

class Match extends Component {

    constructor(props) {
        super(props)
        this.state = {
            isLoading: false
        }
    }

    render() {
        return(
            <div className={this.state.isLoading ? "match-disableInteraction" : ""}>
                <div>
                    <div className="match-container">
                        <div className="match-header">
                            <div className="match-logoImage"/>
                            <div className="match-username-container">
                                <h1 className="match-username">sameer_syd</h1>
                                <h1 className="match-VS">VS</h1>
                                <h1 className="match-username">cool_user</h1>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default Match;