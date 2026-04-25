/* =====================================================
   S.P.E.E.D — Unidade Alta
   script.js
   ===================================================== */

'use strict';

/* =====================================================
   ESTADO (localStorage)
   ===================================================== */
const S = {
  /* senha do dono */
  get ownerPass() { return localStorage.getItem('sp_owner_pass') || 'speed2024'; },
  set ownerPass(v) { localStorage.setItem('sp_owner_pass', v); },

  /* sessão atual (não persiste) */
  currentUser: null,
  editMode: false,

  /* usuários registrados */
  get users()    { return JSON.parse(localStorage.getItem('sp_users')    || '[]'); },
  set users(v)   { localStorage.setItem('sp_users',    JSON.stringify(v)); },

  /* seções de conteúdo */
  get sections() { return JSON.parse(localStorage.getItem('sp_sections') || 'null') || defaultSections(); },
  set sections(v){ localStorage.setItem('sp_sections', JSON.stringify(v)); },

  /* patentes */
  get ranks()    { return JSON.parse(localStorage.getItem('sp_ranks')    || 'null') || defaultRanks(); },
  set ranks(v)   { localStorage.setItem('sp_ranks',    JSON.stringify(v)); },

  /* liveries */
  get liveries() { return JSON.parse(localStorage.getItem('sp_liveries') || 'null') || defaultLiveries(); },
  set liveries(v){ localStorage.setItem('sp_liveries', JSON.stringify(v)); },

  /* imagens (base64) */
  get images()   { return JSON.parse(localStorage.getItem('sp_images')   || '{}'); },
  set images(v)  { localStorage.setItem('sp_images',   JSON.stringify(v)); },

  /* textos editáveis */
  get texts()    { return JSON.parse(localStorage.getItem('sp_texts')    || '{}'); },
  set texts(v)   { localStorage.setItem('sp_texts',    JSON.stringify(v)); },

  /* cores personalizadas */
  get colors()   { return JSON.parse(localStorage.getItem('sp_colors')   || '{}'); },
  set colors(v)  { localStorage.setItem('sp_colors',   JSON.stringify(v)); },
};

/* =====================================================
   DADOS PADRÃO
   ===================================================== */
function defaultSections() {
  return [
    {
      id: 'hierarquia',
      title: 'HIERARQUIA DA UNIDADE',
      type: 'text',
      body: 'Dentro da <span class="highlight">Unidade Speed</span>, temos nossa própria hierarquia, ela deve ser respeitada tanto quanto na polícia. Em uma situação onde um Soldado de cargo <strong>Piloto Sênior</strong> der uma ordem a um Sargento de cargo <strong>Piloto Júnior</strong> em uma situação de acompanhamento, ela deve ser cumprida. Pois sua experiência é maior e de mais valor.<br><br>Dentro da unidade há um <span class="highlight">grupamento</span> vinculado a SPEED, chamado <span class="highlight">GRA</span>. Dentro da hierarquia ele está abaixo do supervisor geral, e não tem nenhum vínculo hierárquico com os membros da unidade speed, porém o respeito deve ser mútuo entre todos.<br><br>Todos os membros da <span class="highlight">GRA</span> respondem ao seu supervisor e a todos que estão acima dele, sendo eles <span class="highlight">Supervisor Geral</span>, <span class="highlight">Subcomando</span> e <span class="highlight">Comando</span>.',
      deletable: false
    },
    { id: 'patentes', title: 'PATENTES E UNIFORMES', type: 'ranks',  body: '', deletable: false },
    { id: 'livery',   title: 'LIVERY',                type: 'livery', body: 'As livery\'s ficaram definidas da seguinte maneira:', deletable: false },
    {
      id: 'adornos',
      title: 'ADORNOS',
      type: 'images',
      body: 'Os adornos da unidade só podem ser utilizados após subir para o cargo de <span class="highlight">Aspirante a Piloto</span>. Cada adorno está avaliado no valor de <strong>15k</strong>. A solicitação deve ser feita via sistema interno, na aba <span class="highlight">"Comprovante"</span>. A luva é paga apenas 1 vez e pode utilizar os 3 modelos.',
      deletable: false
    },
  ];
}

