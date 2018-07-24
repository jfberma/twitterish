import React from 'react';
import {Route, Switch} from 'react-router-dom';
import Header from "../Header/Header";
import UserListContainer from "../UserList/UserListContainer";
import SETTINGS from "../../settings";
import axios from "axios/index";
import RequestHelper from "../../utils/RequestHelper";
import UserFeedContainer from "../UserFeed/UserFeedContainer";
import CreatePostContainer from "../CreatePost/CreatePostContainer";
import Register from "../Register/Register";
import Login from "../Login/Login";
import MainFeed from "../MainFeed/MainFeed";
import PostContainer from "../Post/PostContainer";

export default class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            me: null,
            following: [],
            feed: []
        };
    }

    componentDidMount() {
        this.getMe();
    }

    getMe() {
        axios.get(SETTINGS.API_URL + "auth/me/", RequestHelper.getAuthHeader()).then(response => {
            this.setState({
                me: response.data
            });
            return axios.get(SETTINGS.API_URL + "feed", RequestHelper.getAuthHeader());
        }).then(response => {
            this.setState({
                feed: response.data
            });
            return axios.get(SETTINGS.API_URL + "users/following/", RequestHelper.getAuthHeader());
        }).then(response => {
            this.setState({
                following: response.data
            });
        }).catch(RequestHelper.deleteToken);
    }

    registerHandler = (event) => {
        let username = event.target.username.value;
        let password = event.target.password.value;
        let email = event.target.email.value;
        axios.post(SETTINGS.API_URL + "auth/users/create/", {
            username: username,
            email: email,
            password: password,
            private: true
        }).then(() => {
            this.doLogin(username, password);
        }).catch(error => {
            let errorMessage = "";
            for (var e in error.response.data) {
                errorMessage += e + " " + error.response.data[e] + " ";
            }
            alert("There was a problem creating your account: " + errorMessage)
        });

        event.preventDefault();
    };

    loginHandler = (event) => {
        let username = event.target.username.value;
        let password = event.target.password.value;
        this.doLogin(username, password);

        event.preventDefault();
    };

    logoutHandler = () => {
        console.log(RequestHelper.getAuthHeader());
        axios.post(SETTINGS.API_URL + "auth/token/destroy/", {}, RequestHelper.getAuthHeader()).then(response => {
            RequestHelper.deleteToken();
            this.setState({
                me: null,
                feed: []
            });
        }).catch(error => {
            console.log(error);
        });
    };

    doLogin = (username, password) => {
        axios.post(SETTINGS.API_URL + "auth/token/create/", {
            username: username,
            password: password
        }).then(response => {
            window.localStorage.setItem("access_token", response.data.auth_token);
            this.getMe();
            window.location = "/";
        }).catch(error => {
            let errorMessage = "";
            for (var e in error.response.data) {
                errorMessage += e + " " + error.response.data[e] + " ";
            }
            alert("Login Failed: " + errorMessage)
        });
    };

    followUserHandler = (userId) => {
        axios.post(SETTINGS.API_URL + "users/follow/", {user: userId}, RequestHelper.getAuthHeader()).then(response => {
            this.getMe();
        }).catch(error => {
            console.log(error);
        });
    };

    unFollowUserHandler = (userId) => {
        axios.post(SETTINGS.API_URL + "users/unfollow/", {user: userId}, RequestHelper.getAuthHeader()).then(response => {
            this.getMe();
        }).catch(error => {
            console.log(error);
        });
    };

    togglePrivacySettings = () => {
        axios.put(SETTINGS.API_URL + "privacy/", {private: !this.state.me.private}, RequestHelper.getAuthHeader()).then(response => {
            this.setState({
                me: response.data
            })
        }).catch(error => {
            console.log(error);
        });
    };

    render() {
        return (
            <div>
                <Header me={this.state.me} logoutHandler={this.logoutHandler}/>
                <div className="container">
                    <div className="content">
                        <div className="col-md-8 mx-auto">
                            <Switch>
                                <Route path="/login" render={() => <Login
                                    loginHandler={this.loginHandler}
                                    me={this.state.me}/>}/>
                                <Route path="/user-list"
                                       render={() => <UserListContainer
                                           me={this.state.me}
                                           following={this.state.following}
                                           followUserHandler={this.followUserHandler}
                                           unFollowUserHandler={this.unFollowUserHandler}/>}/>
                                <Route path="/user-feed/:username"
                                       render={({match}) => <UserFeedContainer
                                           me={this.state.me}
                                           username={match.params.username}
                                           privacyChangeHandler={this.togglePrivacySettings}/>}/>
                                <Route path="/create-post"
                                       render={() => <CreatePostContainer
                                           me={this.state.me}/>}/>
                                <Route path="/post/:id"
                                       render={({match}) => <PostContainer
                                           id={match.params.id}
                                           me={this.state.me}/>}/>
                                <Route path="/register" render={() => <Register
                                    registerHandler={this.registerHandler}
                                    me={this.state.me}/>}/>
                                <Route path="/" render={() => <MainFeed
                                    feed={this.state.feed}
                                    me={this.state.me}/>}/>
                            </Switch>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
};
