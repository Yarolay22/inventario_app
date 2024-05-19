(() => {
    let timeOutId = undefined;

    const myTable = document.querySelector('#myTable')
    const inputSearch = document.querySelector('#inputSearchProduct');
    const listSearchProductos = document.querySelector('.listProductos');
    const buttonPagar = document.querySelector('#btnPagar');
    buttonPagar.disabled = true;

    const subTotalTexto = document.querySelector('#subTotalTexto span');
    const totalTexto = document.querySelector('#totalTexto span');


    const deleteProductoVenta = async (idProduct) => {
        const { ok } = await Servicio.removeProductVenta(idProduct);
        if (!ok) return;

        Swal.fire({
            title: "Deleted!",
            text: "Producto Eliminado Exitosamente.",
            icon: "success"
        });

        loadProductosVenta()
    }

    const showButtonAction = (idProduct) => {
        const divContainer = document.createElement('DIV');
        divContainer.classList.add('d-flex', 'justify-content-center', 'gap-2');

        const buttonDelete = document.createElement('BUTTON');
        buttonDelete.setAttribute('type', 'button');
        buttonDelete.classList.add('btn', 'btn-danger', 'text-white')
        buttonDelete.textContent = 'Eliminar';
        buttonDelete.onclick = () => deleteProductoVenta(idProduct);

        divContainer.append(buttonDelete)

        return divContainer;
    }



    const showSweetAlert = async () => {
        const result = await Swal.fire({
            title: "¿Ingrese la cantidad?",
            input: "number",
            showCancelButton: true,
            confirmButtonText: "Guardar",
            showLoaderOnConfirm: true,
            preConfirm: (value) => {
                if (value <= 0) {
                    return false
                }

                return value
            }
        });

        if (!result.isConfirmed) {
            return;
        }

        return Number(result.value);
    }
    const formatearMoney = (value = '') => {
        return Intl.NumberFormat('es-Es').format(value)
    }

    const liElementComponent = (text = '') => {
        const liProductoElement = document.createElement('LI');
        liProductoElement.classList.add('list-group-item', 'list-group-item-action', 'pointer')
        liProductoElement.textContent = text;
        return liProductoElement;
    }


    const errorInputSearchHandler = (error) => {
        showMensajeList(error.message)
    }


    const onClickProducto = async (evt) => {
        evt.preventDefault();

        listSearchProductos.classList.add('d-none');

        const idProducto = Number(evt.target.dataset.id)
        const cantidadNo = await showSweetAlert();

        if (!cantidadNo) return;

        const { ok, cantidad } = await Servicio.validateCantidadProduct(idProducto, cantidadNo);

        if (!ok) {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: `No tenemos esa cantidad - nuestra cantidad es: ${cantidad}!`,
            });
            return;
        }

        await Servicio.addProductoToVenta({ idProducto, cantidadNo })
        loadProductosVenta()

    }


    const showListProductos = (productos = []) => {
        listSearchProductos.innerHTML = '';
        const productosEl = productos.map(({ id, name }) => {
            const liProductoElement = liElementComponent(name);
            liProductoElement.dataset.id = id;
            liProductoElement.onclick = onClickProducto
            return liProductoElement;
        });

        listSearchProductos.append(...productosEl)
    }


    const validateCantidadExiste = async (idProducto, cantidadNo) => {
        const { ok } = await Servicio.validateCantidadProductCounter(idProducto, cantidadNo);
        return ok;
    }


    const showCounterItem = (value, idProduct) => {

        const divContainer = document.createElement('DIV');
        divContainer.classList.add('d-flex', 'gap-3', 'align-items-center')


        const buttonDecrement = document.createElement('button');
        buttonDecrement.setAttribute('type', 'button');
        buttonDecrement.classList.add('btn', 'btn-outline-success')
        buttonDecrement.textContent = '-';
        buttonDecrement.disabled = (value === 1);
        buttonDecrement.onclick = async (evt) => {
            evt.disabled = true;
            await Servicio.decrementarProduct(idProduct)
            await loadProductosVenta();
        }

        const textValueEl = document.createElement('P');
        textValueEl.classList.add('m-0')
        textValueEl.textContent = value;

        const buttonIncrement = document.createElement('button');
        buttonIncrement.setAttribute('type', 'button');
        buttonIncrement.classList.add('btn', 'btn-outline-success')
        buttonIncrement.textContent = '+';
        validateCantidadExiste(idProduct, value).then(validate => {
            buttonIncrement.disabled = !validate;
        })

        buttonIncrement.onclick = async (evt) => {
            evt.disabled = true;
            await Servicio.incrementarProduct(idProduct)
            await loadProductosVenta();
        }

        divContainer.append(buttonDecrement, textValueEl, buttonIncrement)

        return divContainer;
    }

    const showMensajeList = (message = '') => {
        listSearchProductos.innerHTML = '';
        const liMessgeElement = liElementComponent(message)
        liMessgeElement.classList.add('disabled')
        listSearchProductos.appendChild(liMessgeElement)
    }


    const emitirValueToProductos = (evt) => {
        evt.preventDefault();
        listSearchProductos.classList.remove('d-none');

        if (timeOutId) {
            clearTimeout(timeOutId)
        }

        timeOutId = setTimeout(() => {
            Servicio.searchProductosToValue(evt.target.value)
                .then(productosFilter => {
                    if (productosFilter.length === 0) {
                        throw new Error('No se encontro ningun producto');
                    }

                    showListProductos(productosFilter)
                })
                .catch(errorInputSearchHandler);
            clearTimeout(timeOutId)
        }, 500);

    }

    inputSearch.addEventListener('input', emitirValueToProductos)
    inputSearch.addEventListener('focusin', emitirValueToProductos)
    inputSearch.addEventListener('focusout', () => {
        const timeOutFocusId = setTimeout(() => {
            listSearchProductos.classList.add('d-none');
            clearTimeout(timeOutFocusId)
        }, 500);
    })

    const getDataVentaProducto = async () => {
        const { data, priceTotal, priceSubTotal } = await Servicio.getProductosVenta()

        buttonPagar.disabled = (data.length === 0);

        totalTexto.textContent = `$ ${formatearMoney(priceTotal)}`;
        subTotalTexto.textContent = `$ ${formatearMoney(priceSubTotal)}`;
        return data
    }


    buttonPagar.addEventListener('click', async (evt) => {
        evt.preventDefault();

        const { value: documento } = await Swal.fire({
            title: "Ingresa Numero de Documento",
            input: "number",
            showCancelButton: true,
            preConfirm: (value) =>  (value === '') ? false : value
        });

        if (!documento) return;

        const { value: optionPago } = await Swal.fire({
            title: "¿Seleccione Medio de Pago?",
            input: "select",
            inputOptions: {
                Efectivo: "Efectivo",
                Credito: "Credito",
                Transferencia: "Transferencia"
            },
            inputPlaceholder: "-- Seleccione --",
            showCancelButton: true,
        });

        if (!optionPago) return;

        const { pay } = await Servicio.payVentaProduct({optionPago, documento})
            if (pay) {
                Swal.fire({
                    position: "top-end",
                    icon: "success",
                    title: "Pago Exitoso!",
                    text: "Venta Realizada Exitosamete!",
                    showConfirmButton: false,
                    timer: 1500
                });
                loadProductosVenta()
            }
    })


    const loadProductosVenta = async () => {
        new DataTable(myTable, {
            columns: [
                { title: 'Code No.' },
                { title: 'Producto' },
                { title: 'Categoria' },
                {
                    'data': null,
                    title: 'Cantidad',
                    render: function (rowProduct) {
                        const idProduct = rowProduct[0];
                        const valueProduct = rowProduct[3];
                        return showCounterItem(valueProduct, idProduct)
                    }
                },
                { title: 'Precio Unidad' },
                {
                    title: 'Total',
                    render: formatearMoney
                },
                {
                    'data': null,
                    title: 'Eliminar Producto', "render": function (rowProduct) {
                        const idProduct = rowProduct[0];
                        if (!idProduct) return;
                        return showButtonAction(idProduct);
                    }
                },
            ],
            data: await getDataVentaProducto(),
            language: {
                url: '../i18n/es-CO.json',
            },
            bDestroy: true
        });
    }

    loadProductosVenta()



})()