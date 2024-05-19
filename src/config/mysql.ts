import { Sequelize } from 'sequelize'
import { EnvVars } from '../constant'

process.env.TZ = 'America/Bogota';

console.log(process.env);


const dbSequelize = new Sequelize(EnvVars.MYSQL_NAME, EnvVars.MYSQL_USER, EnvVars.MYSQL_PASSWORD, {
    host: EnvVars.MYSQL_HOST,
    dialect: 'mysql',
    database: 'inventario', 
    dialectOptions: {
        useUTC: false, // for reading from database
    },
    timezone:"-05:00", // Zona horaria de Colombia (UTC-05:00)
    logging: false
})



try {
    dbSequelize.authenticate();
    dbSequelize.sync();
    console.log('Connection has been established successfully.');
} catch (error) {
    console.error('Unable to connect to the database:', error);
}


export default dbSequelize;