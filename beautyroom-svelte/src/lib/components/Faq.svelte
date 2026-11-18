<script lang="ts">
  const faqs = [
    {
      q: 'Quanto tempo dura a extensão de cílios?',
      a: 'Em média de 15 a 21 dias até a necessidade de manutenção. O tempo exato varia de acordo com o ciclo natural dos seus fios e os cuidados diários em casa.'
    },
    {
      q: 'O procedimento dói ou danifica os cílios naturais?',
      a: 'Não! O procedimento é 100% indolor, relaxante e seguro. Utilizamos colas de padrão internacional e aplicamos fio a fio com isolamento rigoroso, preservando a saúde da raiz.'
    },
    {
      q: 'Como funciona a reserva com sinal de 30%?',
      a: 'O sinal de 30% garante e bloqueia com exclusividade o seu horário na Google Agenda do estúdio. Você pode pagar via PIX instantâneo ou no Cartão de Crédito. Os 70% restantes são pagos no dia do atendimento.'
    },
    {
      q: 'O que devo evitar antes e depois da sessão?',
      a: 'Antes da sessão, venha sem rímel ou maquiagem na região dos olhos. Nas primeiras 24h após a aplicação, evite molhar em água muito quente, vapores e produtos oleosos.'
    }
  ];

  let openIndex = $state<number | null>(null);

  function toggleFaq(index: number) {
    openIndex = openIndex === index ? null : index;
  }
</script>

<section class="section-wrap faq" id="duvidas">
  <div class="section-heading" style="justify-content: center; text-align: center; display: block;">
    <div class="section-kicker">TIRE SUAS DÚVIDAS</div>
    <h2>Perguntas <em>frequentes.</em></h2>
  </div>

  <div class="faq-list">
    {#each faqs as faq, i}
      <div class="faq-item {openIndex === i ? 'open' : ''}">
        <button type="button" class="faq-question" onclick={() => toggleFaq(i)}>
          <span>{faq.q}</span>
          <span class="faq-icon">{openIndex === i ? '−' : '+'}</span>
        </button>
        {#if openIndex === i}
          <div class="faq-answer">
            <p>{faq.a}</p>
          </div>
        {/if}
      </div>
    {/each}
  </div>
</section>

<style>
  .faq { background: var(--ivory); }
  .faq-list { max-width: 820px; margin: 30px auto 0; display: flex; flex-direction: column; gap: 14px; }
  .faq-item { border: 1px solid var(--line); background: var(--cream); border-radius: 4px; overflow: hidden; transition: border-color .25s, background .25s; }
  .faq-item.open { background: #fff; border-color: var(--gold-light); }
  .faq-question { width: 100%; display: flex; justify-content: space-between; align-items: center; padding: 20px 24px; cursor: pointer; border: 0; background: none; font-weight: 600; font-size: 13.5px; color: var(--espresso); text-align: left; }
  .faq-icon { font-size: 20px; color: var(--gold); font-weight: 300; }
  .faq-answer { padding: 0 24px 22px; color: var(--muted); font-size: 12.5px; line-height: 1.9; }
</style>
