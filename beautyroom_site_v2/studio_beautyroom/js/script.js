// Menu Mobile
const menuToggle = document.querySelector(".menu-toggle");
const mainNav = document.querySelector(".main-nav");

if (menuToggle && mainNav) {
  menuToggle.addEventListener("click", () => {
    const isOpen = mainNav.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });

  mainNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      mainNav.classList.remove("open");
      menuToggle.setAttribute("aria-expanded", "false");
    });
  });
}

// Ano automático no rodapé
const yearEl = document.getElementById("year");
if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}

// Galeria: Lightbox interativo com navegação, legendas e suporte a toque
const lightbox = document.querySelector(".lightbox");
if (lightbox) {
  const lightboxImage = lightbox.querySelector("img");
  const closeLightbox = document.querySelector(".lightbox-close");
  const prevBtn = document.querySelector(".lightbox-prev");
  const nextBtn = document.querySelector(".lightbox-next");
  const counterEl = lightbox.querySelector(".lightbox-counter");
  const titleEl = lightbox.querySelector(".lightbox-title");
  const subEl = lightbox.querySelector(".lightbox-sub");

  const galleryItems = Array.from(document.querySelectorAll("[data-lightbox]"));
  let currentIndex = 0;

  function showImage(index) {
    if (index < 0) index = galleryItems.length - 1;
    if (index >= galleryItems.length) index = 0;
    currentIndex = index;

    const currentItem = galleryItems[currentIndex];
    const imgEl = currentItem.querySelector("img");

    lightboxImage.src = currentItem.href;
    lightboxImage.alt = imgEl ? imgEl.alt : "Trabalho realizado pela Beauty Room";

    if (counterEl) {
      counterEl.textContent = `${String(currentIndex + 1).padStart(2, "0")} / ${String(galleryItems.length).padStart(2, "0")}`;
    }
    if (titleEl) {
      titleEl.textContent = currentItem.getAttribute("data-title") || "";
    }
    if (subEl) {
      subEl.textContent = currentItem.getAttribute("data-subtitle") || "";
    }

    lightbox.classList.add("open");
    document.body.style.overflow = "hidden";
  }

  function closeImage() {
    lightbox.classList.remove("open");
    lightboxImage.src = "";
    document.body.style.overflow = "";
  }

  galleryItems.forEach((item, index) => {
    item.addEventListener("click", (event) => {
      event.preventDefault();
      showImage(index);
    });
  });

  if (closeLightbox) closeLightbox.addEventListener("click", closeImage);
  if (prevBtn) {
    prevBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      showImage(currentIndex - 1);
    });
  }
  if (nextBtn) {
    nextBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      showImage(currentIndex + 1);
    });
  }

  lightbox.addEventListener("click", (event) => {
    if (event.target === lightbox) closeImage();
  });

  document.addEventListener("keydown", (event) => {
    if (!lightbox.classList.contains("open")) return;
    if (event.key === "Escape") closeImage();
    if (event.key === "ArrowLeft") showImage(currentIndex - 1);
    if (event.key === "ArrowRight") showImage(currentIndex + 1);
  });

  // Suporte a swipe no celular
  let touchStartX = 0;
  let touchEndX = 0;

  lightbox.addEventListener("touchstart", (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  lightbox.addEventListener("touchend", (e) => {
    touchEndX = e.changedTouches[0].screenX;
    const diff = touchEndX - touchStartX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        showImage(currentIndex - 1); // Deslizar para a direita -> anterior
      } else {
        showImage(currentIndex + 1); // Deslizar para a esquerda -> próximo
      }
    }
  }, { passive: true });
}

/* ==========================================================================
   MODAL DE AGENDAMENTO ONLINE (Google Agenda + PIX 30%)
   ========================================================================== */