function defaultRanks() {
  return [
    { id: 1, name: 'Aspirante a Piloto', desc: 'Uniforme não sofre alterações significativas, sendo permitido apenas o uso da camisa por fora da calça. É autorizada a utilização de adorno e a retirada do giroflex, mediante pagamentos de ambos.', img: null },
    { id: 2, name: 'Piloto Júnior',      desc: 'Está autorizado o uso da camiseta por fora do uniforme, bem como a utilização da camisa de manga longa. Colocar a patente na manga e coldre de preferência.', img: null },
    { id: 3, name: 'Piloto Oficial',     desc: 'Está autorizado a utilizar a jaqueta aberta, com camiseta preta por baixo, além do coldre de preferência.', img: null },
    { id: 4, name: 'Piloto Sênior',      desc: 'Está autorizado a utilizar a jaqueta fechada e coldre de preferência. Autorizado: Corvette C6. Body kit mediante pagamento de 25K.', img: null },
    { id: 5, name: 'Piloto Veterano',    desc: 'Está autorizado a utilizar a jaqueta corta vento e coldre de preferência.', img: null },
    { id: 6, name: 'Piloto Elite',       desc: 'Pode usar qualquer Camisa/Jaqueta das patentes anteriores. Autorizado usar os 2 coletes PRETOS de preferência.', img: null },
    { id: 7, name: 'Supervisor Geral',   desc: 'Pode usar qualquer Camisa/Jaqueta das patentes anteriores. Autorizado: 2 coletes PRETOS e calça PRETA.', img: null },
    { id: 8, name: 'Instrutor',          desc: "Moletom fechado com nome do instrutor, sem colete, calça preta, bota preta e coldre de escolha. Uso exclusivo em REC'S.", img: null },
  ];
}

function defaultLiveries() {
  return [
    { id: 1, dot: 'azul',   label: 'Azul — Novato → Comando' },
    { id: 2, dot: 'branca', label: 'Branca — Piloto Elite → Comando' },
    { id: 3, dot: 'preta',  label: 'Preta — → Comando' },
  ];
}

/* =====================================================
   AUTH — ABAS
   ===================================================== */
function switchAuthTab(tab) {
  document.querySelectorAll('.auth-tab').forEach((el, i) => {
    el.classList.toggle('active', (i === 0 && tab === 'login') || (i === 1 && tab === 'register'));
  });
  document.getElementById('panel-login').classList.toggle('active', tab === 'login');
  document.getElementById('panel-register').classList.toggle('active', tab === 'register');
}

/* =====================================================
   AUTH — LOGIN
   ===================================================== */
function doLogin() {
  const u   = document.getElementById('login-user').value.trim();
  const p   = document.getElementById('login-pass').value;
  const err = document.getElementById('login-error');
  err.style.display = 'none';

  /* Visitante: campos vazios */
  if (!u && !p) { loginAs({ user: 'visitante', role: 'viewer', nick: 'Visitante' }); return; }

  /* Dono */
  if (u === 'admin' && p === S.ownerPass) { loginAs({ user: 'admin', role: 'owner', nick: 'Administrador' }); return; }

  /* Usuários cadastrados */
  const found = S.users.find(x => x.user === u && x.pass === p);
  if (found) { loginAs({ user: u, role: found.role, nick: found.nick || u }); return; }

  err.style.display = 'block';
}

/* =====================================================
   AUTH — REGISTRO
   ===================================================== */
function doRegister() {
  const u    = document.getElementById('reg-user').value.trim();
  const nick = document.getElementById('reg-nick').value.trim();
  const p    = document.getElementById('reg-pass').value;
  const p2   = document.getElementById('reg-pass2').value;
  const err  = document.getElementById('reg-error');
  const suc  = document.getElementById('reg-success');

  err.style.display = 'none';
  suc.style.display = 'none';

  if (!u || !p || !nick)            { showErr(err, 'Preencha todos os campos.'); return; }
  if (u === 'admin')                 { showErr(err, 'Nome de usuário inválido.'); return; }
  if (p !== p2)                      { showErr(err, 'As senhas não coincidem.'); return; }
  if (p.length < 4)                  { showErr(err, 'Senha muito curta (mín. 4 caracteres).'); return; }
  if (S.users.find(x => x.user===u)){ showErr(err, 'Esse usuário já existe.'); return; }

  const users = S.users;
  users.push({ user: u, pass: p, nick, role: 'viewer', registered: new Date().toLocaleDateString('pt-BR') });
  S.users = users;

  suc.style.display = 'block';
  ['reg-user','reg-nick','reg-pass','reg-pass2'].forEach(id => document.getElementById(id).value = '');
  setTimeout(() => switchAuthTab('login'), 1800);
}

