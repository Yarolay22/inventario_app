import { DataTypes } from "sequelize";
import dbSequelize from "../config/mysql";



const UsuarioModel = dbSequelize.define('usuarios', {
    firstName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    lastName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    }
}, { timestamps: true })


export default UsuarioModel;