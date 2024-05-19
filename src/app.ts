
import { AuthController, DashboardController, PageController, ProductoController, VentaController } from './controllers'
import Server from './server'


new Server([
    new PageController(),
    new AuthController(),
    new VentaController(),
    new ProductoController(),
    new DashboardController()
]).listen()