function showErr(el, msg) { el.textContent = msg; el.style.display = 'block'; }

/* =====================================================
   LOGIN
   ===================================================== */
function loginAs(userData) {
  S.currentUser = userData;

  document.getElementById('auth-screen').style.display = 'none';
  document.getElementById('app').style.display = 'block';

  const roleLabels = { owner: 'DONO', admin: 'ADMIN', editor: 'EDITOR', viewer: 'MEMBRO', visitor: 'VISITANTE' };
  document.getElementById('role-badge').textContent =
    (roleLabels[userData.role] || userData.role.toUpperCase()) + ' · ' + (userData.nick || userData.user);

  const isAdmin = ['owner', 'admin'].includes(userData.role);
  document.getElementById('admin-panel').classList.toggle('visible', isAdmin);

  applyColors();
  applyTexts();
  restoreHeroLogo();
  renderSections();
}

function logout() {
  S.currentUser = null;
  S.editMode = false;
  document.body.classList.remove('edit-mode');
  document.getElementById('edit-bar').classList.remove('on');
  document.getElementById('emode-btn').classList.remove('on');
  document.getElementById('app').style.display = 'none';
  document.getElementById('auth-screen').style.display = 'flex';
  document.getElementById('login-user').value = '';
  document.getElementById('login-pass').value = '';
}

function isEditor() {
  return S.currentUser && ['owner', 'admin', 'editor'].includes(S.currentUser.role);
}

/* =====================================================
   MODO EDIÇÃO
   ===================================================== */
function toggleEditMode() {
  if (!isEditor()) return;
  S.editMode = !S.editMode;
  document.body.classList.toggle('edit-mode', S.editMode);
  document.getElementById('edit-bar').classList.toggle('on', S.editMode);
  document.getElementById('emode-btn').classList.toggle('on', S.editMode);
  showToast(S.editMode ? '✏️ Modo Edição ATIVO' : 'Modo Edição desativado');
}

/* =====================================================
   EDIÇÃO INLINE (textos simples)
   ===================================================== */
const INLINE_LABELS = {
  'site-name':   'Nome na barra superior',
  'hero-title':  'Título do banner',
  'hero-sub':    'Subtítulo do banner',
  'footer-text': 'Texto do rodapé',
};

function editInline(key) {
  if (!S.editMode) return;
  const cur = S.texts[key] || document.getElementById('disp-' + key)?.textContent?.trim() || '';
  document.getElementById('inline-key').value           = key;
  document.getElementById('inline-modal-title').textContent = 'EDITAR — ' + (INLINE_LABELS[key] || key).toUpperCase();
  document.getElementById('inline-label-text').textContent  = INLINE_LABELS[key] || key;
  document.getElementById('inline-input').value         = cur;
  openModal('inline-modal');
}

function saveInline() {
  const key = document.getElementById('inline-key').value;
  const val = document.getElementById('inline-input').value;
  const t   = S.texts;
  t[key]    = val;
  S.texts   = t;
  applyTexts();
  closeModal('inline-modal');
  showToast('Texto atualizado!');
}

function applyTexts() {
  const t = S.texts;
  Object.entries(t).forEach(([key, val]) => {
    const el = document.getElementById('disp-' + key);
    if (el) el.textContent = val;
  });
}

/* =====================================================
   CORES
   ===================================================== */
function previewColor(key, val) {
  document.documentElement.style.setProperty('--' + key, val);
}

function saveColors() {
  const keys = ['gold', 'gold-light', 'dark', 'dark2', 'dark3', 'text'];
  const c = {};
  keys.forEach(k => {
    const el = document.getElementById('col-' + k);
    if (el) c[k] = el.value;
  });
  S.colors = c;
  applyColors();
  closeModal('colors-modal');
  showToast('Cores salvas!');
}

function resetColors() {
  S.colors = {};
  localStorage.removeItem('sp_colors');
  location.reload();
}

