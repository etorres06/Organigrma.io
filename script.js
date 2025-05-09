
// Datos de relaciones completas
const relationsData = {
    direct: [
        { from: "centro", to: "subdireccion-academica", label: "Línea de mando directa" },
        { from: "centro", to: "subdireccion-administrativa", label: "Línea de mando directa" },
        { from: "subdireccion-academica", to: "coordinacion-tecnica", label: "Supervisión académica" },
        { from: "subdireccion-academica", to: "coordinacion-tecnologa", label: "Supervisión tecnológica" },
        { from: "coordinacion-tecnica", to: "programas-tecnicos", label: "Gestión de programas" },
        { from: "coordinacion-tecnica", to: "instructores", label: "Asignación de instructores" },
        { from: "coordinacion-tecnologa", to: "tic", label: "Gestión TIC" },
        { from: "coordinacion-tecnologa", to: "laboratorios", label: "Gestión laboratorios" },
        { from: "subdireccion-administrativa", to: "gestion-talento", label: "Supervisión RH" },
        { from: "subdireccion-administrativa", to: "gestion-financiera", label: "Supervisión financiera" }
    ],
    indirect: [
        { from: "instructores", to: "gestion-talento", label: "Contratación y nómina" },
        { from: "programas-tecnicos", to: "gestion-financiera", label: "Presupuesto programas" },
        { from: "tic", to: "programas-tecnicos", label: "Soporte tecnológico" },
        { from: "instructores", to: "psicologia", label: "Reporte situaciones" },
        { from: "laboratorios", to: "gestion-financiera", label: "Mantenimiento equipos" }
    ]
};

// Inicialización
document.addEventListener('DOMContentLoaded', function() {
    drawConnections();
    setupHoverEffects();
    window.addEventListener('resize', debounce(drawConnections, 200));
});

// Dibujar conexiones con posición corregida
function drawConnections() {
    const svg = document.getElementById('connectors');
    svg.innerHTML = '';
    
    // Ajustar tamaño del SVG
    const orgContainer = document.querySelector('.org-container');
    svg.setAttribute('width', orgContainer.offsetWidth);
    svg.setAttribute('height', orgContainer.offsetHeight);
    
    // Dibujar todas las relaciones
    relationsData.direct.forEach(rel => drawConnection(rel, 'direct'));
    relationsData.indirect.forEach(rel => drawConnection(rel, 'indirect'));
}

// Función mejorada para dibujar conexiones
function drawConnection(rel, type) {
    const { from, to, label } = rel;
    const fromEl = document.querySelector(`[data-id="${from}"]`);
    const toEl = document.querySelector(`[data-id="${to}"]`);
    
    if (!fromEl || !toEl) return;
    
    const svg = document.getElementById('connectors');
    const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
    
    // Calcular posiciones relativas al contenedor SVG
    const fromRect = fromEl.getBoundingClientRect();
    const toRect = toEl.getBoundingClientRect();
    const svgRect = svg.getBoundingClientRect();
    
    const startX = fromRect.left + fromRect.width/2 - svgRect.left;
    const startY = fromRect.top + fromRect.height - svgRect.top;
    const endX = toRect.left + toRect.width/2 - svgRect.left;
    const endY = toRect.top - svgRect.top;
    
    // Configurar línea
    line.setAttribute("x1", startX);
    line.setAttribute("y1", startY);
    line.setAttribute("x2", endX);
    line.setAttribute("y2", endY);
    line.classList.add('relation-line', `${type}-relation-line`);
    
    // Tooltip
    const tooltip = document.getElementById('relation-tooltip');
    
    line.addEventListener('mouseenter', (e) => {
        const x = e.clientX;
        const y = e.clientY;
        tooltip.textContent = label || `${from} → ${to}`;
        tooltip.style.left = `${x}px`;
        tooltip.style.top = `${y - 10}px`;
        tooltip.classList.add('tooltip-visible');
        line.style.strokeWidth = '4px';
    });
    
    line.addEventListener('mouseleave', () => {
        tooltip.classList.remove('tooltip-visible');
        line.style.strokeWidth = type === 'direct' ? '3px' : '2px';
    });
    
    line.addEventListener('mousemove', (e) => {
        tooltip.style.left = `${e.clientX}px`;
        tooltip.style.top = `${e.clientY - 10}px`;
    });
    
    svg.appendChild(line);
}

