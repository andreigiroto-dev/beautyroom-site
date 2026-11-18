<script lang="ts">
  let { onOpenBooking } = $props<{ onOpenBooking: (serviceId?: string) => void }>();
  let menuOpen = $state(false);

  function toggleMenu() {
    menuOpen = !menuOpen;
  }

  function handleNavClick() {
    menuOpen = false;
  }
</script>

<header class="site-header" id="topo">
  <a class="brand" href="#topo" aria-label="Beauty Room - início">
    <span class="brand-monogram">BR</span>
    <div class="brand-name">
      <span class="brand-title">BEAUTY ROOM</span>
      <span class="brand-sub">BELEZA PENSADA PARA VOCÊ</span>
    </div>
  </a>

  <button class="menu-toggle" aria-label="Abrir menu" aria-expanded={menuOpen} onclick={toggleMenu}>
    <span></span><span></span><span></span>
  </button>

  <nav class="main-nav {menuOpen ? 'open' : ''}" aria-label="Navegação principal">
    <a href="#inicio" onclick={handleNavClick}>Início</a>
    <a href="#sobre" onclick={handleNavClick}>O espaço</a>
    <a href="#servicos" onclick={handleNavClick}>Procedimentos</a>
    <a href="#galeria" onclick={handleNavClick}>Galeria</a>
    <a href="#duvidas" onclick={handleNavClick}>Dúvidas</a>
    <a href="#contato" onclick={handleNavClick}>Contato</a>
  </nav>

  <!-- [STATUS ATENDIMENTO: ESTÚDIO PRIVATIVO COM PULSO VIVO - SUGESTÃO 1] -->
  <div class="header-status-pill" title="Atendimento com hora marcada em Mauá, SP">
    <span class="status-pulse-dot">
      <span class="pulse-ring"></span>
      <span class="pulse-core"></span>
    </span>
    <div class="status-pill-text">
      <span class="status-title">Estúdio Privativo</span>
      <span class="status-sub">Atendendo Hoje · Mauá</span>
    </div>
  </div>
  <!-- [FIM STATUS ATENDIMENTO] -->
</header>
