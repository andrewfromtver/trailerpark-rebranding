const serachForm = document.querySelector('#search-form');
const movie = document.querySelector('#movies');
const img = 'https://image.tmdb.org/t/p/w500';

/* Init */
    function startPage() {
        /* Listeners */
            document.getElementById("movies").addEventListener('wheel', function(event) {
                if (event.deltaMode == event.DOM_DELTA_PIXEL) {
                var modifier = 1;
                } else if (event.deltaMode == event.DOM_DELTA_LINE) {
                var modifier = parseInt(getComputedStyle(this).lineHeight);
                } else if (event.deltaMode == event.DOM_DELTA_PAGE) {
                var modifier = this.clientHeight;
                }
                if (event.deltaY != 0) {
                this.scrollLeft += modifier * event.deltaY;
                event.preventDefault();
                }
            });
            document.getElementById("movies__rec").addEventListener('wheel', function(event) {
                if (event.deltaMode == event.DOM_DELTA_PIXEL) {
                var modifier = 1;
                } else if (event.deltaMode == event.DOM_DELTA_LINE) {
                var modifier = parseInt(getComputedStyle(this).lineHeight);
                } else if (event.deltaMode == event.DOM_DELTA_PAGE) {
                var modifier = this.clientHeight;
                }
                if (event.deltaY != 0) {
                this.scrollLeft += modifier * event.deltaY;
                event.preventDefault();
                }
            });
            serachForm.addEventListener('submit', apiSearch);
        /* Init */
            document.querySelector(".up__btn").style.display = "none";
            document.querySelector('body').style.overflow = 'hidden';
            show('multi', 'day', 'day');
            document.querySelector('.logout').innerHTML = `
            <div class="header__logout">
                <a href="" onclick="logout()">
                <img src="./img/logout.png" width="21" height="21">
                </a>
            </div>
            `;
            genChek();
            setTimeout(devCheck, 2050);
    }
