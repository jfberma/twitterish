import React from "react";
import './Register.css'
import Redirect from "react-router-dom/es/Redirect";

const Register = props => {
    if (props.me != null) {
        return <Redirect to="/"/>
    } else {
        return (
            <div className="register-container col-md-6 mx-auto">
                <h5>Sign Up!</h5>
                <form onSubmit={props.registerHandler}>
                    <div className="form-group">
                        <input name="username" placeholder="Username"
                               type="text"/>
                    </div>
                    <div className="form-group">
                        <input name="email" placeholder="Email Address"
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
        );
    }
};

export default Register;