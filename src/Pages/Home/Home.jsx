import React, { Component } from 'react';
import './Home.css';

class Home extends Component {

    constructor(props) {
        super(props)
        this.state = {
            isLoading: false,
            showStartDialog: true,
            nickname: ""
        }
    }

	render() {
        return(
            <div className={this.state.isLoading ? "home-disableInteraction" : ""}>
                <div className={this.state.showStartDialog ? "home-container home-bgBlur" : "home-container"}>
                    <div className="home-logoImage"/>
                    <div className="home-title-container">
                        <h1 className="home-title">Conquer</h1>
                        <h1 className="home-title">the</h1>
                        <h1 className="home-title">Board</h1>
                    </div>
                    <div className="home-bottom-wrap">
                        <div className="home-bottom-container">
                            <h1 className="home-text">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ultricies ultrices tincidunt nam augue non blandit cursus proin non. Non volutpat vulputate tincidunt nunc </h1>
                            <h1 className="home-primaryBtn" onClick={(e) => { this.setState({showStartDialog: true}) }}>Let's Go</h1>
                            <h1 className="home-secondaryBtn">How to play?</h1>
                        </div>
                    </div>
                </div>
                <div className={this.state.showStartDialog ? "home-boxes home-bgBlur" : "home-boxes"}/>
                <div className="home-startDialog">
                    <div>
                        <input type="text" className="home-startDialog-input" placeholder="Nick name" onChange={event => this.setState({nickname: event.target.value})} />
                        <div class="home-startDialog-divider"/>
                    </div>
                    <div>
                        <h1 className="home-text">Select actions</h1>
                        <h1 className="home-text">Submit script</h1>
                    </div>
                </div>
            </div>
        )
    }
}

export default Home;