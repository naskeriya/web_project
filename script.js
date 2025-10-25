// async function addGeneratedImage(prompt, container) {
//     const response = await fetch('https://corsproxy.io/https://api.cloudflare.com/client/v4/accounts/33edd44e25ba937876a6d67dfbb8e96c/ai/run/@cf/lykon/dreamshaper-8-lcm', {
//         method: 'POST',
//         headers: {
//             'Authorization': 'Bearer TesvNSMYtNhadVu5IDZJp7zqvnsbah9AC6GytN5M',
//             'Content-Type': 'application/x-www-form-urlencoded'
//         },
//         body: `{ "prompt": "${prompt}" }`,
//     });

//     const imageUrl = URL.createObjectURL(await response.blob());
//     const image = document.createElement('img');
//     image.src = imageUrl;

//     container.append(image);
// }
// document.getElementById('submit').onclick = async () => {
//     const prompt = document.getElementById('prompt').value;
//     await addGeneratedImage(prompt, document.getElementById('image-container'));
// }


const $ = s => document.querySelector(s);
const $$ = s => Array.from(document.querySelectorAll(s));

/* ===========================
   THEME TOGGLE
=========================== */
(function themeInit(){
  const saved = localStorage.getItem('imagiseum-theme') || 'dark';
  if (saved === 'light') document.documentElement.setAttribute('data-theme', 'light');

  $$('[id^=theme-toggle], [id^=mobileThemeToggle]').forEach(btn =>
    btn.addEventListener('click', () => {
      const isLight = document.documentElement.getAttribute('data-theme') === 'light';
      if (isLight) {
        document.documentElement.removeAttribute('data-theme');
        localStorage.setItem('imagiseum-theme', 'dark');
      } else {
        document.documentElement.setAttribute('data-theme', 'light');
        localStorage.setItem('imagiseum-theme', 'light');
      }
    })
  );
})();

/* ===========================
   BURGER MENU
=========================== */
(function burgerMenu(){
  const burgers = $$('[id^=burger]');
  burgers.forEach(b => {
    const idNum = b.id.replace('burger','');
    const drawer = document.getElementById('mobileDrawer'+idNum) || document.getElementById('mobileDrawer');
    b.addEventListener('click', e => {
      e.stopPropagation();
      drawer.style.display = drawer.style.display === 'block' ? 'none' : 'block';
    });
  });
  document.addEventListener('click', e => {
    if (!e.target.closest('.mobile-drawer') && !e.target.closest('.burger')) {
      $$('.mobile-drawer').forEach(d => d.style.display = 'none');
    }
  });
})();

/* ===========================
   REAL AI IMAGE GENERATION
=========================== */
// script.js — minimal working AI generator (Cloudflare API)

