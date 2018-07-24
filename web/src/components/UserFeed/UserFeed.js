import React from "react";
import Post from "../Post/Post";
import './UserFeed.css'
import Link from "react-router-dom/es/Link";

export default class UserFeed extends React.Component {

    getPrivacySettingButton() {
        if (this.props.owner) {
            let buttonStatus = this.props.privateSetting ? "Public" : "Private";
            let buttonIcon = this.props.privateSetting ?
                <i className="fas fa-lock-open"></i> :
                <i className="fas fa-lock"></i>;
            return (
                <div className="private-button-container">
                    <button className="btn btn-primary"
                            onClick={this.props.privacyChangeHandler}>
                        <span>{buttonIcon} </span>
                        Make {buttonStatus}</button>
                </div>
            );
        }

        return null;
    }

    render() {
        if (this.props.feed.length === 0) {
            return (
                <div className="container">
                    {this.getPrivacySettingButton()}
                    {this.props.owner ? (
                        <div>You have made no posts! Why don't we <Link
                            to="/create-post">change that</Link></div>
                    ) : (
                        <div>{this.props.username} has made no posts</div>
                    )}
                </div>
            )
        }
        return (
            <div>
                {this.props.owner ? (<h5>Your Posts</h5>) : (
                    <h5>{this.props.username}'s Posts</h5>)}
                {this.getPrivacySettingButton()}
                {this.props.feed.map((post, i) =>
                    <Post post={post} key={i}/>
                )}
            </div>
        )
    }
};