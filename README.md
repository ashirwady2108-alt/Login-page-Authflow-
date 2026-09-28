Login Page – Authentication Flow

A simple login authentication project built with Node.js, Express, EJS, Express Session, and bcryptjs.

The project demonstrates how a basic login system works, including password verification, session-based authentication, protected routes, and logout functionality.

Technologies Used
Node.js
Express.js
EJS
Express Session
bcryptjs
HTML/CSS

The project dependencies include bcryptjs, ejs, express, and express-session.


1. How does the app know you're logged in after the first request?

The app uses Express Session. After successful login, the user's information is stored in req.session.user. The session cookie allows the server to recognize the user on future requests.

2. How should passwords be stored, and why not in plain text?

Passwords should be stored as hashed passwords, not plain text. This project uses bcrypt to hash and verify passwords, so the actual password is not stored directly.

3. What happens if someone opens the protected page without logging in?

The /welcome page is protected by authentication middleware. If there is no active session, the user is redirected to /login.

4. What would you add to make this production-ready?

I would add:

A proper database for users
Environment variables for secrets
Secure HTTPS cookies
Rate limiting
Input validation
Password reset and email verification
Better error handling and security
5. If unfinished, what was your plan for the rest?

The basic authentication flow is complete. The next step would be connecting it to a database and adding user registration, password reset, and additional security features.
