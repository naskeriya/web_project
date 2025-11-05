const signup = document.querySelector('#signupForm');
const login = document.querySelector('#loginForm');

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
    const err = document.querySelector('#signupError');

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
    setTimeout(()=>location.href='../profile/index.html',700);
  };
}

if (login){
  login.onsubmit = e => {
    e.preventDefault();
    const em = login.email.value.trim();
    const pw = login.password.value;
    const err = document.querySelector('#loginError');
    const users = JSON.parse(localStorage.getItem('imagiseum-users')||'[]');
    const user = users.find(u=>u.email===em && u.password===pw);
    if (!user) return err.textContent='Wrong credentials.';
    localStorage.setItem('imagiseum-current', JSON.stringify({name:user.name,email:user.email}));
    err.style.color='green';
    err.textContent='Login successful ✅';
    setTimeout(()=>location.href='../profile/index.html',600);
  };
}
