import React from "react";
import Post from "../Post/Post";
import Link from "react-router-dom/es/Link";

export default class MainFeed extends React.Component {
    render() {
        if (this.props.me) {
            if (this.props.feed.length > 0) {
                return (
                    <div>
                        <h5>Your Feed</h5>
                        {this.props.feed.map((post, i) =>
                            <Post post={post} key={i}/>
                        )}
                    </div>
                )
            } else {
                return (
                    <div>
                        Your feed is empty! <Link to="/user-list">Follow some people</Link> or <Link to="create-post">make a post</Link>
                    </div>
                )
            }
        } else {
            return (
                <div><Link to="/login">Login</Link> or <Link to="/register">sign up</Link> and start following people!</div>
            )
        }
    }
};