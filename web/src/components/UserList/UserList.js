import React from 'react';
import UrlHelper from "../../utils/UrlHelper";
import Link from "react-router-dom/es/Link";
import './UserList.css'

export default class UserList extends React.Component {
    handleFollowClick = (id) => {
        this.props.followUserHandler(id)
    };

    handleUnFollowClick = (id) => {
        this.props.unFollowUserHandler(id);
    };

    render() {
        return (
            <div>
                <h5>User List</h5>
                {this.props.users.map((user, i) =>
                    <div className="row user align-items-center" key={i}>
                        <div className="col-md-8">
                            <Link
                                to={UrlHelper.getUserFeedLink(user.username)}>{user.username}</Link>
                        </div>
                        {this.props.me &&
                        <div className="col-md-4 text-right">
                            {user.following ? (
                                <button className="btn btn-success"
                                        onClick={() => this.handleUnFollowClick(user.id)}>
                                    <i className="fas fa-user-friends"></i> Following
                                </button>
                            ) : (
                                <button className="btn btn-light"
                                        onClick={() => this.handleFollowClick(user.id)}>
                                    <i className="fas fa-user-friends"></i> Follow
                                </button>
                            )}
                        </div>
                        }
                    </div>
                )}
            </div>
        )
    }
};