// Efectos hover
function setupHoverEffects() {
    document.querySelectorAll('.node').forEach(node => {
        const nodeId = node.dataset.id;
        
        node.addEventListener('mouseenter', () => {
            document.querySelectorAll('.relation-line').forEach(line => {
                if (line.dataset.from === nodeId || line.dataset.to === nodeId) {
                    line.style.opacity = '1';
                    line.style.strokeWidth = '4px';
                } else {
                    line.style.opacity = '0.3';
                }
            });
        });
        
        node.addEventListener('mouseleave', () => {
            document.querySelectorAll('.relation-line').forEach(line => {
                line.style.opacity = '1';
                const type = line.classList.contains('direct-relation-line') ? '3px' : '2px';
                line.style.strokeWidth = type;
            });
        });
    });
}

// Función debounce para redimensionamiento
function debounce(func, wait) {
    let timeout;
    return function() {
        const context = this, args = arguments;
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(context, args), wait);
    };
}

// Mostrar detalles
function showDetails(nodeId) {
    console.log(`Mostrando detalles de: ${nodeId}`);
    // Implementar lógica de modal según necesidades
}

// ===== [INICIO] Sistema de Avatar Guía ===== //
// [Código completo de relaciones...]

// Sistema de Avatar (completo)
const nodeData = {
    centro: {
        title: "Centro de Formación SENA CDM",
        description: "Unidad encargada de la formación profesional integral...",
        avatarMessage: "Este es nuestro centro de formación...",
        functions: ["Función 1", "Función 2"]
    },
    "subdireccion-academica": {
        title: "Subdirección Académica",
        description: "Gestiona los procesos formativos...",
        avatarMessage: "La subdirección académica supervisa los programas...",
        functions: ["Supervisar programas", "Evaluar instructores"]
    }
    // Completa con TODOS los nodos
};

let currentSpeech = null;
let isSpeaking = false;

// Inicialización del avatar
document.querySelector('.close-modal')?.addEventListener('click', closeModal);
document.getElementById('voice-btn')?.addEventListener('click', toggleSpeech);

function showNodeInfo(nodeId) {
    const data = nodeData[nodeId] || { 
        title: nodeId, 
        description: "Descripción no disponible.",
        avatarMessage: "Información en desarrollo.",
        functions: ["Funciones no especificadas"]
    };
    
    document.getElementById('modal-title').textContent = data.title;
    document.getElementById('modal-content').innerHTML = `
        <p>${data.description}</p>
        <h3>Funciones principales:</h3>
        <ul>${data.functions.map(func => `<li>${func}</li>`).join('')}</ul>
    `;
    
    document.getElementById('avatar-text').textContent = data.avatarMessage;
    document.getElementById('avatar-modal').classList.add('visible');
    document.getElementById('info-modal').style.display = 'flex';
    currentSpeech = `${data.title}. ${data.description}. Funciones: ${data.functions.join(', ')}`;
}

// [Funciones de voz (toggleSpeech, startSpeech, etc.)...]
// ===== [FIN] Sistema de Avatar Guía ===== //

function toggleSpeech() {
    if (isSpeaking) {
        stopSpeech();
    } else {
        startSpeech();
    }
}

function startSpeech() {
    if (!currentSpeech || !window.speechSynthesis) return;
    stopSpeech(); // Detener cualquier mensaje previo
    
    const utterance = new SpeechSynthesisUtterance(currentSpeech);
    utterance.lang = 'es-ES';
    utterance.rate = 0.9;
    
    utterance.onend = () => {
        document.getElementById('voice-btn').classList.remove('playing');
        isSpeaking = false;
    };
    
    document.getElementById('voice-btn').classList.add('playing');
    speechSynthesis.speak(utterance);
    isSpeaking = true;
}

function stopSpeech() {
    if (window.speechSynthesis) {
        speechSynthesis.cancel();
    }
    document.getElementById('voice-btn').classList.remove('playing');
    isSpeaking = false;
}

function closeModal() {
    document.getElementById('info-modal').style.display = 'none';
    document.getElementById('avatar-modal').classList.remove('visible');
    stopSpeech();
}