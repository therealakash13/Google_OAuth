# 🔐 Google OAuth 2.0 Authentication with Node.js & PostgreSQL

This project demonstrates how to implement **Google OAuth 2.0 authentication** from scratch in a **Node.js + Express** application using **PostgreSQL** for user storage — all without third-party auth library like Passport.js.

---
## Link
Live Link : [OAuth](https://google-oauth-yzwv.onrender.com)

---

## 🚀 Features

- Google OAuth 2.0 login
- Express session-based authentication
- PostgreSQL database for user persistence
- Auto `INSERT` / `UPDATE` for returning users

---

## 🧰 Tech Stack

| Component | Technology |
|------------|-------------|
| Server | Node.js, Express |
| Auth | Google OAuth 2.0 |
| Database | PostgreSQL |
| View Engine | EJS |
| Session | express-session |
| Env Config | dotenv |

---

## 🧩 Folder Structure

public/
    ├── assets/
        └── image.png
    ├── css/
        └── style.css
    └── js/
        └── script.js
views/
    ├── partials/
        ├── footer.ejs
        └── header.ejs
    ├── home.ejs
    └── index.ejs
.gitignore
package-lock.json
package.json
server.js
table.sql

---

## ⚙️ Environment Variables

Create a `.env` file in the root directory and add the following:

```env
PORT=3000
SECRET=[your_session_secret]
DATABASE_URI=[postgres://username:password@localhost:5432/your_db]
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URI=[whatever you set in google console setup]
```
---

## 🗄️ PostgreSQL Setup

Run the following SQL command to create the users table:

`CREATE  TABLE users (
  id SERIAL PRIMARY KEY,
  google_id VARCHAR(255) UNIQUE  NOT  NULL,
  display_name VARCHAR(255),
  email VARCHAR(255),
  photo TEXT
);`

---

## 🧠 How It Works

###  1. Redirect User to Google

When the user clicks **Login with Google**, they are redirected to:

`https://accounts.google.com/o/oauth2/v2/auth` 

###  2. Google Redirects Back

After login, Google redirects to `/auth/google/callback` with a `code`.

###  3. Exchange Code for Access Token

The server sends this `code` to Google’s token endpoint:

`https://oauth2.googleapis.com/token` 

and receives an **access token**.

###  4. Get User Info

The access token is used to fetch user data from:

`https://www.googleapis.com/oauth2/v2/userinfo` 

###  5. Store User in Database

If the user exists, update their info; otherwise insert a new row.

###  6. Maintain Session

User data is stored in a session (`express-session`) and used to render the home page.

---

## 🧭 Useful Links

-   🔗 [Google OAuth 2.0 Docs](https://developers.google.com/identity/protocols/oauth2)
    
-   🔗 [OAuth 2.0 Playground](https://developers.google.com/oauthplayground/)

---

## 🧹 Run the App

1.  Install dependencies:
    
    `npm install` 
    
2.  Start your PostgreSQL server and ensure `.env` is configured.
    
3.  Run the app:
    
    `npm start` 
    
    or
    
    `node server.js` 
    
4.  Visit:  
    👉 `http://localhost:3000`

---

## ✨ Future Improvements

-   Add support for **GitHub** or **LinkedIn** OAuth
    
-   Add JWT-based authentication for APIs
    
-   Deploy to **Render** / **Vercel** with environment variables
    

----------

## 🧑‍💻 Author

🔗 [LinkedIn](www.linkedin.com/in/akashkumar0) | 🌐 Portfolio ( *Soon* )
