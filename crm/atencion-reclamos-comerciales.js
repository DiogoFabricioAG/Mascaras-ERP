const caseRecords = {
  "RECL-2026-0001": {
    id: "RECL-2026-0001",
    title: "Bodega San Juan",
    statusLabel: "No iniciado",
    statusClass: "no-iniciado",
    derived: false,
    responseAvailable: false,
    business: {
      razonSocial: "Bodega San Juan",
      nombreComercial: "San Juan Market",
      canal: "Bodega",
      contacto: "Luis Vera",
      telefono: "+51 987654321",
      correo: "luis@sanjuan.pe",
      direccion: "Av. Abancay 123",
      distrito: "Cercado de Lima",
    },
    claim: {
      producto: "Heineken / lote 2401",
      motivo: "Producto en mal estado",
      descripcion:
        "Se detectaron unidades con olor y sabor fuera de norma en la ultima entrega.",
      areaSugerida: "Calidad",
      actualizacion: "Hace 20 min",
      evidencia: "foto_lote_2401.jpg, guia_8821.pdf",
      banner: "El expediente se encuentra en evaluacion inicial por CRM.",
      timeline: "En espera de derivacion a la primera area responsable.",
    },
  },
  "RECL-2026-0002": {
    id: "RECL-2026-0002",
    title: "Licoreria El Punto",
    statusLabel: "Derivado",
    statusClass: "derivado",
    derived: true,
    responseAvailable: false,
    business: {
      razonSocial: "Licoreria El Punto",
      nombreComercial: "El Punto",
      canal: "Licoreria",
      contacto: "Mariela Chacon",
      telefono: "+51 934567890",
      correo: "mariela@elpunto.pe",
      direccion: "Jr. Camana 210",
      distrito: "Cercado de Lima",
    },
    claim: {
      producto: "Amstel / pedido",
      motivo: "Faltante en entrega",
      descripcion:
        "La entrega llego con unidades incompletas respecto a la orden de compra.",
      areaSugerida: "Logistica",
      actualizacion: "Hace 1 h",
      evidencia: "guia_7791.pdf",
      banner:
        "Este expediente ya fue derivado y solo conserva trazabilidad de seguimiento.",
      timeline: "Derivado a Logistica para validacion de despacho.",
    },
  },
  "RECL-2026-0003": {
    id: "RECL-2026-0003",
    title: "Restobar La Esquina",
    statusLabel: "Resolución Completa",
    statusClass: "resolucion-completa",
    derived: true,
    responseAvailable: true,
    business: {
      razonSocial: "Restobar La Esquina",
      nombreComercial: "La Esquina",
      canal: "Restaurante",
      contacto: "Patricia Diaz",
      telefono: "+51 945678123",
      correo: "patricia@laesquina.pe",
      direccion: "Av. Arequipa 890",
      distrito: "Lince",
    },
    claim: {
      producto: "Tres Cruces Lager",
      motivo: "Promocion no aplicada",
      descripcion:
        "La condicion comercial no se reflejo en la factura ni en el pedido final.",
      areaSugerida: "Comercial",
      actualizacion: "Hace 3 h",
      evidencia: "captura_pedido_8812.png",
      banner:
        "El area ya envio un reporte y el caso esta listo para revision o cierre.",
      timeline: "Se recibio respuesta del area comercial para revision final.",
      responseReport:
        "El area comercial valida que la promo aplica a pedidos con volumen minimo y propone revisar el historial del canal antes de cerrar el caso.",
    },
  },
  "RECL-2026-0004": {
    id: "RECL-2026-0004",
    title: "Distribuidora Norte",
    statusLabel: "Atendido",
    statusClass: "atendido",
    derived: true,
    responseAvailable: false,
    business: {
      razonSocial: "Distribuidora Norte",
      nombreComercial: "Norte Express",
      canal: "Distribuidor",
      contacto: "Ricardo Solis",
      telefono: "+51 983211445",
      correo: "ricardo@norteexpress.pe",
      direccion: "Av. Tomas Valle 145",
      distrito: "Los Olivos",
    },
    claim: {
      producto: "Tres Cruces PUM PUM",
      motivo: "Diferencia pedido / entrega",
      descripcion:
        "El cliente reporta diferencia entre el comprobante de salida y la recepcion fisica.",
      areaSugerida: "Logistica",
      actualizacion: "Ayer",
      evidencia: "guia_1902.pdf, foto_descarga_11.jpg",
      banner:
        "El caso ya fue atendido y queda disponible solo para consulta de trazabilidad.",
      timeline: "Cierre confirmado con cliente comercial y area operativa.",
      responseReport:
        "Se verifico la salida, se regularizo la diferencia y se informo al cliente el detalle de la atencion.",
    },
  },
};

let currentCaseId = "RECL-2026-0001";
let responseMode = "review";
let toastTimerId = null;

const CHECK_ICON =
  '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 12.5l4.2 4.2L19 7.5" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>';
const ERROR_ICON =
  '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M7 7l10 10M17 7L7 17" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/></svg>';

