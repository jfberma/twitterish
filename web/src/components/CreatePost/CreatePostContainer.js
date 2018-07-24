import React from "react";
import CreatePost from "./CreatePost";
import RequestHelper from "../../utils/RequestHelper";
import SETTINGS from "../../settings";
import axios from "axios/index";
import Redirect from "react-router-dom/es/Redirect";

export default class CreatePostContainer extends React.Component {
    createPostHandler = (content) => {
        axios.post(SETTINGS.API_URL + "post/", {content: content}, RequestHelper.getAuthHeader()).then(response => {
            window.location.href = "/user-feed/" + this.props.me.username;
        }).catch(error => {
            console.log(error);
        });
    };

    render() {
        if (this.props.me) {
            return <CreatePost createPostHandler={this.createPostHandler}/>;
        } else {
            return <Redirect to="/login"/>
        }
    }
}