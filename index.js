const express = require("express");
const session = require("express-session");
const bcrypt = require("bcryptjs");
const path = require("path");

const app = express();
const port = 5050;

app.set("view engine", "ejs");
app.set("views", __dirname);
app.use(express.static(__dirname));
app.use(express.urlencoded({ extended: false }));

app.use(
  session({
    name: "sid",
    secret: process.env.SESSION_SECRET || "dev-only-change-me",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      sameSite: "lax",
      secure: false,
      maxAge: 1000 * 60 * 30,
    },
  })
);

const users = [
  { email: "alice@example.com", name: "Alice", hash: bcrypt.hashSync("wonderland1", 12) },
  { email: "bob@example.com", name: "Bob", hash: bcrypt.hashSync("builder2", 12) },
];

const DUMMY_HASH = bcrypt.hashSync("dummy", 12);

function requireAuth(req, res, next) {
  if (req.session.user) return next();
  res.redirect("/login");
}

app.get("/", (req, res) => res.redirect(req.session.user ? "/welcome" : "/login"));

app.get("/login", (req, res) => {
  if (req.session.user) return res.redirect("/welcome");
  res.render("login", { error: "" });
});

app.post("/login", async (req, res) => {
  const { email = "", password = "" } = req.body;
  const user = users.find((u) => u.email === email.trim().toLowerCase());
  const ok = await bcrypt.compare(password, user ? user.hash : DUMMY_HASH);

  if (!user || !ok) {
    return res.status(401).render("login", { error: "Invalid email or password." });
  }

  req.session.regenerate((err) => {
    if (err) return res.status(500).send("Session error");
    req.session.user = { email: user.email, name: user.name };
    res.redirect("/welcome");
  });
});

app.get("/welcome", requireAuth, (req, res) => {
  res.set("Cache-Control", "no-store");
  res.render("welcome", { user: req.session.user });
});

app.post("/logout", (req, res) => {
  req.session.destroy(() => {
    res.clearCookie("sid");
    res.redirect("/login");
  });
});

app.listen(port, () => {
  console.log(`listening to port :${port}`);
});