function act(btn) {
  document
    .querySelectorAll(".ni")
    .forEach((item) => item.classList.remove("a", "at"));
  btn.classList.add("a");
}

function openModal(id) {
  document.getElementById(id).classList.add("active");
}

function closeModal(id) {
  document.getElementById(id).classList.remove("active");
}

function setActiveRow(id) {
  document
    .querySelectorAll("tbody tr")
    .forEach((row) => row.classList.remove("active"));
  const row = document.querySelector(`tbody tr[data-case="${id}"]`);
  if (row) row.classList.add("active");
}

function syncCaseRow(id, record) {
  const row = document.querySelector(`tbody tr[data-case="${id}"]`);
  if (!row) return;
  const status = row.querySelector(".ca-status");
  const actionBtn = row.querySelector(".ca-row-actions .btn");
  if (status) {
    status.className = `ca-status ${record.statusClass}`;
    status.textContent = record.statusLabel;
  }
  if (actionBtn) {
    actionBtn.textContent = getRowActionLabel(record.statusClass);
  }
}

function getRowActionLabel(statusClass) {
  if (statusClass === "derivado") return "Informacion del Reclamo";
  return "Actualizar estado";
}

function initializeTableState() {
  Object.entries(caseRecords).forEach(([id, record]) => {
    syncCaseRow(id, record);
  });
}

function showFeedback(targetId, message) {
  showToast(message, "success");
}

function clearFeedback(targetId) {
  const feedback = document.getElementById(targetId);
  if (!feedback) return;
  feedback.textContent = "";
  feedback.classList.remove("active");
}

function showToast(message, type = "success") {
  const toast = document.getElementById("confirmToast");
  const card = document.getElementById("confirmToastCard");
  const icon = document.getElementById("confirmToastIcon");
  const text = document.getElementById("confirmToastMessage");
  if (!toast || !card || !icon || !text) return;

  card.classList.remove("success", "error");
  card.classList.add(type);
  icon.innerHTML = type === "error" ? ERROR_ICON : CHECK_ICON;
  text.textContent = message;
  toast.classList.add("active");

  if (toastTimerId) clearTimeout(toastTimerId);
  toastTimerId = setTimeout(() => {
    toast.classList.remove("active");
  }, 2200);
}

function renderCaseDetail(record) {
  document.getElementById("detailCaseTitle").textContent = record.id;
  document.getElementById("detailCaseSubtitle").textContent =
    `${record.title} | Expediente B2B del cliente comercial`;

  const statusBadge = document.getElementById("detailStatusBadge");
  statusBadge.className = `ca-status ${record.statusClass}`;
  statusBadge.textContent = record.statusLabel;

  document.getElementById("detailRazonSocial").textContent =
    record.business.razonSocial;
  document.getElementById("detailNombreComercial").textContent =
    record.business.nombreComercial;
  document.getElementById("detailCanal").textContent = record.business.canal;
  document.getElementById("detailContacto").textContent =
    record.business.contacto;
  document.getElementById("detailTelefono").textContent =
    record.business.telefono;
  document.getElementById("detailCorreo").textContent = record.business.correo;
  document.getElementById("detailDireccion").textContent =
    record.business.direccion;
  document.getElementById("detailDistrito").textContent =
    record.business.distrito;
  document.getElementById("detailProducto").textContent = record.claim.producto;
  document.getElementById("detailMotivo").textContent = record.claim.motivo;
  document.getElementById("detailDescripcion").textContent =
    record.claim.descripcion;
  document.getElementById("detailAreaSugerida").textContent =
    record.claim.areaSugerida;
  document.getElementById("detailActualizacion").textContent =
    record.claim.actualizacion;
  document.getElementById("detailEvidencia").textContent =
    record.claim.evidencia;
  document.getElementById("detailTimelineLast").textContent =
    record.claim.timeline;

  const deriveBtn = document.getElementById("detailDeriveBtn");
  const responseBtn = document.getElementById("detailResponseBtn");
  const derivePanel = document.getElementById("derivePanel");
  const detailModal = document.getElementById("caseDetailModal");
  const actionNote = document.getElementById("detailActionNote");
  const infoBanner = document.getElementById("detailInfoBanner");

  document.getElementById("deriveNote").value =
    "Se amplia el contexto del reclamo comercial para que el area tome accion con prioridad.";
  document.getElementById("deriveArea").value = "";
  document.getElementById("derivePriority").value = "Alta";

  clearFeedback("detailInfoBanner");
  infoBanner.textContent = record.claim.banner;
  infoBanner.classList.add("active");

  derivePanel.hidden = true;
  detailModal.classList.remove("expanded");
  deriveBtn.dataset.state = "collapsed";
  deriveBtn.textContent = "Derivar reclamo";
  deriveBtn.hidden =
    record.derived ||
    record.responseAvailable ||
    record.statusClass === "derivado" ||
    record.statusClass === "resolucion-completa" ||
    record.statusClass === "re-validacion" ||
    record.statusClass === "atendido" ||
    record.statusClass === "cerrado";
  responseBtn.hidden = !record.responseAvailable;

  if (record.derived) {
    actionNote.textContent =
      "El reclamo ya fue derivado; solo quedan acciones de trazabilidad o revision de respuesta.";
  } else if (record.responseAvailable) {
    actionNote.textContent =
      "Se recibio respuesta del area. Revisa el reporte o reenvia la respuesta al cliente.";
  } else {
    actionNote.textContent =
      "Abre la derivacion para ampliar el contexto del reclamo y enviarlo al area indicada.";
  }
}

