import React from 'react';
import './CreatePost.css'

export default class CreatePost extends React.Component {
    handleCreatePost = (content) => {
        this.props.createPostHandler(content)
    };

    render() {
        return (
            <div>
                <h5>Make A Post</h5>
                <div className="form-group">
                    <textarea className="form-control" ref="content"></textarea>
                </div>
                <div className="form-group">
                    <button className="btn btn-primary"
                            onClick={() => this.handleCreatePost(this.refs.content.value)}>Post
                    </button>
                </div>
            </div>
        );
    }

}