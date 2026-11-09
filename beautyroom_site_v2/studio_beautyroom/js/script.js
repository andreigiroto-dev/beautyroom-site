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

  // Catálogo de procedimentos com valores e cálculo de sinal de 30%
  const SERVICES = {
    cilios: {
      name: "Extensão de Cílios",
      price: 160.00,
      sinal: 48.00,
      duration: "2h00"
    },
    sobrancelhas: {
      name: "Design de Sobrancelhas",
      price: 60.00,
      sinal: 18.00,
      duration: "45min"
    },
    manutencao: {
      name: "Manutenção de Cílios",
      price: 100.00,
      sinal: 30.00,
      duration: "1h30"
    },
    combo: {
      name: "Combo Cílios + Sobrancelhas",
      price: 200.00,
      sinal: 60.00,
      duration: "2h30"
    }
  };

  // Configurações do PIX Oficial do Estúdio (Padrão BACEN BR Code)
  const PIX_CONFIG = {
    key: "11984814153",       // Chave celular cadastrada no banco
    name: "BEAUTY ROOM",     // Nome do beneficiário (sem acento, máx 25 chars)
    city: "MAUA",            // Cidade do recebedor (sem acento, máx 15 chars)
    phoneDisplay: "(11) 98481-4153",
    beneficiaryDisplay: "Beauty Room"
  };

  // Estado do agendamento
  const state = {
    serviceId: "cilios",
    selectedDate: null,
    selectedTime: null,
    clientName: "",
    clientPhone: "",
    clientNotes: "",
    currentStep: 1
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
  const clientNotesInput = document.getElementById("clientNotes");
  const btnNextToPix = document.getElementById("btnNextToPix");

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

  // 2. Navegação entre Etapas (Stepper)
  function goToStep(stepNum) {
    // Validações antes de avançar
    if (stepNum > 2 && (!state.selectedDate || !state.selectedTime)) {
      alert("Por favor, selecione uma data e um horário disponível no calendário.");
      return;
    }

    if (stepNum === 4) {
      const name = clientNameInput ? clientNameInput.value.trim() : "";
      const phone = clientPhoneInput ? clientPhoneInput.value.trim() : "";

      if (!name) {
        alert("Por favor, preencha o seu nome completo.");
        if (clientNameInput) clientNameInput.focus();
        return;
      }
      if (!phone || phone.length < 10) {
        alert("Por favor, preencha seu WhatsApp com DDD.");
        if (clientPhoneInput) clientPhoneInput.focus();
        return;
      }

      state.clientName = name;
      state.clientPhone = phone;
      state.clientNotes = clientNotesInput ? clientNotesInput.value.trim() : "";

      // Atualiza tela do PIX com os dados selecionados
      setupPixCheckout();
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

  // 5. Máscara de Telefone / WhatsApp
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

    // Mensagem formatada do WhatsApp com confirmação do sinal
    const msg = [
      "Olá! Realizei o agendamento no site da Beauty Room:",
      "",
      `✨ *Procedimento:* ${service.name}`,
      `📅 *Data e Horário:* ${formattedDate} às ${state.selectedTime}`,
      `👤 *Cliente:* ${state.clientName}`,
      `📱 *WhatsApp:* ${state.clientPhone}`,
      state.clientNotes ? `📝 *Observação:* ${state.clientNotes}` : "",
      "",
      `💰 *Valor Total:* R$ ${total.toFixed(2).replace(".", ",")}`,
      `⭐ *Sinal de 30%:* R$ ${sinal.toFixed(2).replace(".", ",")} *(Pago via PIX)*`,
      `💳 *Saldo no atendimento:* R$ ${balance.toFixed(2).replace(".", ",")}`,
      "",
      "Estou enviando o comprovante do sinal aqui para confirmar e garantir meu horário! 📸"
    ].filter(Boolean).join("\n");

    if (btnWhatsAppConfirm) {
      btnWhatsAppConfirm.href = `https://wa.me/55${PIX_CONFIG.key}?text=${encodeURIComponent(msg)}`;
    }
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

  // Iniciar calendário no mês atual
  renderCalendar();
  initDefaultDate();
})();
