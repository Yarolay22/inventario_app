(() => {

    const modalBootstrap = new bootstrap.Modal('#exampleModal')

    const myTable = document.querySelector('#myTable');
    const listProductos = document.querySelector('#listProductos');

    const subTotalTexto = document.querySelector('#subTotalTexto span');
    const totalTexto = document.querySelector('#totalTexto span');
    const documentoTexto = document.querySelector('#documentoTexto span');
    const pagoTexto = document.querySelector('#pagoTexto span');

    const formatearMoney = (value = '') => {
        return Intl.NumberFormat('es-Es').format(value)
    }

    function formatDate(date) {
        var result = date.slice(0, 10); // Nos devuelve => "2022-11-17"
        return result.replace(/^(\d{4})-(\d{2})-(\d{2})$/g, '$3/$2/$1');
    }


    const showButtonAction = (id) => {
        const divContainer = document.createElement('DIV');
        divContainer.classList.add('d-flex', 'justify-content-center', 'gap-2');

        const buttonDelete = document.createElement('BUTTON');
        buttonDelete.setAttribute('type', 'button');
        buttonDelete.classList.add('btn', 'btn-success', 'text-white')
        buttonDelete.textContent = 'Ver mas';
        buttonDelete.onclick = () => detalleVenta(id);

        divContainer.append(buttonDelete)

        return divContainer;
    }

    const showItemListProduct = (products = []) => {
        listProductos.innerHTML = '';

        listProductos.innerHTML = products.map((product) => `
            <li class="list-group-item">
                <p class="m-0 fw-bold">Nombre Producto: <span class="fw-normal">${product.name}</span></p>
                <p class="m-0 fw-bold">Cantidad No: <span class="fw-normal">${product.cantidadNo}</span></p>
                <p class="m-0 fw-bold">Total: <span class="fw-normal">${product.total}</span></p>
            </li>
        `).join('')
    }

    const detalleVenta = async (id) => {
        const { productos, subtotal, total, optionPago, documento } = await Servicio.getDetalleVenta(id)
        showItemListProduct(productos)

        totalTexto.textContent = `$ ${formatearMoney(total)}`;
        subTotalTexto.textContent = `$ ${formatearMoney(subtotal)}`;
        documentoTexto.textContent = documento
        pagoTexto.textContent = optionPago

        modalBootstrap.show();
    }


    const loadVentas = async () => {
        new DataTable(myTable, {
            columns: [
                { title: 'ID' },
                { title: 'Documento' },
                { title: 'Opcion Pago' },
                {
                    title: 'SubTotal',
                    render: formatearMoney
                },
                {
                    title: 'Total',
                    render: formatearMoney
                },
                {
                    title: 'Fecha Venta',
                    render:  formatDate
                },
                {
                    'data': null,
                    title: 'Acciones', "render": function (rowVenta) {
                        const idVenta = rowVenta[0];

                        if (!idVenta) return;

                        return showButtonAction(idVenta)
                    }
                },
            ],
            data: await Servicio.getVentas(),
            language: {
                url: '../i18n/es-CO.json',
            },
            bDestroy: true
        });
    }
    loadVentas()
})()