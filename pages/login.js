import Layout from '../components/layout.js'
import API_URL from '../components/globalApiUrl.js'
import Link from 'next/link'
import Router from 'next/router'

export default class extends React.Component {

  constructor (props) {
    super(props)
    this.state = { email: '', password: '', loggingIn: false, errorMessage: '' }

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    const target = event.target, value = target.value, name = target.name;
    this.setState({ [name]: value });
  }

  handleSubmit(event) {
  		
  		event.preventDefault();
  	
	  	if(!this.state.loggingIn) {

	  		this.setState({loggingIn: true, errorMessage: ''});

	  		fetch(API_URL+'/auth', {
			  method: 'POST', headers: { 'Content-Type': 'application/json' },
			  body: JSON.stringify({ email: this.state.email, password: this.state.password })
			})
	  		.then( r => r.json() )
			.then( resp => {

				/* returns a JSON object {result: "success"} or {error:""} with 400 status */

				if(!resp.result) {
					this.setState({errorMessage: 'Email or Password is invalid.'})
				}
				else {
					document.cookie = 'authtoken='+resp.token;
					window.location = "/dashboard";
				}

				this.setState({loggingIn: false });
			})
		}
  }

  render = () => (
    <Layout>
       	<div>
		    <h2>Login</h2>
		    
			<form onSubmit={this.handleSubmit}>
				
				{this.state.errorMessage}

				<input name="email" type="email" placeholder="Email Address" value={this.state.email} onChange={this.handleChange} required />
				<input name="password" type="password" placeholder="password" value={this.state.password} onChange={this.handleChange} required />
				<Link href="/forgot-password"><a>Forgot password?</a></Link>
				<button name="submit" type="submit">{this.state.loggingIn ? 'Logging in..' : 'Log In'}</button>
			</form>

		  </div>
    </Layout>
  )

}