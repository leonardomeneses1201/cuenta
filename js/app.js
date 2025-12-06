const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const nameRegex = /^[A-Za-zÁÉÍÓÚÑáéíóúñ ]+$/;
const passRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{6,}$/;
const phoneRegex = /^[0-9]{7,12}$/;

let users = JSON.parse(localStorage.getItem('users')) || [];

function showForm(formName) {
    document.getElementById('login').classList.add('hidden');
    document.getElementById('register').classList.add('hidden');
    document.getElementById('recovery').classList.add('hidden');
    document.getElementById('welcome').classList.add('hidden');
    document.getElementById(formName).classList.remove('hidden');
    clearMessages();
}

function clearMessages() {
    document.getElementById('loginMsg').classList.add('hidden');
    document.getElementById('regMsg').classList.add('hidden');
    document.getElementById('recMsg').classList.add('hidden');
}

function showMessage(id, text, type) {
    const msg = document.getElementById(id);
    msg.textContent = text;
    msg.className = `message ${type}`;
    msg.classList.remove('hidden');
}

function togglePassword(inputId) {
    const input = document.getElementById(inputId);
    input.type = input.type === 'password' ? 'text' : 'password';
}

function validatePassword(password, type) {
    const req = document.getElementById(type + 'Req');
    if (passRegex.test(password)) {
        req.textContent = '✓ Contraseña válida';
        req.className = 'requirement valid';
    } else {
        req.textContent = 'Mínimo 6 caracteres, una mayúscula, una minúscula, un número y un carácter especial';
        req.className = 'requirement invalid';
    }
}

function register() {
    const name = document.getElementById('regName').value;
    const email = document.getElementById('regEmail').value;
    const phone = document.getElementById('regPhone').value;
    const pass = document.getElementById('regPass').value;
    
    if (!nameRegex.test(name)) {
        showMessage('regMsg', 'Nombre no válido', 'error');
        return;
    }
    
    if (!emailRegex.test(email)) {
        showMessage('regMsg', 'Correo no válido', 'error');
        return;
    }
    
    if (!phoneRegex.test(phone)) {
        showMessage('regMsg', 'Teléfono no válido', 'error');
        return;
    }
    
    if (!passRegex.test(pass)) {
        showMessage('regMsg', 'Contraseña no cumple requisitos', 'error');
        return;
    }
    
    if (users.some(u => u.email === email)) {
        showMessage('regMsg', 'Usuario ya existe', 'error');
        return;
    }
    
    users.push({name, email, phone, pass, blocked: false, attempts: 0});
    localStorage.setItem('users', JSON.stringify(users));
    
    showMessage('regMsg', 'Cuenta creada exitosamente', 'success');
    setTimeout(() => showForm('login'), 2000);
}

function login() {
    const email = document.getElementById('loginEmail').value;
    const pass = document.getElementById('loginPass').value;
    const user = users.find(u => u.email === email);
    
    if (!user) {
        showMessage('loginMsg', 'Usuario o contraseña incorrectos', 'error');
        return;
    }
    
    if (user.blocked) {
        showMessage('loginMsg', 'Cuenta bloqueada. Usa recuperación de contraseña', 'error');
        return;
    }
    
    if (user.pass === pass) {
        user.attempts = 0;
        localStorage.setItem('users', JSON.stringify(users));
        document.getElementById('welcomeMsg').textContent = `Bienvenido al sistema, ${user.name}`;
        showForm('welcome');
    } else {
        user.attempts = (user.attempts || 0) + 1;
        
        if (user.attempts >= 3) {
            user.blocked = true;
            showMessage('loginMsg', 'Cuenta bloqueada por intentos fallidos', 'error');
        } else {
            showMessage('loginMsg', `Usuario o contraseña incorrectos. Intentos restantes: ${3 - user.attempts}`, 'error');
        }
        
        localStorage.setItem('users', JSON.stringify(users));
    }
}

function recover() {
    const email = document.getElementById('recEmail').value;
    const pass = document.getElementById('recPass').value;
    const user = users.find(u => u.email === email);
    
    if (!user) {
        showMessage('recMsg', 'Usuario no encontrado', 'error');
        return;
    }
    
    if (!passRegex.test(pass)) {
        showMessage('recMsg', 'Contraseña no cumple requisitos', 'error');
        return;
    }
    
    user.pass = pass;
    user.blocked = false;
    user.attempts = 0;
    localStorage.setItem('users', JSON.stringify(users));
    
    showMessage('recMsg', 'Contraseña actualizada. Ahora puede iniciar sesión', 'success');
    setTimeout(() => showForm('login'), 2000);
}

function logout() {
    showForm('login');
}

showForm('login');