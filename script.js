document.addEventListener('DOMContentLoaded', () => {
    const botones = document.querySelectorAll('.opcionOperacion');

    botones.forEach(boton => {
        boton.addEventListener('click', (evento) => {
            // Obtiene el tipo de operación desde el atributo data-operacion del botón
            const operacion = evento.target.getAttribute('data-operacion');
            mostrarContenedorOperacion(boton);
        });
    });
});

mostrarNuevoContenedorOperacion(){
    
}