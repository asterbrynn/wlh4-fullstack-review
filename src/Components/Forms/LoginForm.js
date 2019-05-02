import React, {Component} from 'react';
import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom';
import {updateUserID, updateUsername} from '../../redux/reducer';
import axios from 'axios';

class LoginForm extends Component {
	constructor() {
		super();
		this.state = {
			loginUsername: "",
			loginPassword: "",
			loginError: false,
			loginErrorMessage: "Username or password is incorrect.  Please try again."
		}
	}

	handleFormInputUpdate = e => {
		// public class field syntax = autobinds "this" for us
		this.setState({
			[e.target.name] : e.target.value,
			loginError: false
		})
	}
	handleLoginFormSubmit = async e => {
		e.preventDefault();
		const {loginUsername, loginPassword} = this.state;
		try {
			const res = await axios.post('/auth/login', {loginUsername, loginPassword});
			this.props.updateUsername(loginUsername);
			this.props.updateUserID(res.data.user_id);
			this.props.history.push('/info');
		} catch (err) {
			this.setState({loginUsername: "", loginPassword: "", loginError: true});
		}
	}

	render() {
		return (
			<>
			<h1>Login</h1>
			<form>
				<input type="text" name="loginUsername" placeholder="Username"
					value={this.state.loginUsername}
					onChange={this.handleFormInputUpdate}/>
				<input type="text" name="loginPassword" placeholder="Password"
					value={this.state.loginPassword}
					onChange={this.handleFormInputUpdate}/>
				<button>Login</button>
			</form>
			{this.state.loginError && <h3>{this.state.loginErrorMessage}</h3>}
			</>
		)
	}
}

const mapDispatchToProps = {
	updateUserID,
	updateUsername
}

export default connect(null, mapDispatchToProps)(withRouter(LoginForm));