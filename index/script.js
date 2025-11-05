async function generateAIImage(prompt, imageContainer, saveButton, statusContainer) {
  imageContainer.innerHTML = '<p>AI is imagining...</p>';

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
    imageContainer.innerHTML = '';
    const img = document.createElement('img');
    img.src = dataUrl;
    img.alt = prompt;
    img.style.maxWidth = '100%';
    img.style.borderRadius = '12px';
    imageContainer.appendChild(img);

    saveButton.disabled = false;
    statusContainer.textContent = 'Image generated successfully ✅';

    // возвращаем dataUrl (для сохранения)
    return dataUrl;
  } catch (error) {
    console.error('Error generating image:', error);
    imageContainer.innerHTML = `<p style="color:red">Failed: ${error.message}</p>`;
    return null;
  }
}

const submitBtn = document.getElementById('submit');
const saveBtn = document.getElementById('save');
const promptInput = document.getElementById('prompt');
const status = document.querySelector('.image-generator__status');
const imageContainer = document.querySelector('.image-generator__image');

let lastImage = null;
let lastPrompt = '';

submitBtn.addEventListener('click', async (e) => {
  e.preventDefault();

  const user = JSON.parse(localStorage.getItem('imagiseum-current')||'null');
  if (!user){
    status.style.color = 'red';
    status.textContent = 'Please sign in!';
    return
  }

  const prompt = promptInput.value.trim();
  if (!prompt) {
    status.textContent = 'Please enter a prompt first.';
    return;
  }

  submitBtn.disabled = true;
  saveBtn.disabled = true;
  status.textContent = 'Generating...';

  lastImage = await generateAIImage(prompt, imageContainer, saveBtn, status);
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
  status.textContent = 'Saved to your gallery 🖼️'
});
