const galleryContainer = document.querySelector('.gallery__cards');
const emptyContainer = document.querySelector('.gallery__empty');
const search = document.getElementById('search');

function loadGallery() {
  const all = JSON.parse(localStorage.getItem('imagiseum-gallery') || '[]');
  const q = search.value.toLowerCase();
  return q ? all.filter(i => i.prompt.toLowerCase().includes(q)) : all;
}

function renderGallery() {
  emptyContainer.innerHTML = "";

  const items = loadGallery();

  if (items.length) {
    galleryContainer.innerHTML = items.map(i => `
      <div class="card">
        <div class="ibg">
          <img src="${i.src}" alt="${i.prompt}">
        </div>
        <div class="prompt">${i.prompt}</div>
      </div>
    `).join('');
  } else {
    galleryContainer.innerHTML = "";
    emptyContainer.innerHTML = '<p style="text-align: center;">No artworks saved yet.</p>';
  }
}

search.addEventListener('input', renderGallery);
renderGallery();
