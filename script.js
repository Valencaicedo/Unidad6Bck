// Variables para almacenar la información de pacientes y doctores
let patients = [];
let doctors = [];

// Expresiones regulares para validar campos
const nameRegex = /^[A-Za-z\s]+$/;
const cedulaRegex = /^\d{8,10}$/;
const emailRegex = /^\S+@\S+\.\S+$/;

// Función para validar campos del formulario
function validateForm(formId) {
  const form = document.getElementById(formId);
  const inputs = form.getElementsByTagName('input');
  const select = form.getElementsByTagName('select')[0];

  for (let i = 0; i < inputs.length; i++) {
    const input = inputs[i];
    const value = input.value.trim();
    const fieldName = input.name;

    if (value === '') {
      alert(`El campo ${fieldName} es obligatorio.`);
      return false;
    }

    switch (fieldName) {
      case 'nombre':
      case 'apellido':
        if (!nameRegex.test(value)) {
          alert(`El campo ${fieldName} solo puede contener letras y espacios.`);
          return false;
        }
        break;
      case 'cedula':
        if (value.length < 8 || value.length > 10 || !/^\d{8,10}$/.test(value)) {
          alert('El número de cédula debe contener de 8 a 10 dígitos.');
          return false;
        }
        break;
      case 'correo':
        if (!emailRegex.test(value)) {
          alert('Ingrese un correo válido.');
          return false;
        }
        break;
    }
  }

  if (select.value === '') {
    alert('Seleccione una especialidad.');
    return false;
  }

  return true;
}

// Función para guardar la información del formulario en un objeto JSON
function saveData(formId, isDoctor) {
  const form = document.getElementById(formId);
  const inputs = form.getElementsByTagName('input');
  const select = form.getElementsByTagName('select')[0];

  const data = {
    nombre: inputs[0].value.trim(),
    apellido: inputs[1].value.trim(),
    cedula: inputs[2].value.trim(),
    especialidad: select.value,
    consultorio: isDoctor ? inputs[3].value.trim() : null,
    correo: inputs[isDoctor ? 4 : 3].value.trim(),
  };

  if (isDoctor) {
    doctors.push(data);
  } else {
    patients.push(data);
  }

  const jsonData = JSON.stringify(isDoctor ? doctors : patients);
  localStorage.setItem(isDoctor ? 'doctors' : 'patients', jsonData);

  alert('La información se ha guardado correctamente.');

  return true;
}

// Función para mostrar los listados de pacientes y doctores
function showList(listId, isDoctor) {
  const listContainer = document.getElementById(listId);
  const jsonData = localStorage.getItem(isDoctor ? 'doctors' : 'patients');

  if (jsonData) {
    const data = JSON.parse(jsonData);
    let html = '';

    for (let i = 0; i < data.length; i++) {
      html += `<p>Nombre: ${data[i].nombre} ${data[i].apellido}</p>`;
      html += `<p>Cédula: ${data[i].cedula}</p>`;
      html += `<p>Especialidad: ${data[i].especialidad}</p>`;

      if (isDoctor) {
        html += `<p>Consultorio: ${data[i].consultorio}</p>`;
      }

      html += `<p>Correo: ${data[i].correo}</p>`;
      html += '<hr>';
    }

    listContainer.innerHTML = html;
  } else {
    listContainer.innerHTML = 'No hay datos para mostrar.';
  }
}

// Asignar eventos a los formularios
document.getElementById('doctor-form').addEventListener('submit', function(event) {
  event.preventDefault();

  if (validateForm('doctor-form')) {
    saveData('doctor-form', true);
    showList('doctor-list', true);
    this.reset();
  }
});

document.getElementById('patient-form').addEventListener('submit', function(event) {
  event.preventDefault();

  if (validateForm('patient-form')) {
    saveData('patient-form', false);
    showList('patient-list', false);
    this.reset();
  }
});

// Mostrar los listados al cargar la página
showList('patient-list', false);
showList('doctor-list', true);

// Función para borrar la información almacenada
function resetData(key) {
  localStorage.removeItem(key);
  alert('La información se ha borrado correctamente.');
  location.reload(); // Recargar la página después de borrar la información
}

// Asignar eventos a los botones "Restaurar"
document.getElementById('patient-reset').addEventListener('click', function() {
  resetData('patients');
});

document.getElementById('doctor-reset').addEventListener('click', function() {
  resetData('doctors');
});