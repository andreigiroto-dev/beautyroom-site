<script lang="ts">
  let { onOpenBooking } = $props<{ onOpenBooking: (serviceId?: string) => void }>();
</script>

<section class="hero" id="inicio">
  <div class="hero-copy">
    <div class="eyebrow">
      <span></span> Mauá · São Paulo
    </div>
    <h1>Realce seu olhar com <em>delicadeza</em> e precisão.</h1>
    <p class="hero-text">
      Especialista em extensão de cílios e design de sobrancelhas. Um atendimento
      personalizado, criado para valorizar os traços do seu rosto com naturalidade e conforto.
    </p>

    <div class="hero-actions">
      <button type="button" class="button button-dark" onclick={() => onOpenBooking('cilios')}>
        Agendar Horário <span>↗</span>
      </button>
      <a href="#galeria" class="text-link">Ver trabalhos <span>↓</span></a>
    </div>

    <div class="hero-note">
      <span class="note-star">★</span>
      <span>ATENDIMENTO EXCLUSIVO COM HORA MARCADA</span>
    </div>
  </div>

  <div class="hero-visual">
    <div class="hero-duo">
      <div class="hero-duo-panel hero-duo-main">
        <div class="hero-duo-bg hero-bg-main"></div>
        <div class="hero-duo-badge">
          <span>✧</span> BEAUTY ROOM
        </div>
      </div>

      <div class="hero-duo-blend">
        <div class="hero-duo-line"></div>
      </div>

      <a href="#galeria" class="hero-duo-panel hero-duo-portfolio">
        <div class="hero-duo-bg hero-bg-portfolio"></div>
        <div class="hero-duo-badge hero-duo-badge-portfolio">
          <span>✺</span> RESULTADOS REAIS <span>↓</span>
        </div>
      </a>
    </div>

    <div class="hero-stamp">
      BELEZA<br><i>pensada</i><br>PARA VOCÊ
    </div>

    <div class="photo-caption">
      <span>THAIS LEITE · MAUÁ SP</span>
      <span>ESTÚDIO PRIVATIVO</span>
    </div>
  </div>
</section>

<style>
  .hero { min-height: 650px; display: grid; grid-template-columns: 48% 52%; padding: 50px 7.2% 65px; background: var(--cream); }
  .hero-copy { align-self: center; padding: 35px 6% 35px 0; position: relative; }
  .hero h1 { margin: 25px 0 20px; font: 500 clamp(48px,5.5vw,78px)/.99 "Playfair Display",serif; letter-spacing: -2px; color: var(--espresso); }
  .hero-text { max-width: 410px; color: var(--muted); font-size: 13px; line-height: 2; }
  .hero-actions { display: flex; align-items: center; gap: 27px; flex-wrap: wrap; margin-top: 32px; }
  .hero-note { display: flex; align-items: center; gap: 12px; margin-top: 75px; color: var(--muted); font-size: 8px; letter-spacing: 2px; line-height: 1.7; }
  .note-star { color: var(--gold); font-size: 29px; }
  
  .hero-visual { min-height: 520px; position: relative; padding: 0 0 28px 28px; }
  .hero-duo { display: flex; height: 100%; min-height: 520px; position: relative; overflow: hidden; background: var(--sand); border: 1px solid var(--line); box-shadow: 0 20px 45px rgba(62,42,32,.08); }
  .hero-duo-panel { position: relative; flex: 1 1 50%; min-height: 520px; overflow: hidden; display: block; text-decoration: none; transition: flex .65s cubic-bezier(.22,1,.36,1), opacity .45s ease, filter .45s ease; }
  .hero-duo-portfolio { cursor: pointer; }
  .hero-duo-bg { position: absolute; inset: 0; background-size: cover; background-repeat: no-repeat; transition: transform .8s cubic-bezier(.22,1,.36,1), filter .5s ease; }
  .hero-bg-main { background-image: url("/assets/img/banner.jpg"); background-position: center 35%; }
  .hero-bg-portfolio { background-image: url("/assets/img/trabalho-01.jpg"); background-position: center 38%; }

  .hero-duo-blend { position: absolute; top: 0; bottom: 0; left: 50%; width: 84px; transform: translateX(-50%); z-index: 3; pointer-events: none; background: linear-gradient(90deg, rgba(248,243,236,0) 0%, rgba(248,243,236,.42) 28%, rgba(216,189,145,.55) 50%, rgba(248,243,236,.42) 72%, rgba(248,243,236,0) 100%); backdrop-filter: blur(5px); -webkit-backdrop-filter: blur(5px); transition: left .65s cubic-bezier(.22,1,.36,1), opacity .4s ease; }
  .hero-duo-line { position: absolute; top: 7%; bottom: 7%; left: 50%; width: 1px; transform: translateX(-50%); background: linear-gradient(to bottom, transparent 0%, rgba(189,150,94,.3) 15%, rgba(189,150,94,.95) 50%, rgba(189,150,94,.3) 85%, transparent 100%); box-shadow: 0 0 10px rgba(189,150,94,.4); }

  .hero-duo-main::after { content: ""; position: absolute; inset: 0; background: linear-gradient(to right, transparent 65%, rgba(248,243,236,.55) 100%); pointer-events: none; z-index: 2; }
  .hero-duo-portfolio::after { content: ""; position: absolute; inset: 0; background: linear-gradient(to left, transparent 65%, rgba(248,243,236,.55) 100%); pointer-events: none; z-index: 2; }

  .hero-duo-badge { position: absolute; bottom: 20px; left: 20px; z-index: 4; display: inline-flex; align-items: center; gap: 7px; background: rgba(255,250,244,.93); backdrop-filter: blur(10px); border: 1px solid var(--gold-light); color: var(--espresso); font-size: 8px; letter-spacing: 2px; font-weight: 600; padding: 7px 12px; pointer-events: none; }
  .hero-duo-badge span { color: var(--gold); font-size: 9px; }
  .hero-duo-badge-portfolio { left: auto; right: 20px; }

  .hero-duo:hover .hero-duo-panel:not(:hover) { flex: .78; opacity: .68; filter: grayscale(18%) contrast(.92); }
  .hero-duo-panel:hover { flex: 1.22; opacity: 1; filter: none; }
  .hero-duo-panel:hover .hero-duo-bg { transform: scale(1.05); }

  .photo-caption { position: absolute; bottom: 0; left: 28px; right: 0; display: flex; justify-content: space-between; padding: 11px 0 0; color: var(--muted); font-size: 8px; letter-spacing: 2px; }
  .hero-stamp { position: absolute; left: -24px; top: 45px; width: 105px; height: 105px; border-radius: 50%; background: var(--ivory); border: 1px solid var(--gold-light); display: grid; place-content: center; text-align: center; color: var(--brown); font-size: 9px; line-height: 1.5; letter-spacing: 2px; transform: rotate(-12deg); z-index: 5; }
  .hero-stamp i { font: italic 15px "Playfair Display",serif; letter-spacing: 0; }

  @media (max-width: 900px) {
    .hero { grid-template-columns: 1fr; padding: 40px 6%; }
    .hero-copy { padding: 0 0 35px; }
    .hero-visual { padding: 0; min-height: 400px; }
    .hero-stamp { display: none; }
  }
</style>
