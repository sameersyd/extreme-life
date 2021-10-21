import React, { Component } from 'react';
import './Home.css';

class Home extends Component {
	render() {
        return(
            <div>
                <div className="home-container">
                    <div className="home-logoImage"/>
                    <div className="home-title-container">
                        <h1 className="home-title">Conquer</h1>
                        <h1 className="home-title">the</h1>
                        <h1 className="home-title">Board</h1>
                    </div>
                    <div className="home-bottom-wrap">
                        <div className="home-bottom-container">
                            <h1 className="home-text">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ultricies ultrices tincidunt nam augue non blandit cursus proin non. Non volutpat vulputate tincidunt nunc </h1>
                            <h1 className="home-primaryBtn">Let's Go</h1>
                            <h1 className="home-secondaryBtn">How to play?</h1>
                        </div>
                    </div>
                </div>
                <div className="home-boxes"/>
            </div>
        )
    }
}

export default Home;