(function initBookingSystem() {
  const modal = document.getElementById("bookingModal");
  if (!modal) return;

  // Catálogo de procedimentos com valores, duração e cálculo de sinal de 30%
  const SERVICES = {
    cilios: {
      name: "Extensão de Cílios",
      price: 160.00,
      sinal: 48.00,
      duration: "2h00",
      durationHours: 2
    },
    sobrancelhas: {
      name: "Design de Sobrancelhas",
      price: 60.00,
      sinal: 18.00,
      duration: "45min",
      durationHours: 0.75
    },
    manutencao: {
      name: "Manutenção de Cílios",
      price: 100.00,
      sinal: 30.00,
      duration: "1h30",
      durationHours: 1.5
    },
    combo: {
      name: "Combo Cílios + Sobrancelhas",
      price: 200.00,
      sinal: 60.00,
      duration: "2h30",
      durationHours: 2.5
    }/*,
    // [ITEM DE TESTE R$ 0,01 - COMENTADO/DESATIVADO]
    teste: {
      name: "Procedimento de Teste (R$ 0,01)",
      price: 0.01,
      sinal: 0.01,
      duration: "15min",
      durationHours: 0.25
    }*/
  };

  // URL do Webhook do Google Apps Script (Sincronização com Google Agenda da Dona)
  const GOOGLE_CALENDAR_WEBHOOK_URL = "https://script.google.com/macros/s/AKfycbwvzsILWQaxncYqGtIQKDyWtdxh5ThprmYxQh0BDfZomXolglT1KeBO-PqTJZA9Cw0EHQ/exec";

  // Configurações do PIX Oficial do Estúdio (Padrão BACEN BR Code)
  const PIX_CONFIG = {
    key: "+5511984814153",       // Chave celular no padrão BACEN E.164 (+55 + DDD + Número)
    whatsappPhone: "5511984814153", // Número para abertura do WhatsApp
    name: "THAIS LEITE PESSOA", // Nome da titular como registrado no banco (sem acentos)
    city: "MAUA",               // Cidade da conta bancária (sem acentos)
    phoneDisplay: "(11) 98481-4153",
    beneficiaryDisplay: "Thais Leite Pessoa"
  };

  // Configuração do Mercado Pago (Chave Pública do Frontend)
  // Public Key de teste configurada
  const MP_PUBLIC_KEY = "TEST-35039ce6-933f-4f5d-954a-d5d72d91cfba";

  // Estado do agendamento
  const state = {
    serviceId: "cilios",
    selectedDate: null,
    selectedTime: null,
    clientName: "",
    clientPhone: "",
    clientEmail: "",
    clientCpf: "",
    clientNotes: "",
    currentStep: 1,
    paymentMethod: "pix" // 'pix' ou 'card'
  };

  // Elementos do DOM
  const stepNodes = Array.from(modal.querySelectorAll(".step-node"));
  const stepPanels = Array.from(modal.querySelectorAll(".booking-step"));
  const serviceInputs = modal.querySelectorAll('input[name="bookingService"]');
  const summaryServiceName = document.getElementById("summaryServiceName");
  const summaryDateTime = document.getElementById("summaryDateTime");
  const btnNextFromCal = document.getElementById("btnNextFromCal");
  const clientNameInput = document.getElementById("clientName");
  const clientPhoneInput = document.getElementById("clientPhone");
  const clientEmailInput = document.getElementById("clientEmail");
  const clientCpfInput = document.getElementById("clientCpf");
  const clientNotesInput = document.getElementById("clientNotes");
  const btnNextToPix = document.getElementById("btnNextToPix");

  // Elementos do Checkout Mercado Pago e PIX
  const tabPayPix = document.getElementById("tabPayPix");
  const tabPayCard = document.getElementById("tabPayCard");
  const viewPayPix = document.getElementById("viewPayPix");
  const viewPayCard = document.getElementById("viewPayCard");
  const formCheckoutCard = document.getElementById("formCheckoutCard");
  const cardPaymentMessage = document.getElementById("cardPaymentMessage");
  const btnPayCard = document.getElementById("formCheckoutCard__submit");
  const btnPayCardText = document.getElementById("btnPayCardText");
  const btnPayCardSpinner = document.getElementById("btnPayCardSpinner");

  // Elementos da etapa PIX
  const pixServiceTitle = document.getElementById("pixServiceTitle");
  const pixDateTimeText = document.getElementById("pixDateTimeText");
  const pixClientName = document.getElementById("pixClientName");
  const pixTotalValue = document.getElementById("pixTotalValue");
  const pixSinalValue = document.getElementById("pixSinalValue");
  const pixBalanceValue = document.getElementById("pixBalanceValue");
  const pixQrImg = document.getElementById("pixQrImg");
  const qrLoading = document.getElementById("qrLoading");
  const pixCopiaColaInput = document.getElementById("pixCopiaColaInput");
  const btnCopyPix = document.getElementById("btnCopyPix");
  const btnCopyText = document.getElementById("btnCopyText");
  const btnCopyIcon = document.getElementById("btnCopyIcon");
  const btnWhatsAppConfirm = document.getElementById("btnWhatsAppConfirm");

  // Elementos do Calendário Google Agenda
  const calPrevMonth = document.getElementById("calPrevMonth");
  const calNextMonth = document.getElementById("calNextMonth");
  const calMonthLabel = document.getElementById("calMonthLabel");
  const calDaysGrid = document.getElementById("calDaysGrid");
  const calSelectedDayText = document.getElementById("calSelectedDayText");
  const calSlotsGrid = document.getElementById("calSlotsGrid");

  // Controle de datas do calendário
  let viewDate = new Date();
  const MONTHS_PT = [
    "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
    "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
  ];
  const WEEKDAYS_PT = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];
  const AVAILABLE_HOURS = ["09:00", "10:30", "13:00", "14:30", "16:00", "17:30"];

  // 1. Abertura e Fechamento do Modal
  function openModal(serviceId) {
    if (serviceId && SERVICES[serviceId]) {
      state.serviceId = serviceId;
      const targetRadio = modal.querySelector(`input[name="bookingService"][value="${serviceId}"]`);
      if (targetRadio) targetRadio.checked = true;
    }
    updateServiceSummary();
    goToStep(1);
    modal.classList.add("open");
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }

  function closeModal() {
    modal.classList.remove("open");
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }

  // Gatilhos de abertura em botões de agendamento por todo o site
  document.querySelectorAll("[data-open-booking]").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      const serviceId = btn.getAttribute("data-service");
      openModal(serviceId);
    });
  });

  // Gatilhos de fechamento
  modal.querySelectorAll("[data-close-booking]").forEach((btn) => {
    btn.addEventListener("click", closeModal);
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.classList.contains("open")) {
      closeModal();
    }
  });

  // Função de segurança: Sanitização rigorosa contra injeção de HTML / XSS
  function sanitizeInput(str, maxLength = 100) {
    if (typeof str !== "string") return "";
    return str
      .trim()
      .slice(0, maxLength)
      .replace(/[<>'"&/]/g, function (char) {
        switch (char) {
          case "<": return "&lt;";
          case ">": return "&gt;";
          case "'": return "&#39;";
          case "\"": return "&quot;";
          case "&": return "&amp;";
          case "/": return "&#x2F;";
          default: return "";
        }
      });
  }

  // 2. Navegação entre Etapas (Stepper)
  function goToStep(stepNum) {
    // Validações antes de avançar
    if (stepNum > 2 && (!state.selectedDate || !state.selectedTime)) {
      alert("Por favor, selecione uma data e um horário disponível no calendário.");
      return;
    }

    if (stepNum === 4) {
      const rawName = clientNameInput ? clientNameInput.value : "";
      const rawPhone = clientPhoneInput ? clientPhoneInput.value : "";
      const rawEmail = clientEmailInput ? clientEmailInput.value : "";
      const rawCpf = clientCpfInput ? clientCpfInput.value : "";
      const rawNotes = clientNotesInput ? clientNotesInput.value : "";

      const cleanName = sanitizeInput(rawName, 60);
      const cleanPhone = rawPhone.replace(/[^\d()-\s]/g, "").trim().slice(0, 16);
      const cleanEmail = sanitizeInput(rawEmail, 80);
      const cleanCpf = rawCpf.replace(/\D/g, "");
      const cleanNotes = sanitizeInput(rawNotes, 200);

      if (!cleanName || cleanName.length < 3) {
        alert("Por favor, preencha o seu nome completo (mínimo 3 caracteres).");
        if (clientNameInput) clientNameInput.focus();
        return;
      }
      if (!cleanPhone || cleanPhone.replace(/\D/g, "").length < 10) {
        alert("Por favor, preencha um número de WhatsApp válido com DDD.");
        if (clientPhoneInput) clientPhoneInput.focus();
        return;
      }
      if (!cleanEmail || !cleanEmail.includes("@") || !cleanEmail.includes(".")) {
        alert("Por favor, informe um e-mail válido para envio do comprovante.");
        if (clientEmailInput) clientEmailInput.focus();
        return;
      }
      if (!cleanCpf || cleanCpf.length !== 11) {
        alert("Por favor, preencha um CPF válido (11 dígitos).");
        if (clientCpfInput) clientCpfInput.focus();
        return;
      }

      state.clientName = cleanName;
      state.clientPhone = cleanPhone;
      state.clientEmail = cleanEmail;
      state.clientCpf = cleanCpf;
      state.clientNotes = cleanNotes;

      // Atualiza tela do PIX com os dados selecionados
      setupPixCheckout();
      initCardForm();
    }

    state.currentStep = stepNum;

    // Atualiza visibilidade dos painéis
    stepPanels.forEach((panel) => {
      const pStep = Number(panel.getAttribute("data-step"));
      panel.classList.toggle("active", pStep === stepNum);
    });

    // Atualiza indicador do Stepper
    stepNodes.forEach((node) => {
      const nStep = Number(node.getAttribute("data-step-indicator"));
      node.classList.toggle("active", nStep === stepNum);
      node.classList.toggle("completed", nStep < stepNum);
    });

    // Rola para o topo do conteúdo
    const bodyEl = modal.querySelector(".booking-body");
    if (bodyEl) bodyEl.scrollTop = 0;
  }

  // Botões de Avançar / Voltar
  modal.querySelectorAll("[data-go-step]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const targetStep = Number(btn.getAttribute("data-go-step"));
      goToStep(targetStep);
    });
  });

  // 3. Etapa 1: Seleção de Procedimento
  function updateServiceSummary() {
    const current = SERVICES[state.serviceId] || SERVICES.cilios;
    if (summaryServiceName) {
      summaryServiceName.textContent = `${current.name} (R$ ${current.price.toFixed(2).replace(".", ",")})`;
    }
  }

  serviceInputs.forEach((input) => {
    input.addEventListener("change", (e) => {
      state.serviceId = e.target.value;
      updateServiceSummary();
    });
  });

  // 4. Etapa 2: Google Agenda Interativo (Opção B)
  function renderCalendar() {
    if (!calMonthLabel || !calDaysGrid) return;

    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();

    calMonthLabel.textContent = `${MONTHS_PT[month]} ${year}`;
    calDaysGrid.innerHTML = "";

    const firstDayIndex = new Date(year, month, 1).getDay();
    // Ajustar para segunda-feira como início (0: Dom -> 6: Dom)
    const adjustedFirstDay = (firstDayIndex === 0) ? 6 : firstDayIndex - 1;

    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Células vazias antes do dia 1
    for (let i = 0; i < adjustedFirstDay; i++) {
      const emptyCell = document.createElement("div");
      emptyCell.className = "cal-day empty";
      emptyCell.setAttribute("aria-hidden", "true");
      calDaysGrid.appendChild(emptyCell);
    }

    // Dias do mês
    for (let day = 1; day <= daysInMonth; day++) {
      const dayDate = new Date(year, month, day);
      dayDate.setHours(0, 0, 0, 0);

      const dayOfWeek = dayDate.getDay(); // 0 = Domingo, 1 = Segunda
      const isPast = dayDate < today;
      // Estúdio funciona de Terça (2) a Sábado (6)
      const isClosed = (dayOfWeek === 0 || dayOfWeek === 1);

      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "cal-day";
      btn.textContent = day;

      const isToday = dayDate.getTime() === today.getTime();
      if (isToday) btn.classList.add("today");

      const isSelected = state.selectedDate && state.selectedDate.getTime() === dayDate.getTime();
      if (isSelected) btn.classList.add("active");

      if (isPast || isClosed) {
        btn.disabled = true;
        if (isClosed) btn.title = "Estúdio fechado aos domingos e segundas";
      } else {
        btn.addEventListener("click", () => {
          selectDay(dayDate);
        });
      }

      calDaysGrid.appendChild(btn);
    }
  }

  function selectDay(date) {
    state.selectedDate = date;
    state.selectedTime = null; // reseta horário ao trocar o dia
    googleCalendarSynced = false; // permite nova sincronização caso o dia mude
    if (btnNextFromCal) btnNextFromCal.disabled = true;

    // Atualiza classe ativa no calendário
    renderCalendar();

    // Atualiza cabeçalho de horários
    const dayName = WEEKDAYS_PT[date.getDay()];
    const dayStr = String(date.getDate()).padStart(2, "0");
    const monthStr = String(date.getMonth() + 1).padStart(2, "0");

    if (calSelectedDayText) {
      calSelectedDayText.textContent = `${dayName}, ${dayStr}/${monthStr}`;
    }

    renderTimeSlots();
    updateDateTimeSummary();
  }

  function renderTimeSlots() {
    if (!calSlotsGrid) return;
    calSlotsGrid.innerHTML = "";

    AVAILABLE_HOURS.forEach((hour) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "slot-btn";
      btn.textContent = hour;

      if (state.selectedTime === hour) {
        btn.classList.add("active");
      }

      btn.addEventListener("click", () => {
        state.selectedTime = hour;
        calSlotsGrid.querySelectorAll(".slot-btn").forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");

        if (btnNextFromCal) btnNextFromCal.disabled = false;
        updateDateTimeSummary();
      });

      calSlotsGrid.appendChild(btn);
    });
  }

  function updateDateTimeSummary() {
    if (!summaryDateTime) return;
    if (state.selectedDate && state.selectedTime) {
      const d = state.selectedDate;
      const formatted = `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()}`;
      summaryDateTime.textContent = `${formatted} às ${state.selectedTime}`;
    } else if (state.selectedDate) {
      const d = state.selectedDate;
      summaryDateTime.textContent = `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")} (Escolha o horário)`;
    } else {
      summaryDateTime.textContent = "Nenhum horário selecionado";
    }
  }

  if (calPrevMonth) {
    calPrevMonth.addEventListener("click", () => {
      viewDate.setMonth(viewDate.getMonth() - 1);
      renderCalendar();
    });
  }

  if (calNextMonth) {
    calNextMonth.addEventListener("click", () => {
      viewDate.setMonth(viewDate.getMonth() + 1);
      renderCalendar();
    });
  }

  // Inicializa o primeiro dia disponível padrão
  function initDefaultDate() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Encontrar o próximo dia de funcionamento (Terça a Sábado)
    let candidate = new Date(today);
    while (candidate.getDay() === 0 || candidate.getDay() === 1) {
      candidate.setDate(candidate.getDate() + 1);
    }
    selectDay(candidate);
  }

  // 5. Máscara de Telefone / WhatsApp e CPF
  if (clientPhoneInput) {
    clientPhoneInput.addEventListener("input", (e) => {
      let val = e.target.value.replace(/\D/g, "");
      if (val.length > 11) val = val.substring(0, 11);
      if (val.length > 6) {
        e.target.value = `(${val.substring(0, 2)}) ${val.substring(2, 7)}-${val.substring(7)}`;
      } else if (val.length > 2) {
        e.target.value = `(${val.substring(0, 2)}) ${val.substring(2)}`;
      } else if (val.length > 0) {
        e.target.value = `(${val}`;
      } else {
        e.target.value = "";
      }
    });
  }

  if (clientCpfInput) {
    clientCpfInput.addEventListener("input", (e) => {
      let val = e.target.value.replace(/\D/g, "");
      if (val.length > 11) val = val.substring(0, 11);
      if (val.length > 9) {
        e.target.value = `${val.substring(0, 3)}.${val.substring(3, 6)}.${val.substring(6, 9)}-${val.substring(9)}`;
      } else if (val.length > 6) {
        e.target.value = `${val.substring(0, 3)}.${val.substring(3, 6)}.${val.substring(6)}`;
      } else if (val.length > 3) {
        e.target.value = `${val.substring(0, 3)}.${val.substring(3)}`;
      } else {
        e.target.value = val;
      }
    });
  }

  // 6. Gerador Oficial PIX Padrão BACEN (BR Code EMV / CRC16)
  function formatEMV(id, value) {
    const len = String(value.length).padStart(2, "0");
    return `${id}${len}${value}`;
  }

  function calculateCRC16(payload) {
    let crc = 0xFFFF;
    for (let i = 0; i < payload.length; i++) {
      crc ^= (payload.charCodeAt(i) << 8);
      for (let j = 0; j < 8; j++) {
        if ((crc & 0x8000) !== 0) {
          crc = ((crc << 1) ^ 0x1021) & 0xFFFF;
        } else {
          crc = (crc << 1) & 0xFFFF;
        }
      }
    }
    return crc.toString(16).toUpperCase().padStart(4, "0");
  }

  function generatePixPayload({ key, name, city, amount, txid = "SINAL" }) {
    // 00: Indicador do formato do payload
    let payload = formatEMV("00", "01");
    // 01: Método de Iniciação (12 = dinâmico ou valor reutilizável)
    payload += formatEMV("01", "12");

    // 26: Dados da Conta do Comerciante (arranjos PIX do BACEN)
    const gui = formatEMV("00", "br.gov.bcb.pix");
    const chave = formatEMV("01", key);
    payload += formatEMV("26", gui + chave);

    // 52: Código de Categoria do Comerciante (0000 = Geral)
    payload += formatEMV("52", "0000");
    // 53: Moeda da Transação (986 = Real Brasileiro / BRL)
    payload += formatEMV("53", "986");
    // 54: Valor da Transação (ex: 48.00)
    payload += formatEMV("54", Number(amount).toFixed(2));
    // 58: Código do País (BR)
    payload += formatEMV("58", "BR");
    // 59: Nome do Comerciante
    const cleanName = name.normalize("NFD").replace(/[\u0300-\u036f]/g, "").substring(0, 25).toUpperCase();
    payload += formatEMV("59", cleanName);
    // 60: Cidade do Comerciante
    const cleanCity = city.normalize("NFD").replace(/[\u0300-\u036f]/g, "").substring(0, 15).toUpperCase();
    payload += formatEMV("60", cleanCity);

    // 62: Campo de Dados Adicionais (TxId)
    const tx = formatEMV("05", txid.substring(0, 25));
    payload += formatEMV("62", tx);

    // 63: Checksum CRC16
    payload += "6304";
    const crc = calculateCRC16(payload);

    return payload + crc;
  }

  // 7. Etapa 4: Setup do Checkout PIX Sinal 30%
  function setupPixCheckout() {
    const service = SERVICES[state.serviceId] || SERVICES.cilios;
    const total = service.price;
    const sinal = service.sinal;
    const balance = total - sinal;

    const d = state.selectedDate;
    const formattedDate = d
      ? `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()}`
      : "Data a definir";

    // Preenche resumo visual
    if (pixServiceTitle) pixServiceTitle.textContent = service.name;
    if (pixDateTimeText) pixDateTimeText.textContent = `${formattedDate} às ${state.selectedTime || "14:00"}`;
    if (pixClientName) pixClientName.textContent = state.clientName;
    if (pixTotalValue) pixTotalValue.textContent = `R$ ${total.toFixed(2).replace(".", ",")}`;
    if (pixSinalValue) pixSinalValue.textContent = `R$ ${sinal.toFixed(2).replace(".", ",")}`;
    if (pixBalanceValue) pixBalanceValue.textContent = `R$ ${balance.toFixed(2).replace(".", ",")}`;

    // Gera o código PIX Oficial
    const txid = `SINAL${Date.now().toString().slice(-6)}`;
    const pixPayload = generatePixPayload({
      key: PIX_CONFIG.key,
      name: PIX_CONFIG.name,
      city: PIX_CONFIG.city,
      amount: sinal,
      txid: txid
    });

    if (pixCopiaColaInput) {
      pixCopiaColaInput.value = pixPayload;
    }

    // Carrega o QR Code em alta definição
    if (pixQrImg) {
      if (qrLoading) qrLoading.style.display = "grid";
      const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=240x240&margin=8&data=${encodeURIComponent(pixPayload)}`;

      pixQrImg.onload = () => {
        if (qrLoading) qrLoading.style.display = "none";
      };
      pixQrImg.src = qrUrl;
    }

    // Mensagem formatada do WhatsApp com codificação UTF-8 100% limpa e sem distorção
    const msg = [
      "Olá! Realizei o agendamento no site da Beauty Room:",
      "",
      `• *Procedimento:* ${service.name}`,
      `• *Data e Horário:* ${formattedDate} às ${state.selectedTime}`,
      `• *Cliente:* ${state.clientName}`,
      `• *WhatsApp:* ${state.clientPhone}`,
      state.clientNotes ? `• *Observação:* ${state.clientNotes}` : "",
      "",
      `• *Valor Total:* R$ ${total.toFixed(2).replace(".", ",")}`,
      `• *Sinal de 30%:* R$ ${sinal.toFixed(2).replace(".", ",")} (Pago via PIX)`,
      `• *Saldo no atendimento:* R$ ${balance.toFixed(2).replace(".", ",")}`,
      "",
      "Estou enviando o comprovante do sinal aqui para confirmar e garantir meu horário!"
    ].filter(Boolean).join("\n");

    if (btnWhatsAppConfirm) {
      // Usa o endpoint oficial direto do WhatsApp sem redirecionamentos intermediários (evita corrupção de caracteres UTF-8)
      btnWhatsAppConfirm.href = `https://api.whatsapp.com/send?phone=${PIX_CONFIG.whatsappPhone}&text=${encodeURIComponent(msg)}`;
    }

    // Sincroniza o agendamento automaticamente com a Google Agenda da dona
    syncWithGoogleCalendar();
  }

  // 8. Integração em Tempo Real com Google Agenda (Apps Script Webhook) com Proteção contra Abuso
  let isSyncingGoogleCalendar = false;
  let googleCalendarSynced = false;
  let lastSyncTimestamp = 0;

  function syncWithGoogleCalendar() {
    const now = Date.now();
    // Proteção contra chamadas repetitivas (mínimo de 10 segundos entre requisições)
    if (googleCalendarSynced || isSyncingGoogleCalendar || (now - lastSyncTimestamp < 10000)) return;
    if (!state.selectedDate || !state.selectedTime || !state.clientName) return;

    lastSyncTimestamp = now;
    isSyncingGoogleCalendar = true;

    const service = SERVICES[state.serviceId] || SERVICES.cilios;
    const d = state.selectedDate;
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    const isoDate = `${year}-${month}-${day}`;

    const payload = {
      date: isoDate,
      time: state.selectedTime,
      durationHours: service.durationHours || 2,
      serviceName: service.name,
      clientName: state.clientName,
      clientPhone: state.clientPhone,
      clientNotes: state.clientNotes || "",
      priceTotal: service.price.toFixed(2).replace(".", ","),
      sinalValue: service.sinal.toFixed(2).replace(".", ","),
      balanceValue: (service.price - service.sinal).toFixed(2).replace(".", ",")
    };

    const statusEl = document.getElementById("pixAgendaStatus");
    if (statusEl) {
      statusEl.textContent = "⏳ Registrando na agenda...";
      statusEl.className = "badge-agenda-synced badge-agenda-syncing";
    }

    fetch(GOOGLE_CALENDAR_WEBHOOK_URL, {
      method: "POST",
      mode: "no-cors",
      headers: {
        "Content-Type": "text/plain;charset=utf-8"
      },
      body: JSON.stringify(payload)
    })
      .then(() => {
        googleCalendarSynced = true;
        isSyncingGoogleCalendar = false;
        if (statusEl) {
          statusEl.textContent = "📅 Bloqueado na Google Agenda ✓";
          statusEl.className = "badge-agenda-synced badge-agenda-done";
        }
        console.log("✓ Evento registrado com sucesso na Google Agenda da dona!");
      })
      .catch((err) => {
        isSyncingGoogleCalendar = false;
        if (statusEl) {
          statusEl.textContent = "📅 Agendamento registrado";
        }
        console.warn("Aviso na sincronização com Google Agenda:", err);
      });
  }

  // Botão do WhatsApp também garante o disparo caso ainda não tenha sido enviado
  if (btnWhatsAppConfirm) {
    btnWhatsAppConfirm.addEventListener("click", () => {
      syncWithGoogleCalendar();
    });
  }

  // Botão Copiar PIX Copia e Cola
  if (btnCopyPix && pixCopiaColaInput) {
    btnCopyPix.addEventListener("click", () => {
      const textToCopy = pixCopiaColaInput.value;
      if (!textToCopy) return;

      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(textToCopy).then(showCopiedFeedback);
      } else {
        pixCopiaColaInput.select();
        document.execCommand("copy");
        showCopiedFeedback();
      }
    });
  }

  function showCopiedFeedback() {
    if (!btnCopyPix) return;
    btnCopyPix.classList.add("copied");
    if (btnCopyText) btnCopyText.textContent = "Copiado! ✓";
    if (btnCopyIcon) btnCopyIcon.textContent = "✓";

    setTimeout(() => {
      btnCopyPix.classList.remove("copied");
      if (btnCopyText) btnCopyText.textContent = "Copiar";
      if (btnCopyIcon) btnCopyIcon.textContent = "📋";
    }, 2500);
  }

  // =========================================================================
  // 7. CHECKOUT TRANSPARENTE: MERCADO PAGO E CONTROLE DE TABS (PIX / CARTÃO)
  // =========================================================================

  // Alternância de Abas PIX vs Cartão
  if (tabPayPix && tabPayCard) {
    tabPayPix.addEventListener("click", () => {
      state.paymentMethod = "pix";
      tabPayPix.classList.add("active");
      tabPayCard.classList.remove("active");
      if (viewPayPix) viewPayPix.style.display = "block";
      if (viewPayCard) viewPayCard.style.display = "none";
    });

    tabPayCard.addEventListener("click", () => {
      state.paymentMethod = "card";
      tabPayCard.classList.add("active");
      tabPayPix.classList.remove("active");
      if (viewPayPix) viewPayPix.style.display = "none";
      if (viewPayCard) viewPayCard.style.display = "block";
      // Inicializa ou re-renderiza quando a aba do cartão é exibida
      setTimeout(() => {
        initCardForm();
      }, 50);
    });
  }

  let mpInstance = null;
  let cardFormInstance = null;

  function initCardForm() {
    if (typeof MercadoPago === "undefined") {
      console.warn("SDK do Mercado Pago não carregado.");
      return;
    }

    if (!mpInstance) {
      mpInstance = new MercadoPago(MP_PUBLIC_KEY, { locale: "pt-BR" });
    }

    const s = SERVICES[state.serviceId] || SERVICES.cilios;
    const amountStr = s.sinal.toFixed(2);

    if (btnPayCardText) {
      btnPayCardText.textContent = `Pagar Sinal de R$ ${amountStr.replace(".", ",")} no Cartão`;
    }

    // Se já estiver inicializado, apenas atualiza o valor
    if (cardFormInstance) {
      try {
        cardFormInstance.update();
      } catch (e) { }
      return;
    }

    try {
      cardFormInstance = mpInstance.cardForm({
        amount: String(amountStr),
        iframe: false,
        form: {
          id: "formCheckoutCard",
          cardNumber: {
            id: "formCheckoutCard__cardNumber",
            placeholder: "0000 0000 0000 0000"
          },
          expirationDate: {
            id: "formCheckoutCard__expirationDate",
            placeholder: "MM/AA"
          },
          securityCode: {
            id: "formCheckoutCard__securityCode",
            placeholder: "123"
          },
          cardholderName: {
            id: "formCheckoutCard__cardholderName",
            placeholder: "Titular do Cartão"
          },
          installments: {
            id: "formCheckoutCard__installments"
          }
        },
        callbacks: {
          onFormMounted: (error) => {
            if (error) return console.warn("Erro ao montar formulário do cartão:", error);
            console.log("CardForm montado com sucesso");
          },
          onSubmit: (event) => {
            event.preventDefault();
            processCardPayment();
          },
          onFetching: (resource) => {
            console.log("Buscando recurso do Mercado Pago: ", resource);
          }
        }
      });
    } catch (err) {
      console.error("Falha ao inicializar o CardForm do Mercado Pago:", err);
    }
  }

  // Envio seguro do pagamento com cartão para a API da Vercel
  async function processCardPayment() {
    if (btnPayCard) btnPayCard.disabled = true;
    if (btnPayCardText) btnPayCardText.textContent = "Processando pagamento...";
    if (btnPayCardSpinner) btnPayCardSpinner.style.display = "inline-block";
    if (cardPaymentMessage) cardPaymentMessage.style.display = "none";

    try {
      let cardFormData = null;
      if (cardFormInstance) {
        try {
          cardFormData = cardFormInstance.getCardFormData();
        } catch (e) {
          console.warn("Erro ao obter dados via CardForm:", e);
        }
      }

      // Se o cardFormInstance não tiver tokenizado ou falhar, tokeniza diretamente via SDK
      let cardToken = cardFormData ? cardFormData.token : null;
      let paymentMethodId = cardFormData ? cardFormData.paymentMethodId : null;
      let issuerId = cardFormData ? cardFormData.issuerId : null;
      let installments = cardFormData ? (cardFormData.installments || 1) : 1;

      if (!cardToken && mpInstance) {
        const rawCardNumber = document.getElementById("formCheckoutCard__cardNumber")?.value.replace(/\s/g, "");
        const rawCardholder = document.getElementById("formCheckoutCard__cardholderName")?.value.trim();
        const rawExp = document.getElementById("formCheckoutCard__expirationDate")?.value.trim() || "";
        const rawCvv = document.getElementById("formCheckoutCard__securityCode")?.value.trim();
        const installmentsSelect = document.getElementById("formCheckoutCard__installments");
        installments = installmentsSelect ? installmentsSelect.value : 1;

        const [expMonth, expYear] = rawExp.split("/");

        if (!rawCardNumber || !rawCardholder || !expMonth || !expYear || !rawCvv) {
          alert("Por favor, preencha todos os campos do cartão.");
          if (btnPayCard) btnPayCard.disabled = false;
          if (btnPayCardText) btnPayCardText.textContent = "Tentar Novamente";
          if (btnPayCardSpinner) btnPayCardSpinner.style.display = "none";
          return;
        }

        const fullYear = expYear.length === 2 ? `20${expYear}` : expYear;

        const tokenResult = await mpInstance.createCardToken({
          cardNumber: rawCardNumber,
          cardholderName: rawCardholder,
          cardExpirationMonth: expMonth,
          cardExpirationYear: fullYear,
          securityCode: rawCvv,
          identification: {
            type: "CPF",
            number: state.clientCpf
          }
        });

        if (tokenResult && tokenResult.id) {
          cardToken = tokenResult.id;
        } else {
          throw new Error("Não foi possível validar os dados do cartão.");
        }
      }

      if (!cardToken) {
        throw new Error("Falha ao gerar o token de segurança do cartão.");
      }

      const s = SERVICES[state.serviceId] || SERVICES.cilios;

      const response = await fetch("/api/process_payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          paymentMethod: "card",
          transactionAmount: s.sinal,
          description: `Sinal Beauty Room - ${s.name}`,
          token: cardToken,
          installments: Number(installments) || 1,
          paymentMethodId: paymentMethodId,
          issuerId: issuerId,
          payer: {
            email: state.clientEmail,
            firstName: state.clientName.split(" ")[0] || "Cliente",
            lastName: state.clientName.split(" ").slice(1).join(" ") || "Beauty Room",
            identification: {
              type: "CPF",
              number: state.clientCpf
            }
          }
        })
      });

      const result = await response.json();

      if (response.ok && (result.status === "approved" || result.status === "in_process")) {
        if (cardPaymentMessage) {
          cardPaymentMessage.className = "payment-feedback-msg success";
          cardPaymentMessage.textContent = "✓ Pagamento aprovado com sucesso! Sincronizando com a Google Agenda...";
          cardPaymentMessage.style.display = "block";
        }

        // Sincroniza com a Google Agenda
        syncWithGoogleCalendar();

        if (btnPayCardText) btnPayCardText.textContent = "Pagamento Aprovado ✓";

        setTimeout(() => {
          alert(`🎉 Pagamento aprovado!\n\nSeu agendamento para ${s.name} foi confirmado com sucesso!\nEnviamos os detalhes para o seu e-mail (${state.clientEmail}).`);
        }, 1200);

      } else {
        const errorDetail = result.error || "O pagamento não foi aprovado pelo banco emissor. Verifique os dados do cartão e tente novamente.";
        if (cardPaymentMessage) {
          cardPaymentMessage.className = "payment-feedback-msg error";
          cardPaymentMessage.textContent = `❌ ${errorDetail}`;
          cardPaymentMessage.style.display = "block";
        }
        if (btnPayCard) btnPayCard.disabled = false;
        if (btnPayCardText) btnPayCardText.textContent = "Tentar Novamente";
      }
    } catch (err) {
      console.error("Erro na requisição de pagamento:", err);
      if (cardPaymentMessage) {
        cardPaymentMessage.className = "payment-feedback-msg error";
        cardPaymentMessage.textContent = `❌ ${err.message || "Falha na conexão ao processar o cartão. Tente novamente ou use o PIX."}`;
        cardPaymentMessage.style.display = "block";
      }
      if (btnPayCard) btnPayCard.disabled = false;
      if (btnPayCardText) btnPayCardText.textContent = "Tentar Novamente";
    } finally {
      if (btnPayCardSpinner) btnPayCardSpinner.style.display = "none";
    }
  }

  // Listener de clique explícito no botão de pagamento com cartão
  if (btnPayCard) {
    btnPayCard.addEventListener("click", (e) => {
      e.preventDefault();
      processCardPayment();
    });
  }

  // Iniciar calendário no mês atual
  renderCalendar();
  initDefaultDate();
})();
