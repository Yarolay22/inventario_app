(() => {
    const ventaEfectivo = document.querySelector('#ventaEfectivo span')
    const ventaTransferencia = document.querySelector('#ventaTransferencia span')
    const ventaCredito = document.querySelector('#ventaCredito span')

    const totalVenta = document.querySelector('#totalVenta span')
    const totalProducto = document.querySelector('#totalProducto span')
    const listProductos = document.querySelector('#listProductos')


    const limpiarItemElem = () => {
        while (listProductos.firstChild) {
            listProductos.removeChild(listProductos.firstChild)
        }
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

    const showItemListProduct = (products = []) => {
        limpiarItemElem();

        const productsElem = products.map(product => {
            const liElementContainer = document.createElement('LI');
            liElementContainer.className = 'list-group-item d-flex justify-content-between align-items-center';

            const pElem = document.createElement('P');
            pElem.className = 'm-0 fw-bold'
            pElem.innerHTML = `Nombre Producto: <span class="fw-normal">${product.name}</span>`;

            const buttonElem = document.createElement('BUTTON');
            buttonElem.className = 'btn btn-primary';
            buttonElem.setAttribute('type', 'button')
            buttonElem.textContent = 'Actualizar cantidad'
            buttonElem.onclick = async () => {
                const cantidadProducto = await showSweetAlert()
                await Servicio.updateCantidad(product.id, cantidadProducto)
                Swal.fire({
                    title: "Success!",
                    text: "Producto actualizado exitosamente.",
                    icon: "success"
                });
                await loadDashboard();
            }

            liElementContainer.append(pElem, buttonElem)

            return liElementContainer;
        })

        listProductos.append(...productsElem)
    }


    const showItemMessage = (message) => {
        limpiarItemElem();
        const liElementContainer = document.createElement('LI');
        liElementContainer.className = 'list-group-item d-flex justify-content-between align-items-center';

        const pElem = document.createElement('P');
        pElem.className = 'm-0 fw-normal'
        pElem.textContent = message;

        liElementContainer.appendChild(pElem)

        listProductos.appendChild(liElementContainer)
    }


    const loadDashboard = async () => {
        const { efectivo, transferencia, credito, ventasCount, productosCount, productos } = await Servicio.getEstadisitica()

        ventaEfectivo.textContent = efectivo ?? 0;
        ventaTransferencia.textContent = transferencia ?? 0;
        ventaCredito.textContent = credito ?? 0;

        totalVenta.textContent = ventasCount ?? 0;
        totalProducto.textContent = productosCount ?? 0;


        if (productos.length === 0) {
            showItemMessage('No se encontro ningun producto')
            return;
        }

        showItemListProduct(productos)
    }






    window.addEventListener('DOMContentLoaded', async () => {
        await loadDashboard()
    })
})()