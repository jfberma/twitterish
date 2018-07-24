import React from 'react';
import SETTINGS from "../../settings";
import axios from 'axios';
import UserList from "./UserList";
import RequestHelper from "../../utils/RequestHelper";

export default class UserListContainer extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            users: []
        };
    }

    componentDidMount() {
        axios.get(SETTINGS.API_URL + "users/", RequestHelper.getAuthHeader()).then(response => {
            this.setState({
                users: response.data
            });
            this.updateList();
        });
    }

    componentDidUpdate(prevProps) {
        if (this.props.following !== prevProps.following) {
            this.updateList();
        }
    }

    updateList() {
        if (this.props.me) {
            let users = this.state.users.slice();
            let ids = this.props.following.map(user => user.id);
            users.forEach(user => user['following'] = ids.includes(user.id));
            this.setState({
                users: users
            });
        }
    }

    render() {
        return <UserList users={this.state.users}
                         me={this.props.me}
                         followUserHandler={this.props.followUserHandler}
                         unFollowUserHandler={this.props.unFollowUserHandler}/>;
    }
};
