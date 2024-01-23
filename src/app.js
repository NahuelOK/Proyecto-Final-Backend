import express from "express"
import mongoose from "mongoose"
import sessionRouter from "./routes/session.router.js"
import productosRouter from "./routes/productos.router.js"
import handlebars from "express-handlebars"
import cookieParser from "cookie-parser"
import session from "express-session"
import __dirname from "./utils.js"
import initializePassport from "./config/passport.config.js"
import passport from "passport"

//Consts
const app = express()
const mongoURL = "mongodb+srv://nahuel23009:6KwNRivgNXTdFnit@myfirstdb.aozrhlt.mongodb.net/"
const DBname = "proyecto-final-banckend"

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

//Session
app.use(session({
    secret: "secret",
    resave: true,
    saveUninitialized: true
}))
app.use(cookieParser())

//Handlebars
app.engine("handlebars", handlebars.engine())
app.set ("views", __dirname + "/views")
app.set ("view engine", "handlebars")

//Rutas
app.use("/", sessionRouter)
app.use("/productos", productosRouter)

//Passport
initializePassport()
app.use(passport.initialize())
app.use(passport.session())

//Running..
mongoose.connect(mongoURL, { dbName: DBname })
.then(() => app.listen(8080, () => console.log("Running...")))
.catch(e => console.error(e))
