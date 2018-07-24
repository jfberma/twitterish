import React from 'react';
import './Login.css'
import Redirect from "react-router-dom/es/Redirect";

const Login = props => {
    if (props.me != null) {
        return <Redirect to="/"/>
    } else {
        return (
            <div className="login-container col-md-6 mx-auto">
                <h5>Log in</h5>
                <form onSubmit={props.loginHandler}>
                    <div className="form-group">
                        <input name="username" placeholder="Username"
                               type="text"/>
                    </div>
                    <div className="form-group">
                        <input name="password" placeholder="Password"
                               type="password"/>
                    </div>
                    <input type="submit" value="Submit"
                           className="btn btn-primary"/>
                </form>
            </div>
        )
    }
};

export default Login;