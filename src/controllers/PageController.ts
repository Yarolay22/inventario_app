import { Router } from 'express'
import { AppRoute } from '../interfaces';
import { redirectRenderView, renderView } from '../helpers';

import { validateAccessIsAutenticate, validateAccessIsNotAutenticate } from '../middlewares';

class PageController implements AppRoute {

    private _pathRoute: string = '/'
    private _router: Router;


    constructor() {
        this._router = Router();
        this.init();
    }


    private init() {
        this._router.get('/login', validateAccessIsAutenticate(), renderView('login.html'))

        this._router.get('/dashboard', validateAccessIsNotAutenticate(), renderView('dashboard.html'))
        this._router.get('/productos', validateAccessIsNotAutenticate(), renderView('productos.html'))
        this._router.get('/ventas', validateAccessIsNotAutenticate(), renderView('ventas.html'))
        this._router.get('/historial-ventas', validateAccessIsNotAutenticate(), renderView('historial-ventas.html'))

        this._router.get('/', validateAccessIsNotAutenticate(), redirectRenderView('/ventas'))
    }


    public pathRoute(): string {
        return this._pathRoute;
    }


    public router(): Router {
        return this._router
    }

}


export default PageController;