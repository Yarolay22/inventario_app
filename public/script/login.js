(() => {

    const formulario = document.querySelector('#formulario');
    const buttonForm = formulario.querySelector('button');
    const inputs = document.querySelectorAll('input:not([type="submit"])')


    let loginData = {
        email: formulario.querySelector('#inputEmail').value ?? '',
        password: formulario.querySelector('#inputPassword').value ?? ''
    }


    const LoginModelValidate = Zod.object({
        email: Zod.string()
            .email({ message: 'Correo invalido' }),
        password: Zod.string()
            .trim()
            .min(5, { message: 'Contraseña debe tener minimo 5 caracteres' })
            .max(15, { message: 'Contraseña debe tener maximo 15 caracteres' }),
    })

    buttonForm.disabled = true;

    const validateForm = (showAlert = false) => {

        try {
            LoginModelValidate.parse(loginData)
            buttonForm.disabled = false;
        } catch (error) {
            if (showAlert) {
                if (error instanceof Zod.ZodError) {
                    const { message } = JSON.parse(error)[0]
                    showMessageFormError(message)
                } else {
                    showMessageFormError(error.message)
                }
            }
            buttonForm.disabled = true;
        }
    }


    inputs.forEach(input => {
        input.addEventListener('input', (evt) => {
            loginData = {
                ...loginData,
                [evt.target.name]: evt.target.value
            }
            validateForm()
        })

        input.addEventListener('focusout', () => {
            validateForm(true)
        })
    })


    function showMessageFormError(message = '') {
        if (document.querySelector('.message-error')) {
            return;
        }
        const divContainer = document.createElement('DIV');
        divContainer.className = 'row mx-2 mt-3 text-center message-error'

        const divMessage = document.createElement('DIV');
        divMessage.classList.add('alert', 'alert-danger', 'mb-0');
        divMessage.textContent = message
        divContainer.appendChild(divMessage);


        formulario.parentNode.insertBefore(divContainer, formulario)

        setTimeout(() => {
            divContainer.remove();
        }, 3000);
    }


    const showSweetAlertSucces = (user) => {
        Swal.fire({
            title: "Autenticacion Exitosa!",
            text: `Bienvenida Admin: ${user.firstName} ${user.lastName}.`,
            icon: "success"
        });
    }


    const verificateServiceCredencial = async (data) => {
        const { isAuth, user } = await Servicio.validateCredentialLogin(data);
        if (!isAuth) return;

        showSweetAlertSucces(user);

        const timeOut = setTimeout(() => {
            window.location.href = '/dashboard'
            clearTimeout(timeOut)
        }, 2000);
    }

    formulario.addEventListener('submit', async (evt) => {
        evt.preventDefault();

        try {
            await verificateServiceCredencial(loginData);
        } catch (error) {
            showMessageFormError(error.message)
        }
    })

    validateForm();



})()