function applyColors() {
  const defaults = {
    'gold':       '#c9a227',
    'gold-light': '#f0c040',
    'dark':       '#060606',
    'dark2':      '#0d0d0d',
    'dark3':      '#141414',
    'text':       '#d8d0b8',
  };
  const c = S.colors;
  Object.entries(defaults).forEach(([k, v]) => {
    const val = c[k] || v;
    document.documentElement.style.setProperty('--' + k, val);
    const el = document.getElementById('col-' + k);
    if (el) el.value = val;
  });
}

/* =====================================================
   RENDERIZAR SEÇÕES
   ===================================================== */
function renderSections() {
  const container = document.getElementById('sections-container');
  container.innerHTML = '';

  S.sections.forEach(sec => {
    const wrap = document.createElement('div');
    wrap.className = 'section';
    wrap.id = 'section-' + sec.id;
    wrap.innerHTML = `
      <img class="sec-watermark" src="logo.png" alt="">
      <div class="section-header">
        <div class="section-title editable-field" onclick="openEditSection('${sec.id}')">${sec.title}</div>
        <div class="sec-actions">
          <button class="sec-btn" onclick="openEditSection('${sec.id}')">✏️ EDITAR</button>
          ${sec.deletable !== false ? `<button class="sec-btn del" onclick="deleteSection('${sec.id}')">🗑 DELETAR</button>` : ''}
        </div>
      </div>
      <div class="section-body">${buildSectionBody(sec)}</div>`;
    container.appendChild(wrap);
  });
}

function buildSectionBody(sec) {
  switch (sec.type) {
    case 'ranks':
      return `<div class="rank-grid">${buildRankCards()}</div>`;

    case 'livery':
      return `
        <div class="section-text editable-field" onclick="openEditSection('${sec.id}')">${sec.body}</div>
        <div class="livery-list" id="livery-list">${buildLiveries()}</div>`;

    case 'images':
      return `
        <div class="section-text editable-field" onclick="openEditSection('${sec.id}')">${sec.body}</div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-top:16px">
          ${buildImageSlot('img-l-' + sec.id, 'MASCULINO')}
          ${buildImageSlot('img-r-' + sec.id, 'FEMININO')}
        </div>`;

    default: /* text */
      return `<div class="section-text editable-field" onclick="openEditSection('${sec.id}')">${sec.body}</div>`;
  }
}

/* ----- image slot ----- */
function buildImageSlot(slotId, label) {
  const src = S.images[slotId];
  return `
    <div>
      <div class="img-slot-label">${label}</div>
      <div class="img-area" id="${slotId}" onclick="triggerUpload('${slotId}')">
        ${src
          ? `<img src="${src}" alt=""><div class="img-overlay"><button class="img-btn">📷 ALTERAR</button></div>`
          : `<div class="img-placeholder">
               ${imgPlaceholderSVG()}
               <p>Clique para adicionar</p>
             </div>
             <div class="img-overlay"><button class="img-btn">📷 ADICIONAR</button></div>`
        }
      </div>
    </div>`;
}

/* ----- rank cards ----- */
function buildRankCards() {
  return S.ranks.map(r => `
    <div class="rank-card">
      <div class="rank-card-hdr"><span>${r.name}</span></div>
      <div class="rank-card-body">
        <p style="margin-bottom:12px">${r.desc}</p>
        <div class="img-area" id="rank-img-${r.id}" onclick="triggerUpload('rank-img-${r.id}')">
          ${r.img
            ? `<img src="${r.img}" alt="${r.name}"><div class="img-overlay"><button class="img-btn">📷 ALTERAR</button></div>`
            : `<div class="img-placeholder">${imgPlaceholderSVG()}<p>Foto do uniforme</p></div>
               <div class="img-overlay"><button class="img-btn">📷 FOTO</button></div>`}
        </div>
        <div class="rank-actions">
          <button class="btn-gold" style="font-size:.65rem;padding:5px 12px" onclick="openEditRank(${r.id})">✏️ EDITAR</button>
          <button class="btn-del"  style="font-size:.65rem;padding:5px 12px" onclick="removeRank(${r.id})">🗑 REMOVER</button>
        </div>
      </div>
    </div>`).join('');
}

