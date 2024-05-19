(() => {
    const userLabel = document.querySelector('#userLabel');
    const btnSalir = document.querySelector('#btnSalir');


    window.addEventListener('DOMContentLoaded', async () => {

        let fullNameStorage = localStorage.getItem('userFullName')

        if (!fullNameStorage) {
            const { fullName } = await Servicio.detalleUser()
            localStorage.setItem('userFullName', fullName)
            fullNameStorage = fullName;
        }

        userLabel.textContent = fullNameStorage
    })


    btnSalir.addEventListener('click', async () => {
        const result = await Swal.fire({
            title: "Advertencia?",
            text: `Desea cerrar la session !`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Si",
            cancelButtonText: "No",
        });

        if (result.isConfirmed) {
            await Servicio.logoutAuth()

            const timeOut = setTimeout(() => {
                window.location.href = '/login'
                clearTimeout(timeOut)
            }, 500);
        }
    })
})()