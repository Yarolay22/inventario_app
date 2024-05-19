import { Request, Response, Router } from "express";
import { AppRoute } from "../interfaces";
import VentaService from "../services/VentaService";
import { validateAccessIsNotAutenticate } from "../middlewares";

class VentaController implements AppRoute {

    private _pathRoute: string = '/venta'
    private _router: Router;
    private ventaService: VentaService

    constructor() {
        this._router = Router();
        this.ventaService = new VentaService();
        this.initRoute();
    }

    private initRoute() {
        this._router.use(validateAccessIsNotAutenticate())
        this.search10Products();
        this.productoToVenta();
        this.getProductosVenta();
        this.validateProductCantidad();
        this.getListVentas();
        this.detalleVenta();
        this.payVentaProduct()
        this.removeProductVenta();
        this.incrementarProductoVenta();
        this.decrementarProductoVenta();
    }

    private search10Products() {
        this._router.get('/searchProducts', async (req: Request, res: Response) => {
            try {
                const { q, limite } = req.query
                const productos = await this.ventaService.searchProductos(q?.toString() ?? '', Number(limite) ?? 10)
                return res.status(200).json({ total: productos.length, data: productos })
            } catch (error) {
            }
        })
    }

    private productoToVenta() {
        this._router.post('/producto-to-venta', async (req: Request, res: Response) => {
            try {
                await this.ventaService.addProductoVenta(req.body)
                return res.status(200).json({ msg: 'Producto Agregado' })
            } catch (error) {
            }
        })
    }

    private getProductosVenta() {
        this._router.get('/productos-venta', (_req: Request, res: Response) => {
            try {
                const productosDataTableVenta = this.ventaService.findByAll().map(producto => Object.values(producto))
                const priceSubTotal = this.ventaService.getPriceSubTotalVenta();
                const priceTotal = this.ventaService.getPriceTotalVentaToImpuesto();

                return res.status(200).json({
                    total: productosDataTableVenta.length,
                    data: productosDataTableVenta,
                    priceSubTotal,
                    priceTotal
                })
            } catch (error) {
            }
        })
    }


    private validateProductCantidad() {
        this._router.get('/validate-cantidad-product/:id/:cantidad', async (req: Request, res: Response) => {
            try {
                const { id, cantidad } = req.params
                const response = await this.ventaService.validateCantidadProduct(Number(id), Number(cantidad));
                return res.status(200).json({ data: { payload: response } })
            } catch (error) {
                console.log("🚀 ~ VentaController ~ this._router.get ~ error:", error)

            }
        })

        this._router.get('/validate-cantidad-counter/:id/:cantidad', async (req: Request, res: Response) => {
            try {
                const { id, cantidad } = req.params
                const response = await this.ventaService.validateCounterProduct(Number(id), Number(cantidad));
                return res.status(200).json({ data: { payload: response } })
            } catch (error) {
                console.log("🚀 ~ VentaController ~ this._router.get ~ error:", error)

            }
        })
    }

    private payVentaProduct() {
        this._router.post('/pay-venta-product', async (req: Request, res: Response) => {
            try {
                const { optionPago, documento } = req.body;
                const response = await this.ventaService.payVentaProducts(optionPago, documento);
                return res.status(200).json({ data: { payload: response } })
            } catch (error) {
                console.log("🚀 ~ VentaController ~ this._router.post ~ error:", error)
            }
        })
    }

    private removeProductVenta() {
        this._router.delete('/remove-product/:id', async (req: Request, res: Response) => {
            try {
                const response = await this.ventaService.removeProduct(Number(req.params.id));
                return res.status(200).json({ data: { payload: response } })
            } catch (error) {
                console.log("🚀 ~ VentaController ~ this._router.delete ~ error:", error)
            }
        })
    }

    getListVentas() {
        this._router.get('/list-table', async (req: Request, res: Response) => {
            try {
                const response = await this.ventaService.getListVentas();
                const dataTableResponse = response.map(producto => Object.values(producto))
                return res.status(200).json({ data: dataTableResponse })
            } catch (error) {
                console.log("🚀 ~ ProductoController ~ this._router.get ~ error:", error)
            }
        })
    }

    detalleVenta() {
        this._router.get('/detalle-venta/:id', async (req: Request, res: Response) => {
            try {
                const { id } = req.params as any;
                const response = await this.ventaService.getDetalleVenta(id)
                return res.status(200).json({ data: { payload: response } })
            } catch (error) {
                console.log("🚀 ~ VentaController ~ this._router.get ~ error:", error)
            }
        })
    }

    incrementarProductoVenta() {
        this._router.put('/incrementar-producto/:id', (req: Request, res: Response) => {
            try {
                const { id } = req.params as any;
                const response = this.ventaService.incrementar(Number(id))
                return res.status(200).json({ data: { payload: response } })
            } catch (error) {
                console.log("🚀 ~ VentaController ~ incrementarProductoVenta ~ error:", error)
            }
        })
    }

    decrementarProductoVenta() {
        this._router.put('/decrementar-producto/:id', (req: Request, res: Response) => {
            try {
                const { id } = req.params as any;
                const response = this.ventaService.decrementar(Number(id))
                return res.status(200).json({ data: { payload: response } })
            } catch (error) {
                console.log("🚀 ~ VentaController ~ incrementarProductoVenta ~ error:", error)
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


export default VentaController;