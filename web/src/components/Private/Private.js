import React from 'react';

const Private = props => {
    return (
        <div className="container">{props.username ? (
            <div>{props.username}'s account is private.</div>
            ) : (
            <div>This post is private.</div>
            )}
        </div>
    )
};

export default Private