/* Main features */
    function show(type, time) {
        title.innerHTML = `
        <div class="loader__placeholder">
            <div class="lds-ellipsis loader"><div></div><div></div><div></div><div></div></div>
        </div>`;
        function init() {
            fetch(`https://api.themoviedb.org/3/trending/${type}/${time}?api_key=dcaf7f5ea224596464b7714bac28142f&language=ru`)
            .then(function(value){
                if(value.status !== 200){
                    return Promise.reject(new Error('Ошибка'));
                }
                    return value.json();
            })
            .then(function(output){
                let inner = '';
                if(output.results.length === 0){
                    title.innerHTML = '<h4 class="title" >Упс, что-то пошло не так!</h4>';
                }
                let ids = [];
                output.results.forEach(function (item){
                    ids.push(item.id);
                    let nameItem = item.name || item.title;
                    let mediaType = item.media_type;
                    let poster = null;
                    let cheked = '';
                    if (type == 'person') {
                        const posterVar = item.profile_path ? img + item.profile_path : './img/noposter.png';
                        poster = posterVar;
                    }
                    else {
                        const posterVar = item.poster_path ? img + item.poster_path : './img/noposter.png';
                        poster = posterVar;
                        if (true) {
                            if (liked.includes(`${item.id}`)) {
                                cheked = `<img src='./img/chek.png' width="25" height="25" class='chek'>`;
                            }
                        }
                    }
                    let dataInfo = `data-id="${item.id}" data-type="${mediaType}"`;
                    inner += `
                        <div class="item">
                    `;
                    if (item.vote_average > 0 && item.vote_average < 5) {
                        inner += `<p class="rate" style="background-color: tomato;">${item.vote_average}</p>`;
                    }
                    if (item.vote_average >= 5 && item.vote_average < 8) {
                        inner += `<p class="rate" style="background-color: darkorange;">${item.vote_average}</p>`;
                    }
                    if (item.vote_average >= 8) {
                        inner += `<p class="rate" style="background-color: darkgreen;">${item.vote_average}</p>`;
                    }
                    if (item.vote_average == 0) {
                        inner += `<p class="rate" style="background-color: tomato;">н/д</p>`;
                    }
                    inner += `
                        <img src="${poster}" class="poster" alt="${nameItem}" ${dataInfo}>
                        <h5>${nameItem.substr(0, 25)}</h5>
                        </div>
                        ${cheked}
                    `;
                });
                if (type == 'movie') title.innerHTML = '<h4 class="title" >Самые популярные фильмы</h4>';
                if (type == 'tv') title.innerHTML = '<h4 class="title" >Самые популярные сериалы</h4>';
                if (type == 'multi') title.innerHTML = '<h4 class="title" >Самые популярные фильмы и сериалы</h4>';
                if (type == 'person') title.innerHTML = '<h4 class="title" >Самые популярные актёры</h4>';
                movie.innerHTML = inner;
                const media = movie.querySelectorAll('img[data-id]');
                media.forEach(function(elem){
                    elem.addEventListener('click', showFullInfo);
                });
            })
            .catch(function(reason){
                title.innerHTML = `<h4 class="title">Упс, что-то пошло не так!</h4>`;
                console.error('error: ' + reason);
            });
            devCheck();
        }
        const el = document.getElementById('movies');
        el.scrollIntoView({block: "center", inline: "center", behavior: "smooth"});
        setTimeout(init, 1000);
    }
    function showFullInfo(){
        title__item.innerHTML = `
        <div class="loader__placeholder">
            <div class="lds-ellipsis loader"><div></div><div></div><div></div><div></div></div>
        </div>`;
            let url = '';
            if(this.dataset.type === 'movie'){
                url = 'https://api.themoviedb.org/3/movie/' + 
                this.dataset.id + 
                '?api_key=dcaf7f5ea224596464b7714bac28142f&language=ru';
            }else if(this.dataset.type === 'tv'){
                url = 'https://api.themoviedb.org/3/tv/' + 
                this.dataset.id + 
                '?api_key=dcaf7f5ea224596464b7714bac28142f&language=ru';
            }else if(this.dataset.type === 'person'){
                url = 'https://api.themoviedb.org/3/person/' + 
                this.dataset.id + 
                '?api_key=dcaf7f5ea224596464b7714bac28142f&language=ru';
            }else{
                title__item.innerHTML = '<h4 class="title" >Упс, что-то пошло не так!</h4>';
            };
            const id =  this.dataset.id;
            const type = this.dataset.type;
            fetch(url)
            .then(function(value){
                if(value.status !== 200){
                    return Promise.reject(new Error('Ошибка!'));
                }
                return value.json();
            })
            .then(function (output) {
                let cheked = '';
                if (type == 'person') {
                    fetch(`https://api.themoviedb.org/3/discover/movie?api_key=dcaf7f5ea224596464b7714bac28142f&` + 
                        `language=ru&sort_by=popularity.desc&include_adult=false&include_video=false&page=1&with_people=${id}`)
                    .then(function(value){
                        if(value.status !== 200){
                            return Promise.reject(new Error('Ошибка'));
                        }
                            return value.json();
                    })
                    .then(function(output){
                        let inner = '';
                        let i = output.results.length;
                        output.results.forEach(function (item){
                            let nameItem = item.name || item.title;
                            let poster = null;
                            const posterVar = item.poster_path ? img + item.poster_path : './img/noposter.png';
                            poster = posterVar;
                            let cheked = '';
                            if (true) {
                                if (liked.includes(`${item.id}`)) {
                                    cheked = `<img src='./img/chek.png' width="25" height="25" class='chek'>`;
                                }
                            }
                            inner += `
                                <div class="item">
                                <img src="${poster}" class="poster" onclick="showById(${item.id}, 'movie')" alt ="${nameItem}">
                                <h5>${nameItem.substr(0, 25)}</h5>
                                </div>
                                ${cheked}
                            `;
                        });
                        document.querySelector('.rec__list').innerHTML = inner;
                        if(i === 0){
                            document.querySelector('.rec__list').innerHTML = `<h4 class="title rec__title">Упс, что-то пошло не так!</h4>`;
                        }
                        devCheck();
                    })
                    .catch(function(reason){
                        document.querySelector('.rec__list').innerHTML = `<h4 class="title rec__title">Упс, что-то пошло не так!</h4>`;
                        console.error('error: ' + reason);
                    });
                    const poster1 = output.profile_path ? img + output.profile_path : './img/noposter.png';
                    title__item.innerHTML = `<h4 class="title">${output.name}</h4>`;
                    let bio = '';
                    if (output.biography) {
                        bio = output.biography;
                    }else {
                        bio = 'К сожалению биография отсутствует';
                    }
                    let birthday = '';
                    if (output.birthday) {
                        birthday = output.birthday;
                    }else {
                        birthday = 'К сожалению дата рождения отсутствует';
                    }
                    let place_of_birth = '';
                    if (output.place_of_birth) {
                        place_of_birth = output.place_of_birth;
                    }else {
                        place_of_birth = 'К сожалению данные отсутствуют';
                    }
                    item.innerHTML = `
                    <div class="item__poster">
                        <img src='${poster1}' alt='${output.name}' class='poster__info'>
                        ${(output.homepage) ? `<a href="${output.homepage}" target="_blank"><p class="btn__info"> Официальная страница </p></a>` : ''}
                        ${cheked}
                    </div>
                    <div class="item__info">
                        <p>Дата рождения: ${birthday}</p>
                        <p>Место рождения: ${place_of_birth}</p>
                        <br>
                        <p>Биография: ${bio}</p>
                        <br>
                        <div class='youtube'></div>
                    </div>
                    `;
                    trailer.innerHTML = '';
                }else {
                    if (true) {
                        if (liked.includes(`${output.id}`)) {
                            cheked = `<img src='./img/chek.png' width="25" height="25" class='chek'>`;
                        }
                    }
                    const poster1 = output.poster_path ? img + output.poster_path : './img/noposter.png';
                    title__item.innerHTML = `<h4 class="titleContent">${output.name || output.title}</h4>`;
                    let vote = '';
                    if (!output.vote_average == 0) {
                        vote = output.vote_average;
                    }else {
                        vote = 'Отсутствует';
                    }
                    let first_air_date = '';
                    if (output.first_air_date || output.release_date) {
                        first_air_date = output.first_air_date || output.release_date;
                    }else {
                        first_air_date = 'К сожалению данные отсутствуют';
                    }
                    if (output.type == undefined) {
                        itemType = 'movie';
                    } else {
                        itemType = 'tv';
                    }
                    item.innerHTML = `
                    <div class="item__poster" id="${itemType}">
                        <img src='${poster1}' alt='${output.name || output.title}' class='poster__info'>
                        ${(output.homepage) ? `<a href="${output.homepage}" target="_blank">
                            <p class="btn__info">Официальная страница</p>
                        </a>` : ''}
                        ${(output.imdb_id) ? `<a href="https://imdb.com/title/${output.imdb_id}" target="_blank">
                            <p class="btn__info">Страница на IMDB.COM</p>
                        </a>` : ''}
                    </div>
                    ${cheked}
                    <div class="item__info" id="${output.id}">
                        <p>Рейтинг: ${vote}</p>
                        <p>Премьера: ${first_air_date} </p>
                        <br>
                        <div class='item__cheked'>
                            В избранное:
                            <img src='./img/star.png' width="25" height="25" class='star' id='${output.id}' onclick='like()' onload='alredyLiked()'>
                        </div>
                        <p>Описание: ${output.overview || 'К сожалению описание отсутствует'}</p>
                        <br>
                        <div class='youtube'></div>
                    </div>
                    `;
                    if (type == 'movie') {
                        item.innerHTML += `
                            <a onclick="showRecomendations(${output.id}, 'movie')">
                                <p class="btn__info__rec">Рекомендации</p>
                            </a>
                            `;
                    }else {
                        item.innerHTML += `
                            <a onclick="showRecomendations(${output.id}, 'tv')">
                                <p class="btn__info__rec">Рекомендации</p>
                            </a>
                            `;
                    }
                    item.innerHTML += `
                    <a href="https://www.google.com/search?q=${output.name || output.title} смотреть онлайн&tbm=vid&tbs=dur:l" target="blank">
                        <p class="btn__watch__online">Искать</p>
                    </a>
                    `;
                    getVideo(id, type);
                }
            })
            .catch(function(reason){
                title__item.innerHTML = `<h4 class="title">Упс, что-то пошло не так!</h4>`;
                item.innerHTML = '';
                trailer.innerHTML = '';
                console.error('error: ' + reason);
        });
        trending.innerHTML = '';
        document.querySelector('.rec__list').innerHTML = ``;
        devCheck();
    }
