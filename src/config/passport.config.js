import passport from "passport";
import passportJWT from "passport-jwt";
import GithubStrategy from "passport-github2"
import UserModel from "../models/user.model.js";
import { generateToken } from "../utils.js";

const JWTStrategy = passportJWT.Strategy

const initializePassport = () => {

passport.use("github", new GithubStrategy({
    clientID: "Iv1.c2550b5bc810f95a",
    clientSecret: "a319b55f5a472db00d228bb66259aabcde6214b0",
    callbackURL: "http://127.0.0.1:8080/githubcallback"
}, async (accessToken, refreshToken, profile, done) => {
    console.log(profile)

    try{
        const email = profile._json.email
        let user = await UserModel.findOne({ email})
        if(!user){
            console.log("User dosesn/'t exist. Pass to register...")

            user = {
                name: profile._json.name,
                email,
                password: "",
                role: "user",
                social: "github"
            }
            const result = await UserModel.create(user)
            console.log("User register succefully 👌")

            user._id = result._id
        }

        const token = generateToken(user)
        user.token = token
        return done(null, user)
    }catch(e){
        console.error(e)
        return done("[GITHUB] " + e)
    }
}))

passport.use("jwt", new JWTStrategy({
    jwtFromRequest: passportJWT.ExtractJwt.fromExtractors([req => req?.cookies?.cookieJWT ?? null ]),
    secretOrKey: "secretForJWT"
}, (jwt_payload, done) => {
    done(null, jwt_payload)
}))

    passport.serializeUser((user, done) =>{
        done(null, user._id)
    })
    passport.deserializeUser(async (id, done) =>{
        const user = await UserModel.findById(id)
        done(null, user)
    })
}


export default initializePassport