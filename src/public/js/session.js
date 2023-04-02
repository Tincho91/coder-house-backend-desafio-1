const action = document.querySelector('.container').dataset.action || 'signin';
const signinForm = document.getElementById('signin-form');
const signupForm = document.getElementById('signup-form');
const signinTab = document.getElementById('signin-tab');
const signupTab = document.getElementById('signup-tab');

if (action === 'signin') {
  signinTab.classList.add('active');
  signupTab.classList.remove('active');
  signinForm.style.display = 'block';
  signupForm.style.display = 'none';
} else if (action === 'signup') {
  signinTab.classList.remove('active');
  signupTab.classList.add('active');
  signinForm.style.display = 'none';
  signupForm.style.display = 'block';
}

signinTab.addEventListener('click', (e) => {
  e.preventDefault();
  signinTab.classList.add('active');
  signupTab.classList.remove('active');
  signinForm.style.display = 'block';
  signupForm.style.display = 'none';
});

signupTab.addEventListener('click', (e) => {
  e.preventDefault();
  signinTab.classList.remove('active');
  signupTab.classList.add('active');
  signinForm.style.display = 'none';
  signupForm.style.display = 'block';
});