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
    <span class="brand-name">BEAUTY ROOM<small>BELEZA PENSADA PARA VOCÊ</small></span>
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
    <button type="button" class="nav-cta" onclick={() => { handleNavClick(); onOpenBooking(); }}>
      Agendar <span>↗</span>
    </button>
  </nav>
</header>
