<script lang="ts">
  import { onMount } from "svelte";
  import { fade, fly, scale, slide } from "svelte/transition";
  import { cubicOut } from "svelte/easing";
  import {
    Calendar,
    Clock,
    User,
    CreditCard,
    QrCode,
    Copy,
    Check,
    Send,
    Shield,
    Sparkles,
    ArrowRight,
    ArrowLeft,
    X,
    FileText,
    ChevronDown,
    ChevronUp,
  } from "lucide-svelte";
  import {
    SERVICES,
    CATEGORIES,
    GOOGLE_CALENDAR_WEBHOOK_URL,
    PIX_CONFIG,
    MP_PUBLIC_KEY,
  } from "$lib/config";
  import { generatePixPayload } from "$lib/pix";

  let {
    isOpen = $bindable(false),
    selectedServiceId = $bindable("cilios-tradicionais"),
  } = $props<{
    isOpen: boolean;
    selectedServiceId: string;
  }>();

  // Categoria expandida na Etapa 1 (inicia fechada para mostrar todos os botões flutuantes)
  let expandedCategory = $state<
    "cilios" | "sobrancelha" | "labios" | "combo" | null
  >(null);

  function toggleCategory(
    catId: "cilios" | "sobrancelha" | "labios" | "combo",
    isExpandable: boolean,
    directId?: string,
  ) {
    if (!isExpandable && directId) {
      selectedServiceId = directId;
      expandedCategory = null;
      return;
    }
    expandedCategory = expandedCategory === catId ? null : catId;
  }

  // Estado do Stepper e Formulário
  let currentStep = $state(1);
  let selectedDate = $state<Date | null>(null);
  let selectedTime = $state<string | null>(null);
  let clientName = $state("");
  let clientPhone = $state("");
  let clientEmail = $state("");
  let clientCpf = $state("");
  let clientNotes = $state("");
  let paymentMethod = $state<"pix" | "card">("pix");

  // Estado do Calendário
  let viewDate = $state(new Date());
  const MONTHS_PT = [
    "Janeiro",
    "Fevereiro",
    "Março",
    "Abril",
    "Maio",
    "Junho",
    "Julho",
    "Agosto",
    "Setembro",
    "Outubro",
    "Novembro",
    "Dezembro",
  ];
  const WEEKDAYS_PT = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
  const AVAILABLE_HOURS = [
    "09:00",
    "10:30",
    "13:00",
    "14:30",
    "16:00",
    "17:30",
  ];
  let bookedSlots = $state<string[]>([]);

  // Estado do Cartão / Mercado Pago
  let cardNumber = $state("");
  let cardholderName = $state("");
  let cardExp = $state("");
  let cardCvv = $state("");
  let installments = $state("1");
  let installmentOptions = $state<
    Array<{ installments: number; recommended_message: string }>
  >([{ installments: 1, recommended_message: "1x (À vista no cartão)" }]);
  let isProcessingCard = $state(false);
  let cardMessage = $state<{ type: "success" | "error"; text: string } | null>(
    null,
  );
  let cardApprovedId = $state<string | null>(null);
  let mpInstance: any = null;

  // PIX State
  let pixPayload = $state("");
  let isCopied = $state(false);
  let qrLoading = $state(true);

  // Live Google Calendar busy slots
  let liveBusySlots = $state<
    Array<{ startMinutes: number; endMinutes: number; allDay: boolean }>
  >([]);
  let isFetchingLiveSlots = $state(false);

  async function fetchLiveGoogleSlots(date: Date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const isoDate = `${year}-${month}-${day}`;

    isFetchingLiveSlots = true;
    try {
      const res = await fetch(
        `${GOOGLE_CALENDAR_WEBHOOK_URL}?action=getBusySlots&date=${isoDate}`,
      );
      const data = await res.json();
      if (data && data.status === "success" && Array.isArray(data.busySlots)) {
        liveBusySlots = data.busySlots;
      } else {
        liveBusySlots = [];
      }
    } catch (e) {
      liveBusySlots = [];
    } finally {
      isFetchingLiveSlots = false;
    }
  }

  function isSlotGoogleBusy(hour: string): boolean {
    if (!liveBusySlots.length) return false;
    const parts = hour.split(":");
    const startMin = parseInt(parts[0], 10) * 60 + parseInt(parts[1], 10);
    const durationHours = currentService.durationHours || 2.0;
    const endMin = startMin + durationHours * 60;

    return liveBusySlots.some((ev) => {
      if (ev.allDay) return true;
      return startMin < ev.endMinutes && endMin > ev.startMinutes;
    });
  }

  // Serviço selecionado reativo
  let currentService = $derived(
    SERVICES[selectedServiceId] || SERVICES["cilios-tradicionais"],
  );
  let priceTotal = $derived(currentService.price);
  let priceSinal = $derived(currentService.sinal);
  let priceBalance = $derived(priceTotal - priceSinal);

  onMount(() => {
    loadBookedSlots();
    initFirstAvailableDate();
    if (typeof (window as any).MercadoPago !== "undefined") {
      mpInstance = new (window as any).MercadoPago(MP_PUBLIC_KEY, {
        locale: "pt-BR",
      });
    }
  });

  function loadBookedSlots() {
    try {
      const data = localStorage.getItem("br_booked_slots");
      if (data) bookedSlots = JSON.parse(data);
    } catch (e) {}
  }

  function saveBookedSlot(slotKey: string) {
    if (!bookedSlots.includes(slotKey)) {
      bookedSlots = [...bookedSlots, slotKey];
      try {
        localStorage.setItem("br_booked_slots", JSON.stringify(bookedSlots));
      } catch (e) {}
    }
  }

  function initFirstAvailableDate() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    let candidate = new Date(today);
    // Atendimento aberto todos os dias (segunda a domingo)
    selectedDate = candidate;
    fetchLiveGoogleSlots(candidate);
  }

  function closeModal() {
    isOpen = false;
    currentStep = 1;
    cardMessage = null;
    cardApprovedId = null;
  }

  // Máscaras de Input
  function handlePhoneInput(e: Event) {
    let val = (e.target as HTMLInputElement).value.replace(/\D/g, "");
    if (val.length > 11) val = val.substring(0, 11);
    if (val.length > 6) {
      clientPhone = `(${val.substring(0, 2)}) ${val.substring(2, 7)}-${val.substring(7)}`;
    } else if (val.length > 2) {
      clientPhone = `(${val.substring(0, 2)}) ${val.substring(2)}`;
    } else if (val.length > 0) {
      clientPhone = `(${val}`;
    } else {
      clientPhone = "";
    }
  }

  function handleCpfInput(e: Event) {
    let val = (e.target as HTMLInputElement).value.replace(/\D/g, "");
    if (val.length > 11) val = val.substring(0, 11);
    if (val.length > 9) {
      clientCpf = `${val.substring(0, 3)}.${val.substring(3, 6)}.${val.substring(6, 9)}-${val.substring(9)}`;
    } else if (val.length > 6) {
      clientCpf = `${val.substring(0, 3)}.${val.substring(3, 6)}.${val.substring(6)}`;
    } else if (val.length > 3) {
      clientCpf = `${val.substring(0, 3)}.${val.substring(3)}`;
    } else {
      clientCpf = val;
    }
  }

  async function handleCardNumberInput(e: Event) {
    let val = (e.target as HTMLInputElement).value.replace(/\D/g, "");
    if (val.length > 16) val = val.substring(0, 16);
    cardNumber = val.replace(/(\d{4})(?=\d)/g, "$1 ");

    if (val.length >= 6 && mpInstance) {
      try {
        const bin = val.substring(0, 6);
        const res = await mpInstance.getInstallments({
          amount: String(priceSinal.toFixed(2)),
          bin,
        });
        if (res && res[0] && res[0].payer_costs) {
          installmentOptions = res[0].payer_costs;
        }
      } catch (err) {}
    }
  }

  function handleCardExpInput(e: Event) {
    let val = (e.target as HTMLInputElement).value.replace(/\D/g, "");
    if (val.length > 4) val = val.substring(0, 4);
    if (val.length >= 3) {
      cardExp = `${val.substring(0, 2)}/${val.substring(2)}`;
    } else {
      cardExp = val;
    }
  }

  function nextStep() {
    if (currentStep === 1) {
      currentStep = 2;
    } else if (currentStep === 2) {
      if (!selectedDate || !selectedTime) {
        alert("Por favor, selecione uma data e um horário disponível.");
        return;
      }
      currentStep = 3;
    } else if (currentStep === 3) {
      if (!clientName || clientName.trim().length < 3) {
        alert("Por favor, preencha o seu nome completo.");
        return;
      }
      if (!clientPhone || clientPhone.replace(/\D/g, "").length < 10) {
        alert("Por favor, informe seu WhatsApp com DDD.");
        return;
      }
      if (!clientEmail || !clientEmail.includes("@")) {
        alert("Por favor, informe um e-mail válido para envio do comprovante.");
        return;
      }
      if (!clientCpf || clientCpf.replace(/\D/g, "").length !== 11) {
        alert("Por favor, informe um CPF válido.");
        return;
      }

      setupPixData();
      currentStep = 4;
    }
  }

  function prevStep() {
    if (currentStep > 1) currentStep--;
  }

  function setupPixData() {
    const txid = `SINAL${Date.now().toString().slice(-6)}`;
    pixPayload = generatePixPayload({
      key: PIX_CONFIG.key,
      name: PIX_CONFIG.name,
      city: PIX_CONFIG.city,
      amount: priceSinal,
      txid,
    });
    qrLoading = true;
    syncWithGoogleCalendar();
  }

  function copyPix() {
    if (!pixPayload) return;
    navigator.clipboard.writeText(pixPayload).then(() => {
      isCopied = true;
      setTimeout(() => (isCopied = false), 2500);
    });
  }

  let calendarSynced = false;
  function syncWithGoogleCalendar() {
    if (calendarSynced || !selectedDate || !selectedTime) return;
    const d = selectedDate;
    const isoDate = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

    const payload = {
      date: isoDate,
      time: selectedTime,
      durationHours: currentService.durationHours,
      serviceName: currentService.name,
      clientName,
      clientPhone,
      clientNotes,
      priceTotal: priceTotal.toFixed(2).replace(".", ","),
      sinalValue: priceSinal.toFixed(2).replace(".", ","),
      balanceValue: priceBalance.toFixed(2).replace(".", ","),
    };

    fetch(GOOGLE_CALENDAR_WEBHOOK_URL, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify(payload),
    })
      .then(() => {
        calendarSynced = true;
        saveBookedSlot(`${isoDate}_${selectedTime}`);
      })
      .catch((err) => console.warn("Aviso sincronização Google Agenda:", err));
  }

  async function processCard() {
    if (isProcessingCard) return;
    isProcessingCard = true;
    cardMessage = null;

    try {
      if (!mpInstance && typeof (window as any).MercadoPago !== "undefined") {
        mpInstance = new (window as any).MercadoPago(MP_PUBLIC_KEY, {
          locale: "pt-BR",
        });
      }

      const rawNum = cardNumber.replace(/\D/g, "");
      const [expM, expYRaw] = cardExp.split("/");
      const expY = expYRaw?.length === 2 ? `20${expYRaw}` : expYRaw;

      if (!rawNum || !cardholderName || !expM || !expY || !cardCvv) {
        throw new Error("Preencha todos os campos do cartão.");
      }

      let paymentMethodId = null;
      let issuerId = null;
      if (rawNum.length >= 6) {
        const bin = rawNum.substring(0, 6);
        const pMethods = await mpInstance.getPaymentMethods({ bin });
        if (pMethods?.results?.length > 0)
          paymentMethodId = pMethods.results[0].id;
        const issuers = await mpInstance.getIssuers({ paymentMethodId, bin });
        if (issuers?.length > 0) issuerId = issuers[0].id;
      }

      const tokenRes = await mpInstance.createCardToken({
        cardNumber: rawNum,
        cardholderName,
        cardExpirationMonth: expM.padStart(2, "0"),
        cardExpirationYear: expY,
        securityCode: cardCvv,
        identification: { type: "CPF", number: clientCpf.replace(/\D/g, "") },
      });

      if (!tokenRes?.id)
        throw new Error("Não foi possível validar os dados do cartão.");

      const res = await fetch("/api/process_payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          paymentMethod: "card",
          transactionAmount: priceSinal,
          description: `Sinal Beauty Room - ${currentService.name}`,
          token: tokenRes.id,
          installments: Number(installments) || 1,
          paymentMethodId,
          issuerId,
          payer: {
            email: clientEmail,
            firstName: clientName.split(" ")[0],
            lastName: clientName.split(" ").slice(1).join(" ") || "Beauty Room",
            identification: {
              type: "CPF",
              number: clientCpf.replace(/\D/g, ""),
            },
          },
        }),
      });

      const data = await res.json();
      if (
        res.ok &&
        (data.status === "approved" || data.status === "in_process")
      ) {
        cardApprovedId = data.id;
        cardMessage = {
          type: "success",
          text: "✓ Pagamento do sinal aprovado com sucesso!",
        };
        syncWithGoogleCalendar();
      } else {
        throw new Error(data.error || "Pagamento recusado pelo banco emissor.");
      }
    } catch (err: any) {
      cardMessage = {
        type: "error",
        text: `❌ ${err.message || "Erro ao processar cartão."}`,
      };
    } finally {
      isProcessingCard = false;
    }
  }

  let formattedDateStr = $derived(
    selectedDate
      ? `${String(selectedDate.getDate()).padStart(2, "0")}/${String(selectedDate.getMonth() + 1).padStart(2, "0")}/${selectedDate.getFullYear()}`
      : "",
  );

  let bookingVoucherUrl = $derived.by(() => {
    const id = cardApprovedId || `BR-${Date.now().toString().slice(-6)}`;
    const params = new URLSearchParams({
      servico: selectedServiceId,
      cliente: clientName,
      data: formattedDateStr,
      hora: selectedTime || "",
      pagamento: paymentMethod,
    });
    return `/comprovante/${id}?${params.toString()}`;
  });

  let pixWhatsAppUrl = $derived.by(() => {
    const text = [
      "Olá! Realizei o agendamento no site da Beauty Room:",
      "",
      `• *Procedimento:* ${currentService.name}`,
      `• *Data e Horário:* ${formattedDateStr} às ${selectedTime}`,
      `• *Cliente:* ${clientName}`,
      `• *WhatsApp:* ${clientPhone}`,
      clientNotes ? `• *Observação:* ${clientNotes}` : "",
      "",
      `• *Valor Total:* R$ ${priceTotal.toFixed(2).replace(".", ",")}`,
      `• *Sinal de 30%:* R$ ${priceSinal.toFixed(2).replace(".", ",")} (Pago via PIX)`,
      `• *Saldo no atendimento:* R$ ${priceBalance.toFixed(2).replace(".", ",")}`,
      "",
      "Estou enviando o comprovante do sinal aqui para confirmar meu horário!",
    ]
      .filter(Boolean)
      .join("\n");
    return `https://api.whatsapp.com/send?phone=${PIX_CONFIG.whatsappPhone}&text=${encodeURIComponent(text)}`;
  });

  let cardWhatsAppUrl = $derived.by(() => {
    const text = [
      "Olá, Thais! Acabei de pagar o sinal pelo cartão de crédito na Beauty Room.",
      "",
      `*Cliente:* ${clientName}`,
      `*Procedimento:* ${currentService.name}`,
      `*Data:* ${formattedDateStr} às ${selectedTime}`,
      `*Valor Total:* R$ ${priceTotal.toFixed(2).replace(".", ",")}`,
      `*Sinal Pago no Cartão:* R$ ${priceSinal.toFixed(2).replace(".", ",")} (ID: ${cardApprovedId || "MP"})`,
      `*Saldo a pagar no dia:* R$ ${priceBalance.toFixed(2).replace(".", ",")}`,
      "",
      "Poderia me confirmar o agendamento? Aguardo as orientações!",
    ].join("\n");
    return `https://api.whatsapp.com/send?phone=${PIX_CONFIG.whatsappPhone}&text=${encodeURIComponent(text)}`;
  });

  let calendarDays = $derived.by(() => {
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();
    const firstDayIndex = new Date(year, month, 1).getDay();
    const adjustedFirstDay = firstDayIndex === 0 ? 6 : firstDayIndex - 1;
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const days: Array<{
      day: number;
      date: Date;
      isPast: boolean;
      isClosed: boolean;
      isSelected: boolean;
    }> = [];

    for (let day = 1; day <= daysInMonth; day++) {
      const d = new Date(year, month, day);
      const isPast = d < today;
      // Aberto todos os dias (inclusive segundas e domingos)
      const isClosed = false;
      const isSelected =
        !!selectedDate && d.toDateString() === selectedDate.toDateString();
      days.push({ day, date: d, isPast, isClosed, isSelected });
    }
    return { adjustedFirstDay, days };
  });
