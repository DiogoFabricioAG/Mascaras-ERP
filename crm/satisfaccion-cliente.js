// ========================
// DATOS MOCKEADOS HEINEKEN
// ========================

const mockClients = [
  {
    id: "CLI-001",
    ruc: "20123456789",
    razonSocial: "Bodega San Juan S.A.C.",
    nombreComercial: "Bodega San Juan",
    segmento: "Bodegas",
    canalPreferido: "WhatsApp",
    contacto: "Juan Pérez",
    telefono: "987654321",
    correo: "juan.perez@bodegasanjuan.pe",
    distrito: "Lima",
    estadoSeleccion: false,
  },
  {
    id: "CLI-002",
    ruc: "20234567890",
    razonSocial: "Minimarket Central S.A.C.",
    nombreComercial: "Minimarket Central",
    segmento: "Supermercados",
    canalPreferido: "Correo",
    contacto: "María López",
    telefono: "987654322",
    correo: "maria.lopez@minimartcentral.pe",
    distrito: "Liu",
    estadoSeleccion: false,
  },
  {
    id: "CLI-003",
    ruc: "20345678901",
    razonSocial: "Restaurante El Puerto S.A.C.",
    nombreComercial: "Restaurante El Puerto",
    segmento: "Horeca",
    canalPreferido: "WhatsApp",
    contacto: "Carlos García",
    telefono: "987654323",
    correo: "carlos.garcia@elpuerto.pe",
    distrito: "Callao",
    estadoSeleccion: false,
  },
  {
    id: "CLI-004",
    ruc: "20456789012",
    razonSocial: "Licorería Los Andes S.A.C.",
    nombreComercial: "Licorería Los Andes",
    segmento: "Bodegas",
    canalPreferido: "Correo",
    contacto: "Roberto Morales",
    telefono: "987654324",
    correo: "roberto.morales@losandes.pe",
    distrito: "Arequipa",
    estadoSeleccion: false,
  },
  {
    id: "CLI-005",
    ruc: "20567890123",
    razonSocial: "Supermercado Norte S.A.C.",
    nombreComercial: "Supermercado Norte",
    segmento: "Supermercados",
    canalPreferido: "Correo",
    contacto: "Patricia Sánchez",
    telefono: "987654325",
    correo: "patricia.sanchez@supernorte.pe",
    distrito: "Trujillo",
    estadoSeleccion: false,
  },
  {
    id: "CLI-006",
    ruc: "20678901234",
    razonSocial: "Bar La Estación S.A.C.",
    nombreComercial: "Bar La Estación",
    segmento: "Horeca",
    canalPreferido: "WhatsApp",
    contacto: "Diego Flores",
    telefono: "987654326",
    correo: "diego.flores@laestacion.pe",
    distrito: "Cusco",
    estadoSeleccion: false,
  },
];

const surveyTemplates = [
  {
    id: "SUR-001",
    nombre: "Encuesta Bodegas",
    segmento: "Bodegas",
    canalRecomendado: "WhatsApp",
    preguntas: [
      "¿Cómo califica la calidad de nuestros productos?",
      "¿Están satisfechos con los plazos de entrega?",
      "¿La atención del vendedor fue adecuada?",
      "¿Recomendaría nuestros productos a otros? (1-5)",
    ],
    estado: "activa",
    idónea: true,
  },
  {
    id: "SUR-002",
    nombre: "Encuesta Supermercados",
    segmento: "Supermercados",
    canalRecomendado: "Correo",
    preguntas: [
      "Satisfacción con variedad de productos",
      "Cumplimiento de entregas a tiempo",
      "Calidad del servicio de atención",
      "Disposición para próximas compras (1-5)",
    ],
    estado: "activa",
    idónea: true,
  },
  {
    id: "SUR-003",
    nombre: "Encuesta Horeca",
    segmento: "Horeca",
    canalRecomendado: "WhatsApp",
    preguntas: [
      "Nivel de satisfacción con la variedad de bebidas",
      "Experiencia con el personal de ventas",
      "Competitividad de precios",
      "Intención de recompra (1-5)",
    ],
    estado: "activa",
    idónea: true,
  },
];

