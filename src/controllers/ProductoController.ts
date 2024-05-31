import { Request, Response, Router } from "express";
import { AppRoute } from "../interfaces";
import ProductoService from "../services/ProductoService";
import CategoriaService from "../services/CategoriaService";
import { validateAccessIsNotAutenticate } from "../middlewares";

class ProductoController implements AppRoute {

    private _pathRoute: string = '/producto'
    private _router: Router;
    private productoService: ProductoService;
    private categoriaService: CategoriaService;

    constructor() {
        this._router = Router();
        this.productoService = new ProductoService();
        this.categoriaService = new CategoriaService();
        this.init();
    }

    init() {
        this._router.use(validateAccessIsNotAutenticate())

        this.createCategory();
        this.getAllCategories();

        this.getAllProductos();
        this.getAllProductosTable();

        this.detalleProducto();
        this.createProduct();
        this.updateProducto();
        this.deleteProducto();
        this.updateCantidad()
    }

    getAllProductos() {
        this._router.get('/listado', async (_req: Request, res: Response) => {
            try {
                let productos = await this.productoService.findByAll()
                return res.status(200).json({ total: productos.length, data: productos })
            } catch (error) {
                console.log("🚀 ~ ProductoController ~ this._router.get ~ error:", error)
            }
        })
    }

    getAllProductosTable() {
        this._router.get('/data-table', async (_req: Request, res: Response) => {
            try {
                let productos = await this.productoService.findByAll()
                const productosTable = productos.map(producto => Object.values(producto))
                return res.status(200).json({ total: productosTable.length, data: productosTable })
            } catch (error) {
                console.log("🚀 ~ ProductoController ~ this._router.get ~ error:", error)
            }
        })
    }

    getAllCategories() {
        this._router.get('/categories', async (_req: Request, res: Response) => {
            try {
                const categories = await this.categoriaService.getAllCategories()
                return res.status(200).json({ total: categories.length, data: categories })
            } catch (error) {
                console.log("🚀 ~ ProductoController ~ this._router.get ~ error:", error)
            }
        })
    }

    createCategory() {
        this._router.post('/new-category', async (req: Request, res: Response) => {
            try {
                const { name } = req.body;
                const category = await this.categoriaService.addCategory(name)
                return res.status(200).json({ data: { payload: category } })
            } catch (error) {
                console.log("🚀 ~ ProductoController ~ this._router.post ~ error:", error)
            }
        })
    }

    createProduct() {
        this._router.post('/new-product', async (req: Request, res: Response) => {
            try {
                const product = await this.productoService.create(req.body)
                return res.status(200).json({ data: { payload: product } })
            } catch (error) {
                console.log("🚀 ~ ProductoController ~ this._router.post ~ error:", error)
            }
        })
    }

    detalleProducto() {
        this._router.get('/detail-product/:id', async (req: Request, res: Response) => {
            try {
                const product = await this.productoService.findById(Number(req.params.id))
                return res.status(200).json({ data: { payload: product } })
            } catch (error) {
                console.log("🚀 ~ ProductoController ~ this._router.get ~ error:", error)
            }
        })
    }

    updateProducto() {
        this._router.put('/update-product/:id', async (req: Request, res: Response) => {
            try {
                const { params, body } = req;
                const productoUpdate = await this.productoService.update(params.id, body);
                return res.status(200).json({ data: { payload: productoUpdate } })
            } catch (error) {
                console.log("🚀 ~ ProductoController ~ this._router.put ~ error:", error)
            }
        })
    }

    deleteProducto() {
        this._router.delete('/delete-product/:id', async (req: Request, res: Response) => {
            try {
                await this.productoService.delete(req.params.id);
                return res.status(200).json({ data: { payload: { okDelete: true } } })
            } catch (error) {
                console.log("🚀 ~ ProductoController ~ this._router.put ~ error:", error)
            }
        })
    }

    updateCantidad() {
        this._router.put('/update-cantidad/:id', async (req: Request, res: Response) => {
            try {
                console.log(req);
                const response = await this.productoService.updateCantidad(Number(req.params.id), Number(req.body.cantidad))
                return res.status(200).json({ data: { payload: response } })
            } catch (error) {
                console.log("🚀 ~ ProductoController ~ this._router.patch ~ error:", error)
            }
        })
    }

    pathRoute(): string {
        return this._pathRoute;
    }
    router(): Router {
        return this._router;
    }

}


export default ProductoController;