const serachForm = document.querySelector('#search-form');
const movie = document.querySelector('#movies');
const img = 'https://image.tmdb.org/t/p/w500';
/* Device screen width check */
    function devCheck() {
        if (document.documentElement.clientWidth > 900 && document.documentElement.clientWidth < 1500) {
            document.querySelector(".main__section").style = "margin: 0 15vw 0 15vw;";
            document.querySelector(".main__section__title").style = "margin: 0 15vw 0 15vw;";
            document.querySelector(".main__section__search").style = "margin: 0 15vw 0 15vw;";
            document.querySelector(".header__link1__desc").style.display = "";
            document.querySelector(".header__link2__desc").style.display = "";
            document.querySelector(".header__link3__desc").style.display = "";
        }
        else if (document.documentElement.clientWidth > 1500) {
            document.querySelector(".main__section").style = "margin: 0 25vw 0 25vw;";
            document.querySelector(".main__section__title").style = "margin: 0 25vw 0 25vw;";
            document.querySelector(".main__section__search").style = "margin: 0 25vw 0 25vw;";
            document.querySelector(".header__link1__desc").style.display = "";
            document.querySelector(".header__link2__desc").style.display = "";
            document.querySelector(".header__link3__desc").style.display = "";
        }
        else {
            document.querySelector(".main__section").style = "";
            document.querySelector(".main__section__title").style = "";
            document.querySelector(".main__section__search").style = "";
            document.querySelector(".header__link1__desc").style.display = "none";
            document.querySelector(".header__link2__desc").style.display = "none";
            document.querySelector(".header__link3__desc").style.display = "none";
            small__frame.innerHTML = '';
        };
        if (document.documentElement.clientWidth < 460) {
            if (document.querySelector(".item__poster")) {
                document.querySelector(".item__poster").style.display = "none";
            }
        }
        else {
            if (document.querySelector(".item__poster")) {
                document.querySelector(".item__poster").style.display = "";
            }
        }
    }
/* Scroll control */
    function up() {
        const el = document.getElementById('top');
        el.scrollIntoView({behavior: "smooth"});
    }
    window.onscroll = function() {
        var scrolled = window.pageYOffset || document.documentElement.scrollTop;
        if (scrolled > 100) {
        document.querySelector(".up__btn").style.display = "";
        } else {
        document.querySelector(".up__btn").style.display = "none";
        }
    }
/* Authentication */
    document.querySelector('.content').style.display = 'none';
    function loginTrial() {
        document.querySelector('.login__form').innerHTML = '<div class="lds-ellipsis loader"><div></div><div></div><div></div><div></div></div>';
        /* Listeners */
            window.addEventListener("resize", function() {devCheck();});
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
            topTable();
            document.querySelector('.logout').innerHTML = `
            <div class="header__logout">
                <a href="">
                <img src="./img/logout.png" width="23" height="23">
                </a>
            </div>
            `;
        function init() {
            document.querySelector('.content').style.display = '';
            document.querySelector('.login__form__background').style.display = 'none';
            document.querySelector('body').style.overflow = 'auto';
        }
        setTimeout(init, 2000);
    } 
