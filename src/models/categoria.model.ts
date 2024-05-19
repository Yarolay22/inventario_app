import { DataTypes } from "sequelize";
import dbSequelize from "../config/mysql";

const CategoriaModel = dbSequelize.define('categorias', {
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
}, { timestamps: true })

export default CategoriaModel;