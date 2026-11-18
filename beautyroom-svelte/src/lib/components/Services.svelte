<script lang="ts">
  import { SERVICES } from '$lib/config';
  let { onOpenBooking } = $props<{ onOpenBooking: (serviceId?: string) => void }>();
  const serviceList = Object.values(SERVICES);
</script>

<section class="section-wrap services" id="servicos">
  <div class="section-heading">
    <div>
      <div class="section-kicker">ATENDIMENTOS</div>
      <h2>Procedimentos <em>exclusivos.</em></h2>
    </div>
    <p>Técnicas modernas com produtos de alta qualidade para um resultado duradouro, seguro e sofisticado.</p>
  </div>

  <div class="service-grid">
    {#each serviceList as service, i}
      <article class="service-card {service.id === 'cilios' ? 'service-featured' : ''}">
        <div class="service-number">0{i + 1}</div>
        <div class="service-symbol">{service.symbol}</div>
        <h3>{service.name}</h3>
        <p>{service.description}</p>
        <div class="service-price-tag">
          A partir de <b>R$ {service.price.toFixed(2).replace('.', ',')}</b>
        </div>
        <button type="button" class="service-btn" onclick={() => onOpenBooking(service.id)}>
          Agendar <span>↗</span>
        </button>
      </article>
    {/each}
  </div>
  <p class="small-note">Disponibilidade e horários são confirmados diretamente no agendamento online com sinal de 30%.</p>
</section>

<style>
  .services { background: var(--cream); }
  .section-heading { display: flex; justify-content: space-between; align-items: end; gap: 35px; margin-bottom: 48px; }
  .section-heading h2 { font: 500 clamp(32px,3.8vw,50px)/1.12 "Playfair Display",serif; color: var(--espresso); margin-top: 15px; }
  .section-heading > p { max-width: 320px; color: var(--muted); font-size: 12px; line-height: 2; margin-bottom: 4px; }
  .service-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); border: 1px solid var(--line); background: var(--ivory); }
  .service-card { min-height: 290px; padding: 28px; position: relative; border-right: 1px solid var(--line); border-bottom: 1px solid var(--line); background: rgba(255,250,244,.42); transition: background .25s, transform .2s; display: flex; flex-direction: column; }
  .service-card:hover,.service-featured { background: var(--ivory); }
  .service-number { font-size: 9px; color: var(--gold); letter-spacing: 2px; }
  .service-symbol { font: 35px "Playfair Display",serif; color: var(--gold); margin: 20px 0 14px; }
  .service-card h3 { font: 500 20px "Playfair Display",serif; color: var(--espresso); margin-bottom: 10px; }
  .service-card p { color: var(--muted); font-size: 11px; line-height: 1.8; margin-bottom: 16px; flex: 1; }
  .service-price-tag { font-size: 11.5px; color: var(--espresso); margin-bottom: 14px; border-top: 1px dashed var(--line); padding-top: 10px; }
  .service-price-tag b { color: var(--gold); font-size: 13px; }
  .service-btn { background: none; border: 0; padding: 0; text-align: left; font-size: 9px; text-transform: uppercase; letter-spacing: 1.5px; border-bottom: 1px solid var(--gold-light); padding-bottom: 7px; cursor: pointer; color: var(--ink); }
  .service-btn span { color: var(--gold); margin-left: 10px; }

  @media (max-width: 800px) {
    .section-heading { display: block; }
    .section-heading > p { margin-top: 16px; }
  }
</style>
