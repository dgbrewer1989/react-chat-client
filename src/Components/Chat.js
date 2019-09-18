import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './../Css/Chat.css';
import Button from 'react-bootstrap/Button';

class Chat extends Component {
    static getTimeFromEpoch(epochSeconds) {
        return new Date(parseInt(epochSeconds));
    }
    constructor(props) {
        super(props);

        this.buildMessages = this.buildMessages.bind(this);
        this.sendMessage = this.sendMessage.bind(this);
        this.addMessage = this.addMessage.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.onKeyDown = this.onKeyDown.bind(this);
        this.state = {
            ws: null,
            messages: [],
            currentText: '',
        };

        this.textInput = React.createRef();
    }

    componentDidMount() {
        const {
            messages,
        } = this.props;

        const {
            userId,
        } = this.props.location.state;

        let websocket = new WebSocket("ws://localhost:8080/chat/socket/" + userId);

        websocket.onopen = () => {
            messages.push({message: 'connected', username: 'system', timestamp: 'now'});
            this.setState({ ws: websocket });
        };

        websocket.onmessage = evt => {
            const message = JSON.parse(evt.data)
            this.addMessage(message);
        };
    }

    componentWillUnmount() {
        const {
            ws,
        } = this.state;

        ws.close([1000, ['User left']]);
    }

    buildMessages(messages) {
        let mes = [];

        messages.forEach(function(message) {
            mes.push(
                <div className="Chat__message" key={message.username + message.timestamp}>
                    <div className="Chat__sender">
                        {message.username}
                    </div> 
                    <div className="Chat__text">
                        {message.message}
                    </div>
                    <div className="Chat__timeStamp">
                        {new Date(parseInt(message.timestamp)).toString()}
                    </div>
                    <hr />
                </div>
            );
        });

        return mes;
    }

    addMessage(message) {
        this.setState(state => ({ messages: [...state.messages, message]}));
    }

    sendMessage() {
        const {
            ws,
            currentText,
        } = this.state;

        const {
            username,
        } = this.props.location.state;

        if (currentText !== "") {
            ws.send(
                JSON.stringify(
                    {
                        username: username,
                        userId: 'fixme',
                        timestamp: new Date(Date.now()),
                        message: currentText,
                        isDirect: false
                    }
                )
            );

            this.setState({
                currentText: '',
            });

            this.textInput.current.focus();
        }
    }

    handleChange(e) {
        this.setState({ currentText: e.target.value});
    }

    onKeyDown(e) {
        if (e.key === 'Enter') {
            this.sendMessage();
        }
    }

    render() {
        const {
            messages,
            currentText,
        } = this.state;

        return (
            <div className="Chat__main">
                <div className="Chat__chatContainer">
                    <div className="Chat__history">
                        <hr />
                        {this.buildMessages(messages)}
                    </div>
                    <div className="Chat__actions">
                        <input
                            className="Chat__entryField"
                            type="text"
                            placeholder="Enter a message"
                            autoFocus={true}
                            onChange={this.handleChange}
                            onKeyDown={this.onKeyDown}
                            value={currentText}
                            ref={this.textInput}
                        />
                        <Button
                            className="Chat__sendButton"
                            onClick={this.sendMessage}
                        >
                            Send
                        </Button>
                    </div>
                </div>
            </div>
        )
    }
}

Chat.propTypes = {
    username: PropTypes.string,
    messages: PropTypes.array,
};

Chat.defaultProps = {
    messages: [],
};

export {
    Chat,
};