import React, { Component } from 'react';
import './Home.css';
import { Spring, animated } from 'react-spring'
import Axios from 'axios';

class Home extends Component {

    constructor(props) {
        super(props)
        this.state = {
            isLoading: false,
            isHowToPlayDialogOpen: false,
            isusernameDialogOpen: false,
            isSelectionDialogOpen: false,
            isValidateDialogOpen: false,
            isMatchingDialogOpen: false,
            username: "",
            userId: 0,
            actionScripts: [],
            scriptName: "",
            scriptId: 0,
            script: ""
        }
        this.fetchActions()
    }

    fetchActions() {
        var config = {
            headers: {'Access-Control-Allow-Origin': '*'}
        };
        Axios.get("http://localhost:8000/actionscript/", config).then(
            (response) => {
                if(response['status'] === 200) {
                    let data = [
                        { "script_name": "Side shifter", "script_id": 425345 },
                        { "script_name": "Attack 2", "script_id": 987439 },
                        { "script_name": "Round Attack", "script_id": 209257 },
                        { "script_name": "Slider attack 1", "script_id": 874365 },
                        { "script_name": "Cell Box", "script_id": 983465 },
                        { "script_name": "Flex Attack 1", "script_id": 982374},
                        { "script_name": "Flex Attack 3", "script_id": 297434 },
                    ]
                    // var data = response['data']
                    this.setState({ actionScripts: data })
                }
            }
        );
    }

    createUser() {
        var username = this.state.username
        if(username === "") {
            alert("Enter Username")
        } else if(username.length < 3 || username.length > 32) {
            alert("Username should be between 3 to 32 characters")
        } else if(!this.isUserNameValid()) {
            alert("Invalid Username")
        } else {
            var config = {
                headers: {'Access-Control-Allow-Origin': '*'}
            };
            Axios.post("http://localhost:8000/profile/"+this.state.username, config).then(
                (response) => {
                    if(response['status'] === 200) {
                        var data = response['data']
                        this.setState({
                            userId: data['userid'],
                            isusernameDialogOpen: false,
                            isSelectionDialogOpen: true
                        })
                    }
                }
            );
        }
    }

    isUserNameValid(username) {
        /*
          Usernames can only have:
          - Lowercase Letters (a-z)
          - Numbers (0-9)
          - Dots (.)
          - Underscores (_)
        */
        const res = /^[a-z0-9_.]+$/.exec(username);
        const valid = !!res;
        return valid;
    }