/* Youtube trailers search */
    function getVideo(id, type){
        trailer.innerHTML = `
        <div class="loader__placeholder">
            <div class="lds-ellipsis loader"><div></div><div></div><div></div><div></div></div>
        </div>`
        fetch("https://api.themoviedb.org/3/"+type+"/"+id+"/videos?api_key=dcaf7f5ea224596464b7714bac28142f&language=ru")
        .then(function(value){
            if(value.status !== 200){
                return Promise.reject(new Error(value.status));
            }
            return value.json();
        })
        .then((output) => {
            let videoFrame = '<h3 class="title" >Трейлеры</h3>';
            if(output.results.length === 0){
            fetch("https://api.themoviedb.org/3/"+type+"/"+id+"/videos?api_key=dcaf7f5ea224596464b7714bac28142f&language=en")
            .then(function(value){
            if(value.status !== 200){
                return Promise.reject(new Error(value.status));
            }
            return value.json();
            })
            .then((output) => {
            let videoFrame = '<h4 class="title" >Трейлеры</h4>';
            if(output.results.length === 0){
                videoFrame = `<h4 class="title" >К сожалению трейлеры отсутствуют</h4>`;
            }
            output.results.forEach((item)=>{
                videoFrame += `<div class="trailer__frame id__${item.key}">
                    <img src="./img/video.png" class="frame__hide" id="id__${item.key}" onclick="frameHide()">
                    <iframe class="iframe" src="https://www.youtube.com/embed/${item.key}" frameborder="0"></iframe>
                </div>`;
            });
            trailer.innerHTML = videoFrame;
            })
            .catch((reason) => {
            trailer.innerHTML = `<h4 class="title" >К сожалению трейлеры отсутствуют</h4>`;
            console.error(reason || reason.status);
            });
            }
            output.results.forEach((item)=>{
                videoFrame += `<div class="trailer__frame id__${item.key}">
                    <img src="./img/video.png" class="frame__hide" id="id__${item.key}" onclick="frameHide()">
                    <iframe class="iframe" src="https://www.youtube.com/embed/${item.key}" frameborder="0"></iframe>
                </div>`;
            });
            trailer.innerHTML = videoFrame;
        })
        .catch((reason) => {
            trailer.innerHTML = `<h4 class="title" >К сожалению трейлеры отсутствуют</h4>`;
            console.error(reason || reason.status);
        });
        devCheck();
    }
