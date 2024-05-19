import { DataTypes } from "sequelize";
import dbSequelize from "../config/mysql";
import CategoriaModel from "./categoria.model";

const ProductoModel = dbSequelize.define('productos', {
    name: {
        type: DataTypes.STRING,
    },
    categoriaId: {
        type: DataTypes.INTEGER,
        references: {
            model: 'categorias',
            key: 'id',
        }
    },
    descripcion: {
        type: DataTypes.STRING
    },
    cantidad: {
        type: DataTypes.INTEGER
    },
    precio: {
        type: DataTypes.INTEGER
    }
}, { timestamps: true })

CategoriaModel.hasMany(ProductoModel, { as: 'categoriaId' });
ProductoModel.belongsTo(CategoriaModel, { foreignKey: 'categoriaId' })

export default ProductoModel;