/* ----- liveries ----- */
function buildLiveries() {
  return S.liveries.map(l => `
    <div class="livery-item">
      <div class="livery-dot ${l.dot}"></div>
      <span class="livery-label" onclick="editLiveryLabel(${l.id})">${l.label}</span>
      <button class="livery-del" onclick="removeLivery(${l.id})">✕</button>
    </div>`).join('');
}

function imgPlaceholderSVG() {
  return `<svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2">
    <rect x="3" y="3" width="18" height="18" rx="2"/>
    <circle cx="8.5" cy="8.5" r="1.5"/>
    <polyline points="21 15 16 10 5 21"/>
  </svg>`;
}

/* =====================================================
   SEÇÕES — CRUD
   ===================================================== */
function openEditSection(id) {
  if (!S.editMode) return;
  const sec = S.sections.find(s => s.id === id);
  if (!sec) return;
  document.getElementById('edit-sec-id').value    = id;
  document.getElementById('edit-sec-title').value = sec.title;
  document.getElementById('edit-sec-body').value  =
    sec.body.replace(/<br\s*\/?>/gi, '\n').replace(/<[^>]+>/g, '');
  openModal('edit-section-modal');
}

function saveSectionEdit() {
  const id   = document.getElementById('edit-sec-id').value;
  const secs = S.sections;
  const sec  = secs.find(s => s.id === id);
  if (!sec) return;
  sec.title = document.getElementById('edit-sec-title').value;
  sec.body  = document.getElementById('edit-sec-body').value.replace(/\n/g, '<br>');
  S.sections = secs;
  renderSections();
  closeModal('edit-section-modal');
  showToast('Seção atualizada!');
}

function deleteSection(id) {
  if (!confirm('Deseja deletar esta seção?')) return;
  S.sections = S.sections.filter(s => s.id !== id);
  renderSections();
  showToast('Seção removida!');
}

function addSection() {
  const title = document.getElementById('new-sec-title').value.trim();
  const body  = document.getElementById('new-sec-body').value.trim();
  const type  = document.getElementById('new-sec-type').value;
  if (!title) { showToast('Digite um título!'); return; }

  const secs = S.sections;
  secs.push({ id: 's' + Date.now(), title, body, type, deletable: true });
  S.sections = secs;
  renderSections();
  closeModal('add-section-modal');
  document.getElementById('new-sec-title').value = '';
  document.getElementById('new-sec-body').value  = '';
  showToast('Seção criada!');
}

/* =====================================================
   PATENTES — CRUD
   ===================================================== */
function addRank() {
  const name = document.getElementById('rank-name').value.trim();
  const desc = document.getElementById('rank-desc').value.trim();
  const file = document.getElementById('rank-img-file').files[0];
  if (!name) { showToast('Digite o nome da patente!'); return; }

  const newRank = { id: Date.now(), name, desc, img: null };

  const finish = () => {
    const ranks = S.ranks;
    ranks.push(newRank);
    S.ranks = ranks;
    renderSections();
    closeModal('add-rank-modal');
    document.getElementById('rank-name').value = '';
    document.getElementById('rank-desc').value = '';
    showToast('Patente adicionada!');
  };

  if (file) {
    const rd = new FileReader();
    rd.onload = e => { newRank.img = e.target.result; finish(); };
    rd.readAsDataURL(file);
  } else {
    finish();
  }
}

function openEditRank(id) {
  const r = S.ranks.find(x => x.id === id);
  if (!r) return;
  document.getElementById('edit-rank-id').value   = id;
  document.getElementById('edit-rank-name').value = r.name;
  document.getElementById('edit-rank-desc').value = r.desc;
  openModal('edit-rank-modal');
}

function saveRankEdit() {
  const id    = +document.getElementById('edit-rank-id').value;
  const ranks = S.ranks;
  const r     = ranks.find(x => x.id === id);
  if (!r) return;
  r.name = document.getElementById('edit-rank-name').value;
  r.desc = document.getElementById('edit-rank-desc').value;
  S.ranks = ranks;
  renderSections();
  closeModal('edit-rank-modal');
  showToast('Patente atualizada!');
}

function removeRank(id) {
  if (!confirm('Remover esta patente?')) return;
  S.ranks = S.ranks.filter(r => r.id !== id);
  renderSections();
}

