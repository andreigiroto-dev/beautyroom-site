<script lang="ts">
  import Navbar from '$lib/components/Navbar.svelte';
  import Hero from '$lib/components/Hero.svelte';
  import About from '$lib/components/About.svelte';
  import Services from '$lib/components/Services.svelte';
  import Gallery from '$lib/components/Gallery.svelte';
  import Faq from '$lib/components/Faq.svelte';
  import Contact from '$lib/components/Contact.svelte';
  import BookingModal from '$lib/components/BookingModal.svelte';

  let isBookingOpen = $state(false);
  let activeServiceId = $state('cilios');

  function openBooking(serviceId: string = 'cilios') {
    activeServiceId = serviceId;
    isBookingOpen = true;
  }
</script>

<svelte:head>
  <title>Beauty Room | Beleza pensada para você</title>
</svelte:head>

<Navbar onOpenBooking={openBooking} />

<main>
  <Hero onOpenBooking={openBooking} />
  <About />
  <Services onOpenBooking={openBooking} />
  <Gallery />
  <Faq />
  <Contact onOpenBooking={openBooking} />
</main>

<BookingModal bind:isOpen={isBookingOpen} bind:selectedServiceId={activeServiceId} />

<!-- Botão Flutuante do WhatsApp -->
<a
  href="https://api.whatsapp.com/send?phone=5511984814153&text=Ol%C3%A1%2C%20gostaria%20de%20tirar%20uma%20d%C3%BAvida%20sobre%20os%20procedimentos%20do%20Beauty%20Room."
  target="_blank"
  rel="noopener noreferrer"
  class="whatsapp-float"
  aria-label="Fale conosco no WhatsApp"
>
  <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
    <path
      d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2zm.01 1.67c2.2 0 4.26.86 5.82 2.42a8.182 8.182 0 0 1 2.41 5.82c0 4.54-3.7 8.24-8.24 8.24-1.42 0-2.81-.37-4.04-1.07l-.29-.17-3.12.82.83-3.04-.19-.3a8.163 8.163 0 0 1-1.25-4.48c0-4.54 3.7-8.24 8.24-8.24zm4.52 11.66c-.25-.13-1.47-.72-1.7-.81-.23-.08-.39-.13-.56.13-.17.25-.64.81-.79.98-.14.17-.29.19-.54.06-.25-.13-1.06-.39-2.02-1.24-.75-.67-1.26-1.49-1.4-1.74-.15-.25-.02-.39.11-.51.11-.11.25-.29.38-.44.13-.15.17-.25.25-.42.08-.17.04-.32-.02-.44-.06-.13-.56-1.35-.77-1.85-.2-.49-.41-.42-.56-.43h-.48c-.17 0-.44.06-.67.32-.23.25-.88.86-.88 2.1 0 1.24.9 2.44 1.03 2.61.13.17 1.78 2.72 4.31 3.81.6.26 1.07.42 1.44.54.61.19 1.16.17 1.6.1.49-.07 1.47-.6 1.68-1.18.21-.58.21-1.08.15-1.18-.06-.1-.23-.17-.48-.29z"
    />
  </svg>
  <span class="whatsapp-badge">Agende no WhatsApp</span>
</a>
