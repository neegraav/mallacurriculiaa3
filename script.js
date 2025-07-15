const malla = {
  "1er semestre": [
    "Historia del derecho",
    "Historia y evolución de las instituciones civiles",
    "Introducción a la economía",
    "Derecho político",
    "Introducción al derecho",
    "Electivo de comunicación"
  ],
  "2do semestre": [
    "Historia institucional de Chile",
    "Fundamentos filosóficos del derecho",
    "Teoría de la ley y de las personas",
    "Teoría constitucional - Derecho político",
    "Argumentación jurídica y debate"
  ],
  "3er semestre": [
    "Acto jurídico",
    "Organización y atribución de los tribunales",
    "Derecho constitucional orgánico",
    "Teoría del delito",
    "Negociación y ética profesional",
    "Electivo desarrollo del pensamiento"
  ],
  "4to semestre": [
    "Bienes",
    "Teoría del proceso",
    "Derecho y garantías constitucionales",
    "Derecho internacional público",
    "Teoría de la reacción penal",
    "Taller de integración 1"
  ],
  "5to semestre": [
    "Teoría de las obligaciones",
    "Procedimientos civiles de cognición",
    "Derecho individual del trabajo",
    "Delitos en particular 1",
    "Electivo de desarrollo personal"
  ],
  "6to semestre": [
    "Fuentes de las obligaciones",
    "Procedimientos de ejecución y cautela",
    "Teoría del proceso",
    "Derecho mercantil",
    "Derecho colectivo del trabajo y seguridad social",
    "Delitos en particular 2",
    "Electivo de responsabilidad social"
  ],
  "7mo semestre": [
    "Derecho de familia",
    "Responsabilidad civil",
    "Derecho societario",
    "Derecho administrativo 1",
    "Derecho procesal penal",
    "Taller de litigación"
  ],
  "8vo semestre": [
    "Derecho sucesorio",
    "Procedimientos especiales orales",
    "Contratación mercantil",
    "Derecho administrativo 2",
    "Derecho tributario 1",
    "Taller de integración 2",
    "Objetivo de especialización 1"
  ],
  "9no semestre": [
    "Recursos",
    "Seminario de investigación jurídica",
    "Reorganización y liquidación patrimonial",
    "Derecho tributario 2",
    "Clínica jurídica (A+S)",
    "Optativo de especialización 2"
  ],
  "10mo semestre": [
    "Taller de integración 3"
  ]
};

const prerrequisitos = {
  "Acto jurídico": ["Historia y evolución de las instituciones civiles"],
  "Organización y atribución de los tribunales": ["Introducción al derecho"],
  "Derecho constitucional orgánico": ["Derecho político"],
  "Teoría del delito": ["Introducción al derecho"],

  "Bienes": ["Historia y evolución de las instituciones civiles", "Teoría de la ley y de las personas"],
  "Derecho y garantías constitucionales": ["Derecho político", "Teoría constitucional - Derecho político"],
  "Derecho internacional público": ["Teoría constitucional - Derecho político"],
  "Teoría de la reacción penal": ["Teoría del delito"],
  "Taller de integración 1": ["Acto jurídico", "Organización y atribución de los tribunales"],

  "Teoría de las obligaciones": ["Acto jurídico"],
  "Procedimientos civiles de cognición": ["Teoría del proceso"],
  "Derecho individual del trabajo": ["Derecho y garantías constitucionales"],
  "Delitos en particular 1": ["Teoría de la reacción penal"],

  "Fuentes de las obligaciones": ["Acto jurídico"],
  "Derecho mercantil": ["Acto jurídico", "Bienes"],

  "Derecho de familia": ["Teoría de la ley y de las personas"],
  "Responsabilidad civil": ["Teoría de las obligaciones"],
  "Derecho societario": ["Teoría de las obligaciones"],
  "Derecho administrativo 1": ["Derecho y garantías constitucionales"],
  "Derecho procesal penal": ["Procedimientos civiles de cognición"],
  "Taller de litigación": ["Procedimientos civiles de cognición"],

  "Derecho sucesorio": ["Teoría de la ley y de las personas", "Electivo de comunicación", "Acto jurídico"],
  "Procedimientos especiales orales": ["Teoría del proceso", "Procedimientos civiles de cognición"],
  "Contratación mercantil": ["Fuentes de las obligaciones"],
  "Derecho administrativo 2": ["Derecho y garantías constitucionales"],
  "Taller de integración 2": ["Taller de integración 1", "Responsabilidad civil", "Taller de litigación"],

  "Recursos": ["Teoría del proceso", "Procedimientos civiles de cognición"],
  "Seminario de investigación jurídica": ["8vo semestre"],
  "Reorganización y liquidación patrimonial": ["Fuentes de las obligaciones", "Derecho societario"],
  "Clínica jurídica (A+S)": ["8vo semestre"],

  "Taller de integración 3": ["9no semestre"]
};

const aprobados = new Set(JSON.parse(localStorage.getItem("ramosAprobados") || "[]"));

function crearMalla() {
  const contenedor = document.getElementById('malla');
  for (let semestre in malla) {
    const divSem = document.createElement('div');
    divSem.className = 'semestre';
    const h2 = document.createElement('h2');
    h2.textContent = semestre;
    divSem.appendChild(h2);

    malla[semestre].forEach(ramo => {
      const divRamo = document.createElement('div');
      divRamo.textContent = ramo;
      divRamo.className = 'ramo';

      if (aprobados.has(ramo)) {
        divRamo.classList.add('approved');
      } else if (!prerrequisitos[ramo]) {
        divRamo.classList.add('unlocked');
      } else {
        divRamo.classList.add('locked');
      }

      divRamo.addEventListener('click', () => {
        if (divRamo.classList.contains('locked')) return;

        if (divRamo.classList.contains('approved')) {
          divRamo.classList.remove('approved');
          divRamo.classList.add('unlocked');
          aprobados.delete(ramo);
        } else {
          divRamo.classList.remove('unlocked');
          divRamo.classList.add('approved');
          aprobados.add(ramo);
        }

        guardarProgreso();
        actualizarDesbloqueos();
      });

      divSem.appendChild(divRamo);
    });

    contenedor.appendChild(divSem);
  }
}

function actualizarDesbloqueos() {
  document.querySelectorAll('.ramo.locked, .ramo.unlocked').forEach(ramo => {
    const nombre = ramo.textContent;
    const requisitos = prerrequisitos[nombre];

    if (!requisitos) {
      ramo.classList.remove('locked');
      ramo.classList.add('unlocked');
      return;
    }

    const cumplido = requisitos.every(req =>
      aprobados.has(req) || aprobados.has(req.replace("º semestre", "semestre"))
    );

    if (cumplido) {
      ramo.classList.remove('locked');
      ramo.classList.add('unlocked');
    } else {
      ramo.classList.remove('unlocked');
      ramo.classList.add('locked');
    }
  });
}

function guardarProgreso() {
  localStorage.setItem("ramosAprobados", JSON.stringify([...aprobados]));
}

document.getElementById("resetBtn").addEventListener("click", () => {
  if (confirm("¿Estás seguro que quieres borrar todo tu progreso?")) {
    localStorage.removeItem("ramosAprobados");
    location.reload();
  }
});

crearMalla();
actualizarDesbloqueos();