/* =====================================================
   LIVERY — CRUD
   ===================================================== */
function addLivery() {
  const label = document.getElementById('new-livery-label').value.trim();
  const dot   = document.getElementById('new-livery-dot').value;
  if (!label) { showToast('Digite uma descrição!'); return; }

  const liveries = S.liveries;
  liveries.push({ id: Date.now(), dot, label });
  S.liveries = liveries;

  const ll = document.getElementById('livery-list');
  if (ll) ll.innerHTML = buildLiveries();
  renderLiveryEditList();
  document.getElementById('new-livery-label').value = '';
  showToast('Livery adicionada!');
}

function removeLivery(id) {
  S.liveries = S.liveries.filter(l => l.id !== id);
  const ll = document.getElementById('livery-list');
  if (ll) ll.innerHTML = buildLiveries();
  renderLiveryEditList();
}

function editLiveryLabel(id) {
  if (!S.editMode) return;
  const liveries = S.liveries;
  const l = liveries.find(x => x.id === id);
  if (!l) return;
  const val = prompt('Editar descrição:', l.label);
  if (val === null) return;
  l.label = val;
  S.liveries = liveries;
  const ll = document.getElementById('livery-list');
  if (ll) ll.innerHTML = buildLiveries();
}

function renderLiveryEditList() {
  const el = document.getElementById('livery-edit-list');
  if (!el) return;
  const list = S.liveries;
  if (!list.length) {
    el.innerHTML = '<p style="font-size:.82rem;color:rgba(201,162,39,.35)">Nenhuma livery cadastrada.</p>';
    return;
  }
  el.innerHTML = list.map(l => `
    <div class="user-item">
      <div>
        <span>${l.label}</span>
        <div class="user-role-text">${l.dot}</div>
      </div>
      <button class="item-del" onclick="removeLivery(${l.id})">REMOVER</button>
    </div>`).join('');
}

/* =====================================================
   UPLOAD DE IMAGENS
   ===================================================== */
let pendingSlot = null;

function triggerUpload(slotId) {
  if (!S.editMode) return;
  pendingSlot = slotId;
  document.getElementById('global-upload').click();
}

document.getElementById('global-upload').addEventListener('change', function () {
  const file = this.files[0];
  if (!file || !pendingSlot) return;

  const rd = new FileReader();
  rd.onload = e => {
    const src = e.target.result;

    if (pendingSlot.startsWith('rank-img-')) {
      /* imagem de patente */
      const id    = +pendingSlot.replace('rank-img-', '');
      const ranks = S.ranks;
      const r     = ranks.find(x => x.id === id);
      if (r) { r.img = src; S.ranks = ranks; }
    } else {
      /* slot de imagem genérico */
      const imgs = S.images;
      imgs[pendingSlot] = src;
      S.images = imgs;
    }

    renderSections();
    showToast('Imagem atualizada!');
    this.value  = '';
    pendingSlot = null;
  };
  rd.readAsDataURL(file);
});

/* =====================================================
   BANNER (HERO)
   ===================================================== */
function saveHero() {
  const t = S.texts;
  t['hero-title'] = document.getElementById('hero-title-inp').value;
  t['hero-sub']   = document.getElementById('hero-sub-inp').value;
  S.texts = t;

  const file = document.getElementById('hero-logo-file').files[0];

  const finish = () => {
    applyTexts();
    closeModal('hero-modal');
    showToast('Banner atualizado!');
  };

  if (file) {
    const rd = new FileReader();
    rd.onload = e => {
      const src = e.target.result;
      document.getElementById('hero-bg-img').src = src;
      const imgs = S.images;
      imgs['hero-logo'] = src;
      S.images = imgs;
      finish();
    };
    rd.readAsDataURL(file);
  } else {
    finish();
  }
}

function restoreHeroLogo() {
  const src = S.images['hero-logo'];
  if (src) {
    const el = document.getElementById('hero-bg-img');
    if (el) el.src = src;
  }
}

/* =====================================================
   USUÁRIOS — CRUD
   ===================================================== */