// Estado de la aplicación
let appState = {
  selectedClients: [],
  selectedSurvey: null,
  currentFilter: "all",
  trackingData: [],
  resultsData: [],
  customSurveys: [],
};

// ========================
// FUNCIONES DE INTERFAZ
// ========================

function switchTab(tabName, btn) {
  // Hide all views
  document.querySelectorAll(".sc-view").forEach((view) => {
    view.classList.remove("active");
  });

  // Remove active class from all tabs
  document.querySelectorAll(".sc-tab-btn").forEach((button) => {
    button.classList.remove("active");
  });

  // Show selected view
  const view = document.getElementById(tabName);
  if (view) {
    view.classList.add("active");
  }

  // Mark tab as active
  if (btn) {
    btn.classList.add("active");
  }

  // Refresh data based on tab
  if (tabName === "campaign") {
    renderClients();
    updateCampaignSummary();
  } else if (tabName === "survey") {
    renderSurveys();
  } else if (tabName === "tracking") {
    renderTracking();
  } else if (tabName === "results") {
    renderResults();
  }
}

function filterSegment(btn) {
  const segment = btn.textContent.trim();
  appState.currentFilter = segment === "Todos" ? "all" : segment;

  // Update filter buttons
  document.querySelectorAll(".sc-filter-btn").forEach((button) => {
    button.classList.remove("active");
  });
  btn.classList.add("active");

  renderClients();
}

function renderClients() {
  const container = document.getElementById("clientsGrid");
  container.innerHTML = "";

  const filteredClients =
    appState.currentFilter === "all"
      ? mockClients
      : mockClients.filter((c) => c.segmento === appState.currentFilter);

  filteredClients.forEach((client) => {
    const card = document.createElement("div");
    card.className = `sc-client-card ${client.estadoSeleccion ? "selected" : ""}`;

    card.innerHTML = `
      <input type="checkbox" ${client.estadoSeleccion ? "checked" : ""} onchange="toggleClient('${client.id}')">
      <div class="sc-client-info">
        <div class="sc-client-name">${client.nombreComercial}</div>
        <div class="sc-client-ruc">RUC: ${client.ruc}</div>
        <div style="margin-bottom: 0.5rem;">
          <span class="sc-client-segment">${client.segmento}</span>
        </div>
        <div style="font-size: 11px; color: var(--tm); line-height: 1.4;">
          <div><strong>Contacto:</strong> ${client.contacto}</div>
          <div><strong>Canal:</strong> ${client.canalPreferido}</div>
          <div><strong>Teléfono:</strong> ${client.telefono}</div>
        </div>
      </div>
    `;

    container.appendChild(card);
  });
}

function toggleClient(clientId) {
  const client = mockClients.find((c) => c.id === clientId);
  if (client) {
    client.estadoSeleccion = !client.estadoSeleccion;

    if (client.estadoSeleccion) {
      if (!appState.selectedClients.includes(clientId)) {
        appState.selectedClients.push(clientId);
      }
    } else {
      appState.selectedClients = appState.selectedClients.filter(
        (id) => id !== clientId,
      );
    }

    updateCampaignSummary();
  }
}

function updateCampaignSummary() {
  const selected = appState.selectedClients.length;
  const bodegas = mockClients.filter(
    (c) => c.estadoSeleccion && c.segmento === "Bodegas",
  ).length;
  const supermercados = mockClients.filter(
    (c) => c.estadoSeleccion && c.segmento === "Supermercados",
  ).length;
  const horeca = mockClients.filter(
    (c) => c.estadoSeleccion && c.segmento === "Horeca",
  ).length;

  document.getElementById("selectedCount").textContent = selected;
  document.getElementById("bodegasCount").textContent = bodegas;
  document.getElementById("supermercadosCount").textContent = supermercados;
  document.getElementById("horecaCount").textContent = horeca;

  const conformityIcon = document.getElementById("conformityIcon");
  const conformityStatus = document.getElementById("conformityStatus");

  if (selected > 0) {
    conformityIcon.className = "sc-conformity-icon yes";
    conformityIcon.textContent = "✓";
    conformityStatus.textContent = `${selected} cliente(s) seleccionado(s) - Selección Conforme`;
  } else {
    conformityIcon.className = "sc-conformity-icon no";
    conformityIcon.textContent = "✕";
    conformityStatus.textContent = "Sin clientes seleccionados";
  }
}

