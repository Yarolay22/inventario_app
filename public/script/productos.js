

(async () => {

    const modalBootstrap = new bootstrap.Modal('#exampleModal')

    const myTable = document.querySelector('#myTable');
    const formulario = document.querySelector('#formulario');
    const nuevoProducto = document.querySelector('#nuevoProducto');

    const inputNameCategoria = formulario.querySelector('input#inputNameCategoria');
    const selectCategoria = formulario.querySelector('select#inputCategoria');
    const buttonNuevaCategoria = formulario.querySelector('button#buttonNuevaCategoria');
    const buttonFormSubmit = formulario.querySelector('button[type="submit"]');

    const modalHeader = document.querySelector('#exampleModalLabel');


    const formatearMoney = (value = '') => {
        return Intl.NumberFormat('es-Es').format(value)
    }


    function showInputCategoria(isHidden = true) {
        buttonNuevaCategoria.textContent = (isHidden) ? 'Nueva Categoria' : 'Guardar Categoria';
        inputNameCategoria.parentElement.style.display = (!isHidden) ? 'block' : 'none';
    }

    function showMessageFormError(message = '') {
        if (document.querySelector('.message-error')) {
            return;
        }
        const divContainer = document.createElement('DIV');
        divContainer.className = 'row mx-4 mt-2 message-error'

        const divMessage = document.createElement('DIV');
        divMessage.classList.add('alert', 'alert-danger', 'mb-0');
        divMessage.textContent = message
        divContainer.appendChild(divMessage);


        formulario.parentNode.insertBefore(divContainer, formulario)

        setTimeout(() => {
            divContainer.remove();
        }, 1000);
    }

    const optionSelectCategoria = (categorias = []) => {
        selectCategoria.innerHTML = '';
        selectCategoria.innerHTML += '<option value="" selected disabled> -- Seleccione Categoria --</option>'
        if (categorias.length === 0) {
            showInputCategoria(false)
            return;
        }

        selectCategoria.innerHTML += categorias.map(categoria => `<option value=${categoria.id}>${categoria.name}</option>`).join('')
    }

    const editProducto = async (idProduct) => {
        modalHeader.textContent = 'Editar el Producto'
        showInputCategoria();
        await loadCategorias();

        const { cantidad, categoriaId, descripcion, name, precio, id } = await Servicio.detailProduct(idProduct)
        formulario.dataset.id = id;

        formulario.querySelector('#inputNombre').value = name;
        formulario.querySelector('#inputPrecio').value = precio;
        formulario.querySelector('#inputCategoria').value = categoriaId;
        formulario.querySelector('#inputCantidad').value = cantidad;
        formulario.querySelector('#inputDescripcion').value = descripcion;

        buttonFormSubmit.textContent = 'Guardar Cambios'

        modalBootstrap.show();
    }

    const deleteProducto = async (idProduct) => {
        const { name } = await Servicio.detailProduct(idProduct)

        const result = await Swal.fire({
            title: "Advertencia Producto?",
            text: `Desea Eliminar el Producto ${name.toUpperCase()} !`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Si, Eliminar!",
            cancelButtonText: "No, Cancelar!",
        });

        if (result.isConfirmed) {
            const { okDelete } = await Servicio.deleteProduct(idProduct)
            if (okDelete) {
                Swal.fire({
                    title: "Deleted!",
                    text: "Producto Eliminado Exitosamente.",
                    icon: "success"
                });
            }

            await loadProductos();
        }
    }

    const showButtonActions = (idProduct) => {
        const divContainer = document.createElement('DIV');
        divContainer.classList.add('d-flex', 'justify-content-center', 'gap-2');

        const buttonEdit = document.createElement('BUTTON');
        buttonEdit.setAttribute('type', 'button');
        buttonEdit.classList.add('btn', 'btn-info', 'text-white')
        buttonEdit.textContent = 'Editar';
        buttonEdit.onclick = () => editProducto(idProduct);

        const buttonDelete = document.createElement('BUTTON');
        buttonDelete.setAttribute('type', 'button');
        buttonDelete.classList.add('btn', 'btn-danger', 'text-white')
        buttonDelete.textContent = 'Eliminar';
        buttonDelete.onclick = () => deleteProducto(idProduct);

        divContainer.append(buttonEdit, buttonDelete)

        return divContainer;
    }

    const loadProductos = async () => {
        modalHeader.textContent = 'Registrar Nuevo Producto'
        new DataTable(myTable, {
            columns: [
                { title: 'ID' },
                { title: 'Producto' },
                { title: 'Categoria' },
                { title: 'Descripcion' },
                { title: 'Cantidad' },
                {
                    title: 'Precio',
                    render: formatearMoney
                },
                {
                    'data': null,
                    title: 'Acciones', "render": function (rowProduct) {
                        const idProduct = rowProduct[0];

                        if (!idProduct) return;

                        return showButtonActions(idProduct);
                    }
                },
            ],
            data: await Servicio.getProductos(),
            language: {
                url: '../i18n/es-CO.json',
            },
            bDestroy: true
        });
    }

    const loadCategorias = async () => {
        const categorias = await Servicio.getCategories();
        optionSelectCategoria(categorias)
    }


    buttonNuevaCategoria.addEventListener('click', async (evt) => {
        evt.preventDefault();

        if (evt.target.textContent.startsWith('Guardar')) {

            if (inputNameCategoria.value.trim() === '') {
                showMessageFormError('EL CAMPO DE NOMBRE CATEGORIA ES REQUERIDO')
                return;
            }

            await Servicio.createCategory({ name: inputNameCategoria.value })
            inputNameCategoria.value = '';
            showInputCategoria(true)
            await loadCategorias()
            return;
        }

        showInputCategoria(false)
    })

    selectCategoria.addEventListener('input', (evt) => {
        evt.preventDefault();
        showInputCategoria(true)
    })

    formulario.addEventListener('submit', async (evt) => {
        evt.preventDefault();

        let formObjeto = {}

        for (const input of evt.target) {
            if (input.name !== '') {
                formObjeto = {
                    ...formObjeto,
                    [input.name]: input.value
                }
            }
        }

        if (Object.keys(formObjeto).length === 0 || !Object.values(formObjeto).every((input) => input !== '')) {
            showMessageFormError('TODOS LOS CAMPOS SON OBLIGATORIOS')
            return;
        }

        if (formulario.dataset.id) {
            await Servicio.updateProduct(formulario.dataset.id, formObjeto)
        } else {
            await Servicio.createProduct(formObjeto)
        }

        formulario.reset()
        await loadProductos()
        delete formulario.dataset.id
        modalBootstrap.hide();
    })


    nuevoProducto.addEventListener('click', async () => {
        modalHeader.textContent = 'Registrar Nuevo Producto'
        buttonFormSubmit.textContent = 'Guardar'
        delete formulario.dataset.id
        formulario.reset()
        modalBootstrap.show();
        showInputCategoria();
        await loadCategorias()
    })

    loadProductos();
})()