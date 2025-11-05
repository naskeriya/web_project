// Mobile Burger Menu
const burger = document.querySelector('.header__burger');
const navigation = document.querySelector('.header__nav');

burger.addEventListener('click', (e) => {
  e.stopPropagation();
  navigation.classList.toggle('hidden-on-mobile');
});

document.addEventListener('click', (e) => {
  if (!e.target.closest('.header__nav') && !e.target.closest('.header__burger')) {
    document.querySelector('.header__nav').classList.add('hidden-on-mobile');
  }
});


// Theme
const theme = localStorage.getItem('imagiseum-theme') || 'dark';

if (theme === 'light') {
  document.documentElement.setAttribute('data-theme', theme);
}

document.getElementById('theme-toggle').addEventListener('click', () => {
  const isLight = document.documentElement.getAttribute('data-theme') === 'light';
  if (isLight) {
    document.documentElement.removeAttribute('data-theme');
    localStorage.setItem('imagiseum-theme', 'dark');
  } else {
    document.documentElement.setAttribute('data-theme', 'light');
    localStorage.setItem('imagiseum-theme', 'light');
  }
});


// User
const signInLink = document.getElementById('header-sign-in');
const profileLink = document.getElementById('header-profile');

const user = JSON.parse(localStorage.getItem('imagiseum-current')||'null');
if (user){
  signInLink.style.display = 'none';
  profileLink.style.display = 'inline';
} else {
  signInLink.style.display = 'inline';
  profileLink.style.display = 'none';
}
