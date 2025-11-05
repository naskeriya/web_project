const profileInfo = document.querySelector('#profileInfo');
const logoutBtn = document.querySelector('#logoutBtn');

if (profileInfo){
  const user = JSON.parse(localStorage.getItem('imagiseum-current')||'null');
  if (!user){
    profileInfo.innerHTML = '<p class="muted">Not logged in. <a href="login.html">Sign in</a>.</p>';
  } else {
    profileInfo.innerHTML = `
      <p><strong>Name:</strong> ${user.name}</p>
      <p><strong>Email:</strong> ${user.email}</p>
      <p><a class="profile__link" href="../gallery/index.html">Go to your gallery</a></p>
    `;
  }
}

logoutBtn && (logoutBtn.onclick = () => {
  localStorage.removeItem('imagiseum-current');
  location.href = '../index/index.html';
});
