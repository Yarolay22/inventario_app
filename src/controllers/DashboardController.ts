import { NextFunction, Request, Response, Router } from "express";
import { AppRoute } from "../interfaces";
import VentaService from "../services/VentaService";
import { validateAccessIsNotAutenticate } from "../middlewares";
import ProductoService from "../services/ProductoService";

class DashboardController implements AppRoute {

    private _pathRoute: string = '/dashboard'
    private _router: Router;
    private productoService: ProductoService;
    private ventaService: VentaService;

    constructor() {
        this._router = Router();
        this.ventaService = new VentaService();
        this.productoService = new ProductoService();

        this.init();
    }

    private init() {
        this._router.use(validateAccessIsNotAutenticate())
        this.getEstadistica();
    }

    private getEstadistica() {
        this._router.get('/estadistica', async (_req: Request, res: Response, next: NextFunction) => {

            const [efectivo, transferencia, credito, ventasCount, productosCount, productos] = await Promise.all(
                [
                    this.ventaService.getCountVenta('Efectivo'),
                    this.ventaService.getCountVenta('Transferencia'),
                    this.ventaService.getCountVenta('Credito'),
                    this.ventaService.getCountTotalVenta(),
                    this.productoService.getCountProduct(),
                    this.productoService.getProductsIsCero()
                ]
            )

            try {
                return res.status(200).json({
                    data: {
                        payload: {
                            efectivo,
                            transferencia,
                            credito,
                            ventasCount,
                            productosCount,
                            productos
                        }
                    }
                })
            } catch (error) {
                next(error)
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


export default DashboardController;