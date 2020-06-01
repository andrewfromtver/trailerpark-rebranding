/* Authentication */
    let initVar = 0;
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
        auth_history = JSON.parse(localStorage.getItem('auth_history'));
        if (login && password) {
            const operation = {
                id: generateId(),
                login: login,
                password_fingerprint: generatePassword(password),
            };
            sessionStorage.setItem('session', operation.login + ' | ' + operation.password_fingerprint);
            if (localStorage.auth_history) {
                if (!localStorage.auth_history.includes(operation.login + ' | ' + operation.password_fingerprint)) {
                    auth_history.push(operation.login + ' | ' + operation.password_fingerprint);
                    localStorage.setItem('auth_history', JSON.stringify(auth_history));
                    document.querySelector('.login__form').innerHTML = '<div class="lds-ellipsis loader"><div></div><div></div><div></div><div></div></div>';
                    function reg() {
                        document.querySelector('.login__form').innerHTML = `
                        <h4 class="title" >Учетная запись ${operation.login} успешно зарегистрированна</h4>
                        <a href="">
                            <button class="btn">Назад</button>
                        </a>
                        `;
                    }
                    setTimeout(reg, 2000);
                } else {
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
                        if (initVar < 1) {
                            location.href=location.href;
                            initVar +=1;
                        }
                    }
                    setTimeout(init, 2000);
                }
            }
        }
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
            if (initVar < 1) {
                location.href=location.href;
                initVar +=1;
            }
        }
        setTimeout(init, 2000);
    }
    function logout() {
        sessionStorage.clear();
        localStorage.removeItem('authentication');
    }