/* Main features */
    function show(type, time, timestamp) {
        devCheck();
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
                output.results.forEach(function (item){
                    let nameItem = item.name || item.title;
                    let mediaType = item.media_type;
                    let poster = null;
                    if (type == 'person') {
                        const posterVar = item.profile_path ? img + item.profile_path : './img/noposter.png';
                        poster = posterVar;
                    }
                    else {
                        const posterVar = item.poster_path ? img + item.poster_path : './img/noposter.png';
                        poster = posterVar;
                    } 
                    let dataInfo = `data-id="${item.id}" data-type="${mediaType}"`;
                    inner += `
                        <div class="item">
                        <img src="${poster}" class="poster" alt="${nameItem}" ${dataInfo}>
                        <h5>${nameItem.substr(0, 25)}</h5>
                        </div>
                    `;
                });
                if (type == 'movie') title.innerHTML = '<h4 class="title" >Самые популярные фильмы</h4>';
                if (type == 'tv') title.innerHTML = '<h4 class="title" >Самые популярные сериалы</h4>';
                if (type == 'multi') title.innerHTML = '<h4 class="title" >Самые популярные фильмы и сериалы</h4>';
                if (type == 'person') title.innerHTML = '<h4 class="title" >Самые популярные актёры</h4>';
                if (timestamp == 'day') title.innerHTML = '<h4 class="title" >Самые популярные фильмы и сериалы сегодня</h4>';
                if (timestamp == 'week') title.innerHTML = '<h4 class="title" >Самые популярные фильмы и сериалы за неделю</h4>';
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
                url = 'https://api.themoviedb.org/3/movie/' + this.dataset.id + '?api_key=dcaf7f5ea224596464b7714bac28142f&language=ru';
            }else if(this.dataset.type === 'tv'){
                url = 'https://api.themoviedb.org/3/tv/' + this.dataset.id + '?api_key=dcaf7f5ea224596464b7714bac28142f&language=ru';
            }else if(this.dataset.type === 'person'){
                url = 'https://api.themoviedb.org/3/person/' + this.dataset.id + '?api_key=dcaf7f5ea224596464b7714bac28142f&language=ru';
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
                if (type == 'person') {
                    fetch(`https://api.themoviedb.org/3/discover/movie?api_key=dcaf7f5ea224596464b7714bac28142f&language=ru&sort_by=popularity.desc&include_adult=false&include_video=false&page=1&with_people=${id}`)
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
                            inner += `
                                <div class="item">
                                <img src="${poster}" class="poster" onclick="showById(${item.id}, 'movie')" alt ="${nameItem}">
                                <h5>${nameItem.substr(0, 25)}</h5>
                                </div>
                            `;
                        });
                        document.querySelector('.rec__list').innerHTML = inner;
                        if(i === 0){
                            document.querySelector('.rec__list').innerHTML = `<h4 class="title rec__title">Упс, что-то пошло не так!</h4>`;
                        }
                    })
                    .catch(function(reason){
                        document.querySelector('.rec__list').innerHTML = `<h4 class="title rec__title">Упс, что-то пошло не так!</h4>`;
                        console.error('error: ' + reason);
                    });
                    const poster1 = output.profile_path ? img + output.profile_path : './img/noposter.png';
                    title__item.innerHTML = `<h4 class="title" >${output.name}</h4>`;
                    let bio = '';
                    if (output.biography) {
                        bio = output.biography.substr(0, 600) + '...';
                    }else {
                        bio = 'К сожалению биография отсутствует.';
                    }
                    let birthday = '';
                    if (output.birthday) {
                        birthday = output.birthday;
                    }else {
                        birthday = 'К сожалению дата рождения отсутствует.';
                    }
                    let place_of_birth = '';
                    if (output.place_of_birth) {
                        place_of_birth = output.place_of_birth;
                    }else {
                        place_of_birth = 'К сожалению данные отсутствуют.';
                    }
                    item.innerHTML = `
                    <div class="item__poster">
                        <img src='${poster1}' alt='${output.name}' class='poster__info'>
                        ${(output.homepage) ? `<a href="${output.homepage}" target="_blank"><p class="btn__info"> Официальная страница </p></a>` : ''}
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
                    devCheck();
                }else {
                    const poster1 = output.poster_path ? img + output.poster_path : './img/noposter.png';
                    title__item.innerHTML = `<h4 class="title" >${output.name || output.title}</h4>`;
                    let vote = '';
                    if (!output.vote_average == 0) {
                        vote = output.vote_average;
                    }else {
                        vote = 'К сожалению рейтинг отсутствует.';
                    }
                    let first_air_date = '';
                    if (output.first_air_date || output.release_date) {
                        first_air_date = output.first_air_date || output.release_date;
                    }else {
                        first_air_date = 'К сожалению данные отсутствуют.';
                    }
                    item.innerHTML = `
                    <div class="item__poster pic">
                        <img src='${poster1}' alt='${output.name || output.title}' class='poster__info'>
                        ${(output.homepage) ? `<a href="${output.homepage}" target="_blank"><p class="btn__info">Официальная страница</p></a>` : ''}
                        ${(output.imdb_id) ? `<a href="https://imdb.com/title/${output.imdb_id}" target="_blank"><p class="btn__info">Страница на IMDB.COM</p></a>` : ''}
                    </div>
                    <div class="item__info">
                        <p>Рейтинг: ${vote}</p>
                        <p>Премьера: ${first_air_date} </p>
                        <br>
                        <p>Описание: ${output.overview.substr(0, 600) || 'К сожалению описание отсутствует.'}</p>
                        <br>
                        <div class='youtube'></div>
                    </div>
                    `;
                    if (type == 'movie') {
                        item.innerHTML += `
                            <a onclick="showRecomendations(${output.id}, 'movie')">
                                <p class="btn__info__rec"> Рекомендаций </p>
                            </a>
                            `;
                    }else {
                        item.innerHTML += `
                            <a onclick="showRecomendations(${output.id}, 'tv')">
                                <p class="btn__info__rec"> Рекомендаций </p>
                            </a>
                            `;
                    }
                    item.innerHTML += `
                    <a href="https://www.google.com/search?q=${output.name || output.title} смотреть онлайн&tbm=vid&tbs=dur:l" target="blank">
                        <p class="btn__watch__online">Искать</p>
                    </a>
                    `;
                    getVideo(id, type);
                    devCheck();
                }
            })
            .catch(function(reason){
                movie.innerHTML = `<h4 class="title rec__title">Упс, что-то пошло не так!</h4>`;
                console.error('error: ' + reason);
            });
            trending.innerHTML = '';
            document.querySelector('.rec__list').innerHTML = ``;
    }
/* Picture in picture mode */
    function frameHide() {
        small__frame.innerHTML = '';
        let id = event.target.getAttribute('id');
        small__frame.append(document.querySelector(`.${id}`));
        var elemCount  = document.querySelector('.trailer').childElementCount;
        small__frame.innerHTML += '<img src="./img/close.png" class="close" onclick="closeSmallFrame()">';
        if (elemCount == 1) {
            document.querySelector(".trailer").innerHTML = '';
        }
        document.querySelector(".small__frame").style.display = "";
    }
    function closeSmallFrame() {
        small__frame.innerHTML = '';
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
            let videoFrame = '<h3 class="title" >Трейлеры</h3>';
            if(output.results.length === 0){
                videoFrame = `<h3 class="title" >К сожалению трейлеры отсутствуют</h3>`;
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
            trailer.innerHTML = `<h3 class="title" >К сожалению трейлеры отсутствуют</h3>`;
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
            trailer.innerHTML = `<h3 class="title" >К сожалению трейлеры отсутствуют</h3>`;
            console.error(reason || reason.status);
        });
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
        let searchType = '';
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
                    inner += `
                    <div class="item">
                        <img src="${poster}" class="poster" alt="${nameItem}" ${dataInfo}>
                        <h5>${nameItem.substr(0, 25)}</h5>
                    </div>
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
                inner += `
                    <div class="item">
                    <img src="${poster}" class="poster" onclick="showById(${item.id}, '${type}')" alt ="${nameItem}">
                    <h5>${nameItem.substr(0, 25)}</h5>
                    </div>
                `;
            });
            document.querySelector('.rec__list').innerHTML = inner;
            if(i === 0){
                document.querySelector('.rec__list').innerHTML = `<h4 class="title rec__title">Упс, что-то пошло не так!</h4>`;
            }
        })
        .catch(function(reason){
            document.querySelector('.rec__list').innerHTML = `<h4 class="title rec__title">Упс, что-то пошло не так!</h4>`;
            console.error('error: ' + reason);
        });
        const el = document.getElementById('movies__rec');
        el.scrollIntoView({block: "center", inline: "center", behavior: "smooth"});
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
                    const poster1 = output.poster_path ? img + output.poster_path : './img/noposter.png';
                    title__item.innerHTML = `<h4 class="title" >${output.name || output.title}</h4>`;
                    let vote = '';
                    if (!output.vote_average == 0) {
                        vote = output.vote_average;
                    }else {
                        vote = 'К сожалению рейтинг отсутствует.';
                    }
                    let first_air_date = '';
                    if (output.first_air_date || output.release_date) {
                        first_air_date = output.first_air_date || output.release_date;
                    }else {
                        first_air_date = 'К сожалению данные отсутствуют.';
                    }
                    item.innerHTML = `
                    <div class="item__poster">
                        <img src='${poster1}' alt='${output.name || output.title}' class='poster__info'>
                        ${(output.homepage) ? `<a href="${output.homepage}" target="_blank"><p class="btn__info">Официальная страница</p></a>` : ''}
                        ${(output.imdb_id) ? `<a href="https://imdb.com/title/${output.imdb_id}" target="_blank"><p class="btn__info">Страница на IMDB.COM</p></a>` : ''}
                    </div>
                    <div class="item__info">
                        <p>Рейтинг: ${vote}</p>
                        <p>Премьера: ${first_air_date} </p>
                        <br>
                        <p>Описание: ${output.overview.substr(0, 600) || 'К сожалению описание отсутствует.'}</p>
                        <br>
                    </div>
                    `;
                    if (type == 'movie') {
                        item.innerHTML += `
                            <a onclick="showRecomendations(${output.id}, 'movie')">
                                <p class="btn__info__rec"> Рекомендаций </p>
                            </a>
                            `;
                    }else {
                        item.innerHTML += `
                            <a onclick="showRecomendations(${output.id}, 'tv')">
                                <p class="btn__info__rec"> Рекомендаций </p>
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
                console.error('error: ' + reason);
            });
            trending.innerHTML = '';
            getVideo(id, type);
        }
        const el = document.getElementById('item');
        el.scrollIntoView({block: "center", inline: "center", behavior: "smooth"});
        setTimeout(init, 1000);
    }
    function topTable() {
        const el = document.getElementById('movies');
        el.scrollIntoView({block: "center", inline: "center", behavior: "smooth"});
        title__item.innerHTML = `
        <div class="loader__placeholder">
            <div class="lds-ellipsis loader"><div></div><div></div><div></div><div></div></div>
        </div>
        `;
        fetch(`https://api.themoviedb.org/3/trending/movie/day?api_key=dcaf7f5ea224596464b7714bac28142f&language=ru`)
        .then(function(value){
            if(value.status !== 200){
                return Promise.reject(new Error('Ошибка'));
            }
                return value.json();
        })
        .then(function(output){
            let tabledata = []
            output.results.forEach(function (item){
                tabledata.push(
                    {
                        name: item.name || item.title,
                        x: item.popularity,
                        y: item.vote_average,
                        id: item.id
                    },
                )
            })
            let inner = `
                <h4 class="title">Топ 5 новых фильмов</h4>
                    <table class="table">
                        <thead>
                            <tr>
                                <th scope="col">#</th>
                                <th scope="col">Название</th>
                                <th scope="col">Рейтинг</th>
                                <th scope="col">Cборы</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr onclick="showById(${tabledata[0].id}, 'movie')">
                                <th scope="row">1</th>
                                <td>${tabledata[0].name}</td>
                                <td>${tabledata[0].y} из 10</td>
                                <td>${tabledata[0].x} млн. $</td>
                            </tr>
                            <tr onclick="showById(${tabledata[1].id}, 'movie')">
                                <th scope="row">2</th>
                                <td>${tabledata[1].name}</td>
                                <td>${tabledata[1].y} из 10</td>
                                <td>${tabledata[1].x} млн. $</td>
                            </tr>
                            <tr onclick="showById(${tabledata[2].id}, 'movie')">
                                <th scope="row">3</th>
                                <td>${tabledata[2].name}</td>
                                <td>${tabledata[2].y} из 10</td>
                                <td>${tabledata[2].x} млн. $</td>
                            </tr>
                            <tr onclick="showById(${tabledata[3].id}, 'movie')">
                                <th scope="row">4</th>
                                <td>${tabledata[3].name}</td>
                                <td>${tabledata[3].y} из 10</td>
                                <td>${tabledata[3].x} млн. $</td>
                            </tr>
                            <tr onclick="showById(${tabledata[4].id}, 'movie')">
                                <th scope="row">5</th>
                                <td>${tabledata[4].name}</td>
                                <td>${tabledata[4].y} из 10</td>
                                <td>${tabledata[4].x} млн. $</td>
                            </tr>
                            <tr>
                        </tbody>
                    </table>
            `;
            trending.innerHTML = inner;
        })
        fetch(`https://api.themoviedb.org/3/trending/tv/day?api_key=dcaf7f5ea224596464b7714bac28142f&language=ru`)
        .then(function(value){
            if(value.status !== 200){
                return Promise.reject(new Error('Ошибка'));
            }
                return value.json();
        })
        .then(function(output){
            let secondTabledata = []
            output.results.forEach(function (item){
                secondTabledata.push(
                    {
                        name: item.name || item.title,
                        x: item.popularity,
                        y: item.vote_average,
                        id: item.id
                    },
                )
            })
            let secondInner = `
                <h4 class="title">Топ 5 новых сериалов</h4>
                    <table class="table">
                        <thead>
                            <tr>
                                <th scope="col">#</th>
                                <th scope="col">Название</th>
                                <th scope="col">Рейтинг</th>
                                <th scope="col">Cборы</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr onclick="showById(${secondTabledata[0].id}, 'tv')">
                                <th scope="row">1</th>
                                <td>${secondTabledata[0].name}</td>
                                <td>${secondTabledata[0].y} из 10</td>
                                <td>${secondTabledata[0].x} млн. $</td>
                            </tr>
                            <tr onclick="showById(${secondTabledata[1].id}, 'tv')">
                                <th scope="row">2</th>
                                <td>${secondTabledata[1].name}</td>
                                <td>${secondTabledata[1].y} из 10</td>
                                <td>${secondTabledata[1].x} млн. $</td>
                            </tr>
                            <tr onclick="showById(${secondTabledata[2].id}, 'tv')">
                                <th scope="row">3</th>
                                <td>${secondTabledata[2].name}</td>
                                <td>${secondTabledata[2].y} из 10</td>
                                <td>${secondTabledata[2].x} млн. $</td>
                            </tr>
                            <tr onclick="showById(${secondTabledata[3].id}, 'tv')">
                                <th scope="row">4</th>
                                <td>${secondTabledata[3].name}</td>
                                <td>${secondTabledata[3].y} из 10</td>
                                <td>${secondTabledata[3].x} млн. $</td>
                            </tr>
                            <tr onclick="showById(${secondTabledata[4].id}, 'tv')">
                                <th scope="row">5</th>
                                <td>${secondTabledata[4].name}</td>
                                <td>${secondTabledata[4].y} из 10</td>
                                <td>${secondTabledata[4].x} млн. $</td>
                            </tr>
                            <tr>
                        </tbody>
                    </table>
            `;
            trending.innerHTML += secondInner;
        })
        title__item.innerHTML = `<h4 class="title" >Рейтинг за неделю</h4>`;
        item.innerHTML = '';
        document.querySelector('.rec__list').innerHTML = ``;
        trailer.innerHTML = '';
    }
