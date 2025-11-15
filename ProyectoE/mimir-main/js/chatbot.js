/* Chatbot front-end (no-backend demo)
   - By default uses a small demo responder so you can present locally.
   - If you want to use a real LLM API directly from browser, see comments below (not secure).
   - Recommended: use a serverless proxy for production/demo with real keys.
*/

document.addEventListener('DOMContentLoaded', function(){
  // Inject markup
  const container = document.createElement('div');
  container.id = 'chatbot';
  container.innerHTML = `
    <div class="chat-button" id="chatToggle" title="Abrir chat">💬</div>
    <div class="chat-panel" id="chatPanel" style="display:none;">
      <div class="chat-header">
        <div class="title">Mimir Chat</div>
        <button class="close" id="chatClose">✕</button>
      </div>
      <div class="chat-body" id="chatBody">
        <div class="chat-message bot"><div class="chat-bubble">Hola 👋, soy el asistente de Mimir. ¿En qué puedo ayudarte hoy?</div></div>
      </div>
      <div class="chat-input">
        <input id="chatInput" placeholder="Escribe tu pregunta..." />
        <button id="chatSend">Enviar</button>
      </div>
    </div>
  `;
  document.body.appendChild(container);

  const toggle = document.getElementById('chatToggle');
  const panel = document.getElementById('chatPanel');
  const closeBtn = document.getElementById('chatClose');
  const sendBtn = document.getElementById('chatSend');
  const input = document.getElementById('chatInput');
  const body = document.getElementById('chatBody');

  function openPanel(){ panel.style.display = 'flex'; toggle.style.display = 'none'; input.focus(); scrollBottom(); }
  function closePanel(){ panel.style.display = 'none'; toggle.style.display = 'flex'; }

  toggle.addEventListener('click', openPanel);
  closeBtn.addEventListener('click', closePanel);
  sendBtn.addEventListener('click', onSend);
  input.addEventListener('keydown', function(e){ if(e.key === 'Enter') onSend(); });

  function addMessage(text, who='bot'){
    const msg = document.createElement('div');
    msg.className = 'chat-message ' + (who === 'me' ? 'me' : 'bot');
    msg.innerHTML = `<div class="chat-bubble">${escapeHtml(text)}</div>`;
    body.appendChild(msg);
    scrollBottom();
  }

  function scrollBottom(){ body.scrollTop = body.scrollHeight; }

  function onSend(){
    const text = input.value.trim();
    if(!text) return;
    addMessage(text, 'me');
    input.value = '';
    // First try: demo responder for offline use
    demoResponder(text).then(resp => addMessage(resp, 'bot'))
      .catch(err => addMessage('Lo siento, se produjo un error. Intenta de nuevo.', 'bot'));
  }

  // Simple local demo responder (good for presentations without API)
  async function demoResponder(msg){
    const m = msg.toLowerCase();
    if(m.includes('horario') || m.includes('hora')) return 'Nuestro horario es Lunes a Viernes de 9:00 a 18:00.';
    if(m.includes('envio') || m.includes('enviar')) return 'Ofrecemos envío nacional y retiro en tienda. Los costos varían según la ubicación.';
    if(m.includes('pago') || m.includes('pagar')) return 'Aceptamos tarjetas, transferencias y pagos en efectivo en tienda.';
    if(m.includes('hola') || m.includes('holi') || m.includes('buenas')) return '¡Hola! ¿Cómo puedo ayudarte con productos o servicios?';
    // fallback: simple canned suggestion
    return 'Puedo ayudarte con horarios, envíos, pagos y productos. Por ejemplo: "¿Tienen comida para gatos senior?"';
  }

  function escapeHtml(s){ return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }

  // OPTIONAL: example function to call an external API (UNSECURE to call directly from browser)
  // If you have an API key and want to demo an LLM, you can uncomment and adapt the code below.
  // Warning: embedding secret keys in client-side code is NOT secure. Use a serverless proxy for real keys.
  /*
  async function callExternalAPI(userMessage){
    const OPENAI_API_KEY = 'YOUR_API_KEY_HERE'; // DO NOT commit this key
    const resp = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + OPENAI_API_KEY
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [{role:'user', content: userMessage}],
        max_tokens: 300
      })
    });
    const data = await resp.json();
    // extract text depending on API shape
    return (data?.choices?.[0]?.message?.content) || JSON.stringify(data);
  }
  */

});
