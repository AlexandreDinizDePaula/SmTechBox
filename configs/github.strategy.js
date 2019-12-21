const passport = require("passport");
const GitHubStrategy = require("passport-github").Strategy;

passport.use(
  new GitHubStrategy(
    {
      clientID: "6a6e0f54491673f8956c",
      clientSecret: "dbea27060e3f414d8e99aedc4cb2c3f5d0bdc644",
      callbackURL: "https://smtechbox.herokuapp.com/auth/github/callback"
    },
    function(accessToken, refreshToken, profile, done) {
      if (profile) {
        user = profile;
        
        return done(null, user);
      } else {
        return done(null, false);
      }
    }));

passport.serializeUser(function(user, done) {
  const onError = () => {
    console.log('Ocorreu um erro!')
  }

  done(undefined, user);
});

passport.deserializeUser(function(user, done) {
  const onError = () => {
    console.log('Ocorreu um erro!')
  }

  done(undefined, user);
});
