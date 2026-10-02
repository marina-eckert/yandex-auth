require("dotenv").config();
const express = require("express");
const session = require("express-session");
const passport = require("passport");
const YandexStrategy = require("passport-yandex").Strategy;

const app = express();
const PORT = 3000;

passport.use(
  new YandexStrategy(
    {
      clientID: process.env.YANDEX_CLIENT_ID,
      clientSecret: process.env.YANDEX_CLIENT_SECRET,
      callbackURL: `http://localhost:${PORT}/auth/yandex/callback`,
    },
    (accessToken, refreshToken, profile, done) => done(null, profile),
  ),
);

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((obj, done) => done(null, obj));

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  }),
);
app.use(passport.initialize());
app.use(passport.session());

const ensureAuth = (req, res, next) =>
  req.isAuthenticated() ? next() : res.redirect("/login");

app.get("/", (req, res) => {
  res.send(
    req.isAuthenticated()
      ? `Привет, ${req.user.displayName}! <a href="/profile">Профиль</a> | <a href="/logout">Выйти</a>`
      : `<a href="/login">Войти через Яндекс</a>`,
  );
});

app.get("/login", passport.authenticate("yandex"));

app.get(
  "/auth/yandex/callback",
  passport.authenticate("yandex", { failureRedirect: "/" }),
  (req, res) => res.redirect("/profile"),
);

app.get("/profile", ensureAuth, (req, res) => {
  const { id, displayName, username, emails, photos } = req.user;
  res.send(`
    <h1>Профиль</h1>
    <p>ID: ${id}</p>
    <p>Имя: ${displayName}</p>
    <p>Логин: ${username}</p>
    <p>Email: ${emails && emails[0] ? emails[0].value : "не указан"}</p>
    ${photos && photos[0] ? `<img src="${photos[0].value}" alt="avatar">` : ""}
    <p><a href="/logout">Выйти</a></p>
  `);
});

app.get("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    res.redirect("/");
  });
});

app.listen(PORT, () => console.log(`http://localhost:${PORT}`));
