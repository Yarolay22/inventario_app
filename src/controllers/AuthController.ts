import { NextFunction, Request, Response, Router } from "express";
import { AppRoute } from "../interfaces";
import passport from '../config/passport'
import { validateAccessIsNotAutenticate } from "../middlewares";

class AuthController implements AppRoute {


    private _pathRoute: string = '/auth'
    private _router: Router;

    constructor() {
        this._router = Router();

        this.init();
    }

    init() {
        this.validateAutenticated()

        this._router.use(validateAccessIsNotAutenticate())
        this.getDetalleUser()
        this.logoutAuth();
    }

    validateAutenticated() {
        this._router.post('/login', passport.authenticate('local', {
            failureRedirect: '/login',
            successMessage: 'USUARIO VERIFICADO EXITOSAMENTE!!!'
        }), (req: Request, res: Response) => {
            const { password, ...user } = req.user as any;
            return res.status(200).json({
                data: {
                    payload: {
                        isAuth: req.isAuthenticated(),
                        user,
                    }
                }
            })
        })
    }


    getDetalleUser() {
        this._router.get('/user-detalle', (req: Request, res: Response, next: NextFunction) => {
            try {
                const { password, ...user } = req.user as any;
                return res.status(200).json({ data: { payload: { ...user, fullName: `${user.firstName} ${user.lastName}` } } })
            } catch (error) {
                return next(error)
            }
        })
    }

    logoutAuth() {
        this._router.get('/logout-auth', (req: Request, res: Response, next: NextFunction) => {
            try {
                req.logout((err) => next(err));
                return res.status(200).json({ data: { payload: { logout: true } } })
            } catch (error) {
                return next(error)
            }
        })
    }


    public pathRoute(): string {
        return this._pathRoute;
    }


    public router(): Router {
        return this._router
    }
}


export default AuthController;