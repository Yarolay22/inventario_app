import { DataTypes } from "sequelize";
import dbSequelize from "../config/mysql";
import moment from "moment-timezone";



const VentaModel = dbSequelize.define('ventas', {
    documento: {
        type: DataTypes.STRING
    },
    optionPago: {
        type: DataTypes.STRING
    },
    productos: {
        type: DataTypes.TEXT,
        get: function () {
            return JSON.parse(this.getDataValue('productos'));
        },
        set: function (value) {
            this.setDataValue('productos', JSON.stringify(value));
        },
    },
    subtotal: {
        type: DataTypes.INTEGER
    },
    total: {
        type: DataTypes.INTEGER
    },
    fechaVenta: {
        type: DataTypes.STRING,
        defaultValue: moment().tz('America/Bogota').toDate().toLocaleDateString()
    }
}, { timestamps: true })


export default VentaModel;