</script>

{#if isOpen}
  <div
    class="booking-modal open"
    role="dialog"
    aria-modal="true"
    transition:fade={{ duration: 250 }}
  >
    <button
      type="button"
      class="booking-backdrop"
      onclick={closeModal}
      aria-label="Fechar"
    ></button>
    <div
      class="booking-dialog"
      transition:scale={{ start: 0.96, duration: 300 }}
    >
      <button class="booking-close" onclick={closeModal} aria-label="Fechar">
        <X size={18} />
      </button>

      <!-- Header & Stepper -->
      <div class="booking-header">
        <div class="booking-kicker">BEAUTY ROOM · AGENDAMENTO ONLINE</div>
        <h2>Reserve seu <em>horário</em></h2>
        <p>
          Garanta seu atendimento de forma rápida com confirmação de horário e
          sinal de 30%.
        </p>

        <div class="booking-stepper">
          <div
            class="step-node {currentStep === 1 ? 'active' : ''} {currentStep >
            1
              ? 'completed'
              : ''}"
          >
            <span class="step-num">{currentStep > 1 ? "✓" : "1"}</span>
            <span class="step-label">Procedimento</span>
          </div>
          <div class="step-track"></div>
          <div
            class="step-node {currentStep === 2 ? 'active' : ''} {currentStep >
            2
              ? 'completed'
              : ''}"
          >
            <span class="step-num">{currentStep > 2 ? "✓" : "2"}</span>
            <span class="step-label">Google Agenda</span>
          </div>
          <div class="step-track"></div>
          <div
            class="step-node {currentStep === 3 ? 'active' : ''} {currentStep >
            3
              ? 'completed'
              : ''}"
          >
            <span class="step-num">{currentStep > 3 ? "✓" : "3"}</span>
            <span class="step-label">Seus Dados</span>
          </div>
          <div class="step-track"></div>
          <div class="step-node {currentStep === 4 ? 'active' : ''}">
            <span class="step-num">4</span>
            <span class="step-label">Sinal (30%)</span>
          </div>
        </div>
      </div>

      <!-- Corpo do Modal com Animações Svelte -->
      <div class="booking-body">
        <!-- ETAPA 1: Procedimentos Organizados por Categorias Interativas -->
        {#if currentStep === 1}
          <div class="booking-step" in:fly={{ x: 20, duration: 280 }}>
            <div class="step-intro">
              <h3>1. Escolha a categoria e o procedimento</h3>
              <p>
                Toque nas categorias para expandir os procedimentos e selecione
                o serviço desejado.
              </p>
            </div>

            <!-- Grade dos 4 Botões Flutuantes Principais -->
            <div class="categories-accordion-list">
              {#each CATEGORIES as cat}
                {@const isCombo = !cat.isExpandable}
                {@const isExpanded = expandedCategory === cat.id}
                {@const isSelectedDirect =
                  isCombo && selectedServiceId === cat.directServiceId}
                {@const hasSelectedChild = cat.services.some(
                  (s) => s.id === selectedServiceId,
                )}

                <div
                  class="category-block {isExpanded ? 'expanded' : ''} {isCombo
                    ? 'combo-block'
                    : ''} {isSelectedDirect || hasSelectedChild
                    ? 'has-selection'
                    : ''}"
                >
                  <!-- Botão Flutuante Interativo -->
                  <button
                    type="button"
                    class="category-float-btn {isSelectedDirect
                      ? 'selected-combo'
                      : ''}"
                    onclick={() =>
                      toggleCategory(
                        cat.id,
                        cat.isExpandable,
                        cat.directServiceId,
                      )}
                  >
                    <div class="cat-btn-left">
                      <span class="cat-icon-badge">{cat.icon}</span>
                      <div class="cat-info">
                        <div class="cat-title-row">
                          <h4 class="cat-title">{cat.title}</h4>
                        </div>
                        <span class="cat-sub">{cat.subtitle}</span>
                      </div>
                    </div>

                    <div class="cat-btn-right">
                      {#if isCombo}
                        <div class="combo-direct-price">
                          <span class="combo-pill">SELEÇÃO DIRETA</span>
                          <span class="combo-price-val">R$ 180</span>
                          <span class="combo-sinal-tag">Sinal R$ 54</span>
                        </div>
                      {:else}
                        <div class="cat-toggle-action">
                          <span class="cat-count-pill"
                            >{cat.services.length} opções</span
                          >
                          <span class="cat-chevron">
                            {#if isExpanded}
                              <ChevronUp size={16} />
                            {:else}
                              <ChevronDown size={16} />
                            {/if}
                          </span>
                        </div>
                      {/if}
                    </div>
                  </button>

                  <!-- Painel Expansível dos Procedimentos com transição suave -->
                  {#if isExpanded && cat.isExpandable}
                    <div
                      class="category-items-panel"
                      transition:slide={{ duration: 320, easing: cubicOut }}
                    >
                      <div class="category-items-grid">
                        {#each cat.services as service}
                          {@const isSelected = selectedServiceId === service.id}
                          <label
                            class="service-item-card {isSelected
                              ? 'selected'
                              : ''}"
                          >
                            <input
                              type="radio"
                              name="bookingService"
                              value={service.id}
                              checked={isSelected}
                              onchange={() => (selectedServiceId = service.id)}
                            />
                            <div class="item-card-inner">
                              <div class="item-card-header">
                                <div class="item-name-wrap">
                                  <span class="item-symbol"
                                    >{service.symbol || "✦"}</span
                                  >
                                  <span class="item-name">{service.name}</span>
                                </div>
                                {#if service.badge}
                                  <span class="item-badge">{service.badge}</span
                                  >
                                {/if}
                              </div>

                              {#if service.description}
                                <p class="item-desc">{service.description}</p>
                              {/if}

                              <div class="item-footer">
                                <span class="item-duration"
                                  ><Clock size={12} /> {service.duration}</span
                                >
                                <div class="item-pricing">
                                  <span class="item-total"
                                    >Total: <b
                                      >R$ {service.price
                                        .toFixed(2)
                                        .replace(".", ",")}</b
                                    ></span
                                  >
                                  <span class="item-sinal"
                                    >Sinal (30%): <b
                                      >R$ {service.sinal
                                        .toFixed(2)
                                        .replace(".", ",")}</b
                                    ></span
                                  >
                                </div>
                              </div>
                            </div>
                          </label>
                        {/each}
                      </div>
                    </div>
                  {/if}
                </div>
              {/each}
            </div>

            <div class="booking-footer">
              <div class="selected-summary-indicator">
                <span class="indicator-label">Selecionado:</span>
                <span class="indicator-name"
                  ><b>{currentService.name}</b> (R$ {priceTotal
                    .toFixed(2)
                    .replace(".", ",")})</span
                >
              </div>
              <button
                type="button"
                class="btn-step btn-next"
                onclick={nextStep}
              >
                Continuar para Data e Horário <ArrowRight size={14} />
              </button>
            </div>
          </div>
        {/if}

        <!-- ETAPA 2: Google Agenda -->
        {#if currentStep === 2}
          <div class="booking-step" in:fly={{ x: 20, duration: 280 }}>
            <div class="step-intro">
              <h3>2. Selecione a data e o horário desejado</h3>
              <p>Horários integrados com a Google Agenda oficial do estúdio.</p>
            </div>

            <div class="calendar-layout">
              <div class="cal-box">
                <div class="cal-nav">
                  <button
                    type="button"
                    onclick={() =>
                      (viewDate = new Date(
                        viewDate.getFullYear(),
                        viewDate.getMonth() - 1,
                        1,
                      ))}>‹</button
                  >
                  <span
                    >{MONTHS_PT[viewDate.getMonth()]}
                    {viewDate.getFullYear()}</span
                  >
                  <button
                    type="button"
                    onclick={() =>
                      (viewDate = new Date(
                        viewDate.getFullYear(),
                        viewDate.getMonth() + 1,
                        1,
                      ))}>›</button
                  >
                </div>

                <div class="cal-weekdays">
                  {#each WEEKDAYS_PT as wd}
                    <span>{wd}</span>
                  {/each}
                </div>

                <div class="cal-grid">
                  {#each Array(calendarDays.adjustedFirstDay) as _}
                    <div class="cal-day empty"></div>
                  {/each}
                  {#each calendarDays.days as d}
                    <button
                      type="button"
                      class="cal-day {d.isSelected ? 'selected' : ''}"
                      disabled={d.isPast || d.isClosed}
                      onclick={() => {
                        selectedDate = d.date;
                        selectedTime = null;
                        fetchLiveGoogleSlots(d.date);
                      }}
                    >
                      {d.day}
                    </button>
                  {/each}
                </div>
              </div>

              <div class="slots-box">
                <h4>
                  <Clock
                    size={15}
                    style="vertical-align: middle; margin-right: 4px;"
                  />
                  {selectedDate
                    ? `${WEEKDAYS_PT[selectedDate.getDay()]}, ${String(selectedDate.getDate()).padStart(2, "0")}/${String(selectedDate.getMonth() + 1).padStart(2, "0")}`
                    : "Selecione uma data"}
                </h4>
                <div class="slots-grid">
                  {#if selectedDate}
                    {@const datePrefix = `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, "0")}-${String(selectedDate.getDate()).padStart(2, "0")}`}
                    {#each AVAILABLE_HOURS as hour}
                      {@const slotKey = `${datePrefix}_${hour}`}
                      {@const isOccupied =
                        bookedSlots.includes(slotKey) || isSlotGoogleBusy(hour)}
                      <button
                        type="button"
                        class="slot-btn {selectedTime === hour
                          ? 'active'
                          : ''} {isOccupied ? 'slot-occupied' : ''}"
                        disabled={isOccupied}
                        onclick={() => (selectedTime = hour)}
                      >
                        {hour}
                        {isOccupied ? "(Ocupado)" : ""}
                      </button>
                    {/each}
                  {/if}
                </div>
              </div>
            </div>

            <div class="booking-footer">
              <button
                type="button"
                class="btn-step btn-prev"
                onclick={prevStep}
              >
                <ArrowLeft size={14} /> Voltar
              </button>
              <button
                type="button"
                class="btn-step btn-next"
                disabled={!selectedTime}
                onclick={nextStep}
              >
                Continuar para Seus Dados <ArrowRight size={14} />
              </button>
            </div>
          </div>
        {/if}

        <!-- ETAPA 3: Dados de Contato -->
        {#if currentStep === 3}
          <div class="booking-step" in:fly={{ x: 20, duration: 280 }}>
            <div class="step-intro">
              <h3>3. Informe seus dados de contato</h3>
              <p>
                Seus dados são usados exclusivamente para confirmação do horário
                e envio do comprovante.
              </p>
            </div>

            <form
              class="client-form"
              onsubmit={(e) => {
                e.preventDefault();
                nextStep();
              }}
            >
              <div class="form-grid">
                <div class="form-field">
                  <label for="clientName">Seu nome completo *</label>
                  <input
                    type="text"
                    id="clientName"
                    bind:value={clientName}
                    placeholder="Ex: Mariana Silva"
                    required
                  />
                </div>
                <div class="form-field">
                  <label for="clientPhone">Seu WhatsApp *</label>
                  <input
                    type="tel"
                    id="clientPhone"
                    value={clientPhone}
                    oninput={handlePhoneInput}
                    placeholder="(11) 98481-4153"
                    required
                  />
                </div>
              </div>

              <div class="form-grid">
                <div class="form-field">
                  <label for="clientEmail"
                    >Seu E-mail * <small>(para envio do comprovante)</small
                    ></label
                  >
                  <input
                    type="email"
                    id="clientEmail"
                    bind:value={clientEmail}
                    placeholder="mariana@exemplo.com"
                    required
                  />
                </div>
                <div class="form-field">
                  <label for="clientCpf"
                    >Seu CPF * <small>(exigido pelo banco)</small></label
                  >
                  <input
                    type="text"
                    id="clientCpf"
                    value={clientCpf}
                    oninput={handleCpfInput}
                    placeholder="000.000.000-00"
                    required
                  />
                </div>
              </div>

              <div class="form-field">
                <label for="clientNotes"
                  >Observações ou dúvidas (opcional)</label
                >
                <textarea
                  id="clientNotes"
                  bind:value={clientNotes}
                  rows="2"
                  placeholder="Ex: Primeira vez no estúdio..."></textarea>
              </div>

              <div class="sinal-box">
                <div class="sinal-icon"><Sparkles size={18} /></div>
                <div class="sinal-text">
                  <strong>Garantia com Sinal de 30%:</strong>
                  <p>
                    Solicitamos um <b>sinal de 30%</b> na próxima tela (PIX ou Cartão
                    de Crédito). O saldo restante (70%) é pago tranquilamente no
                    estúdio.
                  </p>
                </div>
              </div>

              <div class="booking-footer">
                <button
                  type="button"
                  class="btn-step btn-prev"
                  onclick={prevStep}
                >
                  <ArrowLeft size={14} /> Voltar
                </button>
                <button type="submit" class="btn-step btn-next">
                  Garantir Horário (30% de Sinal) <ArrowRight size={14} />
                </button>
              </div>
            </form>
          </div>
        {/if}

        <!-- ETAPA 4: Checkout PIX ou Cartão -->
        {#if currentStep === 4}
          <div class="booking-step" in:fly={{ x: 20, duration: 280 }}>
            <div class="step-intro">
              <h3>4. Garanta seu horário com o sinal de 30%</h3>
              <p>
                Escolha a forma de pagamento do sinal para confirmar e travar
                sua vaga.
              </p>
            </div>

            <!-- Abas PIX vs Cartão -->
            <div class="payment-tabs">
              <button
                type="button"
                class="payment-tab {paymentMethod === 'pix' ? 'active' : ''}"
                onclick={() => (paymentMethod = "pix")}
              >
                <QrCode size={18} />
                <span>Pagar com PIX</span>
                <small>Aprovação Imediata</small>
              </button>
              <button
                type="button"
                class="payment-tab {paymentMethod === 'card' ? 'active' : ''}"
                onclick={() => (paymentMethod = "card")}
              >
                <CreditCard size={18} />
                <span>Cartão de Crédito</span>
                <small>Mercado Pago</small>
              </button>
            </div>

            <!-- Resumo Financeiro -->
            <div class="resumo-box">
              <div class="resumo-line">
                <span>Procedimento:</span> <b>{currentService.name}</b>
              </div>
              <div class="resumo-line">
                <span>Data & Horário:</span>
                <b>{formattedDateStr} às {selectedTime}</b>
              </div>
              <div class="resumo-line">
                <span>Cliente:</span> <b>{clientName}</b>
              </div>
              <div class="resumo-line">
                <span>Google Agenda:</span>
                <b style="color: #2b7a4b;">📅 Registrado ✓</b>
              </div>
              <div class="resumo-sep"></div>
              <div class="resumo-line">
                <span>Valor Total:</span>
                <span>R$ {priceTotal.toFixed(2).replace(".", ",")}</span>
              </div>
              <div class="resumo-line highlight">
                <span>Sinal de Reserva (30%):</span>
                <b>R$ {priceSinal.toFixed(2).replace(".", ",")}</b>
              </div>
              <div class="resumo-line">
                <span>Saldo no estúdio (70%):</span>
                <span>R$ {priceBalance.toFixed(2).replace(".", ",")}</span>
              </div>
            </div>

            <!-- ABA 1: PIX -->
            {#if paymentMethod === "pix"}
              <div class="pix-view" in:fade={{ duration: 200 }}>
                <div class="qr-box">
                  <img
                    src="https://api.qrserver.com/v1/create-qr-code/?size=220x220&margin=8&data={encodeURIComponent(
                      pixPayload,
                    )}"
                    alt="QR Code PIX"
                    onload={() => (qrLoading = false)}
                  />
                  <span>Aponte a câmera no app do seu banco</span>
                </div>

                <div class="copiacola-box">
                  <label for="copiacolaInput"
                    >Ou use o <b>PIX Copia e Cola</b>:</label
                  >
                  <div class="copiacola-row">
                    <input
                      id="copiacolaInput"
                      type="text"
                      readonly
                      value={pixPayload}
                    />
                    <button type="button" onclick={copyPix}>
                      {#if isCopied}
                        <Check size={14} /> Copiado!
                      {:else}
                        <Copy size={14} /> Copiar
                      {/if}
                    </button>
                  </div>
                  <small
                    >Favorecido: <b>Thais Leite Pessoa</b> · Chave:
                    <b>(11) 98481-4153</b></small
                  >
                </div>

                <div class="whatsapp-card">
                  <p>
                    Após pagar o sinal no app do seu banco, envie o comprovante
                    no WhatsApp do estúdio para validar seu agendamento:
                  </p>
                  <a
                    href={pixWhatsAppUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    class="btn-whatsapp"
                  >
                    <Send size={15} /> Já fiz o PIX · Enviar comprovante no WhatsApp
                    ↗
                  </a>
                </div>

                <div class="voucher-link-row">
                  <a
                    href={bookingVoucherUrl}
                    target="_blank"
                    class="btn-voucher-view"
                  >
                    <FileText size={15} /> Ver Comprovante Online Completo
                  </a>
                </div>
              </div>
            {/if}

            <!-- ABA 2: Cartão de Crédito -->
            {#if paymentMethod === "card"}
              <div class="card-view" in:fade={{ duration: 200 }}>
                <div class="secure-tag">
                  <Shield size={14} /> Pagamento Criptografado via Mercado Pago
                </div>
                <form
                  class="card-form"
                  onsubmit={(e) => {
                    e.preventDefault();
                    processCard();
                  }}
                >
                  <div class="form-field">
                    <label for="cardNum">Número do Cartão *</label>
                    <input
                      id="cardNum"
                      type="text"
                      value={cardNumber}
                      oninput={handleCardNumberInput}
                      placeholder="0000 0000 0000 0000"
                      maxlength="19"
                      required
                    />
                  </div>

                  <div class="form-field">
                    <label for="cardName">Nome impresso no Cartão *</label>
                    <input
                      id="cardName"
                      type="text"
                      bind:value={cardholderName}
                      placeholder="Ex: MARIANA SILVA"
                      required
                    />
                  </div>

                  <div class="form-grid">
                    <div class="form-field">
                      <label for="cardExp">Validade (MM/AA) *</label>
                      <input
                        id="cardExp"
                        type="text"
                        value={cardExp}
                        oninput={handleCardExpInput}
                        placeholder="MM/AA"
                        maxlength="5"
                        required
                      />
                    </div>
                    <div class="form-field">
                      <label for="cardCvv">CVV / Cód. Segurança *</label>
                      <input
                        id="cardCvv"
                        type="password"
                        bind:value={cardCvv}
                        placeholder="123"
                        maxlength="4"
                        required
                      />
                    </div>
                  </div>

                  <div class="form-field">
                    <label for="cardInstallments">Parcelas *</label>
                    <select id="cardInstallments" bind:value={installments}>
                      {#each installmentOptions as opt}
                        <option value={String(opt.installments)}
                          >{opt.recommended_message}</option
                        >
                      {/each}
                    </select>
                  </div>

                  {#if cardMessage}
                    <div class="card-msg {cardMessage.type}">
                      {cardMessage.text}
                    </div>
                  {/if}

                  {#if !cardApprovedId}
                    <button
                      type="submit"
                      class="btn-pay-card"
                      disabled={isProcessingCard}
                    >
                      {isProcessingCard
                        ? "Processando pagamento..."
                        : `Pagar Sinal de R$ ${priceSinal.toFixed(2).replace(".", ",")} no Cartão`}
                    </button>
                  {/if}
                </form>

                {#if cardApprovedId}
                  <div class="whatsapp-card" style="margin-top: 20px;">
                    <p>
                      🎉 <b>Pagamento Aprovado!</b> Clique no botão abaixo para enviar
                      os detalhes no WhatsApp do estúdio:
                    </p>
                    <a
                      href={cardWhatsAppUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      class="btn-whatsapp"
                    >
                      <Send size={15} /> Enviar Confirmação do Cartão no WhatsApp
                      ↗
                    </a>
                  </div>
                  <div class="voucher-link-row">
                    <a
                      href={bookingVoucherUrl}
                      target="_blank"
                      class="btn-voucher-view"
                    >
                      <FileText size={15} /> Ver Comprovante Online Completo
                    </a>
                  </div>
                {/if}
              </div>
            {/if}

            <div class="booking-footer">
              <button
                type="button"
                class="btn-step btn-prev"
                onclick={prevStep}
              >
                <ArrowLeft size={14} /> Alterar dados
              </button>
              <button
                type="button"
                class="btn-step btn-close"
                onclick={closeModal}
              >
                Concluir & Fechar
              </button>
            </div>
          </div>
        {/if}
      </div>
    </div>
  </div>
{/if}

<style>
  .booking-modal {
    position: fixed;
    inset: 0;
    z-index: 1000;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
  }
  .booking-backdrop {
    position: absolute;
    inset: 0;
    background: rgba(46, 31, 23, 0.75);
    backdrop-filter: blur(8px);
    border: none;
    cursor: pointer;
  }
  .booking-dialog {
    position: relative;
    width: 100%;
    max-width: 820px;
    max-height: 90vh;
    background: var(--ivory);
    border: 1px solid var(--gold-light);
    box-shadow: 0 30px 80px rgba(62, 42, 32, 0.35);
    display: flex;
    flex-direction: column;
    overflow: hidden;
    z-index: 2;
    border-radius: 8px;
  }
  .booking-close {
    position: absolute;
    top: 16px;
    right: 18px;
    width: 34px;
    height: 34px;
    background: var(--ivory);
    border: 1px solid var(--line);
    border-radius: 50%;
    cursor: pointer;
    display: grid;
    place-content: center;
    z-index: 10;
    color: var(--espresso);
    transition: all 0.2s;
  }
  .booking-close:hover {
    background: var(--sand);
  }

  .booking-header {
    padding: 28px 34px 20px;
    background: var(--cream);
    border-bottom: 1px solid var(--line);
  }
  .booking-kicker {
    font-size: 8.5px;
    letter-spacing: 2.8px;
    font-weight: 700;
    color: var(--brown);
    margin-bottom: 6px;
  }
  .booking-header h2 {
    font:
      500 clamp(24px, 3vw, 34px) / 1.15 "Playfair Display",
      serif;
    color: var(--espresso);
    margin: 0 0 6px;
  }
  .booking-header p {
    color: var(--muted);
    font-size: 11.5px;
    margin: 0 0 16px;
  }

  .booking-stepper {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .step-node {
    display: flex;
    align-items: center;
    gap: 8px;
    opacity: 0.5;
    transition: opacity 0.3s;
  }
  .step-node.active,
  .step-node.completed {
    opacity: 1;
  }
  .step-num {
    width: 24px;
    height: 24px;
    border-radius: 50%;
    background: var(--sand);
    color: var(--espresso);
    font-size: 10px;
    font-weight: 700;
    display: grid;
    place-content: center;
  }
  .step-node.active .step-num {
    background: var(--espresso);
    color: var(--ivory);
    border: 1px solid var(--gold);
  }
  .step-node.completed .step-num {
    background: var(--gold);
    color: white;
  }
  .step-label {
    font-size: 9.5px;
    text-transform: uppercase;
    letter-spacing: 1px;
    font-weight: 600;
  }
  .step-track {
    flex: 1;
    height: 1px;
    background: var(--line);
    margin: 0 10px;
  }

  .booking-body {
    padding: 24px 34px 28px;
    overflow-y: auto;
    max-height: calc(90vh - 180px);
  }
  .step-intro {
    margin-bottom: 20px;
  }
  .step-intro h3 {
    font:
      500 18px "Playfair Display",
      serif;
    color: var(--espresso);
    margin: 0 0 4px;
  }
  .step-intro p {
    color: var(--muted);
    font-size: 11px;
    margin: 0;
  }

  /* Acordeão de Categorias e Botões Flutuantes Interativos (Visual Fluido & Orgânico) */
  .categories-accordion-list {
    display: flex;
    flex-direction: column;
    gap: 14px;
    margin-bottom: 24px;
  }

  .category-block {
    background: linear-gradient(
      145deg,
      #ffffff 0%,
      rgba(255, 252, 248, 0.95) 100%
    );
    border: 1px solid rgba(189, 150, 94, 0.22);
    border-radius: 14px;
    overflow: hidden;
    transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1);
    box-shadow:
      0 6px 20px rgba(62, 42, 32, 0.04),
      0 1px 3px rgba(189, 150, 94, 0.08);
  }

  .category-block:hover {
    border-color: rgba(189, 150, 94, 0.45);
    box-shadow:
      0 10px 28px rgba(62, 42, 32, 0.07),
      0 2px 6px rgba(189, 150, 94, 0.12);
    transform: translateY(-2px);
  }

  .category-block.has-selection {
    border-color: var(--gold);
    box-shadow:
      0 8px 28px rgba(189, 150, 94, 0.22),
      0 2px 8px rgba(189, 150, 94, 0.15);
  }

  .category-block.expanded {
    border-color: rgba(189, 150, 94, 0.55);
    box-shadow:
      0 12px 36px rgba(62, 42, 32, 0.09),
      0 3px 10px rgba(189, 150, 94, 0.14);
    background: #ffffff;
  }

  .category-float-btn {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 18px 22px;
    background: transparent;
    border: none;
    cursor: pointer;
    text-align: left;
    transition: background 0.3s ease;
  }

  .category-float-btn:hover {
    background: rgba(248, 243, 236, 0.5);
  }

  .cat-btn-left {
    display: flex;
    align-items: center;
    gap: 15px;
  }

  .cat-icon-badge {
    width: 46px;
    height: 46px;
    border-radius: 50%;
    background: radial-gradient(
      circle at 30% 30%,
      #ffffff 0%,
      var(--ivory) 70%,
      var(--sand) 100%
    );
    border: 1.5px solid var(--gold-light);
    display: grid;
    place-content: center;
    font-size: 21px;
    box-shadow:
      0 4px 14px rgba(189, 150, 94, 0.18),
      inset 0 1px 2px #fff;
    flex-shrink: 0;
    transition:
      transform 0.3s cubic-bezier(0.16, 1, 0.3, 1),
      box-shadow 0.3s ease;
  }

  .category-block:hover .cat-icon-badge {
    transform: scale(1.06) rotate(3deg);
    box-shadow: 0 6px 18px rgba(189, 150, 94, 0.28);
  }

  .cat-info {
    display: flex;
    flex-direction: column;
    gap: 3px;
  }

  .cat-title-row {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .cat-title {
    font:
      600 15.5px "DM Sans",
      sans-serif;
    color: var(--espresso);
    margin: 0;
    letter-spacing: -0.2px;
  }

  .combo-pill {
    font-size: 7.5px;
    letter-spacing: 1.2px;
    font-weight: 700;
    color: #ffffff;
    background: linear-gradient(135deg, var(--gold) 0%, var(--brown) 100%);
    padding: 3px 9px;
    border-radius: 20px;
    box-shadow: 0 2px 6px rgba(189, 150, 94, 0.3);
  }

  .cat-sub {
    font-size: 11.5px;
    color: var(--muted);
  }

  .cat-btn-right {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .cat-toggle-action {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .cat-count-pill {
    font-size: 10px;
    color: var(--brown);
    background: rgba(189, 150, 94, 0.14);
    padding: 5px 12px;
    border-radius: 20px;
    font-weight: 600;
    letter-spacing: 0.3px;
  }

  .cat-chevron {
    color: var(--gold);
    display: flex;
    align-items: center;
    transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1);
  }

  .category-block.expanded .cat-chevron {
    transform: rotate(180deg);
  }

  /* Combo Direto Especial com Gradiente Glow Suave */
  .combo-block {
    background: linear-gradient(
      135deg,
      #ffffff 0%,
      rgba(255, 250, 244, 0.95) 50%,
      rgba(248, 243, 236, 0.9) 100%
    );
    border: 1.5px dashed var(--gold);
  }

  .combo-block:hover {
    border-color: var(--espresso);
    box-shadow: 0 10px 30px rgba(189, 150, 94, 0.22);
  }

  .category-float-btn.selected-combo {
    background: rgba(189, 150, 94, 0.12);
  }

  .combo-direct-price {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 2px;
  }

  .combo-price-val {
    font-size: 16px;
    font-weight: 700;
    color: var(--espresso);
  }

  .combo-sinal-tag {
    font-size: 9px;
    color: var(--brown);
    background: var(--ivory);
    border: 1px solid var(--gold-light);
    padding: 2px 7px;
    border-radius: 4px;
    font-weight: 600;
  }

  /* Painel Expansível de Serviços (Fluido com Fundo Suave) */
  .category-items-panel {
    border-top: 1px solid rgba(189, 150, 94, 0.15);
    background: linear-gradient(
      to bottom,
      rgba(248, 243, 236, 0.5) 0%,
      rgba(255, 252, 248, 0.8) 100%
    );
    padding: 18px 22px;
  }

  .category-items-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
  }

  .service-item-card {
    cursor: pointer;
    display: block;
  }

  .service-item-card input {
    position: absolute;
    opacity: 0;
    pointer-events: none;
  }

  .item-card-inner {
    background: #ffffff;
    border: 1px solid rgba(62, 42, 32, 0.1);
    border-radius: 10px;
    padding: 15px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    min-height: 115px;
    transition: all 0.28s cubic-bezier(0.16, 1, 0.3, 1);
    box-shadow: 0 2px 8px rgba(62, 42, 32, 0.03);
  }

  .service-item-card:hover .item-card-inner {
    border-color: var(--gold-light);
    transform: translateY(-2px);
    box-shadow: 0 6px 18px rgba(62, 42, 32, 0.06);
  }

  .service-item-card.selected .item-card-inner {
    border-color: var(--gold);
    box-shadow: 0 6px 20px rgba(189, 150, 94, 0.25);
    background: #fffdfa;
  }

  .item-card-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 8px;
    margin-bottom: 6px;
  }

  .item-name-wrap {
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .item-symbol {
    font-size: 13px;
  }

  .item-name {
    font-size: 12.5px;
    font-weight: 600;
    color: var(--espresso);
    line-height: 1.25;
  }

  .item-badge {
    font-size: 7.5px;
    letter-spacing: 1px;
    font-weight: 700;
    color: var(--gold);
    background: rgba(189, 150, 94, 0.1);
    padding: 2px 6px;
    border-radius: 4px;
    white-space: nowrap;
  }

  .item-desc {
    font-size: 10px;
    color: var(--muted);
    line-height: 1.45;
    margin: 0 0 10px;
  }

  .item-footer {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    border-top: 1px dashed rgba(62, 42, 32, 0.12);
    padding-top: 8px;
  }

  .item-duration {
    display: flex;
    align-items: center;
    gap: 4px;
    font-size: 9.5px;
    color: var(--muted);
  }

  .item-pricing {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 2px;
  }

  .item-total {
    font-size: 11.5px;
    color: var(--espresso);
  }

  .item-sinal {
    font-size: 9.5px;
    background: var(--espresso);
    color: var(--ivory);
    padding: 2px 6px;
    border-radius: 3px;
  }

  .item-sinal b {
    color: var(--gold-light);
  }

  .selected-summary-indicator {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 11.5px;
    color: var(--muted);
  }

  .selected-summary-indicator b {
    color: var(--espresso);
  }

  @media (max-width: 768px) {
    .category-items-grid {
      grid-template-columns: 1fr;
    }
    .category-float-btn {
      padding: 14px 16px;
      gap: 10px;
    }
    .cat-btn-left {
      gap: 12px;
      flex: 1;
      min-width: 0;
    }
    .cat-icon-badge {
      width: 38px;
      height: 38px;
      font-size: 18px;
    }
    .cat-title {
      font-size: 13.5px;
    }
    .cat-count-pill {
      display: none;
    }
    .combo-pill {
      display: inline-block;
      font-size: 7px;
      padding: 2px 6px;
    }
    .cat-title-row {
      flex-wrap: wrap;
      gap: 6px;
    }
    .combo-direct-price {
      flex-shrink: 0;
      margin-left: 8px;
    }
    .combo-price-val {
      font-size: 14.5px;
    }
    .combo-sinal-tag {
      font-size: 8.5px;
      padding: 2px 5px;
      white-space: nowrap;
    }
  }

  /* Calendário */
  .calendar-layout {
    display: grid;
    grid-template-columns: 1.2fr 0.8fr;
    gap: 20px;
    margin-bottom: 20px;
  }
  .cal-box {
    background: #fff;
    border: 1px solid var(--line);
    border-radius: 8px;
    padding: 16px;
  }
  .cal-nav {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;
    font-weight: 600;
    color: var(--espresso);
  }
  .cal-nav button {
    background: none;
    border: 1px solid var(--line);
    width: 28px;
    height: 28px;
    border-radius: 4px;
    cursor: pointer;
  }
  .cal-weekdays {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    text-align: center;
    font-size: 10px;
    color: var(--muted);
    margin-bottom: 8px;
  }
  .cal-grid {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 4px;
  }
  .cal-day {
    height: 34px;
    border: 1px solid transparent;
    background: none;
    border-radius: 4px;
    font-size: 12px;
    cursor: pointer;
    color: var(--espresso);
  }
  .cal-day:hover:not(:disabled) {
    border-color: var(--gold);
  }
  .cal-day.selected {
    background: var(--espresso);
    color: white;
    font-weight: 700;
  }
  .cal-day:disabled {
    color: #ccc;
    cursor: not-allowed;
  }

  .slots-box {
    background: #fff;
    border: 1px solid var(--line);
    border-radius: 8px;
    padding: 16px;
  }
  .slots-box h4 {
    margin: 0 0 12px;
    font-size: 13px;
    color: var(--espresso);
    display: flex;
    align-items: center;
  }
  .slots-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 8px;
  }
  .slot-btn {
    padding: 10px;
    border: 1px solid var(--line);
    background: var(--ivory);
    border-radius: 4px;
    cursor: pointer;
    font-size: 11.5px;
    font-weight: 600;
    color: var(--espresso);
  }
  .slot-btn.active {
    background: var(--gold);
    color: white;
    border-color: var(--gold);
  }
  .slot-btn.slot-occupied,
  .slot-btn:disabled {
    background: #f1ede6 !important;
    color: #a89f92 !important;
    cursor: not-allowed !important;
    text-decoration: line-through;
    opacity: 0.6;
  }

  /* Formulário de Contato */
  .form-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 14px;
    margin-bottom: 14px;
  }
  .form-field {
    display: flex;
    flex-direction: column;
    gap: 6px;
    margin-bottom: 12px;
  }
  .form-field label {
    font-size: 11px;
    font-weight: 600;
    color: var(--espresso);
  }
  .form-field input,
  .form-field textarea,
  .form-field select {
    padding: 10px 14px;
    border: 1px solid var(--line);
    border-radius: 6px;
    font-family: inherit;
    font-size: 13px;
    background: #fff;
  }
  .sinal-box {
    display: flex;
    gap: 12px;
    background: rgba(189, 150, 94, 0.1);
    border: 1px solid var(--gold-light);
    border-radius: 8px;
    padding: 14px;
    margin: 18px 0;
    font-size: 11.5px;
    color: var(--espresso);
  }

  /* Checkout Tabs */
  .payment-tabs {
    display: flex;
    gap: 12px;
    margin-bottom: 18px;
  }
  .payment-tab {
    flex: 1;
    padding: 14px;
    border: 2px solid var(--line);
    background: var(--ivory);
    border-radius: 8px;
    cursor: pointer;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 5px;
    font-weight: 600;
  }
  .payment-tab.active {
    border-color: var(--gold);
    background: #fff;
    color: var(--gold);
    box-shadow: 0 4px 14px rgba(189, 150, 94, 0.16);
  }
  .payment-tab small {
    font-size: 10px;
    color: var(--muted);
  }

  .resumo-box {
    background: #fff;
    border: 1px solid var(--line);
    border-radius: 8px;
    padding: 16px;
    margin-bottom: 20px;
    font-size: 12px;
  }
  .resumo-line {
    display: flex;
    justify-content: space-between;
    margin-bottom: 6px;
    color: var(--ink);
  }
  .resumo-line.highlight {
    color: var(--espresso);
    font-size: 13px;
    font-weight: 700;
  }
  .resumo-sep {
    height: 1px;
    background: var(--line);
    margin: 10px 0;
  }

  /* PIX */
  .pix-view {
    text-align: center;
  }
  .qr-box img {
    width: 180px;
    height: 180px;
    border: 1px solid var(--line);
    border-radius: 8px;
    padding: 6px;
    background: #fff;
  }
  .qr-box span {
    display: block;
    font-size: 11px;
    color: var(--muted);
    margin: 8px 0 16px;
  }
  .copiacola-row {
    display: flex;
    gap: 8px;
    max-width: 500px;
    margin: 8px auto 6px;
  }
  .copiacola-row input {
    flex: 1;
    padding: 8px 12px;
    font-size: 11px;
    border: 1px solid var(--line);
    border-radius: 4px;
  }
  .copiacola-row button {
    padding: 8px 16px;
    background: var(--espresso);
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 11px;
    font-weight: 600;
    display: inline-flex;
    align-items: center;
    gap: 5px;
  }

  /* Cartão */
  .secure-tag {
    text-align: center;
    font-size: 11px;
    color: #2b7a4b;
    background: rgba(43, 122, 75, 0.08);
    padding: 6px 14px;
    border-radius: 20px;
    display: inline-flex;
    align-items: center;
    gap: 6px;
    margin: 0 auto 16px;
  }
  .card-view {
    background: #fff;
    border: 1px solid var(--line);
    border-radius: 8px;
    padding: 20px;
  }
  .btn-pay-card {
    width: 100%;
    padding: 14px;
    background: var(--gold);
    color: white;
    border: none;
    border-radius: 6px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    margin-top: 10px;
  }
  .card-msg {
    padding: 10px;
    border-radius: 6px;
    text-align: center;
    font-size: 12px;
    margin: 10px 0;
  }
  .card-msg.success {
    background: rgba(43, 122, 75, 0.1);
    color: #2b7a4b;
  }
  .card-msg.error {
    background: rgba(200, 35, 51, 0.08);
    color: #c82333;
  }

  /* WhatsApp */
  .whatsapp-card {
    background: rgba(37, 211, 102, 0.08);
    border: 1px solid rgba(37, 211, 102, 0.3);
    border-radius: 8px;
    padding: 16px;
    text-align: center;
    margin-top: 18px;
  }
  .whatsapp-card p {
    font-size: 11.5px;
    color: var(--espresso);
    margin: 0 0 12px;
  }
  .btn-whatsapp {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    background: #25d366;
    color: white;
    padding: 12px 20px;
    border-radius: 50px;
    font-size: 12px;
    font-weight: 600;
    text-decoration: none;
  }

  .voucher-link-row {
    margin-top: 14px;
    text-align: center;
  }
  .btn-voucher-view {
    font-size: 11.5px;
    color: var(--brown);
    text-decoration: underline;
    display: inline-flex;
    align-items: center;
    gap: 6px;
  }

  /* Footer do Stepper */
  .booking-footer {
    display: flex;
    justify-content: space-between;
    margin-top: 24px;
    border-top: 1px solid var(--line);
    padding-top: 18px;
  }
  .btn-step {
    padding: 12px 20px;
    border-radius: 6px;
    font-size: 11px;
    font-weight: 600;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    gap: 8px;
  }
  .btn-prev {
    background: none;
    border: 1px solid var(--line);
    color: var(--espresso);
  }
  .btn-next {
    background: var(--espresso);
    color: white;
    border: none;
  }
  .btn-next:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  .btn-close {
    background: none;
    border: 1px solid var(--line);
  }

  @media (max-width: 768px) {
    .calendar-layout {
      grid-template-columns: 1fr;
    }
    .services-select-grid {
      grid-template-columns: 1fr;
    }
    .form-grid {
      grid-template-columns: 1fr;
    }
    .step-label {
      display: none;
    }
    .booking-body {
      padding: 18px 20px;
    }
  }
</style>
