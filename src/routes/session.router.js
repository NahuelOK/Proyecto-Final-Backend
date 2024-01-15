import { Router } from "express";
import UserModel from "../models/user.model.js";
import passport from "passport";

const router = Router()

router.get("/", async (req, res) => {
    const users = await UserModel.find().lean()
    res.render("index", { users })
})

router.get("/githublogin",
    passport.authenticate("github", { scope: ["user:email"]}),
    (req, res) => {}
)
router.get("/githubcallback",
    passport.authenticate("github", { failureRedirect: "/error?error=GithubFail"}),
    (req, res) => {
        if(!req.user){
            return res.status(500).send("Invalid Github")
        }

        res.cookie("cookieJWT", req.user.token).redirect("/")
    }
 )

router.get(
    "/private", 
    passport.authenticate("jwt", { session: false }),
    (req, res) =>{
        const {user} = req.user
        console.log({ user })
        res.render("private", { user })
    }    
)

router.get("/error", (req, res) =>{
    const error = req.query?.error ?? "Error on Server"

    res.render("error", { error })
})

export default router;