import React from "react";
import UserFeed from "./UserFeed";
import RequestHelper from "../../utils/RequestHelper";
import SETTINGS from "../../settings";
import axios from "axios/index";
import Private from "../Private/Private";

export default class UserFeedContainer extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            feed: [],
            private: false
        }
    }

    componentDidMount() {
        this.getUserFeed();
    }

    componentDidUpdate(prevProps) {
        if (prevProps.username !== this.props.username) {
            this.getUserFeed();
        }
    }

    getUserFeed() {
        axios.get(SETTINGS.API_URL + `feed/${this.props.username}/`, RequestHelper.getAuthHeader()).then(response => {
            this.setState({
                feed: response.data
            });
        }).catch(reason => {
            if (reason.response.status === 403) {
                this.setState({
                    private: true
                });
            }
        });
    }

    isOwner() {
        return !!(this.props.me && this.props.me.username === this.props.username);
    }

    isPrivate() {
        return this.props.me && this.props.me.private
    }

    render() {
        if (this.state.private) {
            return (
                <Private username={this.props.username}/>
            )
        } else {
            return (
                <UserFeed feed={this.state.feed} owner={this.isOwner()}
                          username={this.props.username}
                          privateSetting={this.isPrivate()}
                          privacyChangeHandler={this.props.privacyChangeHandler}/>
            )
        }
    }
}