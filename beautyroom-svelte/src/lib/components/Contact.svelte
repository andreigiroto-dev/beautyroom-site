<script lang="ts">
  let { onOpenBooking } = $props<{ onOpenBooking: (serviceId?: string) => void }>();
</script>

<section class="contact" id="contato">
  <div class="contact-inner">
    <div class="section-kicker">ATENDIMENTO PERSONALIZADO</div>
    <h2>Pronta para valorizar seu <em>olhar?</em></h2>
    <p>Agende seu horário com antecedência e garanta uma experiência única e exclusiva no nosso estúdio em Mauá.</p>
    <button type="button" class="button button-light" onclick={() => onOpenBooking('cilios')}>
      Reservar Meu Horário <span>↗</span>
    </button>
  </div>

  <div class="contact-meta">
    <span>BEAUTY ROOM · THAIS LEITE</span>
    <span>MAUÁ · SÃO PAULO</span>
    <span>WHATSAPP: (11) 98481-4153</span>
  </div>
</section>

<footer class="site-footer">
  <div class="brand brand-footer">
    <span class="brand-monogram">BR</span>
    <span class="brand-name">BEAUTY ROOM</span>
  </div>
  <span>© {new Date().getFullYear()} Beauty Room. Todos os direitos reservados.</span>
</footer>

<style>
  .contact { background: var(--espresso); color: var(--ivory); text-align: center; padding: 95px 7% 35px; }
  .contact .section-kicker { color: var(--gold-light); }
  .contact h2 { color: var(--ivory); margin: 23px 0 17px; font: 500 clamp(32px,4vw,52px)/1.12 "Playfair Display",serif; }
  .contact h2 em { color: var(--gold-light); }
  .contact-inner > p { color: #d4c5b8; font-size: 12.5px; margin-bottom: 28px; max-width: 480px; margin-left: auto; margin-right: auto; line-height: 1.8; }
  .button-light { background: var(--gold-light); color: var(--espresso); }
  .button-light:hover { background: #ead8b7; }
  .contact-meta { display: flex; justify-content: space-between; border-top: 1px solid rgba(255,255,255,.18); margin-top: 85px; padding-top: 20px; color: #d4c5b8; font-size: 8px; letter-spacing: 1.5px; }
  .site-footer { padding: 30px 7.2%; display: flex; align-items: center; justify-content: space-between; gap: 20px; background: var(--cream); color: var(--muted); font-size: 9px; }
  .brand-footer .brand-monogram { width: 36px; height: 36px; font-size: 19px; }
  .brand-footer .brand-name { font-size: 10px; }

  @media (max-width: 700px) {
    .contact-meta { flex-direction: column; gap: 12px; }
    .site-footer { flex-direction: column; text-align: center; }
  }
</style>
