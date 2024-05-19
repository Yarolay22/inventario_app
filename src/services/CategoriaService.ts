import { CategoriaModel } from "../models";


class CategoriaService {

    async getAllCategories() {
        return (await CategoriaModel.findAll({ attributes: ['id', 'name'] })).map((categoria) => categoria.toJSON())
    }

    async getByIdCategory(id: string) {
        const categoria = await CategoriaModel.findByPk(id, { attributes: ['id', 'name'] })
        return categoria?.toJSON();
    }


    async addCategory(name: string) {
        const newCategoria = await CategoriaModel.create({ name })
        return newCategoria.toJSON();
    }
}

export default CategoriaService;