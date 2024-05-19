
import { VentaModel } from "../models";
import ProductoService from "./ProductoService";

class VentaService {


    private productosVenta: any[] = []

    private productoService: ProductoService
    private impuesto = 15; // Porcentaje de Impuestos

    constructor() {
        this.productoService = new ProductoService();
    }


    async searchProductos(value: string, limite: number) {
        return (await this.productoService.findSearch(value, limite)).map(producto => producto.toJSON())
    }


    async addProductoVenta({ cantidadNo, idProducto }: any) {

        const existProduct = this.validateExistProductVenta(idProducto);

        if (!existProduct) {
            const producto = await this.productoService.findByIdToCategory(idProducto);
            if (Object.keys(producto).length === 0) return this.productosVenta;
            const { id, name, precio, categoria } = producto;
            this.productosVenta.unshift({ id, name, categoria: categoria.name, cantidadNo, precio, total: (precio * cantidadNo) })
            return;
        }


        this.productosVenta = this.productosVenta.map((producto) => {
            if (producto.id === idProducto) {

                const cantidadUpdate = (producto.cantidadNo + cantidadNo)

                return {
                    ...producto,
                    cantidadNo: cantidadUpdate,
                    total: (producto.precio * cantidadUpdate)
                }
            }
        })

        return this.productosVenta;
    }

    private validateExistProductVenta(idProducto: any) {
        return this.productosVenta.find((producto) => producto.id === idProducto)
    }

    findByAll() {
        return this.productosVenta;
    }


    getPriceSubTotalVenta() {
        return this.productosVenta.reduce((totalPrecio, producto) => {
            return totalPrecio += producto.total
        }, 0)
    }

    getPriceTotalVentaToImpuesto() {
        const subtotal = this.getPriceSubTotalVenta()
        return subtotal + (subtotal * (this.impuesto / 100))
    }


    async validateCantidadProduct(id: number, cantidadParams: number) {
        const { cantidad } = await this.productoService.findById(id)

        if (cantidadParams > cantidad) {
            return { ok: false, cantidad }
        }

        return { ok: true, cantidad }
    }

    async validateCounterProduct(id: number, cantidadParams: number) {
        const { cantidad } = await this.productoService.findById(id)

        if (cantidadParams >= cantidad) {
            return { ok: false, cantidad }
        }
        return { ok: true, cantidad }
    }


    async payVentaProducts(optionPago: any, documento: any) {

        const resumenVenta = await this.guardarVentaProducts(documento, optionPago)
        this.productosVenta.forEach(({ id, cantidadNo }) => {
            this.productoService.restarCantidad(id, cantidadNo);
        });

        this.productosVenta = [];
        return { pay: true, ...resumenVenta }
    }

    private async guardarVentaProducts(documento: string, optionPago: string) {

        const subtotal = Number(this.getPriceSubTotalVenta())
        const total = Number(this.getPriceTotalVentaToImpuesto())

        const newVenta = await VentaModel.create({
            documento,
            optionPago,
            productos: this.productosVenta,
            subtotal,
            total
        })

        return newVenta.toJSON()
    }

    async removeProduct(idProduct: number) {
        this.productosVenta = this.productosVenta.filter((producto) => producto.id !== idProduct);
        return { ok: true }
    }

    async getListVentas() {
        const ventas = await VentaModel.findAll({
            attributes: ['id', 'documento', 'optionPago', 'subtotal', 'total', 'fechaVenta'],
            order: [['fechaVenta', 'ASC']]
        });
        const data =  ventas.map((venta) => venta.toJSON())
        console.log(data);

        return data
    }

    async getDetalleVenta(id: number) {
        const venta = await VentaModel.findByPk(id)
        return venta?.toJSON()
    }

    async getCountVenta(optionPago: string) {
        return await VentaModel.count({ where: { optionPago } })
    }

    async getCountTotalVenta() {
        return await VentaModel.count()
    }

    incrementar(id: number) {
        console.log("🚀 ~ VentaService ~ incrementar ~ id:", id)
        this.productosVenta = this.productosVenta.map(producto => {
            if (producto.id === id) {
                const cantidadUpdate = (producto.cantidadNo += 1)
                console.log("🚀 ~ VentaService ~ incrementar ~ cantidadUpdate:", cantidadUpdate)
                return {
                    ...producto,
                    cantidadNo: cantidadUpdate,
                    total: (producto.precio * cantidadUpdate)
                }
            }
            return producto
        })

        return { ok: true }
    }


    decrementar(id: number) {
        this.productosVenta = this.productosVenta.map(producto => {
            if (producto.id === id) {
                const cantidadUpdate = (producto.cantidadNo -= 1)
                return {
                    ...producto,
                    cantidadNo: cantidadUpdate,
                    total: (producto.precio * cantidadUpdate)
                }
            }
            return producto
        })
        return { ok: true }
    }
}


export default VentaService;