// Datos actualizados del organigrama
const orgData = {
    centro: {
        title: "Centro de Formación SENA CDM",
        content: "Entidad encargada de la formación profesional integral. Coordina todas las áreas y procesos formativos.",
        video: "",
        audio: ""
    },
    subdireccion: {
        title: "Subdirección",
        content: "Responsable de la dirección estratégica del centro. Supervisa todas las coordinaciones.",
        video: "",
        audio: ""
    },
    'comite-tecnico': {
        title: "Comité Técnico",
        content: "Analiza y recomienda sobre aspectos técnicos de los programas de formación.",
        video: "",
        audio: ""
    },
    'mesa-sectorial': {
        title: "Mesa Sectorial",
        content: "Espacio de concertación con el sector productivo para alinear la formación.",
        video: "",
        audio: ""
    },
    'coordinacion-academica': {
        title: "Coordinación Académica",
        content: "Gestiona todos los procesos formativos, instructores y ambientes de aprendizaje.",
        video: "",
        audio: ""
    },
    instructores: {
        title: "Gestión de Instructores",
        content: "Selección, vinculación (Res. 0642), desarrollo y evaluación del personal docente.",
        video: "",
        audio: ""
    },
    ambientes: {
        title: "Gestión de Ambientes",
        content: "Administración de aulas, talleres, laboratorios y plataformas virtuales.",
        video: "",
        audio: ""
    },
    'formacion-titulada': {
        title: "Formación Titulada",
        content: "Programas técnicos y tecnológicos con certificación oficial del SENA.",
        video: "",
        audio: ""
    },
    'gestion-aprendices': {
        title: "Gestión de Aprendices",
        content: "Proceso integral desde matrícula hasta seguimiento académico.",
        video: "",
        audio: ""
    },
    bienestar: {
        title: "Bienestar al Aprendiz",
        content: "Servicios de psicorientación, salud, actividades deportivas y culturales.",
        video: "",
        audio: ""
    },
    'apoyo-administrativo': {
        title: "Apoyo Administrativo",
        content: "Gestión de recursos físicos, financieros y tecnológicos del centro.",
        video: "",
        audio: ""
    },
    'recursos-fisicos': {
        title: "Recursos Físicos",
        content: "Mantenimiento de infraestructura y servicios generales.",
        video: "",
        audio: ""
    },
    tic: {
        title: "Tecnologías de la Información",
        content: "Soporte técnico, plataformas virtuales e infraestructura tecnológica.",
        video: "",
        audio: ""
    }
};

// Avatar y roles actualizados
const roleInfo = {
    aprendiz: {
        title: "Guía para Aprendices",
        content: "Como aprendiz, puedes navegar para conocer:<ul><li>Procesos de formación</li><li>Servicios de bienestar</li><li>Oportunidades laborales</li><li>Ambientes de aprendizaje</li></ul>",
        voiceMessage: "Aprendiz, aquí encontrarás información sobre tu formación, bienestar y oportunidades laborales."
    },
    instructor: {
        title: "Guía para Instructores",
        content: "Recursos para docentes:<ul><li>Normativa de instructores</li><li>Acceso a ambientes</li><li>Desarrollo curricular</li><li>Evaluación de aprendices</li></ul>",
        voiceMessage: "Instructor, este espacio le muestra recursos para su labor docente y gestión de ambientes."
    },
    administrativo: {
        title: "Guía para Administrativos",
        content: "Procesos clave:<ul><li>Gestión de recursos</li><li>Contratación</li><li>Mantenimiento</li><li>Soporte tecnológico</li></ul>",
        voiceMessage: "Personal administrativo, aquí encontrará los procesos de gestión de recursos y soporte."
    }
};

// Avatares disponibles
const avatars = {
    default: { image: 'avatar_v1-fdn.png', name: 'Guía' },
    aprendiz: { image: '', name: 'Aprendiz' },
    instructor: { image: '', name: 'Instructor' },
    administrativo: { image: '', name: 'Administrativo' }
};

// Variables globales
let currentRole = null;
let currentAvatar = 'default';
let speechSynthesis = window.speechSynthesis || null;
let currentUtterance = null;
let isSpeaking = false;

// Inicialización
document.addEventListener('DOMContentLoaded', function() {
    // Efecto de carga
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.5s ease';
        document.body.style.opacity = '1';
    }, 100);
    
    // Dibujar conexiones
    setTimeout(drawConnections, 500);
    
    // Configurar avatar por defecto
    setAvatar(currentAvatar);
});

