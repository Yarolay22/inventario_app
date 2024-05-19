import path from 'path'
import express from 'express'
import morgan from 'morgan'
import session from 'express-session'
import { ConfigEnv, EnvVars } from './constant';
import { AppRoute } from './interfaces';
import passport from './config/passport'
import { errorHandlerApp } from './middlewares';


class Server {

    private app: express.Application;

    constructor(controllers: any[]) {
        this.app = express();
        this.init();

        this.initRouteControllers(controllers)
    }

    private init(): void {
        this.app.set('port', EnvVars.PORT)
        this.viewEngine();
        this.sessionInit();
        this.middlewares();
        this.staticFiles();
    }

    private sessionInit() {
        this.app.use(session({
            secret: EnvVars.SESSION_SECRET,
            resave: true,
            saveUninitialized: false
        }))

        this.app.use(passport.initialize())
        this.app.use(passport.session())
    }

    private viewEngine(): void {
        this.app.set('views', ConfigEnv.VIEWS)
    }

    private staticFiles(): void {
        this.app.use(express.static(path.join(__dirname, '../public')))
    }

    private middlewares(): void {
        this.app.use(express.json())
        this.app.use(express.urlencoded({ extended: true }))
        this.app.use(morgan('dev'))
    }

    private initRouteControllers(controllers: AppRoute[]) {
        controllers.forEach(controller => {
            this.app.use(controller.pathRoute(), express.static(path.join(__dirname, '../public')))
            this.app.use(controller.pathRoute(), controller.router())
        })
        this.app.use(errorHandlerApp)
    }

    listen(): void {
        this.app.listen(this.app.get('port'), () => console.log('URL => http://localhost:' + this.app.get('port')))
    }
}

export default Server;