/* TMDB API Search */
    function apiSearch(event){
        event.preventDefault();
        const searchText = document.querySelector('.form-control').value;
        if(searchText.trim().length === 0){
            title.innerHTML = '<h4 class="title">Пожалуйста заполните поисковую форму!</h4>';
            return;
        }
        title.innerHTML = `
        <div class="loader__placeholder">
            <div class="lds-ellipsis loader"><div></div><div></div><div></div><div></div></div>
        </div>`;
        fetch(`https://api.themoviedb.org/3/search/multi?api_key=dcaf7f5ea224596464b7714bac28142f&language=ru&query=${searchText}`)
            .then(function(value){
                if(value.status !== 200){
                    return Promise.reject(new Error('Ошибка!'));
                }
                return value.json();
            })
            .then(function(output){
                let inner = '';
                if(output.results.length === 0){
                    title.innerHTML = '<h4 class="title" >По вашему запросу ничего не обнаруженно!</h4>';
                }
                else {
                    title.innerHTML = `<h4 class="title">Поиск по запросу - ${searchText}</h4>`;
                }
                output.results.forEach(function (item){
                    let nameItem = item.name || item.title;
                    const poster = item.poster_path ? img + item.poster_path : item.profile_path ? img + item.profile_path : './img/noposter.png';
                    let dataInfo = '';
                    dataInfo = `data-id="${item.id}" data-type="${item.media_type}"`;
                    let cheked = '';
                    if (true) {
                        if (liked.includes(`${item.id}`)) {
                            cheked = `<img src='./img/chek.png' width="25" height="25" class='chek'>`;
                        }
                    }    
                    inner += `
                    <div class="item">
                    `;
                    if (item.vote_average > 0 && item.vote_average < 5) {
                        inner += `<p class="rate" style="background-color: tomato;">${item.vote_average}</p>`;
                    }
                    if (item.vote_average >= 5 && item.vote_average < 8) {
                        inner += `<p class="rate" style="background-color: darkorange;">${item.vote_average}</p>`;
                    }
                    if (item.vote_average >= 8) {
                        inner += `<p class="rate" style="background-color: darkgreen;">${item.vote_average}</p>`;
                    }
                    if (item.vote_average == 0) {
                        inner += `<p class="rate" style="background-color: tomato;">н/д</p>`;
                    }
                    inner += `
                        <img src="${poster}" class="poster" alt="${nameItem}" ${dataInfo}>
                        <h5>${nameItem.substr(0, 25)}</h5>
                    </div>
                    ${cheked}
                    `;
                });
                movie.innerHTML = inner;
                const media = movie.querySelectorAll('img[data-id]');
                media.forEach(function(elem){
                    elem.style.cursor = 'pointer';
                    elem.addEventListener('click', showFullInfo);
                });
            })
            .catch(function(reason){
                title.innerHTML = `
                <h4 class="title">
                    Упс, что-то пошло не так!
                </h4>
                `;
                console.error('error: ' + reason);
            });
        devCheck();
    }
    function yearCheck() {
        if (document.querySelector('.searchType')[document.querySelector('.searchType').selectedIndex].id === 'tv') {
            document.querySelector('.year').style = 'display: none;';
        }
        if (document.querySelector('.searchType')[document.querySelector('.searchType').selectedIndex].id === 'movie') {
            document.querySelector('.year').style = '';
        }
    }
    function genChek() {
        title__item.innerHTML = `<h4 class="title">Расширенный поиск</h4>`;
        item.innerHTML = `
            <select class="searchType" onchange="yearCheck()">
                <option id="movie">Фильмы</option>
                <option id="tv">Сериалы</option>
            </select>
            <select class="gen"></select>
            <select class="year"></select>
            <button onclick="filter()" class="btn__filter" id="search">Найти</button>
        `;
        document.querySelector('.rec__list').innerHTML = '';
        trending.innerHTML = `<img src='./img/404.gif' class='search__image'>`;
        trailer.innerHTML = '';
        if (document.documentElement.clientWidth > 900 && document.documentElement.clientWidth < 1500) {
            document.querySelector(".search__image").style.display = "";
        }
        else if (document.documentElement.clientWidth > 1500) {
            document.querySelector(".search__image").style.display = "";
        }
        else {
            document.querySelector(".search__image").style.display = "none";
        }
        fetch(`https://api.themoviedb.org/3/genre/movie/list?api_key=dcaf7f5ea224596464b7714bac28142f&language=ru`)
        .then(function(value){
            if(value.status !== 200){
                return Promise.reject(new Error('Ошибка'));
            }
                return value.json();
        })
        .then(function(output){
            output.genres.forEach(function (item){
                document.querySelector('.gen').innerHTML += `<option id="${item.id}">${item.name}</option>`;
            });
        })
        for (let index = 1960; index < 2021; index++) {
            document.querySelector('.year').innerHTML += `<option>${index}</option>`;
        }
        const el = document.getElementById('search');
        el.scrollIntoView({block: "center", inline: "center", behavior: "smooth"});
    }
    function filter() {
        let type = document.querySelector('.searchType')[document.querySelector('.searchType').selectedIndex].id;
        let year = document.querySelector('.year').value;
        let gen = document.querySelector('.gen')[document.querySelector('.gen').selectedIndex].id;
        fetch(`https://api.themoviedb.org/3/discover/${type}?api_key=dcaf7f5ea224596464b7714bac28142f&language=ru&` + 
        `sort_by=popularity.desc&include_adult=true&include_video=false&page=1&year=${year}&with_genres=${gen}`)
        .then(function(value){
            if(value.status !== 200){
                return Promise.reject(new Error('Ошибка'));
            }
                return value.json();
        })
        .then(function(output){
            console.log();
            let inner = '';
            let i = output.results.length;
            output.results.forEach(function (item){
                let nameItem = item.name || item.title;
                let poster = null;
                const posterVar = item.poster_path ? img + item.poster_path : './img/noposter.png';
                poster = posterVar;
                let cheked = '';
                if (true) {
                    if (liked.includes(`${item.id}`)) {
                        cheked = `<img src='./img/chek.png' width="25" height="25" class='chek'>`;
                    }
                inner += `
                    <div class="item">
                `;
                }
                if (item.vote_average > 0 && item.vote_average < 5) {
                    inner += `<p class="rate" style="background-color: tomato;">${item.vote_average}</p>`;
                }
                if (item.vote_average >= 5 && item.vote_average < 8) {
                    inner += `<p class="rate" style="background-color: darkorange;">${item.vote_average}</p>`;
                }
                if (item.vote_average >= 8) {
                    inner += `<p class="rate" style="background-color: darkgreen;">${item.vote_average}</p>`;
                }
                if (item.vote_average == 0) {
                    inner += `<p class="rate" style="background-color: tomato;">н/д</p>`;
                }
                inner += `
                    <img src="${poster}" class="poster" onclick="showById(${item.id}, '${type}')" alt ="${nameItem}">
                    <h5>${nameItem.substr(0, 25)}</h5>
                    </div>
                    ${cheked}
                `;
            });
            yearPrint =`, снятые в ${year} году`;
            if (type === 'tv') {
                yearPrint = '';
            }
            document.querySelector('.title').innerHTML = `
                ${document.querySelector('.searchType').value} в жанре - ${document.querySelector('.gen').value}${yearPrint}
            `;
            movie.innerHTML = inner;
            if(i === 0){
                document.querySelector('.title').innerHTML = `Упс, что-то пошло не так!`;
            }
        })
        .catch(function(reason){
            document.querySelector('.rec__list').innerHTML = `<h4 class="title rec__title">Упс, что-то пошло не так!</h4>`;
            console.error('error: ' + reason);
        });
        const el = document.getElementById('movies');
        el.scrollIntoView({block: "center", inline: "center", behavior: "smooth"});
        devCheck();
    }
