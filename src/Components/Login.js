import React, { Component } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import { Redirect } from 'react-router-dom';
import './../Css/Login.css';

class Login extends Component {
    static generateId() {
        return Math.random().toString(36).substr(2, 9);
    }

    constructor(props) {
        super(props);
        this.state = { login: '', loggedIn: false };
        this.onUpdate = this.onUpdate.bind(this);
        this.onClick = this.onClick.bind(this);
        this.join = this.join.bind(this);
    }

    onUpdate(e) {
        this.setState({ login: e.target.value });
    }

    join(username) {
        const userId = Login.generateId();
        let url = `http://localhost:8080/chat/connect/${userId}?username=${username}`;
        fetch(url, {
            method: 'POST',
            credentials: 'include',
            mode: 'no-cors'
          });

        return userId;
    }

    onClick(e) {
        e.preventDefault();
        let userId = this.join(this.state.login);
        this.setState({ loggedIn: true, userId: userId });
    }
    
    render() {
        if (this.state.loggedIn === true) {
            this.join(this.state.login);
            return <Redirect to={{
                pathname: '/chat',
                state: { username: this.state.login, userId: this.state.userId }
            }} />
        }

        return (
            <Container className="login__container">
                <div className="login__body">
                    <Form>
                        <Form.Group controlId="formEmail">
                            <Form.Label>
                                Username
                            </Form.Label>
                            <Form.Control type="username" placeholder="Enter a username" onChange={this.onUpdate}/>
                            <Form.Text className="text-muted">
                                Pick a username
                            </Form.Text>
                            <Button variant="outline-info" type="submit" onClick={this.onClick}>
                                Login
                            </Button>
                        </Form.Group>
                    </Form>
                </div>
            </Container>
        );
    }
}

export {
    Login,
};