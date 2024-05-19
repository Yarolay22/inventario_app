import { Op } from "sequelize";
import { CategoriaModel, ProductoModel } from "../models";

class ProductoService {



    async findByAll() {
        return (await ProductoModel.findAll({
            include: [
                {
                    model: CategoriaModel,
                    attributes: ['name'],
                    required: true
                }
            ],
            attributes: {
                exclude: ['categoriaId', 'createdAt', 'updatedAt'],
            }
        })).map(producto => {
            const { id, name, categoria, descripcion, cantidad, precio } = producto.toJSON()
            return { id, name, categoria: categoria.name, descripcion, cantidad, precio }
        })
    }

    async findById(id: number) {
        const producto = await ProductoModel.findByPk(id)
        return producto?.toJSON();
    }

    async findByIdToCategory(id: number) {
        const producto = await ProductoModel.findByPk(id, {
            include: [
                {
                    model: CategoriaModel,
                    attributes: ['name'],
                    required: true
                }
            ],
            attributes: {
                exclude: ['categoriaId', 'createdAt', 'updatedAt'],
            }
        })
        return producto?.toJSON();
    }


    async findSearch(value: string, limit: number = 10) {
        return await ProductoModel.findAll({
            limit, where: {
                name: {
                    [Op.like]: `%${value}%`
                },
                cantidad: {
                    [Op.ne]: 0
                }
            }, attributes: ['id', 'name']
        })
    }

    async create(producto: any) {
        const newProducto = await ProductoModel.create(producto)
        return newProducto.toJSON();
    }

    async update(id: string, productoUpdate: any) {
        const producto = await ProductoModel.findByPk(id)
        if (!producto) throw new Error('Producto No Encontrado');

        return (await producto.update(productoUpdate)).toJSON()
    }

    async restarCantidad(id: string, cantidadVenta: number) {
        const producto = await ProductoModel.findByPk(id)
        if (!producto) throw new Error('Producto No Encontrado');

        return (await producto.update({ ...producto, cantidad: Number(producto.getDataValue('cantidad')) - cantidadVenta })).toJSON()
    }

    async delete(id: string) {
        const producto = await ProductoModel.findByPk(id)

        if (!producto) throw new Error('Producto No Encontrado');

        return await producto.destroy();
    }


    async getCountProduct() {
        return await ProductoModel.count()
    }

    async getProductsIsCero() {
        const productos = await ProductoModel.findAll({
            where: {
                cantidad: {
                    [Op.eq]: 0
                }
            },
            limit: 5
        })

        return (await productos).map((product) => product.toJSON())
    }

    async updateCantidad(id: number, cantidad: number) {
        const producto = await ProductoModel.findByPk(id);
        if (!producto) throw new Error('Producto No Encontrado');

        await producto.update({ ...producto.toJSON(), cantidad })
        return { ok: true}
    }
}

export default ProductoService;