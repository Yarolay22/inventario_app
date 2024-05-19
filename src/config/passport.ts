import passport from 'passport'
import passportLocal from 'passport-local'
import AuthService from '../services/AuthService';

const authService = new AuthService()


const StrategyLocal = new passportLocal.Strategy(
    {
        usernameField: 'email', passwordField: 'password'
    },
    (email: string, password: string, done) => {
        authService.verificateCredential(email, password)
            .then(user => done(null, user))
            .catch(error => done(error, false))
    }
);


passport.use(StrategyLocal)
passport.serializeUser((user: any, done) => done(null, user.id))
passport.deserializeUser(async (id: number, done) => {
    authService.findById(id)
        .then(user => done(null, user))
        .catch(error => done(error, null))
})

export default passport