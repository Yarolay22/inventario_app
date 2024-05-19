

import bcryptjs from 'bcryptjs'
import { ErrorAppHttp, UsuarioModel } from '../models';

class AuthService {

    private usersAdmin: any[] = [
        {
            firstName: 'Yarolay',
            lastName: 'Toncel',
            email: 'yarolay@admin.com',
            password: '123456'
        }
    ]

    constructor() {
        this.insertAutoAdminApp();
    }


    insertAutoAdminApp() {
        this.usersAdmin.forEach(async (user) => {
            try {
                const userExists = await UsuarioModel.findOne({ where: { email: user.email } })
                if (!userExists) {
                    await UsuarioModel.create({ ...user, password: bcryptjs.hashSync(user.password, 10) });
                }
            } catch (error) {
                console.log("🚀 ~ AuthService ~ this.usersAdmin.forEach ~ error:", error)
            }
        });
    }

    async verificateCredential(email: string, password: string) {
        const usuario = await UsuarioModel.findOne({ where: { email } })
        if (!usuario) {
            throw new ErrorAppHttp(400, 'Usuario no encontrado')
        }

        const comparePassword = bcryptjs.compareSync(password, usuario.getDataValue('password'))

        if (!comparePassword) {
            throw new ErrorAppHttp(400, 'Contraseña invalida!')
        }

        return usuario.toJSON();
    }

    async findById(id: number) {
        const user = await UsuarioModel.findByPk(id);
        return user?.toJSON()
    }
}

export default AuthService;