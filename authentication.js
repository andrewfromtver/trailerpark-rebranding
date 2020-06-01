/* Authentication */
    document.querySelector('.loginForm').addEventListener('submit', function(){login();})
    document.querySelector('#login').value = localStorage.getItem('lastLogin') || '';
    document.querySelector('.content').style.display = 'none';
    if (sessionStorage.authentication) {relogin(JSON.parse(sessionStorage.authentication).login ,JSON.parse(sessionStorage.authentication).password_fingerprint);}
    if (localStorage.authentication) {relogin(JSON.parse(localStorage.authentication).login ,JSON.parse(localStorage.authentication).password_fingerprint);}
    function login() {
        let authentication = JSON.parse(localStorage.getItem('authentication')) || [];
        const generateId = () => `${Math.round(Math.random() * 1e8).toString(16)}`
        const generatePassword = (password) => `${Math.round(password * 1e8).toString(16)}`
        let login = document.querySelector('#login').value;
        let password = document.querySelector('#password').value;
        let lastLogin = '';
        if (!localStorage.auth_history) {
            localStorage.setItem('auth_history', '[]');
        }
        let auth_history = JSON.parse(localStorage.getItem('auth_history'));
            if (login && password) {
            const operation = {
                id: generateId(),
                login: login,
                password_fingerprint: generatePassword(password),
            };
            if (auth_history.includes(operation.login + ' | ' + operation.password_fingerprint)) {
                sessionStorage.setItem('session', operation.login + ' | ' + operation.password_fingerprint);
                    lastLogin = operation.login;
                    localStorage.setItem('lastLogin', lastLogin);
                    authentication = operation;
                    sessionStorage.setItem('authentication', JSON.stringify(authentication));
                    if (document.querySelector('.chekbox').checked) {
                        localStorage.setItem('authentication', JSON.stringify(authentication));
                    }
                    document.querySelector('.login__form').innerHTML = '<div class="lds-ellipsis loader"><div></div><div></div><div></div><div></div></div>';
                    startPage();
                    function init() {
                        document.querySelector('.content').style.display = '';
                        document.querySelector('.login__form__background').style.display = 'none';
                        document.querySelector('body').style.overflow = 'auto';
                        liked = JSON.parse(localStorage.getItem(sessionStorage.session)) || [];
                        
                    }
                    setTimeout(init, 2000);
                    if (!sessionStorage.reloaded) {
                        sessionStorage.setItem('reloaded', true);
                        window.location.reload();
                    }               
                }
            }
            document.querySelector('.login__form').innerHTML = `
            <h4 class="title" style="padding: 10px 20px;">Введен неверный логин или PIN-код</h4>
            <a href="">
                <button class="btn">Назад</button>
            </a>
            `;
        }
    function relogin(usr, pwd) {
        const generateId = () => `${Math.round(Math.random() * 1e8).toString(16)}`
        const operation = {
            id: generateId(),
            login: usr,
            password_fingerprint: pwd,
        };
        sessionStorage.setItem('session', operation.login + ' | ' + operation.password_fingerprint);
        let authentication = JSON.parse(localStorage.getItem('authentication')) || [];
        let lastLogin = ''
        lastLogin = operation.login;
        localStorage.setItem('lastLogin', lastLogin);
        authentication = operation;
        sessionStorage.setItem('authentication', JSON.stringify(authentication));
        document.querySelector('.login__form').innerHTML = '<div class="lds-ellipsis loader"><div></div><div></div><div></div><div></div></div>';
        startPage();
        function init() {
            document.querySelector('.content').style.display = '';
            document.querySelector('.login__form__background').style.display = 'none';
            document.querySelector('body').style.overflow = 'auto';
            liked = JSON.parse(localStorage.getItem(sessionStorage.session)) || [];
        }
        setTimeout(init, 2000);
        if (!sessionStorage.reloaded) {
            sessionStorage.setItem('reloaded', true);
            window.location.reload();
        }
    }
    function logout() {
        sessionStorage.clear();
        localStorage.removeItem('authentication');
    }
    function regUser() {
        console.log('123');
        const generatePassword = (password) => `${Math.round(password * 1e8).toString(16)}`
        let login = document.querySelector('#login').value;
        let password = document.querySelector('#password').value;
        let password_fingerprint = generatePassword(password);
        localStorage.setItem('auth_history', JSON.stringify([login + ' | ' + password_fingerprint]));
        document.querySelector('.login__form').innerHTML = '<div class="lds-ellipsis loader"><div></div><div></div><div></div><div></div></div>';
        document.querySelector('.login__form').innerHTML = `
        <h4 class="title" style="padding: 10px 20px;">Учетная запись ${login} успешно зарегистрированна</h4>
        <a href="">
            <button class="btn">Назад</button>
        </a>
        `;
    }