async function generateAIImage(prompt, container) {
  // Показываем статус
  container.innerHTML = '<p>AI is imagining...</p>';

  try {
    const response = await fetch(
      'https://corsproxy.io/https://api.cloudflare.com/client/v4/accounts/33edd44e25ba937876a6d67dfbb8e96c/ai/run/@cf/lykon/dreamshaper-8-lcm',
      {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer TesvNSMYtNhadVu5IDZJp7zqvnsbah9AC6GytN5M',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      }
    );

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const blob = await response.blob();

    // Создаем ссылку на изображение
    const imageUrl = URL.createObjectURL(blob);

    // Очищаем контейнер и добавляем изображение
    container.innerHTML = '';
    const img = document.createElement('img');
    img.src = imageUrl;
    img.alt = prompt;
    img.style.maxWidth = '100%';
    img.style.borderRadius = '12px';
    container.appendChild(img);

  } catch (error) {
    console.error('Error generating image:', error);
    container.innerHTML = `<p style="color:red">Failed to generate image.<br>${error.message}</p>`;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const submitBtn = document.getElementById('submit');
  const promptInput = document.getElementById('prompt');
  const imageContainer = document.getElementById('image-container');

  if (!submitBtn || !promptInput || !imageContainer) {
    console.error('Missing required HTML elements (#submit, #prompt, #image-container)');
    return;
  }

  submitBtn.addEventListener('click', async () => {
    const prompt = promptInput.value.trim();
    if (!prompt) {
      imageContainer.innerHTML = '<p style="color:orange">Please enter a prompt first.</p>';
      return;
    }

    submitBtn.disabled = true;
    await generateAIImage(prompt, imageContainer);
    submitBtn.disabled = false;
  });
});


/* ===========================
   GENERATE PAGE LOGIC
=========================== */
(function generatorLogic(){
  const generateBtn = $('#generateBtn');
  const saveBtn = $('#saveBtn');
  const promptInput = $('#promptInput');
  const artContainer = $('#artCanvas');

  if (!generateBtn) return;

  let lastImageUrl = null;
  let lastPrompt = null;

  generateBtn.onclick = async () => {
    const prompt = promptInput.value.trim() || 'abstract dreamlike landscape';
    generateBtn.disabled = true;
    saveBtn.disabled = true;

    lastImageUrl = await addGeneratedImage(prompt, artContainer);
    lastPrompt = prompt;

    generateBtn.disabled = false;
    if (lastImageUrl) saveBtn.disabled = false;
  };

  saveBtn.onclick = () => {
    if (!lastImageUrl || !lastPrompt) return;
    let gallery = JSON.parse(localStorage.getItem('imagiseum-gallery') || '[]');
    gallery.unshift({ src: lastImageUrl, prompt: lastPrompt, ts: Date.now(), likes: 0 });
    localStorage.setItem('imagiseum-gallery', JSON.stringify(gallery));
    $('#status').textContent = 'Saved to gallery ✅';
    saveBtn.disabled = true;
  };
})();

/* ===========================
   GALLERY PAGE (search + likes)
=========================== */
(function galleryLogic(){
  const grid = $('#galleryGrid');
  if (!grid) return;

  const search = $('#gallerySearch');
  const clear = $('#clearSearch');

  function loadGallery(){
    return JSON.parse(localStorage.getItem('imagiseum-gallery') || '[]');
  }

  function saveGallery(arr){
    localStorage.setItem('imagiseum-gallery', JSON.stringify(arr));
  }

  function likeItem(index){
    let data = loadGallery();
    if (!data[index]) return;
    data[index].likes = (data[index].likes || 0) + 1;
    saveGallery(data);
    render(data);
  }

  function render(items){
    grid.innerHTML = '';
    if (!items.length) {
      grid.innerHTML = '<p class="muted">No artworks yet. Create and save from the Create page.</p>';
      return;
    }
    items.forEach((item, i) => {
      const div = document.createElement('div');
      div.className = 'card gallery-item';
      div.innerHTML = `
        <img src="${item.src}" alt="${item.prompt}">
        <div class="gallery-meta">
          <div class="prompt-text" title="${item.prompt}">${item.prompt}</div>
          <button class="like-btn" data-idx="${i}">❤ ${item.likes || 0}</button>
        </div>
      `;
      grid.append(div);
    });
    grid.querySelectorAll('.like-btn').forEach(btn =>
      btn.addEventListener('click', () => likeItem(Number(btn.dataset.idx)))
    );
  }

  function performSearch(){
    const q = (search.value || '').toLowerCase().trim();
    const all = loadGallery();
    const filtered = q ? all.filter(i => i.prompt.toLowerCase().includes(q)) : all;
    render(filtered);
  }

  render(loadGallery());
  search && search.addEventListener('input', performSearch);
  clear && clear.addEventListener('click', () => {
    search.value = '';
    render(loadGallery());
  });
})();

/* ===========================
   AUTHENTICATION (Sign up / Log in / Profile)
=========================== */
(function authLogic(){
  const signup = $('#signupForm');
  const login = $('#loginForm');
  const profileInfo = $('#profileInfo');
  const logoutBtn = $('#logoutBtn');

  function validEmail(e){return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);}
  function validPassword(p){return /^(?=.*[A-Za-z])(?=.*\d).{6,}$/.test(p);}
  function validPhone(ph){return !ph || /^[0-9+\s()\-]{6,20}$/.test(ph);}

  if (signup){
    signup.onsubmit = e => {
      e.preventDefault();
      const n = signup.name.value.trim();
      const em = signup.email.value.trim();
      const ph = signup.phone.value.trim();
      const pw = signup.password.value;
      const err = $('#signupError');

      if (!n || !em || !pw) return err.textContent = 'Fill all required fields.';
      if (!validEmail(em)) return err.textContent = 'Invalid email.';
      if (!validPassword(pw)) return err.textContent = 'Weak password.';
      if (!validPhone(ph)) return err.textContent = 'Invalid phone.';

      const users = JSON.parse(localStorage.getItem('imagiseum-users')||'[]');
      if (users.find(u => u.email === em)) return err.textContent = 'User already exists.';

      users.push({name:n,email:em,phone:ph,password:pw});
      localStorage.setItem('imagiseum-users', JSON.stringify(users));
      localStorage.setItem('imagiseum-current', JSON.stringify({name:n,email:em}));

      err.style.color = 'green';
      err.textContent = 'Signed up ✅ Redirecting...';
      setTimeout(()=>location.href='profile.html',700);
    };
  }

  if (login){
    login.onsubmit = e => {
      e.preventDefault();
      const em = login.email.value.trim();
      const pw = login.password.value;
      const err = $('#loginError');
      const users = JSON.parse(localStorage.getItem('imagiseum-users')||'[]');
      const user = users.find(u=>u.email===em && u.password===pw);
      if (!user) return err.textContent='Wrong credentials.';
      localStorage.setItem('imagiseum-current', JSON.stringify({name:user.name,email:user.email}));
      err.style.color='green';
      err.textContent='Login successful ✅';
      setTimeout(()=>location.href='profile.html',600);
    };
  }

  if (profileInfo){
    const user = JSON.parse(localStorage.getItem('imagiseum-current')||'null');
    if (!user){
      profileInfo.innerHTML = '<p class="muted">Not logged in. <a href="login.html">Sign in</a>.</p>';
    } else {
      profileInfo.innerHTML = `
        <p><strong>Name:</strong> ${user.name}</p>
        <p><strong>Email:</strong> ${user.email}</p>
        <p><a href="gallery.html">Go to your gallery</a></p>
      `;
    }
  }

  logoutBtn && (logoutBtn.onclick = () => {
    localStorage.removeItem('imagiseum-current');
    location.href = 'main.html';
  });
})();
// === AI генерация + сохранение в галерею ===