// === Datos de Relaciones ===
const relations = {
    direct: [
        { 
            from: "coordinacion-academica", 
            to: "instructores",
            label: "Asignación de instructores a programas" 
        }
    ],
    indirect: [
        { 
            from: "bienestar", 
            to: "instructores",
            label: "Reporte de situaciones de aprendices" 
        }
    ]
};

// === Dibujar conexiones ===
function drawConnections() {
    const svg = document.getElementById('connectors');
    
    // Dibujar relaciones
    relations.direct.forEach(rel => drawLine(rel.from, rel.to, 'direct', rel.label));
relations.indirect.forEach(rel => drawLine(rel.from, rel.to, 'indirect', rel.label));
}

// Modifica la función drawLine así:
// Reemplaza la función drawLine por esta versión corregida
function drawLine(fromId, toId, type, label) {
    const from = document.querySelector(`[data-id="${fromId}"]`);
    const to = document.querySelector(`[data-id="${toId}"]`);
    if (!from || !to) return;

    const svg = document.getElementById('connectors');
    const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
    
    // Calcular posiciones
    const fromRect = from.getBoundingClientRect();
    const toRect = to.getBoundingClientRect();
    const svgRect = svg.getBoundingClientRect();
    
    const x1 = fromRect.left + fromRect.width/2 - svgRect.left;
    const y1 = fromRect.top + fromRect.height - svgRect.top;
    const x2 = toRect.left + toRect.width/2 - svgRect.left;
    const y2 = toRect.top - svgRect.top;
    
    line.setAttribute("x1", x1);
    line.setAttribute("y1", y1);
    line.setAttribute("x2", x2);
    line.setAttribute("y2", y2);
    line.classList.add('relation-line', `${type}-relation-line`);
    
    // Crear tooltip global (solo uno)
    let tooltip = document.getElementById('relation-tooltip');
    if (!tooltip) {
        tooltip = document.createElement('div');
        tooltip.id = 'relation-tooltip';
        tooltip.className = 'tooltip';
        document.body.appendChild(tooltip);
    }
    
    // Configurar eventos
    line.addEventListener('mouseenter', (e) => {
        const x = (e.clientX);
        const y = (e.clientY);
        tooltip.textContent = label || `${fromId} → ${toId}`;
        tooltip.style.left = `${x}px`;
        tooltip.style.top = `${y - 30}px`;
        tooltip.classList.add('tooltip-visible');
    });
    
    line.addEventListener('mouseleave', () => {
        tooltip.classList.remove('tooltip-visible');
    });
    
    line.addEventListener('mousemove', (e) => {
        tooltip.style.left = `${e.clientX}px`;
        tooltip.style.top = `${e.clientY - 30}px`;
    });
    
    svg.appendChild(line);
}



// Y en drawConnections usa:
relations.direct.forEach(rel => drawLine(rel.from, rel.to, 'direct', rel.label));
relations.indirect.forEach(rel => drawLine(rel.from, rel.to, 'indirect', rel.label));
// Y en drawConnections usa:
relations.direct.forEach(rel => drawLine(rel.from, rel.to, 'direct', rel.label));
relations.indirect.forEach(rel => drawLine(rel.from, rel.to, 'indirect', rel.label));
// Inicializar al cargar
document.addEventListener('DOMContentLoaded', drawConnections);

// Función para configurar el avatar
function setAvatar(avatarType) {
    currentAvatar = avatarType;
    const avatar = document.querySelector('.avatar');
    const avatarData = avatars[avatarType] || avatars.default;
    
    // Crear imagen si no existe
    if (!avatar.querySelector('img')) {
        const img = document.createElement('img');
        img.alt = avatarData.name;
        avatar.innerHTML = '';
        avatar.appendChild(img);
    }
    
    // Actualizar imagen
    const img = avatar.querySelector('img');
    img.src = `assets/avatars/${avatarData.image}`;
    img.title = avatarData.name;
}

// Función para reproducir mensaje de voz
function speakMessage(message) {
    // Detener cualquier mensaje en curso
    if (isSpeaking) {
        speechSynthesis.cancel();
        isSpeaking = false;
        document.querySelectorAll('.voice-button').forEach(btn => {
            btn.classList.remove('playing');
        });
        return;
    }
    
    if (speechSynthesis && message) {
        currentUtterance = new SpeechSynthesisUtterance(message);
        currentUtterance.lang = 'es-ES';
        currentUtterance.rate = 0.9;
        
        document.querySelectorAll('.voice-button').forEach(btn => {
            btn.classList.add('playing');
        });
        
        currentUtterance.onend = function() {
            isSpeaking = false;
            document.querySelectorAll('.voice-button').forEach(btn => {
                btn.classList.remove('playing');
            });
        };
        
        currentUtterance.onerror = function() {
            isSpeaking = false;
            document.querySelectorAll('.voice-button').forEach(btn => {
                btn.classList.remove('playing');
            });
        };
        
        speechSynthesis.speak(currentUtterance);
        isSpeaking = true;
    }
}

