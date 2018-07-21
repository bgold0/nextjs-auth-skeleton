# nextjs-auth-skeleton
NextJS server and client side authentication skeleton template for simple JWT tokens

This took me a little while to get right. Thanks to [Tim](https://github.com/timneutkens) for basically showing me how to do all of this.

If anyone has any suggestions, would love to hear feedback.

----

To use this you need another server with the following endpoints:
1. One that accepts an email/password combo and spits out an **authtoken**
2. One that checks said **authtoken** and gives you a success or fail response
