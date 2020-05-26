const serachForm = document.querySelector('#search-form');
const movie = document.querySelector('#movies');
const img = 'https://image.tmdb.org/t/p/w500';

document.addEventListener('DOMContentLoaded', show('multi', 'day', 'day'));
document.querySelector(".up__btn").style.display = "none";
window.addEventListener("resize", function() {devCheck();});

/* Device screen width check */
function devCheck() {
    if (document.documentElement.clientWidth > 900 && document.documentElement.clientWidth < 1500) {
        document.querySelector(".main__section").style = "margin: 0 15vw 0 15vw;";
        document.querySelector(".main__section__title").style = "margin: 0 15vw 0 15vw;";
        document.querySelector(".header__link1__desc").style.display = "";
        document.querySelector(".header__link2__desc").style.display = "";
        document.querySelector(".header__link3__desc").style.display = "";
    }
    else if (document.documentElement.clientWidth > 1500) {
        document.querySelector(".main__section").style = "margin: 0 25vw 0 25vw;";
        document.querySelector(".main__section__title").style = "margin: 0 25vw 0 25vw;";
        document.querySelector(".header__link1__desc").style.display = "";
        document.querySelector(".header__link2__desc").style.display = "";
        document.querySelector(".header__link3__desc").style.display = "";
    }
    else {
        document.querySelector(".main__section").style = "";
        document.querySelector(".main__section__title").style = "";
        document.querySelector(".header__link1__desc").style.display = "none";
        document.querySelector(".header__link2__desc").style.display = "none";
        document.querySelector(".header__link3__desc").style.display = "none";
        small__frame.innerHTML = '';
    };
}
/* Scroll control */
function up() {
	var t;
	var top = Math.max(document.body.scrollTop,document.documentElement.scrollTop);
	if(top > 0) {
		window.scrollBy(0,-150);
		t = setTimeout('up()', 50);
	}
	else clearTimeout(t);
	return false;
}
window.onscroll = function() {
    var scrolled = window.pageYOffset || document.documentElement.scrollTop;
    if (scrolled > 100) {
      document.querySelector(".up__btn").style.display = "";
    } else {
      document.querySelector(".up__btn").style.display = "none";
    }
}
document.getElementById("movies").addEventListener('wheel', function(event) {
    if (event.deltaMode == event.DOM_DELTA_PIXEL) {
      var modifier = 1;
      // иные режимы возможны в Firefox
    } else if (event.deltaMode == event.DOM_DELTA_LINE) {
      var modifier = parseInt(getComputedStyle(this).lineHeight);
    } else if (event.deltaMode == event.DOM_DELTA_PAGE) {
      var modifier = this.clientHeight;
    }
    if (event.deltaY != 0) {
      // замена вертикальной прокрутки горизонтальной
      this.scrollLeft += modifier * event.deltaY;
      event.preventDefault();
    }
});
/* Main features */
function show(type, time, timestamp) {
    devCheck();
    title.innerHTML = `
    <div class="loader__placeholder">
        <div class="lds-ellipsis loader"><div></div><div></div><div></div><div></div></div>
    </div>`;
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
        if (type == 'movie') {
            title.innerHTML = '<h4 class="title" >Самые популярные фильмы</h4>';
        }
        if (type == 'tv') {
            title.innerHTML = '<h4 class="title" >Самые популярные сериалы</h4>';
        }
        if (type == 'multi') {
            title.innerHTML = '<h4 class="title" >Самые популярные фильмы и сериалы</h4>';
        }
        if (type == 'person') {
            title.innerHTML = '<h4 class="title" >Самые популярные актёры</h4>';
        }
        if (timestamp == 'day') {
            title.innerHTML = '<h4 class="title" >Самые популярные фильмы и сериалы сегодня</h4>';
        }
        if (timestamp == 'week') {
            title.innerHTML = '<h4 class="title" >Самые популярные фильмы и сериалы за неделю</h4>';
        }
        movie.innerHTML = inner;
        addEventMedia();
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
function addEventMedia(){
    const media = movie.querySelectorAll('img[data-id]');
            media.forEach(function(elem){
                elem.style.cursor = 'pointer';
                elem.addEventListener('click', showFullInfo);
            });
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
            console.log(output);
            const poster1 = output.profile_path ? img + output.profile_path : './img/noposter.png';
            title__item.innerHTML = `<h4 class="title" >${output.name}</h4>`;
            let bio = '';
            if (output.biography) {
                bio = output.biography.substr(0, 600) + '...';
            }else {
                bio = 'К сожалению биография отсутствует.';
            }
            item.innerHTML = `
            <div class="item__poster">
                <img src='${poster1}' alt='${output.name}' class='poster__info'>
            </div>
            <div class="item__info">
                <p>Дата рождения: ${output.birthday}</p>
                <p>Биография: ${bio}</p>
                <br>
                <div class='youtube'></div>
            </div>
            `;
            trailer.innerHTML = '';
        }else {
            const poster1 = output.poster_path ? img + output.poster_path : './img/noposter.png';
            title__item.innerHTML = `<h4 class="title" >${output.name || output.title}</h4>`;
            item.innerHTML = `
            <div class="item__poster">
                <img src='${poster1}' alt='${output.name || output.title}' class='poster__info'>
                ${(output.homepage) ? `<p class='btn__info'> <a href="${output.homepage}" target="_blank"> Официальная страница </a> </p>` : ''}
                ${(output.imdb_id) ? `<p class='btn__info'> <a href="https://imdb.com/title/${output.imdb_id}" target="_blank"> Страница на IMDB.COM </a> </p>` : ''}
            </div>
            <div class="item__info">
                <p>Рейтинг: ${output.vote_average}</p>
                <p>Премьера: ${output.first_air_date || output.release_date} </p>
                <p>Описание: ${output.overview.substr(0, 600) || 'К сожалению описание отсутствует.'}</p>
                <br>
                <div class='youtube'></div>
            </div>
            `;
            getVideo(id, type);
        }
    })
    .catch(function(reason){
        movie.innerHTML = `<h4 class="title">Упс, что-то пошло не так!</h4>`;
        console.error('error: ' + reason);
    });
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
                if(item.media_type !== 'person') dataInfo = `data-id="${item.id}" data-type="${item.media_type}"`;
                inner += `
                <div class="item">
                    <img src="${poster}" class="poster" alt="${nameItem}" ${dataInfo}>
                    <h5>${nameItem.substr(0, 25)}</h5>
                </div>
                `;
            });
            movie.innerHTML = inner;
            addEventMedia();
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
serachForm.addEventListener('submit', apiSearch);
/* Charts & table of top movies */
function top_chart() {
    title__item.innerHTML = `
    <div class="loader__placeholder">
        <div class="lds-ellipsis loader"><div></div><div></div><div></div><div></div></div>
    </div>`;
    trailer.innerHTML = '';
    fetch(`https://api.themoviedb.org/3/trending/all/day?api_key=dcaf7f5ea224596464b7714bac28142f&language=ru`)
    .then(function(value){
        if(value.status !== 200){
            return Promise.reject(new Error('Ошибка'));
        }
            return value.json();
    })
    .then(function(output){
        let chartdata = []
        let chart2data = []
        let tabledata = []
        output.results.forEach(function (item){
            let title = item.name || item.title
            chartdata.push(
                {
                    y: item.popularity,
                    name: title.substr(0, 25),
                    name_long: title
                },
            )
            chart2data.push(
                {
                    label: title.substr(0, 25),
                    label_long: title,
                    y: item.vote_average
                },
            )
            tabledata.push(
                {
                    name: title.substr(0, 25),
                    x: item.popularity,
                    y: item.vote_average

                },
            )
        })
        item.innerHTML = '';
        title__item.innerHTML =' <h4 class="title" >Кассовые сборы самых популярных фильмов и сериалов</h4>';
        let inner = `
            <div class="chart">
                <div id="chartContainer" style="height: 40vh; max-height: 300px; margin: 5px auto;"></div>
            </div>
            <h4 class="title" >Рейтинг самых популярных фильмов и сериалов</h4>
            <div class="chart">
                <div id="chart2Container" style="height: 40vh; max-height: 300px; margin: 5px auto;"></div>
            </div>
        `;
        trailer.innerHTML = inner;
        var chart = new CanvasJS.Chart("chartContainer", {
            theme: "dark2",
            exportFileName: "Doughnut Chart",
            animationEnabled: true,
            data: [{
                type: "doughnut",
                innerRadius: 90,
                toolTipContent: "<b>{name_long}</b>: ${y} (#percent%)",
                indexLabel: "{name} - #percent%",
                dataPoints: chartdata
            }]
        });
        chart.render();
        var chart2 = new CanvasJS.Chart("chart2Container", {
            animationEnabled: true,
            theme: "dark2",
            data: [{
                type: "bar",
                yValueFormatString: "Рейтинг - #,##0.00",
                toolTipContent: "<b>{label_long}</b>",
                dataPoints: chart2data
            }]
        });
        chart2.render();
})
}
