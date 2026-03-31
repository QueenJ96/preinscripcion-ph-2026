// Variables globales para rastrear el progreso
let phElegida = 0;

// 1. Definición de Requisitos por cada Práctica
const datosConfig = {
    1: {
        aprobadas: ["Anatomía", "Fisiología", "Histo y Embrio", "Salud Mental", "Microbiología"],
        regulares: ["Química", "Física", "IDO", "Ambiente Hospitalario"],
        hospitales: ["Fernandez", "Rivadavia", "Maternidad Sarda", "Velez", "Gandulfo", "Pirovano", "Argerich", "Balestrini", "Belgrano", "Goitia"]
    },
    2: {
        aprobadas: ["Obstetricia Normal", "Psicología Gral", "Neonatología Normal", "PH 1"],
        regulares: ["Farmacología", "APS", "At. Preconcepcional", "Nutrición"],
        hospitales: ["Fiorito", "Durand", "San Fernando", "Oñativia", "Santojanni", "Alvarez", "Maternidad Santa Rosa", "Eva Peron"]
    },
    3: {
        aprobadas: ["Obstetricia Pato", "Neonatología Pato", "Psicología Evolutiva", "PH 2"],
        regulares: ["Deontología", "Antropología", "Ed. para la Salud", "Salud Pública"],
        hospitales: ["Ramos Mejia", "Posadas", "Piñeiro", "Guemes", "Lanus", "Penna", "Escobar", "Pacheco", "Mercante"]
    }
};

// 2. Función para navegar entre secciones
function irAlPaso(n) {
    // Escondemos todas las secciones
    document.querySelectorAll('.step').forEach(s => s.classList.add('hidden'));
    // Mostramos la sección deseada
    const paso = document.getElementById('paso' + n);
    if (paso) paso.classList.remove('hidden');
    
    // Scroll hacia arriba para que no se pierdan al cambiar de pantalla
    window.scrollTo(0, 0);
}

// 3. Al elegir PH (Paso 1), preparamos el Paso 2 y el Paso 3
function seleccionarPH(num) {
    phElegida = num;
    
    // Actualizamos el título del paso 2
    document.getElementById('titulo-paso2').innerText = "Requisitos para PH " + num;
    
    // Llenamos las cajas de materias dinámicamente
    const divAprobadas = document.getElementById('grupo-aprobadas');
    const divRegulares = document.getElementById('grupo-regulares');
    
    divAprobadas.innerHTML = "";
    divRegulares.innerHTML = "";

    datosConfig[num].aprobadas.forEach(m => {
        divAprobadas.innerHTML += `<label><input type="checkbox" class="check-materia"> ${m}</label>`;
    });
    
    datosConfig[num].regulares.forEach(m => {
        divRegulares.innerHTML += `<label><input type="checkbox" class="check-materia"> ${m}</label>`;
    });

    // Dejamos listos los hospitales en los selectores del Paso 3
    cargarHospitales(num);

    irAlPaso(2);
}

// 4. Llenar los selectores de hospitales según la PH
function cargarHospitales(num) {
    const listaHosp = datosConfig[num].hospitales;
    const idsSelects = ['hosp1', 'hosp2', 'hosp3'];

    idsSelects.forEach(id => {
        const select = document.getElementById(id);
        select.innerHTML = '<option value="">Seleccioná un hospital...</option>';
        
        listaHosp.forEach(h => {
            const opt = document.createElement('option');
            opt.value = h;
            opt.textContent = "Hosp. " + h;
            select.appendChild(opt);
        });
    });
}

// 5. Validar que marcaron TODAS las materias
function validarMaterias() {
    const checks = document.querySelectorAll('.check-materia');
    let todoMarcado = true;

    checks.forEach(c => {
        if (!c.checked) todoMarcado = false;
    });

    if (todoMarcado) {
        irAlPaso(3);
    } else {
        alert("⚠️ ¡Atención! Tenés que tener todas las correlativas marcadas para poder inscribirte.");
    }
}

// 6. Finalizar y mostrar resumen
function finalizar() {
    const btn = document.querySelector('.btn-finalizar');
    const urlGoogle = 'https://script.google.com/macros/s/AKfycbz1ZfVLflfc5reDckHDYRMyQoiEdSHhJJIYawt1lpGj5KyCv-w3ltVrfZR4of3GtPtd/exec'; // <--- Pegá el link de Apps Script

    const nombre = document.getElementById('nombre_completo').value;
    const h1 = document.getElementById('hosp1').value;

    if (!nombre || !h1) {
        alert("⚠️ Completá nombre y prioridad 1");
        return;
    }

    btn.innerText = "Enviando...";
    btn.disabled = true;

    // Usamos URLSearchParams para que Google lo entienda perfecto y gratis
    const datos = new URLSearchParams();
    datos.append('nombre', nombre);
    datos.append('localidad', document.getElementById('localidad').value);
    datos.append('trabaja', document.getElementById('trabaja').checked ? "SI" : "NO");
    datos.append('practica', phElegida);
    datos.append('h1', h1);
    datos.append('h2', document.getElementById('hosp2').value);
    datos.append('h3', document.getElementById('hosp3').value);
    datos.append('no_ir', document.getElementById('hospital_no').value);

    fetch(urlGoogle, {
        method: 'POST',
        mode: 'no-cors', // Esto evita problemas de seguridad
        body: datos
    })
    .then(() => {
        alert("✨ ¡Inscripción exitosa! Ya podés cerrar la página.");
        btn.innerText = "¡Enviado!";
        setTimeout(() => location.reload(), 2000);
    })
    .catch(error => {
        alert("❌ Error al enviar. Probá de nuevo.");
        btn.disabled = false;
        btn.innerText = "Finalizar Inscripción ✨";
    });
}