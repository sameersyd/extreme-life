import React, { Component } from 'react';
import './Home.css';
import { Spring, animated } from 'react-spring'

class Home extends Component {

    constructor(props) {
        super(props)
        this.state = {
            isLoading: false,
            isStartDialogOpen: false,
            isHowToPlayDialogOpen: false,
            nickname: ""
        }
    }

    startDialog(animation) {
        return (
            <animated.div style={animation} className="home-startDialog">
                <div>
                    <div className="home-startDialog-input-dialog">
                        <input type="text" className="home-startDialog-input" placeholder="Nick name" onChange={event => this.setState({nickname: event.target.value})} />
                        <div className="home-startDialog-generate"/>
                    </div>
                    <div class="home-startDialog-divider"/>
                </div>
                <div className="home-startDialog-selection-body">
                    <div className="home-startDialog-selection">
                        <div className="home-startDialog-selection-actions"/>
                        <h1 className="home-startDialog-selection-title">Select actions</h1>
                    </div>
                    <div className="home-startDialog-selection">
                        <div className="home-startDialog-selection-script"/>
                        <h1 className="home-startDialog-selection-title">Submit script</h1>
                    </div>
                </div>
                <h1 className="home-startDialog-startBtn">Start Game</h1>
                <h1 className="home-startDialog-cancel" onClick={(e) => { this.setState({isStartDialogOpen: false}) }}>Cancel</h1>
            </animated.div>
        )
    }

    howToPlay(animation) {
        return (
            <animated.div style={animation} className="home-howToPlayDialog">
                <div className="home-howToPlay-layout">
                    <div className="home-howToPlay-header-layout">
                        <h1 className="home-howToPlay-header">How to play</h1>
                        <div className="home-howToPlay-close" onClick={(e) => { this.setState({isHowToPlayDialogOpen: false}) }}/>
                    </div>
                    <div className="home-howToPlay-content">
                        <h1 className="home-howToPlay-title">How to play</h1>
                        <h1 className="home-howToPlay-desc">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ultricies ultrices tincidunt nam augue non blandit cursus proin non. Non Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ultricies ultrices tincidunt nam augue non blandit cursus proin non. Non volutpat vulputate tincidunt nunc </h1>
                        <h1 className="home-howToPlay-title">How to play</h1>
                        <h1 className="home-howToPlay-desc">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ultricies ultrices tincidunt nam augue non blandit cursus proin non. Non Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ultricies ultrices tincidunt nam augue non blandit cursus proin non. Non volutpat vulputate tincidunt nunc </h1>
                        <h1 className="home-howToPlay-title">How to play</h1>
                        <h1 className="home-howToPlay-desc">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ultricies ultrices tincidunt nam augue non blandit cursus proin non. Non Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ultricies ultrices tincidunt nam augue non blandit cursus proin non. Non volutpat vulputate tincidunt nunc </h1>
                        <h1 className="home-howToPlay-title">How to play</h1>
                        <h1 className="home-howToPlay-desc">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ultricies ultrices tincidunt nam augue non blandit cursus proin non. Non Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ultricies ultrices tincidunt nam augue non blandit cursus proin non. Non volutpat vulputate tincidunt nunc </h1>
                        <h1 className="home-howToPlay-title">How to play</h1>
                        <h1 className="home-howToPlay-desc">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ultricies ultrices tincidunt nam augue non blandit cursus proin non. Non Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ultricies ultrices tincidunt nam augue non blandit cursus proin non. Non volutpat vulputate tincidunt nunc </h1>
                        <h1 className="home-howToPlay-title">How to play</h1>
                        <h1 className="home-howToPlay-desc">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ultricies ultrices tincidunt nam augue non blandit cursus proin non. Non Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ultricies ultrices tincidunt nam augue non blandit cursus proin non. Non volutpat vulputate tincidunt nunc </h1>
                    </div>
                </div>
            </animated.div>
        )
    }

	render() {
        return(
            <div className={this.state.isLoading ? "home-disableInteraction" : ""}>
                <div className={this.state.isStartDialogOpen || this.state.isHowToPlayDialogOpen ? "home-container home-bgBlur" : "home-container"}>
                    <div className="home-logoImage"/>
                    <div className="home-title-container">
                        <h1 className="home-title">Conquer</h1>
                        <h1 className="home-title">the</h1>
                        <h1 className="home-title">Board</h1>
                    </div>
                    <div className="home-bottom-wrap">
                        <div className="home-bottom-container">
                            <h1 className="home-text">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ultricies ultrices tincidunt nam augue non blandit cursus proin non. Non volutpat vulputate tincidunt nunc </h1>
                            <h1 className="home-primaryBtn" onClick={(e) => { this.setState({isStartDialogOpen: true}) }}>Let's Go</h1>
                            <h1 className="home-secondaryBtn" onClick={(e) => { this.setState({isHowToPlayDialogOpen: true}) }}>How to play?</h1>
                        </div>
                    </div>
                </div>
                <div className={this.state.isStartDialogOpen || this.state.isHowToPlayDialogOpen ? "home-boxes home-bgBlur" : "home-boxes"}/>
                <Spring
                    native
                    from= {{ transform: 'translate(-50%, 200%)' }}
                    to={{ transform: this.state.isStartDialogOpen ? 'translate(-50%, -50%)' : 'translate(-50%, 200%)' }}
                >
                    {(animation)=>(this.startDialog(animation))}
                </Spring>
                <Spring
                    native
                    from= {{ transform: 'translate(-50%, 200%)' }}
                    to={{ transform: this.state.isHowToPlayDialogOpen ? 'translate(-50%, -50%)' : 'translate(-50%, 1000%)' }}
                >
                    {(animation)=>(this.howToPlay(animation))}
                </Spring>
            </div>
        )
    }
}

export default Home;