function clearSelection() {
  mockClients.forEach((c) => {
    c.estadoSeleccion = false;
  });
  appState.selectedClients = [];
  renderClients();
  updateCampaignSummary();
}

function renderSurveys() {
  const container = document.getElementById("surveysGrid");
  container.innerHTML = "";

  const allSurveys = [...surveyTemplates, ...appState.customSurveys];

  // Determine selected segment
  const segmentCount = appState.selectedClients.reduce((acc, clientId) => {
    const client = mockClients.find((c) => c.id === clientId);
    if (!client) return acc;
    acc[client.segmento] = (acc[client.segmento] || 0) + 1;
    return acc;
  }, {});

  const selectedSegments = Object.keys(segmentCount);

  allSurveys.forEach((survey) => {
    const isSuitable =
      selectedSegments.length === 0 ||
      selectedSegments.includes(survey.segmento);

    const card = document.createElement("div");
    card.className = `sc-survey-card ${isSuitable ? "suitable" : ""}`;

    const questionsHtml = survey.preguntas
      .slice(0, 3)
      .map((q) => `<div class="sc-survey-q">${q}</div>`)
      .join("");

    card.innerHTML = `
      <div class="sc-survey-name">${survey.nombre}</div>
      <div class="sc-survey-segment">Segmento: ${survey.segmento}</div>
      <div class="sc-survey-questions">
        <strong>Preguntas:</strong>
        ${questionsHtml}
        ${survey.preguntas.length > 3 ? `<div style="margin-top: 0.5rem; font-size: 10px;">+${survey.preguntas.length - 3} preguntas más</div>` : ""}
      </div>
      <div class="sc-survey-actions">
        <button class="btn ${appState.selectedSurvey === survey.id ? "bs" : "sec"}" onclick="selectSurvey('${survey.id}')">
          ${appState.selectedSurvey === survey.id ? "Seleccionada ✓" : "Usar Encuesta"}
        </button>
      </div>
    `;

    container.appendChild(card);
  });
}

function selectSurvey(surveyId) {
  appState.selectedSurvey = surveyId;
  renderSurveys();
}

function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.add("active");
    if (modalId === "newSurveyModal") {
      // Initialize questions list
      const questionsList = document.getElementById("questionsList");
      questionsList.innerHTML = "";
      addQuestionField();
    }
  }
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.remove("active");
  }
}

function addQuestionField() {
  const questionsList = document.getElementById("questionsList");
  const index = questionsList.children.length;

  const field = document.createElement("div");
  field.className = "sc-question-item";
  field.id = `question-${index}`;

  field.innerHTML = `
    <input 
      type="text" 
      placeholder="Ingresa la pregunta ${index + 1}..."
      data-question-index="${index}"
    />
    <button class="sc-btn-remove" onclick="removeQuestion(${index})">
      Eliminar
    </button>
  `;

  questionsList.appendChild(field);
}

function removeQuestion(index) {
  const field = document.getElementById(`question-${index}`);
  if (field) {
    field.remove();
  }
}

function saveSurvey() {
  const name = document.getElementById("surveyName").value.trim();
  const segment = document.getElementById("surveySegment").value;
  const channel = document.getElementById("surveyChannel").value;
  const questions = Array.from(
    document.getElementById("questionsList").querySelectorAll("input"),
  )
    .map((input) => input.value.trim())
    .filter((q) => q.length > 0);

  if (!name || !segment || !channel || questions.length === 0) {
    alert("Por favor completa todos los campos requeridos");
    return;
  }

  const newSurvey = {
    id: `SUR-${Date.now()}`,
    nombre: name,
    segmento: segment,
    canalRecomendado: channel,
    preguntas: questions,
    estado: "activa",
    idónea: true,
  };

  appState.customSurveys.push(newSurvey);
  appState.selectedSurvey = newSurvey.id;

  alert("Encuesta creada exitosamente");
  closeModal("newSurveyModal");
  renderSurveys();
}

