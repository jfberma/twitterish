import React from "react";
import Post from "./Post";
import RequestHelper from "../../utils/RequestHelper";
import SETTINGS from "../../settings";
import axios from "axios/index";
import Private from "../Private/Private";


export default class PostContainer extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            post: null,
            private: false,
            doesNotExists: false
        }
    }

    getNoExistingPostMessage() {
        return `No post exists with id ${this.props.id}`;
    }

    componentDidMount() {
        axios.get(SETTINGS.API_URL + `post/${this.props.id}`, RequestHelper.getAuthHeader()).then(response => {
            this.setState({
                post: response.data
            });
        }).catch(reason => {
            if (reason.response.status === 500) {
                this.setState = ({
                    doesNotExists: true
                });
            } else if (reason.response.status === 403) {
                this.setState({
                    private: true
                });
            }
        });
    }

    render() {
        if (this.state.doesNotExists) {
            return <div>{`No post exists with id ${this.props.id}`}</div>
        }
        if (this.state.private) {
            return <Private/>
        }
        return <Post post={this.state.post}/>;
    }
}