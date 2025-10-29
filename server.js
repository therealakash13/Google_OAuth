import express from "express";
import axios from "axios";
import dotenv from "dotenv";
import session from "express-session";
import pg from "pg";
import ejs from "ejs";
import bodyParser from "body-parser";

// Server setup
dotenv.config(); // Environment Vars
const server = express();
const port = process.env.PORT;
server.set("view engine", "ejs");
server.use(express.static("public"));
server.use(bodyParser.urlencoded({ extended: true }));

// Session setup
server.use(
  session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

// PostgreSQL connection
const db = new pg.Client({ connectionString: process.env.DATABASE_URI });
db.connect();

// Google OAuth URLs
const GOOGLE_AUTH_URL = "https://accounts.google.com/o/oauth2/v2/auth";
const GOOGLE_TOKEN_URL = "https://oauth2.googleapis.com/token";
const GOOGLE_USERINFO_URL = "https://www.googleapis.com/oauth2/v2/userinfo";

// Routes : Starting page
server.get("/", (req, res) => {
  res.render("index.ejs");
});

// Route: Redirect user to Google
server.get("/auth/google", (req, res) => {
  const params = new URLSearchParams({
    client_id: process.env.GOOGLE_CLIENT_ID,
    redirect_uri: process.env.GOOGLE_CALLBACK_URI,
    response_type: "code",
    scope: "openid email profile",
    access_type: "offline",
    prompt: "consent",
  });
  res.redirect(`${GOOGLE_AUTH_URL}?${params.toString()}`);
});

// Route: Callback from Google
server.get("/auth/google/callback", async (req, res) => {
  const code = req.query.code;

  try {
    // 1. Exchange code for access token
    const tokenRes = await axios.post(GOOGLE_TOKEN_URL, {
      code,
      client_id: process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
      redirect_uri: process.env.GOOGLE_CALLBACK_URI,
      grant_type: "authorization_code",
    });

    const accessToken = tokenRes.data.access_token;

    // 2. Get user info
    const userRes = await axios.get(GOOGLE_USERINFO_URL, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    const { id, name, email, picture } = userRes.data;

    // 3. Insert/update user info to db
    const response = await db.query(
      ` INSERT INTO users (google_id, display_name, email, photo) 
        VALUES ($1, $2, $3, $4) 
        ON CONFLICT (google_id) 
        DO UPDATE SET 
          display_name = EXCLUDED.display_name,
          email = EXCLUDED.email,
          photo = EXCLUDED.photo
        RETURNING *`,
      [id, name, email, picture]
    );

    const user = response.rows[0];

    // 4. Store user in session
    req.session.user = user;
    res.redirect("/home");
  } catch (err) {
    console.error(err);
    res.send("Error during authentication");
  }
});

// Route: Logout
server.get("/logout", (req, res) => {
  req.session.destroy(() => res.redirect("/"));
});

// Route: Home
server.get("/home", (req, res) => {
  const user = req.session.user;
  if (!user) return res.redirect("/");
  res.render("home.ejs", { user: user });
});

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