async function generateAIImage(prompt, container) {
  container.innerHTML = '<p>AI is imagining...</p>';

  try {
    const response = await fetch(
      'https://corsproxy.io/https://api.cloudflare.com/client/v4/accounts/33edd44e25ba937876a6d67dfbb8e96c/ai/run/@cf/lykon/dreamshaper-8-lcm',
      {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer TesvNSMYtNhadVu5IDZJp7zqvnsbah9AC6GytN5M',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      }
    );

    if (!response.ok) throw new Error(`API error: ${response.status}`);

    const blob = await response.blob();
    const reader = new FileReader();

    // конвертируем blob в dataURL, чтобы можно было сохранять в localStorage
    const dataUrl = await new Promise((resolve) => {
      reader.onloadend = () => resolve(reader.result);
      reader.readAsDataURL(blob);
    });

    // добавляем картинку
    container.innerHTML = '';
    const img = document.createElement('img');
    img.src = dataUrl;
    img.alt = prompt;
    img.style.maxWidth = '100%';
    img.style.borderRadius = '12px';
    container.appendChild(img);

    document.getElementById('save').disabled = false;
    document.getElementById('status').textContent = 'Image generated successfully ✅';

    // возвращаем dataUrl (для сохранения)
    return dataUrl;
  } catch (error) {
    console.error('Error generating image:', error);
    container.innerHTML = `<p style="color:red">Failed: ${error.message}</p>`;
    return null;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const submitBtn = document.getElementById('submit');
  const saveBtn = document.getElementById('save');
  const promptInput = document.getElementById('prompt');
  const imageContainer = document.getElementById('image-container');
  const status = document.getElementById('status');

  let lastImage = null;
  let lastPrompt = '';

  submitBtn.addEventListener('click', async () => {
    const prompt = promptInput.value.trim();
    if (!prompt) {
      status.textContent = 'Please enter a prompt first.';
      return;
    }

    submitBtn.disabled = true;
    saveBtn.disabled = true;
    status.textContent = 'Generating...';

    lastImage = await generateAIImage(prompt, imageContainer);
    lastPrompt = prompt;

    submitBtn.disabled = false;
  });

  saveBtn.addEventListener('click', () => {
    if (!lastImage || !lastPrompt) return;

    const gallery = JSON.parse(localStorage.getItem('imagiseum-gallery') || '[]');
    gallery.unshift({
      src: lastImage,
      prompt: lastPrompt,
      ts: Date.now(),
    });
    localStorage.setItem('imagiseum-gallery', JSON.stringify(gallery));

    saveBtn.disabled = true;
    status.textContent = 'Saved to your gallery 🖼️';
    
  });
});
const galleryContainer = document.getElementById('gallery');
    const search = document.getElementById('search');

    function loadGallery() {
      const all = JSON.parse(localStorage.getItem('imagiseum-gallery') || '[]');
      const q = search.value.toLowerCase();
      return q ? all.filter(i => i.prompt.toLowerCase().includes(q)) : all;
    }

    function renderGallery() {
      const items = loadGallery();
      galleryContainer.innerHTML = items.length
        ? items.map(i => `
            <div class="card">
              <img src="${i.src}" alt="${i.prompt}">
              <div class="prompt">${i.prompt}</div>
            </div>
          `).join('')
        : '<p>No artworks saved yet.</p>';
    }

    search.addEventListener('input', renderGallery);
    renderGallery();
