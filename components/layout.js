import Head from 'next/head'
import React from 'react'

export default class extends React.Component {

	constructor (props) {
		super(props)
		this.state = { authtoken: props.authtoken }
	}

	render() {

		return (
			<div>
				<Head>
			   	<title>Title Here</title>
			      <meta name="viewport" content="initial-scale=1.0, width=device-width" />
			   </Head>

		    	{
		    		/* This is where the content in your other pages get's inserted to*/ 
		    		this.props.children
		    	}

			</div>
		)
	}
}