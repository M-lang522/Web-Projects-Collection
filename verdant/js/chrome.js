function mountChrome(active){
  const nav=document.createElement('div');
  nav.innerHTML=`
  <div class="progress-bar"></div>
  <div class="cursor-dot"></div>
  <div class="cursor-ring"></div>
  <nav class="nav">
    <a href="index.html" class="nav-logo"><span class="dot"></span>Verdant Lab</a>
    <div class="nav-links">
      <a href="index.html" ${active==='home'?'class="active"':''}>Home</a>
      <a href="about.html" ${active==='about'?'class="active"':''}>Story</a>
      <a href="services.html" ${active==='services'?'class="active"':''}>Solutions</a>
      <a href="portfolio.html" ${active==='portfolio'?'class="active"':''}>Work</a>
      <a href="insights.html" ${active==='insights'?'class="active"':''}>Insights</a>
    </div>
    <a href="contact.html" class="nav-cta magnetic">Book Consult</a>
  </nav>`;
  document.body.prepend(nav);

  const footer=document.createElement('footer');
  footer.innerHTML=`
    <div class="footer-grid">
      <div>
        <div class="nav-logo" style="margin-bottom:18px;"><span class="dot"></span>Verdant Lab</div>
        <p style="max-width:320px;font-size:0.92rem;">A botanical extraction studio formulating small-batch skincare from single-origin chlorophyll and plant actives.</p>
      </div>
      <div>
        <h3 style="font-size:0.95rem;margin-bottom:18px;font-family:'IBM Plex Mono',monospace;letter-spacing:.05em;">Site</h3>
        <div style="display:flex;flex-direction:column;gap:12px;font-size:0.9rem;">
          <a href="about.html">Our Story</a>
          <a href="services.html">Solutions</a>
          <a href="portfolio.html">Work</a>
          <a href="insights.html">Insights</a>
        </div>
      </div>
      <div>
        <h3 style="font-size:0.95rem;margin-bottom:18px;font-family:'IBM Plex Mono',monospace;letter-spacing:.05em;">Studio</h3>
        <div style="display:flex;flex-direction:column;gap:12px;font-size:0.9rem;">
          <a href="contact.html">Book a Consult</a>
          <a href="#">Wholesale</a>
          <a href="#">Careers</a>
        </div>
      </div>
      <div>
        <h3 style="font-size:0.95rem;margin-bottom:18px;font-family:'IBM Plex Mono',monospace;letter-spacing:.05em;">Field Notes</h3>
        <p style="font-size:0.85rem;">Kyoto · Portland<br/>Mon–Fri, 9–5</p>
      </div>
    </div>
    <div class="footer-bottom">
      <span>© 2026 VERDANT LAB — ALL EXTRACTS RESERVED</span>
      <span>BATCH №2026.07</span>
    </div>
  `;
  document.body.appendChild(footer);
}
