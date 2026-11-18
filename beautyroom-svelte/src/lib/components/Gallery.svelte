<script lang="ts">
  const galleryPhotos = [
    { src: '/assets/img/trabalho-01.jpg', title: 'Volume Brasileiro', sub: 'Extensão Fio a Fio e Volume', tall: true },
    { src: '/assets/img/trabalho-02.jpg', title: 'Design Personalizado', sub: 'Mapeamento Geométrico', tall: false },
    { src: '/assets/img/trabalho-03.jpg', title: 'Harmonização do Olhar', sub: 'Efeito Natural e Curvatura', tall: false },
    { src: '/assets/img/trabalho-04.jpg', title: 'Efeito Rímel & Híbrido', sub: 'Densidade e Elegância', tall: false },
    { src: '/assets/img/trabalho-05.jpg', title: 'Manutenção Perfeita', sub: 'Durabilidade até 21 dias', tall: false }
  ];

  let selectedIndex = $state<number | null>(null);

  function openLightbox(index: number) {
    selectedIndex = index;
  }

  function closeLightbox() {
    selectedIndex = null;
  }

  function nextPhoto() {
    if (selectedIndex !== null) {
      selectedIndex = (selectedIndex + 1) % galleryPhotos.length;
    }
  }

  function prevPhoto() {
    if (selectedIndex !== null) {
      selectedIndex = (selectedIndex - 1 + galleryPhotos.length) % galleryPhotos.length;
    }
  }
</script>

<section class="gallery-section" id="galeria">
  <div class="section-wrap">
    <div class="section-heading gallery-heading">
      <div>
        <div class="section-kicker">RESULTADOS REAIS</div>
        <h2>Um olhar que <em>encanta.</em></h2>
      </div>
      <a href="#inicio" class="text-link">Voltar ao topo <span>↑</span></a>
    </div>

    <div class="gallery-grid">
      {#each galleryPhotos as photo, i}
        <button
          type="button"
          class="gallery-item {photo.tall ? 'gallery-tall' : ''}"
          onclick={() => openLightbox(i)}
        >
          <img src={photo.src} alt={photo.title} loading="lazy" />
          <span>
            {photo.sub}
            <b>{photo.title}</b>
          </span>
        </button>
      {/each}
    </div>
    <p class="gallery-tip">Dica: clique em qualquer imagem para ampliar os detalhes.</p>
  </div>
</section>

<!-- Lightbox Modal -->
{#if selectedIndex !== null}
  <div class="lightbox open" role="dialog" aria-modal="true" aria-label="Imagem ampliada">
    <button class="lightbox-close" aria-label="Fechar imagem" onclick={closeLightbox}>×</button>
    <button class="lightbox-nav lightbox-prev" aria-label="Imagem anterior" onclick={prevPhoto}>&#10094;</button>
    <button class="lightbox-nav lightbox-next" aria-label="Próxima imagem" onclick={nextPhoto}>&#10095;</button>
    <div class="lightbox-content">
      <img src={galleryPhotos[selectedIndex].src} alt={galleryPhotos[selectedIndex].title} />
      <div class="lightbox-caption">
        <span class="lightbox-counter">{selectedIndex + 1} / {galleryPhotos.length}</span>
        <h4 class="lightbox-title">{galleryPhotos[selectedIndex].title}</h4>
        <p class="lightbox-sub">{galleryPhotos[selectedIndex].sub}</p>
      </div>
    </div>
  </div>
{/if}

<style>
  .gallery-section { background: var(--sand); padding: 90px 0; }
  .gallery-heading { margin-bottom: 40px; }
  .gallery-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; }
  .gallery-item { position: relative; overflow: hidden; display: block; background: #c5ae96; min-height: 270px; border-radius: 2px; border: none; padding: 0; cursor: pointer; text-align: left; }
  .gallery-item.gallery-tall { grid-row: span 2; min-height: 554px; }
  .gallery-item img { display: block; width: 100%; height: 100%; min-height: 270px; object-fit: cover; transition: transform .6s cubic-bezier(.2,.8,.2,1); }
  .gallery-item.gallery-tall img { min-height: 554px; }
  .gallery-item::after { content:""; position:absolute; inset:40% 0 0; background:linear-gradient(transparent,rgba(35,24,18,.75)); opacity:.9; }
  .gallery-item:hover img { transform: scale(1.04); }
  .gallery-item > span { position:absolute; z-index:1; bottom:16px; left:18px; right:18px; color:white; font-size:10px; letter-spacing:1.5px; }
  .gallery-item > span b { display:block; font-weight:600; margin-top:5px; font-size:9px; letter-spacing: 2px; }

  /* Lightbox */
  .lightbox { position: fixed; z-index: 100; inset: 0; background: rgba(20,14,11,.94); padding: 40px 20px; display: flex; align-items: center; justify-content: center; backdrop-filter: blur(8px); }
  .lightbox-content { display: flex; flex-direction: column; align-items: center; max-width: 90vw; max-height: 90vh; }
  .lightbox img { max-width: min(85vw, 680px); max-height: 70vh; object-fit: contain; border-radius: 4px; box-shadow: 0 15px 40px rgba(0,0,0,.6); }
  .lightbox-caption { margin-top: 16px; text-align: center; color: var(--ivory); }
  .lightbox-counter { font-size: 10px; letter-spacing: 2px; color: var(--gold-light); display: block; margin-bottom: 6px; }
  .lightbox-title { font: 500 20px "Playfair Display",serif; margin: 0 0 5px; color: #fff; }
  .lightbox-sub { font-size: 12px; color: #c8bcaf; margin: 0; }
  .lightbox-close { position: absolute; right: 24px; top: 18px; border: 0; background: none; color: white; font-size: 38px; cursor: pointer; }
  .lightbox-nav { position: absolute; top: 50%; transform: translateY(-50%); background: rgba(255,255,255,.12); border: 1px solid rgba(255,255,255,.2); color: white; width: 46px; height: 46px; border-radius: 50%; display: grid; place-items: center; font-size: 18px; cursor: pointer; }
  .lightbox-prev { left: 24px; }
  .lightbox-next { right: 24px; }

  @media (max-width: 800px) {
    .gallery-grid { grid-template-columns: 1fr; }
    .gallery-item.gallery-tall { grid-row: auto; min-height: 290px; }
  }
</style>