function renderUsers() {
  const list = document.getElementById('users-list');
  if (!list) return;

  const users = S.users;
  if (!users.length) {
    list.innerHTML = '<p style="font-size:.82rem;color:rgba(201,162,39,.35);margin-bottom:8px">Nenhum usuário cadastrado.</p>';
    return;
  }

  const roleLabel = { viewer: 'Visualizador', editor: 'Editor', admin: 'Admin' };

  list.innerHTML = users.map((u, i) => `
    <div class="user-item">
      <div>
        <span>${u.nick || u.user}
          <span style="color:var(--text-dim);font-size:.82rem">(${u.user})</span>
        </span>
        <div class="user-role-text">${roleLabel[u.role] || u.role}${u.registered ? ' · ' + u.registered : ''}</div>
      </div>
      <div class="user-item-right">
        <select class="user-role-select" onchange="changeUserRole(${i}, this.value)">
          <option value="viewer" ${u.role === 'viewer' ? 'selected' : ''}>Visualizador</option>
          <option value="editor" ${u.role === 'editor' ? 'selected' : ''}>Editor</option>
          <option value="admin"  ${u.role === 'admin'  ? 'selected' : ''}>Admin</option>
        </select>
        <button class="item-del" onclick="removeUser(${i})">✕</button>
      </div>
    </div>`).join('');
}

function changeUserRole(i, role) {
  const users = S.users;
  users[i].role = role;
  S.users = users;
  showToast('Permissão alterada!');
}

function addUser() {
  const u = document.getElementById('new-user-name').value.trim();
  const p = document.getElementById('new-user-pass').value;
  const r = document.getElementById('new-user-role').value;

  if (!u || !p) { showToast('Preencha usuário e senha!'); return; }

  const users = S.users;
  if (users.find(x => x.user === u)) { showToast('Usuário já existe!'); return; }

  users.push({ user: u, pass: p, nick: u, role: r });
  S.users = users;
  renderUsers();
  document.getElementById('new-user-name').value = '';
  document.getElementById('new-user-pass').value = '';
  showToast('Usuário adicionado!');
}

function removeUser(i) {
  const users = S.users;
  users.splice(i, 1);
  S.users = users;
  renderUsers();
  showToast('Usuário removido!');
}

/* =====================================================
   ALTERAR SENHA
   ===================================================== */
function changePassword() {
  const cur = document.getElementById('pass-cur').value;
  const nw  = document.getElementById('pass-new').value;
  const cf  = document.getElementById('pass-cf').value;
  const err = document.getElementById('pass-err');
  err.style.display = 'none';

  if (cur !== S.ownerPass) { showErr(err, 'Senha atual incorreta.'); return; }
  if (!nw)                  { showErr(err, 'A nova senha não pode ser vazia.'); return; }
  if (nw !== cf)            { showErr(err, 'As senhas não coincidem.'); return; }

  S.ownerPass = nw;
  closeModal('password-modal');
  ['pass-cur', 'pass-new', 'pass-cf'].forEach(id => document.getElementById(id).value = '');
  showToast('Senha alterada com sucesso!');
}

/* =====================================================
   MODAIS
   ===================================================== */
function openModal(id) {
  /* preenche antes de abrir */
  if (id === 'users-modal')  renderUsers();
  if (id === 'livery-modal') renderLiveryEditList();
  if (id === 'hero-modal') {
    document.getElementById('hero-title-inp').value = S.texts['hero-title'] || 'UNIDADE ALTA';
    document.getElementById('hero-sub-inp').value   = S.texts['hero-sub']   || 'Capturar · Perseguir · Caçar';
  }
  document.getElementById(id).classList.add('open');
}

function closeModal(id) {
  document.getElementById(id).classList.remove('open');
}

/* Fechar clicando fora */
document.querySelectorAll('.modal-overlay').forEach(overlay => {
  overlay.addEventListener('click', e => {
    if (e.target === overlay) overlay.classList.remove('open');
  });
});

/* =====================================================
   TOAST
   ===================================================== */
function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2800);
}

/* =====================================================
   ATALHOS DE TECLADO
   ===================================================== */
document.addEventListener('keydown', e => {
  /* Enter no login */
  if (e.key === 'Enter' && document.getElementById('auth-screen').style.display !== 'none') {
    doLogin();
  }
  /* ESC fecha modais */
  if (e.key === 'Escape') {
    document.querySelectorAll('.modal-overlay.open').forEach(m => m.classList.remove('open'));
  }
});
