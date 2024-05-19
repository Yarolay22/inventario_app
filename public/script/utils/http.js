const Http = (() => {


    const sendRequest = async (endpoint, method, data = {}) => {

        const url = window.location.origin + endpoint;

        let objetoRequest = {
            method,
            headers: {
                'Content-Type': 'application/json'
            },
        }

        if (url === '') return;

        if (['POST', 'PUT'].includes(method) && Object.keys(data).length !== 0) {
            objetoRequest.body = JSON.stringify(data)
        }

        const response = await fetch(url, objetoRequest)
        const jsonData = await response.json()

        if (!response.ok) {
            throw new Error(jsonData?.error ?? 'Error Inesperado')
        }

        return jsonData
    }



    return {
        get: (endpoint = '') => sendRequest(endpoint, 'GET'),
        post: (endpoint = '', data = {}) => sendRequest(endpoint, 'POST', data),
        delete: (endpoint = '') => sendRequest(endpoint, 'DELETE'),
        put: (endpoint = '', data = {}) => sendRequest(endpoint, 'PUT', data)
    }
})()