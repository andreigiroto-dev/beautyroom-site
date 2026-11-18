<script lang="ts">
  let { onOpenBooking } = $props<{ onOpenBooking: (serviceId?: string) => void }>();
</script>

<section class="hero" id="inicio">
  <!-- [CAMADA ARTÍSTICA ORGÂNICA EM GOTAS/PETALS DOURADAS - COMENTAR SE DESEJAR REMOVER] -->
  <div class="hero-organic-layer" aria-hidden="true">
    <svg class="organic-art-svg" viewBox="0 0 1000 700" preserveAspectRatio="none" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="goldPetal1Svelte" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#bd965e" stop-opacity="0.32" />
          <stop offset="50%" stop-color="#d8bd91" stop-opacity="0.20" />
          <stop offset="100%" stop-color="#fffaf4" stop-opacity="0" />
        </linearGradient>
        <linearGradient id="goldPetal2Svelte" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="#765237" stop-opacity="0.25" />
          <stop offset="60%" stop-color="#bd965e" stop-opacity="0.14" />
          <stop offset="100%" stop-color="#f8f3ec" stop-opacity="0" />
        </linearGradient>
        <linearGradient id="goldPetal3Svelte" x1="100%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#d8bd91" stop-opacity="0.28" />
          <stop offset="100%" stop-color="#fffaf4" stop-opacity="0.03" />
        </linearGradient>
      </defs>

      <g class="petal-group-flow">
        <path d="M-80,-60 C80,30 180,180 120,340 C70,480 -40,510 -90,440 C-140,370 -160,100 -80,-60 Z" fill="url(#goldPetal1Svelte)" />
        <path d="M-20,-10 C90,80 230,190 280,320 C320,430 260,490 200,450 C140,410 70,260 -20,-10 Z" fill="url(#goldPetal2Svelte)" />
        <path d="M40,110 C160,170 240,270 230,370 C220,450 170,470 140,420 C100,350 70,220 40,110 Z" fill="url(#goldPetal3Svelte)" />
        <path d="M110,-40 C210,10 320,110 340,210 C360,280 310,310 270,280 C220,240 180,110 110,-40 Z" fill="url(#goldPetal1Svelte)" />
        <path d="M220,50 C280,90 320,150 310,190 C300,220 270,220 260,190 C240,150 220,90 220,50 Z" fill="url(#goldPetal2Svelte)" />
        <path d="M300,160 C360,190 390,240 370,270 C350,290 320,280 320,250 C320,220 310,180 300,160 Z" fill="url(#goldPetal3Svelte)" />
        <circle cx="150" cy="460" r="14" fill="url(#goldPetal1Svelte)" />
        <circle cx="210" cy="480" r="8" fill="url(#goldPetal2Svelte)" />
        <circle cx="260" cy="430" r="10" fill="url(#goldPetal3Svelte)" />
        <circle cx="340" cy="310" r="6" fill="url(#goldPetal1Svelte)" />
      </g>
    </svg>
  </div>
  <!-- [FIM: CAMADA ARTÍSTICA] -->

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
  .hero { 
    min-height: clamp(520px, 80vh, 720px); 
    display: grid; 
    grid-template-columns: 48% 52%; 
    padding: clamp(30px, 4vw, 55px) clamp(16px, 6vw, 7.2%) clamp(40px, 5vw, 65px); 
    background: var(--cream); 
    position: relative; 
    overflow: hidden; 
  }
  
  /* Camada Artística Orgânica Dourada */
  .hero-organic-layer {
    position: absolute;
    inset: 0;
    pointer-events: none;
    z-index: 1;
    overflow: hidden;
  }
  .organic-art-svg {
    width: 100%;
    height: 100%;
    opacity: 0.85;
  }
  .petal-group-flow {
    animation: organicDrift 14s ease-in-out infinite alternate;
    transform-origin: 10% 20%;
  }
  @keyframes organicDrift {
    0% {
      transform: scale(1) rotate(0deg) translate(0, 0);
    }
    50% {
      transform: scale(1.03) rotate(1deg) translate(8px, -5px);
    }
    100% {
      transform: scale(0.98) rotate(-1deg) translate(-4px, 6px);
    }
  }

  .hero-copy { 
    align-self: center; 
    padding: clamp(20px, 3vw, 35px) clamp(10px, 4vw, 6%) clamp(20px, 3vw, 35px) 0; 
    position: relative; 
    z-index: 2; 
  }
  .hero h1 { 
    margin: clamp(14px, 2.5vw, 25px) 0 clamp(12px, 2vw, 20px); 
    font: 500 clamp(36px, 5vw, 72px)/1.02 "Playfair Display", serif; 
    letter-spacing: -1.5px; 
    color: var(--espresso); 
    word-break: break-word;
  }
  .hero-text { 
    max-width: 420px; 
    color: var(--muted); 
    font-size: clamp(12px, 1.1vw, 13.5px); 
    line-height: 1.85; 
  }
  .hero-actions { 
    display: flex; 
    align-items: center; 
    gap: clamp(14px, 2vw, 27px); 
    flex-wrap: wrap; 
    margin-top: clamp(22px, 3vw, 32px); 
  }
  .hero-note { 
    display: flex; 
    align-items: center; 
    gap: 12px; 
    margin-top: clamp(35px, 6vw, 75px); 
    color: var(--muted); 
    font-size: clamp(7.5px, 0.9vw, 8.5px); 
    letter-spacing: 2px; 
    line-height: 1.7; 
  }
  .note-star { color: var(--gold); font-size: 26px; }
  
  .hero-visual { 
    min-height: clamp(380px, 45vw, 540px); 
    position: relative; 
    padding: 0 0 24px clamp(12px, 2.5vw, 28px); 
    z-index: 2;
  }
  .hero-duo { 
    display: flex; 
    height: 100%; 
    min-height: clamp(380px, 45vw, 540px); 
    position: relative; 
    overflow: hidden; 
    background: var(--sand); 
    border: 1px solid var(--line); 
    box-shadow: 0 20px 45px rgba(62,42,32,.08); 
    border-radius: 4px;
  }
  .hero-duo-panel { 
    position: relative; 
    flex: 1 1 50%; 
    min-height: 100%; 
    overflow: hidden; 
    display: block; 
    text-decoration: none; 
    transition: flex .65s cubic-bezier(.22,1,.36,1), opacity .45s ease, filter .45s ease; 
  }
  .hero-duo-portfolio { cursor: pointer; }
  .hero-duo-bg { position: absolute; inset: 0; background-size: cover; background-repeat: no-repeat; transition: transform .8s cubic-bezier(.22,1,.36,1), filter .5s ease; }
  .hero-bg-main { background-image: url("/assets/img/banner.jpg"); background-position: center 35%; }
  .hero-bg-portfolio { background-image: url("/assets/img/trabalho-01.jpg"); background-position: center 38%; }

  .hero-duo-blend { position: absolute; top: 0; bottom: 0; left: 50%; width: 84px; transform: translateX(-50%); z-index: 3; pointer-events: none; background: linear-gradient(90deg, rgba(248,243,236,0) 0%, rgba(248,243,236,.42) 28%, rgba(216,189,145,.55) 50%, rgba(248,243,236,.42) 72%, rgba(248,243,236,0) 100%); backdrop-filter: blur(5px); -webkit-backdrop-filter: blur(5px); transition: left .65s cubic-bezier(.22,1,.36,1), opacity .4s ease; }
  .hero-duo-line { position: absolute; top: 7%; bottom: 7%; left: 50%; width: 1px; transform: translateX(-50%); background: linear-gradient(to bottom, transparent 0%, rgba(189,150,94,.3) 15%, rgba(189,150,94,.95) 50%, rgba(189,150,94,.3) 85%, transparent 100%); box-shadow: 0 0 10px rgba(189,150,94,.4); }

  .hero-duo-main::after { content: ""; position: absolute; inset: 0; background: linear-gradient(to right, transparent 65%, rgba(248,243,236,.55) 100%); pointer-events: none; z-index: 2; }
  .hero-duo-portfolio::after { content: ""; position: absolute; inset: 0; background: linear-gradient(to left, transparent 65%, rgba(248,243,236,.55) 100%); pointer-events: none; z-index: 2; }

  .hero-duo-badge { position: absolute; bottom: 16px; left: 16px; z-index: 4; display: inline-flex; align-items: center; gap: 7px; background: rgba(255,250,244,.93); backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px); border: 1px solid var(--gold-light); color: var(--espresso); font-size: 8px; letter-spacing: 2px; font-weight: 600; padding: 6px 10px; pointer-events: none; }
  .hero-duo-badge span { color: var(--gold); font-size: 9px; }
  .hero-duo-badge-portfolio { left: auto; right: 16px; }

  .hero-duo:hover .hero-duo-panel:not(:hover) { flex: .78; opacity: .68; filter: grayscale(18%) contrast(.92); }
  .hero-duo-panel:hover { flex: 1.22; opacity: 1; filter: none; }
  .hero-duo-panel:hover .hero-duo-bg { transform: scale(1.05); }

  .photo-caption { position: absolute; bottom: 0; left: 28px; right: 0; display: flex; justify-content: space-between; padding: 8px 0 0; color: var(--muted); font-size: 8px; letter-spacing: 2px; }
  .hero-stamp { position: absolute; left: -20px; top: 35px; width: 95px; height: 95px; border-radius: 50%; background: var(--ivory); border: 1px solid var(--gold-light); display: grid; place-content: center; text-align: center; color: var(--brown); font-size: 8.5px; line-height: 1.45; letter-spacing: 1.8px; transform: rotate(-12deg); z-index: 5; box-shadow: 0 4px 15px rgba(62,42,32,0.06); }
  .hero-stamp i { font: italic 14px "Playfair Display",serif; letter-spacing: 0; }

  /* Adaptabilidade Dinâmica para Tablets e Smartphones */
  @media (max-width: 1024px) {
    .hero { grid-template-columns: 1fr; padding: 40px 6% 50px; }
    .hero-copy { padding: 0 0 35px; }
    .hero-visual { padding: 0; min-height: 420px; }
    .hero-duo { min-height: 420px; }
    .photo-caption { left: 0; }
    .hero-stamp { left: 15px; top: 15px; }
  }

  @media (max-width: 600px) {
    .hero { padding: 25px 5% 45px; }
    .hero h1 { font-size: clamp(34px, 9vw, 46px); letter-spacing: -1px; }
    .hero-visual, .hero-duo { min-height: 350px; }
    .hero-stamp { width: 75px; height: 75px; font-size: 7px; top: 10px; left: 10px; }
    .hero-stamp i { font-size: 11px; }
    .photo-caption { font-size: 7px; letter-spacing: 1px; }
  }

  /* NOVO BOTÃO DESTAQUE HERO: GLOW DOURADO EDITORIAL */
  .hero-cta-glow {
    position: relative;
    display: inline-flex;
    align-items: center;
    padding: clamp(13px, 1.8vw, 16px) clamp(20px, 2.5vw, 28px);
    background: linear-gradient(135deg, #bd965e 0%, #9e7640 100%);
    color: #ffffff !important;
    border-radius: 8px;
    border: 1px solid rgba(255, 255, 255, 0.25);
    cursor: pointer;
    overflow: hidden;
    box-shadow: 0 10px 28px rgba(189, 150, 94, 0.35);
    transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    text-align: left;
    max-width: 100%;
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
    font-size: clamp(12.5px, 1.5vw, 14px);
    font-weight: 700;
    letter-spacing: 0.8px;
    display: inline-flex;
    align-items: center;
    gap: 8px;
    color: #ffffff;
    white-space: nowrap;
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
    font-size: clamp(8.5px, 1vw, 9.5px);
    color: rgba(255, 255, 255, 0.85);
    letter-spacing: 0.5px;
    font-weight: 400;
    white-space: nowrap;
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

  /* Ilustração Cílios Piscando (Flutuante / Opção 1) */
  .hero-lash-badge {
    position: absolute;
    top: 50%;
    right: 20px;
    z-index: 25;
    display: inline-flex;
    align-items: center;
    gap: 12px;
    padding: 10px 18px 10px 14px;
    background: rgba(255, 252, 248, 0.95);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    border: 1px solid rgba(189, 150, 94, 0.45);
    border-radius: 40px;
    box-shadow: 0 14px 35px rgba(62, 42, 32, 0.16), 0 2px 10px rgba(189, 150, 94, 0.2);
    animation: badgeLevitate 5s ease-in-out infinite;
    transition: border-color 0.3s ease, box-shadow 0.3s ease;
    user-select: none;
  }
  .hero-lash-badge:hover {
    border-color: #bd965e;
    box-shadow: 0 16px 38px rgba(189, 150, 94, 0.28);
  }
  @keyframes badgeLevitate {
    0%, 100% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(-8px);
    }
  }
  @media (max-width: 1280px) {
    .hero-lash-badge {
      right: 15px;
      padding: 8px 14px;
    }
  }
  @media (max-width: 1024px) {
    .hero-lash-badge {
      position: static;
      margin-top: 20px;
      align-self: flex-start;
      animation: none;
      box-shadow: 0 6px 18px rgba(62, 42, 32, 0.06);
    }
  }
  .lash-visual-wrap {
    width: 52px;
    height: 30px;
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
    font-size: 8px;
    letter-spacing: 2px;
    font-weight: 700;
    color: #1a120c;
    text-transform: uppercase;
  }
  .lash-sub {
    font-size: 9.5px;
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
