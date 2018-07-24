import React from "react";
import Link from "react-router-dom/es/Link";
import './Post.css'
import UrlHelper from "../../utils/UrlHelper";

export default class Post extends React.Component {
    getFormattedDate(date) {
        let d = new Date(date);
        let hours = d.getHours();
        let minutes = d.getMinutes();
        let ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12;
        minutes = minutes < 10 ? '0' + minutes : minutes;
        let strTime = hours + ':' + minutes + ' ' + ampm;

        return strTime + " on " + (d.getMonth() + 1) + "/" + d.getDate() + "/" + d.getFullYear();
    }

    getPostLink() {
        return `/post/${this.props.post.id}`;
    }

    render() {
        if (this.props.post) {
            return (
                <div className="post">
                    <Link to={this.getPostLink()}>
                    <div className="row">
                        <div className="col-md-12">
                            <Link
                                to={UrlHelper.getUserFeedLink(this.props.post.user.username)}>{this.props.post.user.username}</Link>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-12 post-content">
                            {this.props.post.content}
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-12 date">
                            Posted
                            at {this.getFormattedDate(this.props.post.created_at)}
                        </div>
                    </div>
                    </Link>
                </div>
            )
        } else {
            return <div></div>
        }
    }
};