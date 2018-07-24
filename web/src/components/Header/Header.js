import React from 'react';
import './Header.css'
import {Link} from "react-router-dom";
import UrlHelper from "../../utils/UrlHelper";

export default class Header extends React.Component {
    render() {
        return (
            <div className="header">
                <div className="container">
                    <div className="row">
                        <div className="col-md-6">
                            <i className="fas fa-leaf"></i> <Link to="/">Twitterish</Link>
                        </div>
                        <div className="col-md-6 text-right">
                            <ul className="list-inline">
                                <li className="list-inline-item"><i className="fas fa-list-ul"></i> <Link to="/user-list">User List</Link></li>
                                {this.props.me ? (
                                    <span>
                                        <li className="list-inline-item"><i className="fas fa-pencil-alt"></i> <Link to="/create-post">Make A Post</Link></li>
                                        <li className="list-inline-item"><i className="fas fa-user"></i> Hello,  <Link to={UrlHelper.getUserFeedLink(this.props.me.username)}>{this.props.me.username}</Link></li>
                                        <li className="list-inline-item"><i className="fas fa-sign-out-alt"></i> <a className="logout" onClick={this.props.logoutHandler}>Logout</a></li>
                                    </span>
                                ) : (
                                    <span>
                                        <li className="list-inline-item"><i className="fas fa-sign-in-alt"></i> <Link to="/login">Login</Link></li>
                                        <li className="list-inline-item"><i className="fas fa-user-circle"></i> <Link to="/register">Sign Up</Link></li>
                                    </span>
                                )}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
};