function renderTracking() {
  // Generate tracking data from selected clients
  if (
    appState.trackingData.length === 0 &&
    appState.selectedClients.length > 0
  ) {
    appState.trackingData = appState.selectedClients.map((clientId) => {
      const client = mockClients.find((c) => c.id === clientId);
      const randomDays = Math.floor(Math.random() * 25);
      const states = [
        "Enviada",
        "Pendiente",
        "Recordatorio enviado",
        "Respondida",
        "Sin responder",
      ];
      const randomState = states[Math.floor(Math.random() * states.length)];

      return {
        clientId,
        cliente: client.nombreComercial,
        segmento: client.segmento,
        canal: client.canalPreferido,
        fechaEnvio: new Date(
          Date.now() - Math.random() * 20 * 24 * 60 * 60 * 1000,
        ).toLocaleDateString("es-PE"),
        estado: randomState,
        diasTranscurridos: randomDays,
        recordatorioEnviado: randomDays > 10,
        ultimaInteraccion: new Date(
          Date.now() - Math.random() * 15 * 24 * 60 * 60 * 1000,
        ).toLocaleDateString("es-PE"),
      };
    });
  }

  // Update summary
  const enviadas = appState.trackingData.filter(
    (t) => t.estado !== "Pendiente",
  ).length;
  const respondidas = appState.trackingData.filter(
    (t) => t.estado === "Respondida",
  ).length;
  const pending = appState.trackingData.filter(
    (t) => t.estado === "Pendiente",
  ).length;
  const sinResponder = appState.trackingData.filter(
    (t) => t.estado === "Sin responder",
  ).length;

  document.getElementById("sentCount").textContent = enviadas;
  document.getElementById("respondedCount").textContent = respondidas;
  document.getElementById("pendingCount").textContent = pending;
  document.getElementById("nonRespondedCount").textContent = sinResponder;

  // Render table
  const tableBody = document.getElementById("trackingTable");
  tableBody.innerHTML = "";

  appState.trackingData.forEach((record) => {
    const row = document.createElement("tr");

    const stateColors = {
      Enviada: "enviada",
      Pendiente: "pendiente",
      "Recordatorio enviado": "recordatorio",
      Respondida: "respondida",
      "Sin responder": "sin-responder",
    };

    const progressPercent = Math.min(
      (record.diasTranscurridos / 20) * 100,
      100,
    );

    row.innerHTML = `
      <td>${record.cliente}</td>
      <td>${record.segmento}</td>
      <td>${record.canal}</td>
      <td>${record.fechaEnvio}</td>
      <td><span class="sc-badge ${stateColors[record.estado]}">${record.estado}</span></td>
      <td>
        <div style="display: flex; align-items: center; gap: 0.5rem;">
          <div>${record.diasTranscurridos}</div>
          <div class="sc-progress-bar">
            <div class="sc-progress-fill" style="width: ${progressPercent}%"></div>
          </div>
        </div>
      </td>
      <td>
        ${record.estado === "Pendiente" ? `<button class="btn sec" onclick="sendReminder('${record.clientId}')">Recordatorio</button>` : ""}
        ${record.diasTranscurridos > 20 && record.estado !== "Sin responder" ? `<button class="btn sec" onclick="markNoResponse('${record.clientId}')">Marcar No Resp.</button>` : ""}
      </td>
    `;

    tableBody.appendChild(row);
  });
}

function sendReminder(clientId) {
  const record = appState.trackingData.find((t) => t.clientId === clientId);
  if (record) {
    record.estado = "Recordatorio enviado";
    record.recordatorioEnviado = true;
    renderTracking();
    alert(`Recordatorio enviado a ${record.cliente} por ${record.canal}`);
  }
}

