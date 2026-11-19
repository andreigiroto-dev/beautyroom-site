/**
 * ============================================================================
 * GOOGLE APPS SCRIPT - BEAUTY ROOM (SINCRONIZAÇÃO BIDIRECIONAL GOOGLE AGENDA)
 * ============================================================================
 * Como instalar no Google Apps Script:
 * 1. Acesse https://script.google.com/
 * 2. Abra o projeto existente do webhook do Beauty Room.
 * 3. Substitua todo o conteúdo pelo código abaixo.
 * 4. Clique em "Implantar" (Deploy) > "Gerenciar Implantações" > Editar (ícone de lápis).
 * 5. Selecione "Nova versão" e clique em "Implantar".
 * ============================================================================
 */

// ID da Agenda do Google (use "primary" para a agenda padrão da conta)
const CALENDAR_ID = "primary";

/**
 * 1. GET: Consulta horários ocupados para uma data
 * Chamado pelo site quando a cliente clica em um dia no calendário.
 * Parâmetros esperados na URL: ?action=getBusySlots&date=YYYY-MM-DD
 */
function doGet(e) {
  try {
    const params = e ? e.parameter : {};
    const action = params.action || "getBusySlots";
    const dateStr = params.date; // formato: "YYYY-MM-DD"

    if (action === "getBusySlots" && dateStr) {
      const busySlots = getCalendarEventsForDate(dateStr);
      return createJsonResponse({
        status: "success",
        date: dateStr,
        busySlots: busySlots
      });
    }

    // Ping / Teste básico
    return createJsonResponse({
      status: "online",
      message: "API Google Calendar Beauty Room ativa."
    });

  } catch (error) {
    return createJsonResponse({
      status: "error",
      message: error.toString()
    });
  }
}

/**
 * 2. POST: Registra novo agendamento vindo do site
 * Cria o evento na Google Agenda oficial com detalhes da cliente e procedimento.
 */
function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const calendar = CalendarApp.getCalendarById(CALENDAR_ID) || CalendarApp.getDefaultCalendar();

    // Data e Hora do Agendamento
    // data.date: "YYYY-MM-DD", data.time: "HH:mm"
    const dateParts = data.date.split("-");
    const timeParts = data.time.split(":");
    const year = parseInt(dateParts[0], 10);
    const month = parseInt(dateParts[1], 10) - 1;
    const day = parseInt(dateParts[2], 10);
    const hours = parseInt(timeParts[0], 10);
    const minutes = parseInt(timeParts[1], 10);

    const startTime = new Date(year, month, day, hours, minutes, 0);
    const durationHours = parseFloat(data.durationHours) || 2.0;
    const endTime = new Date(startTime.getTime() + durationHours * 60 * 60 * 1000);

    // Monta Título e Descrição do Evento
    const title = `[Beauty Room] ${data.serviceName} - ${data.clientName}`;
    const description = 
      `✦ AGENDAMENTO CONFIRMADO - BEAUTY ROOM ✦\n\n` +
      `Cliente: ${data.clientName}\n` +
      `WhatsApp: ${data.clientPhone}\n` +
      `Procedimento: ${data.serviceName}\n` +
      `Duração Estimada: ${durationHours}h\n` +
      `Valor Total: R$ ${data.priceTotal}\n` +
      `Sinal Pago (30%): R$ ${data.sinalValue}\n` +
      `Saldo no Dia: R$ ${data.balanceValue}\n` +
      (data.clientNotes ? `Observações: ${data.clientNotes}\n` : "") +
      `\nOrigem: Site Beauty Room (Agendamento Automático)`;

    // Cria o Evento no Google Calendar
    const event = calendar.createEvent(title, startTime, endTime, {
      description: description
    });

    // Opcional: Define cor diferenciada no Google Calendar (Dourado/Banana: 5 ou Flamingo: 4)
    try {
      event.setColor("5");
    } catch(cErr) {}

    return createJsonResponse({
      status: "success",
      eventId: event.getId(),
      message: "Horário reservado com sucesso no Google Calendar."
    });

  } catch (error) {
    return createJsonResponse({
      status: "error",
      message: error.toString()
    });
  }
}

/**
 * Busca todos os eventos marcados no dia (manuais ou automáticos)
 * e retorna seus intervalos de horário (start e end em minutos desde 00:00).
 */
function getCalendarEventsForDate(dateStr) {
  const calendar = CalendarApp.getCalendarById(CALENDAR_ID) || CalendarApp.getDefaultCalendar();
  const parts = dateStr.split("-");
  const year = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10) - 1;
  const day = parseInt(parts[2], 10);

  const startOfDay = new Date(year, month, day, 0, 0, 0);
  const endOfDay = new Date(year, month, day, 23, 59, 59);

  const events = calendar.getEvents(startOfDay, endOfDay);
  const busySlots = [];

  for (let i = 0; i < events.length; i++) {
    const ev = events[i];
    // Se for evento de dia inteiro ou compromisso ativo
    if (ev.isAllDayEvent()) {
      busySlots.push({
        title: ev.getTitle(),
        allDay: true,
        startHour: "00:00",
        endHour: "23:59",
        startMinutes: 0,
        endMinutes: 1440
      });
    } else {
      const s = ev.getStartTime();
      const e = ev.getEndTime();
      
      const sH = Utilities.formatDate(s, "America/Sao_Paulo", "HH:mm");
      const eH = Utilities.formatDate(e, "America/Sao_Paulo", "HH:mm");
      const sMin = s.getHours() * 60 + s.getMinutes();
      const eMin = e.getHours() * 60 + e.getMinutes();

      busySlots.push({
        title: ev.getTitle(),
        allDay: false,
        startHour: sH,
        endHour: eH,
        startMinutes: sMin,
        endMinutes: eMin
      });
    }
  }

  return busySlots;
}

/**
 * Helper para resposta JSON com cabeçalhos apropriados
 */
function createJsonResponse(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
