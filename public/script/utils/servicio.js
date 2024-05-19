const Servicio = (() => {

    const searchProductosToValue = async (value = '', limite = 10) => {
        const response = await Http.get(`/venta/searchProducts?q=${value}&limite=${limite}`);
        return response.data
    }

    const addProductoToVenta = async (data = {}) => {
        const response = await Http.post('/venta/producto-to-venta', data)
        return response.msg;
    }


    const getProductosVenta = async () => {
        const { data, priceSubTotal, priceTotal } = await Http.get('/venta/productos-venta')
        return { data, priceSubTotal, priceTotal };
    }

    const getProductos = async () => {
        const { data } = await Http.get('/producto/data-table');
        return data;
    }

    const getCategories = async () => {
        const { data } = await Http.get('/producto/categories')
        return data
    }

    const createCategory = async (data = {}) => {
        const response = await Http.post('/producto/new-category', data)
        return response.data.payload
    }

    const createProduct = async (data = {}) => {
        const response = await Http.post('/producto/new-product', data)
        return response.data.payload
    }

    const detailProduct = async (id = '') => {
        if (id === '') return;
        const response = await Http.get(`/producto/detail-product/${id}`)
        return response.data.payload;
    }

    const updateProduct = async (id = '', data = {}) => {
        if (id === '') return;

        const response = await Http.put(`/producto/update-product/${id}`, data)
        return response.data.payload;
    }
    const deleteProduct = async (id = '', data = {}) => {
        if (id === '') return;

        const response = await Http.delete(`/producto/delete-product/${id}`)
        return response.data.payload;
    }

    const validateCantidadProduct = async (id = '', cantidad = '') => {
        if (id === '' && cantidad === '') return;
        const response = await Http.get(`/venta/validate-cantidad-product/${id}/${cantidad}`)
        return response.data.payload;
    }

    const validateCantidadProductCounter = async (id = '', cantidad = '') => {
        if (id === '' && cantidad === '') return;
        const response = await Http.get(`/venta/validate-cantidad-counter/${id}/${cantidad}`)
        return response.data.payload;
    }


    const payVentaProduct = async (data) => {
        const response = await Http.post('/venta/pay-venta-product', data)
        return response.data.payload;
    }

    const validateCredentialLogin = async (data) => {
        const response = await Http.post('/auth/login', data);
        return response.data.payload;
    }

    const detalleUser = async () => {
        const response = await Http.get('/auth/user-detalle')
        return response.data.payload;
    }

    const logoutAuth = async () => {
        const response = await Http.get('/auth/logout-auth')
        return response.data.payload;
    }

    const removeProductVenta = async (idProduct) => {
        const response = await Http.delete(`/venta/remove-product/${idProduct}`)
        return response.data.payload;
    }

    const getVentas = async () => {
        const response = await Http.get('/venta/list-table');
        return response.data;
    }

    const getDetalleVenta = async (id) => {
        const response = await Http.get(`/venta/detalle-venta/${id}`)
        return response.data.payload;
    }

    const incrementarProduct = async (id) => {
        const response = await Http.put(`/venta/incrementar-producto/${id}`, {})
        return response.data.payload;
    }

    const decrementarProduct = async (id) => {
        const response = await Http.put(`/venta/decrementar-producto/${id}`, {})
        return response.data.payload;
    }

    const getEstadisitica = async () => {
        const response = await Http.get('/dashboard/estadistica')
        return response.data.payload;
    }

    const updateCantidad = async (id, cantidad) => {
        const response = await Http.put(`/producto/update-cantidad/${id}`, { cantidad })
        return response.data.payload;
    }

    return {
        getProductos,
        searchProductosToValue,
        addProductoToVenta,
        getProductosVenta,
        getCategories,
        createCategory,
        createProduct,
        detailProduct,
        updateProduct,
        deleteProduct,
        validateCantidadProduct,
        payVentaProduct,
        validateCredentialLogin,
        detalleUser,
        logoutAuth,
        removeProductVenta,
        getVentas,
        getDetalleVenta,
        incrementarProduct,
        decrementarProduct,
        getEstadisitica,
        validateCantidadProductCounter,
        updateCantidad
    }

})()