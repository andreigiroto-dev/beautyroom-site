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
      <!-- [NOVO BOTÃO EM DESTAQUE - GLOW DOURADO EDITORIAL] -->
      <button type="button" class="hero-cta-glow" onclick={() => onOpenBooking('cilios')}>
        <span class="cta-glow-shine"></span>
        <div class="cta-glow-content">
          <span class="cta-glow-main">✨ Reservar Meu Horário <span class="cta-arrow">↗</span></span>
          <span class="cta-glow-sub">Vagas exclusivas · Sinal de 30%</span>
        </div>
      </button>
      <!-- [FIM NOVO BOTÃO] -->

      <!-- [BOTÃO ANTERIOR - DESCOMENTE SE PREFERIR VOLTAR AO MODELO CLÁSSICO]
      <button type="button" class="button button-dark" onclick={() => onOpenBooking('cilios')}>
        Agendar Horário <span>↗</span>
      </button>
      -->
      <a href="#galeria" class="text-link">Ver trabalhos <span>↓</span></a>
    </div>

    <!-- [INÍCIO: ILUSTRAÇÃO ANIMADA CÍLIOS PISCANDO - COMENTAR SE DESEJAR REMOVER] -->
    <div class="hero-lash-badge" aria-hidden="true" title="Beauty Room - Realce do Olhar">
      <div class="lash-visual-wrap">
        <svg class="lash-svg" viewBox="0 0 110 65" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="lashGoldGradSvelte" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#bd965e" />
              <stop offset="50%" stop-color="#d8bd91" />
              <stop offset="100%" stop-color="#765237" />
            </linearGradient>
          </defs>
          <path class="lash-eyelid" d="M10,42 Q55,14 100,42" stroke="url(#lashGoldGradSvelte)" stroke-width="2.5" stroke-linecap="round" fill="none" />
          <path class="lash-liner" d="M16,42 Q55,18 94,42" stroke="rgba(189,150,94,0.35)" stroke-width="1.2" stroke-linecap="round" fill="none" />
          <g class="lash-hairs" stroke="url(#lashGoldGradSvelte)" stroke-width="1.8" stroke-linecap="round">
            <path d="M22,38 Q20,29 17,24" />
            <path d="M30,32 Q28,21 24,15" />
            <path d="M40,27 Q39,14 36,8" />
            <path d="M50,24 Q50,9 49,3" />
            <path d="M60,24 Q62,9 65,4" />
            <path d="M70,27 Q74,13 79,9" />
            <path d="M80,32 Q86,21 93,17" />
            <path d="M88,37 Q95,28 102,26" />
            <path d="M94,40 Q101,35 106,34" />
          </g>
          <circle class="lash-sparkle sparkle-1" cx="95" cy="14" r="1.5" fill="#bd965e" />
          <circle class="lash-sparkle sparkle-2" cx="16" cy="18" r="1.2" fill="#d8bd91" />
        </svg>
      </div>
      <div class="lash-badge-text">
        <span class="lash-tag">CÍLIOS & OLHAR</span>
        <span class="lash-sub">Delicadeza em cada fio</span>
      </div>
    </div>
    <!-- [FIM: ILUSTRAÇÃO ANIMADA CÍLIOS PISCANDO] -->

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

  /* NOVO BOTÃO DESTAQUE HERO: GLOW DOURADO EDITORIAL */
  .hero-cta-glow {
    position: relative;
    display: inline-flex;
    align-items: center;
    padding: 16px 28px;
    background: linear-gradient(135deg, #bd965e 0%, #9e7640 100%);
    color: #ffffff !important;
    border-radius: 8px;
    border: 1px solid rgba(255, 255, 255, 0.25);
    cursor: pointer;
    overflow: hidden;
    box-shadow: 0 10px 28px rgba(189, 150, 94, 0.35);
    transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    text-align: left;
  }
  .hero-cta-glow:hover {
    transform: translateY(-3px) scale(1.02);
    box-shadow: 0 16px 36px rgba(189, 150, 94, 0.48);
    background: linear-gradient(135deg, #caa36b 0%, #ad8249 100%);
  }
  .cta-glow-content {
    display: flex;
    flex-direction: column;
    gap: 3px;
    z-index: 2;
  }
  .cta-glow-main {
    font-size: 13.5px;
    font-weight: 700;
    letter-spacing: 1px;
    display: inline-flex;
    align-items: center;
    gap: 8px;
    color: #ffffff;
  }
  .cta-glow-main .cta-arrow {
    color: #fffaf4;
    font-size: 14px;
    transition: transform 0.3s ease;
  }
  .hero-cta-glow:hover .cta-arrow {
    transform: translate(3px, -3px);
  }
  .cta-glow-sub {
    font-size: 9.5px;
    color: rgba(255, 255, 255, 0.85);
    letter-spacing: 0.5px;
    font-weight: 400;
  }
  .cta-glow-shine {
    position: absolute;
    top: 0;
    left: -100%;
    width: 60%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.35), transparent);
    transform: skewX(-20deg);
    animation: shimmerButton 4s infinite ease-in-out;
    pointer-events: none;
    z-index: 1;
  }
  @keyframes shimmerButton {
    0% { left: -100%; }
    25% { left: 160%; }
    100% { left: 160%; }
  }

  /* Ilustração Cílios Piscando */
  .hero-lash-badge {
    display: inline-flex;
    align-items: center;
    gap: 16px;
    margin-top: 28px;
    padding: 12px 20px 12px 14px;
    background: rgba(255, 250, 244, 0.72);
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
    border: 1px solid rgba(189, 150, 94, 0.35);
    border-radius: 40px;
    box-shadow: 0 8px 24px rgba(62, 42, 32, 0.05);
    transition: transform 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease;
    user-select: none;
  }
  .hero-lash-badge:hover {
    transform: translateY(-2px);
    border-color: #bd965e;
    box-shadow: 0 12px 28px rgba(189, 150, 94, 0.18);
  }
  .lash-visual-wrap {
    width: 58px;
    height: 34px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .lash-svg {
    width: 100%;
    height: 100%;
    overflow: visible;
    filter: drop-shadow(0 2px 4px rgba(189, 150, 94, 0.25));
  }
  .lash-eyelid,
  .lash-liner,
  .lash-hairs {
    transform-origin: 55px 42px;
    animation: eyeBlinkFlutter 4.2s infinite ease-in-out;
  }
  .lash-hairs {
    animation: lashFlutter 4.2s infinite ease-in-out;
  }
  .lash-sparkle {
    animation: sparkleTwinkle 3s infinite ease-in-out;
  }
  :global(.sparkle-2) {
    animation-delay: 1.5s;
  }
  .lash-badge-text {
    display: flex;
    flex-direction: column;
    gap: 2px;
    text-align: left;
  }
  .lash-tag {
    font-size: 8.5px;
    letter-spacing: 2.2px;
    font-weight: 700;
    color: #1a120c;
    text-transform: uppercase;
  }
  .lash-sub {
    font-size: 10px;
    color: #765237;
    font-style: italic;
    letter-spacing: 0.3px;
  }
  @keyframes eyeBlinkFlutter {
    0%, 82%, 100% {
      transform: scaleY(1);
    }
    86% {
      transform: scaleY(0.08);
    }
    89% {
      transform: scaleY(0.85);
    }
    92% {
      transform: scaleY(0.12);
    }
    96% {
      transform: scaleY(1);
    }
  }
  @keyframes lashFlutter {
    0%, 82%, 100% {
      transform: scaleY(1) rotate(0deg);
    }
    86% {
      transform: scaleY(0.15) rotate(-2deg);
    }
    89% {
      transform: scaleY(0.9) rotate(1deg);
    }
    92% {
      transform: scaleY(0.2) rotate(-1deg);
    }
    96% {
      transform: scaleY(1) rotate(0deg);
    }
  }
  @keyframes sparkleTwinkle {
    0%, 100% {
      opacity: 0.3;
      transform: scale(0.8);
    }
    50% {
      opacity: 1;
      transform: scale(1.3);
    }
  }
</style>