function openCaseDetail(id) {
  currentCaseId = id;
  setActiveRow(id);
  renderCaseDetail(caseRecords[id]);
  openModal("caseDetailModal");
}

function handleDeriveAction() {
  const record = caseRecords[currentCaseId];
  const detailModal = document.getElementById("caseDetailModal");
  const deriveBtn = document.getElementById("detailDeriveBtn");
  const derivePanel = document.getElementById("derivePanel");

  if (deriveBtn.dataset.state !== "expanded") {
    detailModal.classList.add("expanded");
    derivePanel.hidden = false;
    deriveBtn.dataset.state = "expanded";
    deriveBtn.textContent = "Enviar derivacion";
    return;
  }

  const area = document.getElementById("deriveArea").value.trim();
  const note = document.getElementById("deriveNote").value.trim();
  if (!area || !note) {
    showToast(
      "Completa el texto adicional y selecciona el area antes de enviar.",
      "error",
    );
    return;
  }

  record.derived = true;
  record.responseAvailable = false;
  record.statusClass = "derivado";
  record.statusLabel = "Derivado";
  record.claim.banner = `Reclamo derivado a ${area} con prioridad ${document.getElementById("derivePriority").value}.`;
  record.claim.timeline = `Derivado a ${area} para seguimiento operativo.`;
  syncCaseRow(currentCaseId, record);
  renderCaseDetail(record);
  showToast(
    `Confirmacion: el reclamo fue enviado a ${area} con prioridad ${document.getElementById("derivePriority").value}.`,
    "success",
  );
}

function renderResponseModal(record) {
  document.getElementById("responseCaseSubtitle").textContent =
    `${record.id} | ${record.title}`;
  document.getElementById("responseReportText").textContent =
    record.claim.responseReport;
  document.getElementById("responseReviewText").value =
    "Se solicita una segunda revision con contexto adicional de CRM antes de cerrar el caso.";
  document.getElementById("responseSendText").value =
    "Se informa al cliente comercial que su reclamo fue atendido correctamente y se ejecutaron las acciones de cierre correspondientes.";
  setResponseMode("review");
}

function openResponseModal() {
  const record = caseRecords[currentCaseId];
  if (!record.responseAvailable) return;
  renderResponseModal(record);
  openModal("responseModal");
}

function setResponseMode(mode) {
  responseMode = mode;
  const reviewPanel = document.getElementById("responseReviewPanel");
  const sendPanel = document.getElementById("responseSendPanel");
  const reviewBtn = document.getElementById("reviewModeBtn");
  const sendBtn = document.getElementById("sendModeBtn");
  const actionBtn = document.getElementById("responseActionBtn");

  reviewPanel.hidden = mode !== "review";
  sendPanel.hidden = mode !== "send";
  reviewBtn.classList.toggle("active", mode === "review");
  sendBtn.classList.toggle("active", mode === "send");
  actionBtn.textContent =
    mode === "review" ? "Pedir revision otra vez" : "Enviar al cliente";
}

function handleResponseAction() {
  const record = caseRecords[currentCaseId];
  if (responseMode === "review") {
    const note = document.getElementById("responseReviewText").value.trim();
    if (!note) {
      showToast(
        "Agrega un texto adicional antes de pedir otra revision.",
        "error",
      );
      return;
    }
    record.statusClass = "re-validacion";
    record.statusLabel = "Re-validacion";
    record.responseAvailable = false;
    record.claim.banner =
      "CRM solicito una segunda validacion al area responsable.";
    record.claim.timeline =
      "En re-validacion por solicitud de CRM con contexto adicional.";
    syncCaseRow(currentCaseId, record);
    renderCaseDetail(record);
    showToast(
      "Se envio la solicitud de revision con contexto adicional de CRM.",
      "success",
    );
    return;
  }

  const note = document.getElementById("responseSendText").value.trim();
  if (!note) {
    showToast("Agrega el texto para el cliente antes de enviar.", "error");
    return;
  }

  record.responseAvailable = false;
  record.statusClass = "atendido";
  record.statusLabel = "Atendido";
  record.claim.banner =
    "La respuesta fue enviada al cliente comercial y el reclamo quedo atendido.";
  record.claim.timeline =
    "Respuesta final enviada al cliente comercial con cierre de seguimiento.";
  syncCaseRow(currentCaseId, record);
  renderCaseDetail(record);
  showToast(
    "Respuesta enviada al cliente comercial con confirmacion de atencion correcta.",
    "success",
  );
}

document.addEventListener("click", (event) => {
  if (event.target.classList.contains("modal-overlay")) {
    event.target.parentElement.classList.remove("active");
  }
});

document.addEventListener("DOMContentLoaded", () => {
  initializeTableState();
});
