<script lang="ts">
  import {
    CalendarCheck,
    CheckCircle2,
    Clock,
    MapPin,
    Share2,
    ArrowLeft,
    Sparkles,
    ShieldCheck
  } from 'lucide-svelte';
  import { page } from '$app/state';
  import { SERVICES } from '$lib/config';

  // Obtém os parâmetros da URL
  let bookingId = $derived(page.params.id);
  let serviceId = $derived(page.url.searchParams.get('servico') || 'cilios');
  let clientName = $derived(page.url.searchParams.get('cliente') || 'Cliente');
  let dateParam = $derived(page.url.searchParams.get('data') || 'Data a confirmar');
  let timeParam = $derived(page.url.searchParams.get('hora') || '14:00');
  let payMethod = $derived(page.url.searchParams.get('pagamento') || 'PIX');

  let service = $derived(SERVICES[serviceId] || SERVICES.cilios);
  let sinalPaid = $derived(service.sinal);
  let balanceToPay = $derived(service.price - sinalPaid);

  let isCopied = $state(false);

  function shareVoucher() {
    if (navigator.share) {
      navigator.share({
        title: 'Comprovante de Agendamento · Beauty Room',
        text: `Meu agendamento para ${service.name} no Beauty Room está confirmado para ${dateParam} às ${timeParam}!`,
        url: window.location.href
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      isCopied = true;
      setTimeout(() => (isCopied = false), 2500);
    }
  }
</script>

<svelte:head>
  <title>Comprovante de Agendamento #{bookingId} · Beauty Room</title>
</svelte:head>

<div class="voucher-wrapper">
  <div class="voucher-card">
    <div class="voucher-header">
      <div class="badge-success">
        <CheckCircle2 size={18} />
        <span>RESERVA CONFIRMADA</span>
      </div>
      <h2>Beauty Room</h2>
      <p class="voucher-sub">Beleza pensada para você</p>
      <div class="voucher-code">CÓDIGO: #{bookingId}</div>
    </div>

    <div class="voucher-body">
      <!-- Bloco de Procedimento e Horário -->
      <div class="highlight-block">
        <div class="icon-bubble">
          <Sparkles size={24} />
        </div>
        <div class="highlight-info">
          <h3>{service.name}</h3>
          <div class="meta-row">
            <span><CalendarCheck size={14} /> {dateParam}</span>
            <span><Clock size={14} /> {timeParam} ({service.duration})</span>
          </div>
        </div>
      </div>

      <!-- Detalhes do Cliente e Local -->
      <div class="info-group">
        <div class="info-row">
          <span class="label">Cliente:</span>
          <span class="val">{clientName}</span>
        </div>
        <div class="info-row">
          <span class="label">Local do Estúdio:</span>
          <span class="val"><MapPin size={13} style="vertical-align: middle;" /> Mauá, SP</span>
        </div>
        <div class="info-row">
          <span class="label">Forma do Sinal:</span>
          <span class="val">{payMethod.toUpperCase()} (Aprovado)</span>
        </div>
      </div>

      <div class="separator"></div>

      <!-- Resumo Financeiro -->
      <div class="financial-block">
        <div class="fin-row">
          <span>Valor Total do Procedimento:</span>
          <span>R$ {service.price.toFixed(2).replace('.', ',')}</span>
        </div>
        <div class="fin-row paid">
          <span>Sinal Pago (30% de Reserva):</span>
          <b>R$ {sinalPaid.toFixed(2).replace('.', ',')} ✓</b>
        </div>
        <div class="fin-row balance">
          <span>Saldo Restante a Pagar no Estúdio:</span>
          <span>R$ {balanceToPay.toFixed(2).replace('.', ',')}</span>
        </div>
      </div>

      <!-- Card de Orientações -->
      <div class="tip-card">
        <ShieldCheck size={18} class="tip-icon" />
        <div class="tip-text">
          <strong>Orientações para o seu atendimento:</strong>
          <p>Chegue com 5 a 10 minutos de antecedência. Não utilize rímel ou maquiagem nos olhos no dia da sessão.</p>
        </div>
      </div>

      <!-- Ações -->
      <div class="voucher-actions">
        <button type="button" class="btn-share" onclick={shareVoucher}>
          <Share2 size={16} />
          <span>{isCopied ? 'Link Copiado! ✓' : 'Compartilhar Comprovante'}</span>
        </button>
        <a href="/" class="btn-back">
          <ArrowLeft size={16} />
          <span>Voltar ao Início</span>
        </a>
      </div>
    </div>

    <div class="voucher-footer">
      <span>Beauty Room · Estúdio Exclusivo de Cílios e Sobrancelhas</span>
    </div>
  </div>
</div>

<style>
  .voucher-wrapper {
    min-height: 100vh;
    background: var(--cream);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 30px 16px;
    font-family: "DM Sans", sans-serif;
  }
  .voucher-card {
    width: 100%;
    max-width: 540px;
    background: #ffffff;
    border-radius: 14px;
    box-shadow: 0 20px 60px rgba(62,42,32,0.12);
    border: 1px solid var(--line);
    overflow: hidden;
  }
  .voucher-header {
    background: var(--espresso);
    color: var(--ivory);
    text-align: center;
    padding: 34px 20px 24px;
    position: relative;
  }
  .badge-success {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    background: #25D366;
    color: #ffffff;
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 1.5px;
    padding: 5px 14px;
    border-radius: 20px;
    margin-bottom: 14px;
  }
  .voucher-header h2 {
    font: 500 32px "Playfair Display", serif;
    margin: 0;
    color: var(--ivory);
  }
  .voucher-sub {
    font-size: 10px;
    letter-spacing: 2px;
    color: var(--gold-light);
    margin: 4px 0 14px;
    text-transform: uppercase;
  }
  .voucher-code {
    font-size: 11px;
    letter-spacing: 2px;
    color: #c5b5a7;
    border-top: 1px dashed rgba(255,255,255,0.2);
    padding-top: 12px;
    display: inline-block;
  }
  .voucher-body {
    padding: 28px;
  }
  .highlight-block {
    display: flex;
    align-items: center;
    gap: 16px;
    background: var(--ivory);
    border: 1px solid var(--gold-light);
    border-radius: 10px;
    padding: 16px;
    margin-bottom: 22px;
  }
  .icon-bubble {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    background: var(--espresso);
    color: var(--gold-light);
    display: grid;
    place-items: center;
    flex-shrink: 0;
  }
  .highlight-info h3 {
    margin: 0 0 6px;
    font: 500 18px "Playfair Display", serif;
    color: var(--espresso);
  }
  .meta-row {
    display: flex;
    gap: 14px;
    font-size: 11.5px;
    color: var(--muted);
    flex-wrap: wrap;
  }
  .meta-row span {
    display: inline-flex;
    align-items: center;
    gap: 5px;
  }
  .info-group {
    display: flex;
    flex-direction: column;
    gap: 10px;
    font-size: 12.5px;
  }
  .info-row {
    display: flex;
    justify-content: space-between;
  }
  .info-row .label {
    color: var(--muted);
  }
  .info-row .val {
    font-weight: 600;
    color: var(--espresso);
  }
  .separator {
    height: 1px;
    background: var(--line);
    margin: 20px 0;
  }
  .financial-block {
    background: var(--cream);
    border-radius: 8px;
    padding: 14px 16px;
    display: flex;
    flex-direction: column;
    gap: 8px;
    font-size: 12px;
  }
  .fin-row {
    display: flex;
    justify-content: space-between;
    color: var(--ink);
  }
  .fin-row.paid {
    color: #2b7a4b;
    font-size: 12.5px;
  }
  .fin-row.balance {
    font-weight: 600;
    color: var(--espresso);
    border-top: 1px dashed var(--line);
    padding-top: 8px;
    margin-top: 4px;
  }
  .tip-card {
    display: flex;
    gap: 12px;
    background: rgba(189,150,94,0.1);
    border: 1px solid var(--gold-light);
    border-radius: 8px;
    padding: 14px;
    margin: 22px 0;
    font-size: 11px;
    color: var(--espresso);
  }
  .tip-text strong {
    display: block;
    margin-bottom: 3px;
  }
  .tip-text p {
    margin: 0;
    color: var(--muted);
    line-height: 1.5;
  }
  .voucher-actions {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  .btn-share {
    width: 100%;
    padding: 14px;
    background: var(--espresso);
    color: var(--ivory);
    border: none;
    border-radius: 8px;
    font-size: 12px;
    font-weight: 600;
    letter-spacing: 0.5px;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    transition: background 0.2s;
  }
  .btn-share:hover {
    background: var(--brown);
  }
  .btn-back {
    text-align: center;
    padding: 12px;
    font-size: 12px;
    color: var(--muted);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    transition: color 0.2s;
  }
  .btn-back:hover {
    color: var(--espresso);
  }
  .voucher-footer {
    text-align: center;
    background: var(--cream);
    border-top: 1px solid var(--line);
    padding: 14px;
    font-size: 10px;
    color: var(--muted);
  }
</style>