function markNoResponse(clientId) {
  const record = appState.trackingData.find((t) => t.clientId === clientId);
  if (record) {
    record.estado = "Sin responder";
    renderTracking();
    alert(`${record.cliente} marcado como Sin responder`);
  }
}

function renderResults() {
  // Generate results from tracking data
  if (appState.resultsData.length === 0) {
    const respondedRecords = appState.trackingData.filter(
      (t) => t.estado === "Respondida",
    );

    appState.resultsData = respondedRecords.map((record) => {
      const satisfaction = Math.floor(Math.random() * 5 + 1);
      const comments = [
        "Excelente servicio y rapidez en entrega",
        "Buen producto, pero nos gustaría más variedad",
        "Satisfechos con la atención recibida",
        "Precios competitivos",
        "Entrega a tiempo, muy profesionales",
      ];

      return {
        cliente: record.cliente,
        segmento: record.segmento,
        satisfaccion: satisfaction,
        comentarios: comments[Math.floor(Math.random() * comments.length)],
        estadoValidacion: "Conforme",
      };
    });
  }

  // Calculate dashboard metrics
  const totalSent = appState.trackingData.length;
  const totalResponded = appState.resultsData.length;
  const responseRate =
    totalSent > 0 ? Math.round((totalResponded / totalSent) * 100) : 0;
  const avgSatisfaction =
    totalResponded > 0
      ? (
          appState.resultsData.reduce((sum, r) => sum + r.satisfaccion, 0) /
          totalResponded
        ).toFixed(1)
      : 0;

  document.getElementById("dashTotalSent").textContent = totalSent;
  document.getElementById("dashTotalResponded").textContent = totalResponded;
  document.getElementById("dashResponseRate").textContent = responseRate + "%";
  document.getElementById("dashAvgSatisfaction").textContent =
    avgSatisfaction + "/5";

  // Render charts
  renderCharts();

  // Render results table
  const tableBody = document.getElementById("resultsTable");
  tableBody.innerHTML = "";

  appState.resultsData.forEach((result) => {
    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${result.cliente}</td>
      <td>${result.segmento}</td>
      <td>
        <div style="display: flex; align-items: center; gap: 0.5rem;">
          <span style="font-weight: 600; color: var(--sc-success);">${result.satisfaccion}/5</span>
          <div style="display: flex; gap: 2px;">
            ${new Array(5)
              .fill(0)
              .map(
                (_, i) =>
                  `<span style="color: ${i < result.satisfaccion ? "var(--sc-primary)" : "var(--sc-border)"}">★</span>`,
              )
              .join("")}
          </div>
        </div>
      </td>
      <td>${result.comentarios}</td>
      <td><span class="sc-badge respondida">${result.estadoValidacion}</span></td>
    `;

    tableBody.appendChild(row);
  });
}

function renderCharts() {
  const container = document.getElementById("chartsContainer");
  container.innerHTML = "";

  // Chart 1: Satisfacción por Segmento
  const satisfaccionPorSegmento = {};
  appState.resultsData.forEach((result) => {
    if (!satisfaccionPorSegmento[result.segmento]) {
      satisfaccionPorSegmento[result.segmento] = [];
    }
    satisfaccionPorSegmento[result.segmento].push(result.satisfaccion);
  });

  const chartData1 = Object.entries(satisfaccionPorSegmento).map(
    ([segment, values]) => ({
      segment,
      avg: (values.reduce((a, b) => a + b, 0) / values.length).toFixed(1),
    }),
  );

  const chart1 = document.createElement("div");
  chart1.className = "sc-section";
  chart1.innerHTML = `
    <h3 style="margin-top: 0; color: var(--sc-primary); margin-bottom: var(--sp2);">Satisfacción Promedio por Segmento</h3>
    <canvas id="chart-satisfaction-segment" width="300" height="150"></canvas>
  `;
  container.appendChild(chart1);

  setTimeout(() => {
    drawBarChart("chart-satisfaction-segment", chartData1);
  }, 100);

  // Chart 2: Respondidas vs Sin Responder
  const responded = appState.resultsData.length;
  const notResponded = appState.trackingData.length - responded;

  const chart2 = document.createElement("div");
  chart2.className = "sc-section";
  chart2.innerHTML = `
    <h3 style="margin-top: 0; color: var(--sc-primary); margin-bottom: var(--sp2);">Tasa de Respuesta</h3>
    <canvas id="chart-response-rate" width="300" height="150"></canvas>
  `;
  container.appendChild(chart2);

  setTimeout(() => {
    drawPieChart("chart-response-rate", [
      { label: "Respondidas", value: responded, color: "var(--sc-success)" },
      {
        label: "Sin Responder",
        value: notResponded,
        color: "var(--sc-danger)",
      },
    ]);
  }, 100);

  // Chart 3: Evolución temporal
  const evolutionData = {};
  appState.trackingData.forEach((record) => {
    const date = record.fechaEnvio;
    evolutionData[date] = (evolutionData[date] || 0) + 1;
  });

  const chart3 = document.createElement("div");
  chart3.className = "sc-section";
  chart3.innerHTML = `
    <h3 style="margin-top: 0; color: var(--sc-primary); margin-bottom: var(--sp2);">Encuestas Enviadas por Fecha</h3>
    <canvas id="chart-evolution" width="300" height="150"></canvas>
  `;
  container.appendChild(chart3);

  setTimeout(() => {
    const evolutionArray = Object.entries(evolutionData)
      .sort((a, b) => new Date(a[0]) - new Date(b[0]))
      .slice(-10)
      .map(([date, count]) => ({
        date: date.substring(0, 5),
        count,
      }));
    drawLineChart("chart-evolution", evolutionArray);
  }, 100);
}

function drawBarChart(canvasId, data) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  const padding = 40;
  const chartHeight = canvas.height - padding * 2;
  const chartWidth = canvas.width - padding * 2;
  const barWidth = (chartWidth / data.length) * 0.8;
  const barSpacing = chartWidth / data.length;

  // Background
  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Y-axis scale
  const maxValue = 5;
  const yScale = chartHeight / maxValue;

  // Draw bars
  data.forEach((item, index) => {
    const x = padding + index * barSpacing + barSpacing * 0.1;
    const barHeight = item.avg * yScale;
    const y = canvas.height - padding - barHeight;

    // Bar
    ctx.fillStyle = "#1a5490";
    ctx.fillRect(x, y, barWidth, barHeight);

    // Label
    ctx.fillStyle = "#666";
    ctx.font = "12px Inter";
    ctx.textAlign = "center";
    ctx.fillText(item.segment, x + barWidth / 2, canvas.height - padding + 20);

    // Value
    ctx.fillStyle = "#1a5490";
    ctx.font = "bold 12px Inter";
    ctx.fillText(item.avg, x + barWidth / 2, y - 5);
  });

  // Axes
  ctx.strokeStyle = "#ddd";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(padding, padding);
  ctx.lineTo(padding, canvas.height - padding);
  ctx.lineTo(canvas.width - padding, canvas.height - padding);
  ctx.stroke();

  // Y-axis labels
  ctx.fillStyle = "#999";
  ctx.font = "11px Inter";
  ctx.textAlign = "right";
  for (let i = 0; i <= maxValue; i++) {
    const y = canvas.height - padding - i * yScale;
    ctx.fillText(i, padding - 10, y + 4);
  }
}

function drawPieChart(canvasId, data) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;
  const radius = 50;

  // Background
  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const total = data.reduce((sum, item) => sum + item.value, 0);
  let currentAngle = -Math.PI / 2;

  data.forEach((item) => {
    const sliceAngle = (item.value / total) * 2 * Math.PI;

    // Draw slice
    ctx.fillStyle = item.color;
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, currentAngle, currentAngle + sliceAngle);
    ctx.lineTo(centerX, centerY);
    ctx.fill();

    // Draw label
    const labelAngle = currentAngle + sliceAngle / 2;
    const labelX = centerX + Math.cos(labelAngle) * (radius + 40);
    const labelY = centerY + Math.sin(labelAngle) * (radius + 40);

    ctx.fillStyle = "#333";
    ctx.font = "11px Inter";
    ctx.textAlign = "center";
    ctx.fillText(`${item.label}: ${item.value}`, labelX, labelY);

    currentAngle += sliceAngle;
  });
}

function drawLineChart(canvasId, data) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  const padding = 40;
  const chartHeight = canvas.height - padding * 2;
  const chartWidth = canvas.width - padding * 2;

  // Background
  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const maxValue = Math.max(...data.map((d) => d.count), 1);
  const xScale = chartWidth / (data.length - 1 || 1);
  const yScale = chartHeight / maxValue;

  // Draw line
  ctx.strokeStyle = "#1a5490";
  ctx.lineWidth = 2;
  ctx.beginPath();

  data.forEach((item, index) => {
    const x = padding + index * xScale;
    const y = canvas.height - padding - item.count * yScale;

    if (index === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  });

  ctx.stroke();

  // Draw points
  ctx.fillStyle = "#1a5490";
  data.forEach((item, index) => {
    const x = padding + index * xScale;
    const y = canvas.height - padding - item.count * yScale;

    ctx.beginPath();
    ctx.arc(x, y, 4, 0, 2 * Math.PI);
    ctx.fill();
  });

  // Axes
  ctx.strokeStyle = "#ddd";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(padding, padding);
  ctx.lineTo(padding, canvas.height - padding);
  ctx.lineTo(canvas.width - padding, canvas.height - padding);
  ctx.stroke();

  // X-axis labels
  ctx.fillStyle = "#999";
  ctx.font = "11px Inter";
  ctx.textAlign = "center";
  data.forEach((item, index) => {
    const x = padding + index * xScale;
    ctx.fillText(item.date, x, canvas.height - padding + 20);
  });

  // Y-axis labels
  ctx.fillStyle = "#999";
  ctx.font = "11px Inter";
  ctx.textAlign = "right";
  for (let i = 0; i <= maxValue; i++) {
    const y = canvas.height - padding - i * yScale;
    ctx.fillText(i, padding - 10, y + 4);
  }
}

function validateResults() {
  const validated = appState.resultsData.filter(
    (r) => r.estadoValidacion === "Conforme",
  ).length;
  alert(
    `✓ Validación completada\n${validated} de ${appState.resultsData.length} respuestas validadas como conformes`,
  );
}

function generateReport() {
  if (appState.resultsData.length === 0) {
    alert("No hay datos de resultados para generar reporte");
    return;
  }

  const avgSatisfaction = (
    appState.resultsData.reduce((sum, r) => sum + r.satisfaccion, 0) /
    appState.resultsData.length
  ).toFixed(2);

  const report = `
REPORTE DE SATISFACCIÓN DEL CLIENTE - HEINEKEN PERÚ B2B
========================================================

Periodo: ${new Date().toLocaleDateString("es-PE")}

RESUMEN EJECUTIVO
-----------------
Total de Encuestas Enviadas: ${appState.trackingData.length}
Total de Respuestas: ${appState.resultsData.length}
Tasa de Respuesta: ${Math.round((appState.resultsData.length / appState.trackingData.length) * 100)}%
Satisfacción Promedio: ${avgSatisfaction}/5.0

ANÁLISIS POR SEGMENTO
---------------------
${(() => {
  const bySegment = {};
  appState.resultsData.forEach((r) => {
    if (!bySegment[r.segmento]) {
      bySegment[r.segmento] = [];
    }
    bySegment[r.segmento].push(r.satisfaccion);
  });

  return Object.entries(bySegment)
    .map(
      ([segment, scores]) =>
        `${segment}: ${(scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(2)}/5 (${scores.length} respuestas)`,
    )
    .join("\n");
})()}

COMENTARIOS DESTACADOS
----------------------
${appState.resultsData
  .slice(0, 3)
  .map((r) => `• ${r.cliente} (${r.segmento}): "${r.comentarios}"`)
  .join("\n")}

Reporte generado: ${new Date().toLocaleString("es-PE")}
  `;

  // Copy to clipboard and show alert
  navigator.clipboard.writeText(report);
  alert("✓ Reporte generado y copiado al portapapeles\n\n" + report);
}

function cleanData() {
  appState.trackingData = [];
  appState.resultsData = [];
  renderTracking();
  renderResults();
  alert(
    "✓ Datos limpios. Los cambios se reflejarán en la próxima generación de datos.",
  );
}

function notifyMarketing() {
  const avgSatisfaction =
    appState.resultsData.length > 0
      ? (
          appState.resultsData.reduce((sum, r) => sum + r.satisfaccion, 0) /
          appState.resultsData.length
        ).toFixed(2)
      : 0;

  const responseRate =
    appState.trackingData.length > 0
      ? Math.round(
          (appState.resultsData.length / appState.trackingData.length) * 100,
        )
      : 0;

  const bySegment = {};
  appState.resultsData.forEach((r) => {
    if (!bySegment[r.segmento]) {
      bySegment[r.segmento] = [];
    }
    bySegment[r.segmento].push(r.satisfaccion);
  });

  const topSegments = Object.entries(bySegment)
    .sort(
      (a, b) =>
        b[1].reduce((x, y) => x + y) / b[1].length -
        a[1].reduce((x, y) => x + y) / a[1].length,
    )
    .slice(0, 2);

  const notificationContent = `
    <div style="margin-bottom: var(--sp3);">
      <h3 style="color: var(--g); font-size: var(--tlg); margin-top: 0;">Resultados de la Medición de Satisfacción B2B</h3>
    </div>

    <div style="background: rgba(0, 114, 42, 0.05); padding: var(--sp3); border-radius: var(--rmd); margin-bottom: var(--sp3); border-left: 4px solid var(--g);">
      <div style="margin-bottom: var(--sp2);">
        <strong>${appState.resultsData.length}</strong> respuestas recibidas
      </div>
      <div style="margin-bottom: var(--sp2);">
        <strong>${responseRate}%</strong> tasa de respuesta
      </div>
      <div>
        <strong>${avgSatisfaction}/5</strong> satisfacción promedio
      </div>
    </div>

    ${
      topSegments.length > 0
        ? `
    <div style="margin-bottom: var(--sp3);">
      <h4 style="color: var(--t); margin-bottom: var(--sp2);">Segmentos con mejor desempeño:</h4>
      <ul style="margin: 0; padding-left: var(--sp3);">
        ${topSegments
          .map(
            ([segment, scores]) =>
              `<li>${segment}: <strong>${(scores.reduce((a, b) => a + b) / scores.length).toFixed(2)}/5</strong></li>`,
          )
          .join("")}
      </ul>
    </div>
    `
        : ""
    }

    <div style="background: rgba(46, 125, 50, 0.05); padding: var(--sp3); border-radius: var(--rmd); border-left: 4px solid #2e7d32;">
      <h4 style="color: var(--t); margin-top: 0;">Acciones recomendadas:</h4>
      <ul style="margin: 0; padding-left: var(--sp3);">
        <li>Analizar feedback negativo</li>
        <li>Implementar mejoras en procesos</li>
        <li>Planificar próxima medición</li>
      </ul>
    </div>

    <div style="color: var(--tm); font-size: var(--txs); margin-top: var(--sp3); border-top: 1px solid rgba(0, 0, 0, 0.06); padding-top: var(--sp2);">
      Enviado: ${new Date().toLocaleString("es-PE")}
    </div>
  `;

  document.getElementById("marketingNotificationContent").innerHTML =
    notificationContent;
  openModal("marketingNotificationModal");
}

function loadModule(moduleName) {
  // This function would navigate to different modules
  console.log("Navigating to: " + moduleName);
  // In a real app, this would navigate to different pages
}

function act(button) {
  // Sidebar active state
  document.querySelectorAll(".ni").forEach((btn) => btn.classList.remove("a"));
  button.classList.add("a");
}

// Initialize on page load
document.addEventListener("DOMContentLoaded", () => {
  renderClients();
  updateCampaignSummary();
});