/* Recomendations */
    function showRecomendations(id, type) {
        fetch(`https://api.themoviedb.org/3/${type}/${id}/recommendations?api_key=dcaf7f5ea224596464b7714bac28142f&language=ru&page=1`)
        .then(function(value){
            if(value.status !== 200){
                return Promise.reject(new Error('Ошибка'));
            }
                return value.json();
        })
        .then(function(output){
            let inner = '';
            let i = output.results.length;
            output.results.forEach(function (item){
                let nameItem = item.name || item.title;
                let poster = null;
                const posterVar = item.poster_path ? img + item.poster_path : './img/noposter.png';
                poster = posterVar;
                let cheked = '';
                if (true) {
                    if (liked.includes(`${item.id}`)) {
                        cheked = `<img src='./img/chek.png' width="25" height="25" class='chek'>`;
                    }
                }
                inner += `
                    <div class="item">
                `;
                if (item.vote_average > 0 && item.vote_average < 5) {
                    inner += `<p class="rate" style="background-color: tomato;">${item.vote_average}</p>`;
                }
                if (item.vote_average >= 5 && item.vote_average < 8) {
                    inner += `<p class="rate" style="background-color: darkorange;">${item.vote_average}</p>`;
                }
                if (item.vote_average >= 8) {
                    inner += `<p class="rate" style="background-color: darkgreen;">${item.vote_average}</p>`;
                }
                if (item.vote_average == 0) {
                    inner += `<p class="rate" style="background-color: tomato;">н/д</p>`;
                }
                inner += `
                    <img src="${poster}" class="poster" onclick="showById(${item.id}, '${type}')" alt ="${nameItem}">
                    <h5>${nameItem.substr(0, 25)}</h5>
                    </div>
                    ${cheked}
                `;
            });
            document.querySelector('.rec__list').innerHTML = inner;
            if(i === 0){
                document.querySelector('.rec__list').innerHTML = `<h4 class="title rec__title">К сожалению рекомендаций пока нет...</h4>`;
            }
        })
        .catch(function(reason){
            document.querySelector('.rec__list').innerHTML = `<h4 class="title rec__title">Упс, что-то пошло не так!</h4>`;
            console.error('error: ' + reason);
        });
        const el = document.getElementById('movies__rec');
        el.scrollIntoView({block: "center", inline: "center", behavior: "smooth"});
        devCheck();
    }
    function showById(id, type){
        title__item.innerHTML = `
        <div class="loader__placeholder">
            <div class="lds-ellipsis loader"><div></div><div></div><div></div><div></div></div>
        </div>`;
        function init() {
            let url = `https://api.themoviedb.org/3/${type}/${id}?api_key=dcaf7f5ea224596464b7714bac28142f&language=ru`;
            fetch(url)
            .then(function(value){
                if(value.status !== 200){
                    return Promise.reject(new Error('Ошибка!'));
                }
                return value.json();
            })
            .then(function (output) {
                    let cheked = '';
                    if (true) {
                        if (liked.includes(`${output.id}`)) {
                            cheked = `<img src='./img/chek.png' width="25" height="25" class='chek'>`;
                        }
                    }
                    const poster1 = output.poster_path ? img + output.poster_path : './img/noposter.png';
                    title__item.innerHTML = `<h4 class="titleContent">${output.name || output.title}</h4>`;
                    let vote = '';
                    if (!output.vote_average == 0) {
                        vote = output.vote_average;
                    }else {
                        vote = 'Отсутствует';
                    }
                    let first_air_date = '';
                    if (output.first_air_date || output.release_date) {
                        first_air_date = output.first_air_date || output.release_date;
                    }else {
                        first_air_date = 'К сожалению данные отсутствуют';
                    }
                    item.innerHTML = `
                    <div class="item__poster" id="${type}">
                        <img src='${poster1}' alt='${output.name || output.title}' class='poster__info'>
                        ${(output.homepage) ? `<a href="${output.homepage}" target="_blank">
                            <p class="btn__info">Официальная страница</p>
                        </a>` : ''}
                        ${(output.imdb_id) ? `<a href="https://imdb.com/title/${output.imdb_id}" target="_blank">
                            <p class="btn__info">Страница на IMDB.COM</p>
                        </a>` : ''}
                    </div>
                    ${cheked}
                    <div class="item__info" id="${id}">
                        <p>Рейтинг: ${vote}</p>
                        <p>Премьера: ${first_air_date} </p>
                        <br>
                        <div class='item__cheked'>
                            В избранное:
                            <img src='./img/star.png' width="25" height="25" class='star' onclick='like()' onload='alredyLiked()'>
                        </div>
                        <p>Описание: ${output.overview.substr(0, 600) || 'К сожалению описание отсутствует'}</p>
                        <br>
                    </div>
                    `;
                    if (type == 'movie') {
                        item.innerHTML += `
                            <a onclick="showRecomendations(${output.id}, 'movie')">
                                <p class="btn__info__rec">Рекомендаций</p>
                            </a>
                            `;
                    }else {
                        item.innerHTML += `
                            <a onclick="showRecomendations(${output.id}, 'tv')">
                                <p class="btn__info__rec">Рекомендации</p>
                            </a>
                            `;
                    }
                    item.innerHTML += `
                    <a href="https://www.google.com/search?q=${output.name || output.title} смотреть онлайн&tbm=vid&tbs=dur:l" target="blank">
                        <p class="btn__watch__online">Искать</p>
                    </a>
                    `;
                devCheck();
            })
            .catch(function(reason){
                title__item.innerHTML = `<h4 class="title">Упс, что-то пошло не так!</h4>`;
                item.innerHTML = '';
                trailer.innerHTML = '';
                console.error('error: ' + reason);
            });
            trending.innerHTML = '';
            getVideo(id, type);
        }
        const el = document.getElementById('item');
        el.scrollIntoView({block: "center", inline: "center", behavior: "smooth"});
        setTimeout(init, 1000);
    }