    generateUsername() {
        var length = Math.floor(Math.random() * (32 - 3 + 1) + 3)
        var result = '';
        var characters = 'abcdefghijklmnopqrstuvwxyz0123456789._';
        var charactersLength = characters.length;
        for(var i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength))
        }
        this.setState({ username: result })
    }

    usernameDialog(animation) {
        return (
            <animated.div style={animation} className="home-dialog">
                <div>
                    <div className="home-usernameDialog-input-dialog">
                        <input type="text" className="home-usernameDialog-input" placeholder="Username" value={this.state.username} onChange={event => this.setState({ username: event.target.value })} />
                        <div className="home-usernameDialog-generate" onClick={(e) => { this.generateUsername() }}/>
                    </div>
                    <div class="home-usernameDialog-divider"/>
                </div>
                <h1 className="home-usernameDialog-startBtn" onClick={(e) => { this.createUser() }}>Create User</h1>
                <h1 className="home-dialog-cancel" onClick={(e) => { this.cancelUsername() }}>Cancel</h1>
            </animated.div>
        )
    }

    cancelUsername() {
        this.setState({
            username: "",
            isusernameDialogOpen: false
        })
    }

    selectionDialog(animation) {
        return (
            <animated.div style={animation} className="home-dialog">
                <div className="home-selectionDialog-selection-body">
                    <div className="home-selectionDialog-selection" onClick={ (e) => {this.setState({isScriptsDialogOpen: true})}}>
                        <div className="home-selectionDialog-selection-actions"/>
                        <h1 className="home-selectionDialog-selection-title">Select actions</h1>
                    </div>
                    <div className="home-selectionDialog-selection" onClick={ (e) => {this.setState({isValidateDialogOpen: true})}}>
                        <div className="home-selectionDialog-selection-script"/>
                        <h1 className="home-selectionDialog-selection-title">Submit script</h1>
                    </div>
                </div>
                <h1 className="home-dialog-cancel" onClick={(e) => { this.setState({isSelectionDialogOpen: false}) }}>Cancel</h1>
            </animated.div>
        )
    }

    actionScripts(animation) {
        return (
            <animated.div style={animation} className="home-scriptsDialog">
                <div className="home-scriptsDialog-container">
                    {this.state.actionScripts.map((aObj, k) => {
                        const script_name = aObj.script_name
                        return(
                            <h1 className="home-scriptsDialog-title" onClick={(e) => { 
                                this.setState({
                                    scriptId: aObj.script_id, 
                                    isScriptsDialogOpen: false,
                                    isSelectionDialogOpen: false
                                })
                                this.matchPlayer()
                            }}>{script_name}</h1>
                        )
                    })}
                </div>
                <h1 className="home-dialog-cancel" onClick={(e) => { this.setState({ isScriptsDialogOpen: false }) }}>Cancel</h1>
            </animated.div>
        )
    }

    validateScript(animation) {
        return (
            <animated.div style={animation} className="home-dialog">
                <div>
                    <input type="text" className="home-usernameDialog-input" placeholder="Script name" value={this.state.scriptName} onChange={event => this.setState({ scriptName: event.target.value })} />
                    <div class="home-usernameDialog-divider"/>
                </div>
                <button className="home-validateDialog-uploadBtn" onClick={(e) => { this.uploadScript() }}>Upload script</button>
                <h1 className="home-dialog-cancel" onClick={(e) => { this.setState({isValidateDialogOpen: false}) }}>Cancel</h1>
            </animated.div>
        )
    }

    uploadScript() {
        if(this.state.scriptName === "") {
            alert('Enter script name'); return
        }
        this.selectFile()
    }

    matchingDesign(animation) {
        return (
            <animated.div style={animation} className="home-dialog">
                <h1 className="home-matchDialog-header">Matching User...</h1>
            </animated.div>
        )
    }

    howToPlay(animation) {
        return (
            <animated.div style={animation} className="home-howToPlayDialog">
                <div className="home-howToPlay-layout">
                    <div className="home-howToPlay-header-layout">
                        <h1 className="home-howToPlay-header">How to play</h1>
                        <div className="home-howToPlay-close" onClick={(e) => { this.setState({ isHowToPlayDialogOpen: false }) }}/>
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

    letsGoBtn() {
        this.setState({
            isusernameDialogOpen: this.state.userId === 0,
            isSelectionDialogOpen: this.state.userId !== 0
        })
    }

    shouldBlurBackground() {
        return this.state.isusernameDialogOpen || this.state.isHowToPlayDialogOpen || this.state.isSelectionDialogOpen || 
        this.state.isScriptsDialogOpen || this.state.isValidateDialogOpen || this.state.isMatchingDialogOpen
    }

    // Upload Script Dialog -> Trigger [ <input type="file" ] when button pressed
    selectFile = () => {this.refs.fileUploader.click();}

    // Upload File Dialog -> choose file - selected
    onFileSelect = (e) => {
        let file = e.target.files[0]
        if(file != null) {
            this.setState({ script: file }, () => {
                this.callValidateAPI(file)
            })
        }
    }

    callValidateAPI(file) {
        this.setState({ isLoading: true }, () => {
            var formData = new FormData();
            formData.append("file", file);
            var config = {
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Content-Type': 'multipart/form-data'
                },
                params: {'script_name': this.state.scriptName}
            };
            Axios.post("http://localhost:8000/actionscript", formData, config).then(
                (response) => {
                    if(response['status'] === 200) {
                        var data = response['data']
                        this.setState({
                            isLoading: false, scriptId: data['script_id'],
                            isValidateDialogOpen: false,
                            isSelectionDialogOpen: false
                        })
                        this.matchPlayer()
                    }
                }
            );
        })
    }

    matchPlayer() {
        this.setState({ isLoading: true, isMatchingDialogOpen: true }, () => {
            Axios.post("http://localhost:8000/match", {
                'player_id': this.state.userId,
                'action_script_id': this.state.scriptId
            }).then(
                (response) => {
                    if(response['status'] === 200) {
                        var data = response['data']
                        if(data['match_is_complete']) { this.playerMatched() }
                        else { this.listenForMatch(data['request_id']) }
                    }
                }
            );
        })
    }

    playerMatched() {
        this.setState({
            isLoading: false,
            isMatchingDialogOpen: false
        }, () => {
            window.location = '/match'
        })
    }

    listenForMatch(reqId) {
        Axios.get("http://localhost:8000/match/" + reqId).then(
            (response) => {
                if(response['status'] === 200) {
                    var data = response['data']
                    if(data['match_is_complete']) { this.playerMatched() }
                    else { setTimeout(() => { this.listenForMatch(reqId) }, 3000) }
                }
            }
        );
    }

	render() {
        return(
            <div className={this.state.isLoading ? "home-disableInteraction" : ""}>
                <div className={this.shouldBlurBackground() ? "home-container home-bgBlur" : "home-container"}>
                    <div className="home-logoImage"/>
                    <div className="home-title-container">
                        <h1 className="home-title">Conquer</h1>
                        <h1 className="home-title">the</h1>
                        <h1 className="home-title">Board</h1>
                    </div>
                    <div className="home-bottom-wrap">
                        <div className="home-bottom-container">
                            <h1 className="home-text">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ultricies ultrices tincidunt nam augue non blandit cursus proin non. Non volutpat vulputate tincidunt nunc </h1>
                            <h1 className="home-primaryBtn" onClick={(e) => { this.letsGoBtn() }}>Let's Go</h1>
                            <h1 className="home-secondaryBtn" onClick={(e) => { this.setState({isHowToPlayDialogOpen: true}) }}>How to play?</h1>
                        </div>
                    </div>
                </div>
                <div className={this.shouldBlurBackground() ? "home-boxes home-bgBlur" : "home-boxes"}/>
                <input type='file' onChange={(e) => this.onFileSelect(e)} accept="file/*, .py" ref="fileUploader" style={{display:"none"}} />
                <Spring
                    native
                    from= {{ transform: 'translate(-50%, 200%)' }}
                    to={{ transform: this.state.isHowToPlayDialogOpen ? 'translate(-50%, -50%)' : 'translate(-50%, 1000%)' }}
                >
                    {(animation)=>(this.howToPlay(animation))}
                </Spring>
                <Spring
                    native
                    from= {{ transform: 'translate(-50%, 200%)' }}
                    to={{ transform: this.state.isusernameDialogOpen ? 'translate(-50%, -50%)' : 'translate(-50%, 1000%)' }}
                >
                    {(animation)=>(this.usernameDialog(animation))}
                </Spring>
                <Spring
                    native
                    from= {{ transform: 'translate(-50%, 200%)' }}
                    to={{ transform: this.state.isSelectionDialogOpen ? 'translate(-50%, -50%)' : 'translate(-50%, 1000%)' }}
                >
                    {(animation)=>(this.selectionDialog(animation))}
                </Spring>
                <Spring
                    native
                    from= {{ transform: 'translate(-50%, 200%)' }}
                    to={{ transform: this.state.isScriptsDialogOpen ? 'translate(-50%, -50%)' : 'translate(-50%, 1000%)' }}
                >
                    {(animation)=>(this.actionScripts(animation))}
                </Spring>
                <Spring
                    native
                    from= {{ transform: 'translate(-50%, 200%)' }}
                    to={{ transform: this.state.isValidateDialogOpen ? 'translate(-50%, -50%)' : 'translate(-50%, 1000%)' }}
                >
                    {(animation)=>(this.validateScript(animation))}
                </Spring>
                <Spring
                    native
                    from= {{ transform: 'translate(-50%, 200%)' }}
                    to={{ transform: this.state.isMatchingDialogOpen ? 'translate(-50%, -50%)' : 'translate(-50%, 1000%)' }}
                >
                    {(animation)=>(this.matchingDesign(animation))}
                </Spring>
            </div>
        )
    }
}

export default Home;