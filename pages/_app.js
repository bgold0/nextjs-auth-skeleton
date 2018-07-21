import API_URL from '../components/globalApiUrl.js'
import App, {Container} from 'next/app'
import React from 'react'
import fetch from 'isomorphic-unfetch'
import redirectTo from '../components/redirectTo.js'
import cookies from 'next-cookies'

export default class extends React.Component {

  static async getInitialProps ({ Component, router, ctx }) {
    let pageProps = {};
    const c = cookies(ctx);

    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx)
    }

    //if the authtoken is not found
    if(typeof c.authtoken == 'undefined') {
      //don't do anything if we are on a page that doesn't require credentials
      if(ctx.pathname == "/login" || ctx.pathname == "/forgot-password") return {pageProps};
      //if we are on any other page, redirect to the login page
      else redirectTo('/login', { res: ctx.res, status: 301 })
    }
    //if we do have an auth token to check
    else {

      var response = await fetch(API_URL+'/auth', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token:c.authtoken} )
      })
      .then( r => r.json() )
      .then( resp => {

        if(ctx.pathname == "/")  {

          //if auth check was successful, send to dashboard
          if(resp.result == "success") redirectTo('/dashboard', { res: ctx.res, status: 301 })
          else {

            //setting the cookie to expire way back when removes it
            document.cookie = "authtoken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
            redirectTo('/login', { res: ctx.res, status: 301 })

          }

        }

        else if(ctx.pathname == "/login") {

          //shouldn't show the login page is we are already logged in
          if(resp.result == "success") { redirectTo('/dashboard', { res: ctx.res, status: 301 });  }

          //if it wasn't successful, stay where we are
          else return {...pageProps, ...{query: ctx.query, authtoken: c.authtoken}};

        }

        //any other page that requires a login
        else {

          //if auth check was successful, stay where we are
          if(resp.result == "success") return {...pageProps, ...{query: ctx.query, authtoken: c.authtoken}};

          //if it wasn't successful, clear the authtoken since it must be expired or invalid and redirect to login
          else { 
            document.cookie = "authtoken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
            redirectTo('/login', { res: ctx.res, status: 301 });
          }
        }

      })
      .catch((err) => { console.log(err); return {pageProps}; })
    }

    if(response !== null) { return {response}; }
    else return {pageProps};

  }

  render () {
    const {Component, pageProps} = this.props

    return <Container>
      <Component {...this.props.response} />
    </Container>
  }
}