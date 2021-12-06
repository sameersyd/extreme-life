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

    shouldBlurBackground() {
        return false
    }

    render() {
        return(
            <div className={this.state.isLoading ? "match-disableInteraction" : ""}>
                <div className={this.shouldBlurBackground() ? "match-container match-bgBlur" : "match-container"}>
                    User1 VS User2
                </div>
            </div>
        )
    }
}

export default Match;