// Mostrar detalles del nodo
function showDetails(nodeId) {
    const data = orgData[nodeId];
    const modalContent = `
        <div class="modal-content">
            <span class="close-modal" onclick="toggleDetailsModal()">&times;</span>
            <h2>${data.title}</h2>
            <div class="detail-content">
                <p>${data.content}</p>
                ${data.video ? `<video src="${data.video}" controls style="width:100%; margin-top:15px;"></video>` : ''}
                ${data.audio ? `<audio src="${data.audio}" controls style="width:100%; margin-top:15px;"></audio>` : ''}
                <button class="voice-button" onclick="speakMessage('${escapeSingleQuotes(data.title)}. ${escapeSingleQuotes(data.content)}')">
                    <i class="fas fa-volume-up"></i>
                </button>
                <p><small>Haz clic para escuchar esta información</small></p>
            </div>
        </div>
    `;
    
    document.getElementById('detailsModal').innerHTML = modalContent;
    toggleDetailsModal();
}

// Modal de avatar
function toggleAvatarModal() {
    const modal = document.getElementById('avatarModal');
    
    if (modal.style.display === 'flex') {
        modal.style.display = 'none';
    } else {
        const modalContent = `
            <div class="modal-content">
                <span class="close-modal" onclick="toggleAvatarModal()">&times;</span>
                <h2>Personaliza tu Guía</h2>
                
                <h3>Selecciona tu rol:</h3>
                <div class="avatar-options">
                    <button onclick="setAvatarRole('aprendiz')">Aprendiz</button>
                    <button onclick="setAvatarRole('instructor')">Instructor</button>
                    <button onclick="setAvatarRole('administrativo')">Administrativo</button>
                </div>
                
                <h3>Elige tu avatar:</h3>
                <div class="avatar-selector">
                    ${Object.entries(avatars).map(([key, avatar]) => `
                        <div class="avatar-option ${key === currentAvatar ? 'selected' : ''}" onclick="setAvatar('${key}')">
                            <img src="assets/avatars/${avatar.image}" alt="${avatar.name}" title="${avatar.name}">
                        </div>
                    `).join('')}
                </div>
                
                <div id="roleInfo" class="role-info">
                    ${currentRole ? `
                        <h3>${roleInfo[currentRole].title}</h3>
                        ${roleInfo[currentRole].content}
                        <button class="voice-button" onclick="speakMessage('${escapeSingleQuotes(roleInfo[currentRole].voiceMessage)}')">
                            <i class="fas fa-volume-up"></i> Escuchar guía
                        </button>
                    ` : '<p>Selecciona un rol para ver información específica</p>'}
                </div>
            </div>
        `;
        
        modal.innerHTML = modalContent;
        modal.style.display = 'flex';
    }
}

// Configurar rol del avatar
function setAvatarRole(role) {
    currentRole = role;
    const roleInfoElement = document.getElementById('roleInfo');
    if (roleInfoElement) {
        roleInfoElement.innerHTML = `
            <h3>${roleInfo[role].title}</h3>
            ${roleInfo[role].content}
            <button class="voice-button" onclick="speakMessage('${escapeSingleQuotes(roleInfo[role].voiceMessage)}')">
                <i class="fas fa-volume-up"></i> Escuchar guía
            </button>
        `;
    }
    
    // Cambiar avatar según rol si no se ha personalizado
    if (currentAvatar === 'default') {
        setAvatar(role);
    }
}

// Mostrar/ocultar modal de detalles
function toggleDetailsModal() {
    const modal = document.getElementById('detailsModal');
    modal.style.display = modal.style.display === 'flex' ? 'none' : 'flex';
}

// Escapar comillas simples para JS
function escapeSingleQuotes(str) {
    return str.replace(/'/g, "\\'");
}

// Cerrar modales al hacer clic fuera
window.onclick = function(event) {
    const detailsModal = document.getElementById('detailsModal');
    const avatarModal = document.getElementById('avatarModal');
    
    if (event.target === detailsModal) {
        toggleDetailsModal();
    }
    
    if (event.target === avatarModal) {
        toggleAvatarModal();
    }
}

// Redibujar conexiones al cambiar tamaño de ventana
window.addEventListener('resize', function() {
    drawConnections();
});