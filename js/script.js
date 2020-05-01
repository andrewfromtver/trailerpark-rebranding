const serachForm = document.querySelector('#search-form');
const movie = document.querySelector('#movies');
const img = 'https://image.tmdb.org/t/p/w500';

document.addEventListener('DOMContentLoaded', main_day());
document.addEventListener('DOMContentLoaded', hideUpBtn());

/* JS delay */
function sleep(milliseconds) {
    const date = Date.now();
    let currentDate = null;
    do {
      currentDate = Date.now();
    } while (currentDate - date < milliseconds);
}
/* Device screen width check */
function devCheck() {
    if (document.documentElement.clientWidth > 900 && document.documentElement.clientWidth < 1500) {
        document.querySelector(".main__section").style = "margin: 0 15vw 0 15vw;";
        document.querySelector(".main__section__title").style = "margin: 0 15vw 0 15vw;";
        document.querySelector(".header__link1__desc").style.display = "";
        document.querySelector(".header__link2__desc").style.display = "";
        document.querySelector(".header__link3__desc").style.display = "";
        document.querySelector(".header__link4__desc").style.display = "";
    }
    else if (document.documentElement.clientWidth > 1500) {
        document.querySelector(".main__section").style = "margin: 0 25vw 0 25vw;";
        document.querySelector(".main__section__title").style = "margin: 0 25vw 0 25vw;";
    }
    else {
        document.querySelector(".main__section").style = "";
        document.querySelector(".main__section__title").style = "";
        document.querySelector(".header__link1__desc").style.display = "none";
        document.querySelector(".header__link2__desc").style.display = "none";
        document.querySelector(".header__link3__desc").style.display = "none";
        document.querySelector(".header__link4__desc").style.display = "none";
    };
}
window.addEventListener("resize", function() {devCheck();}, false);
/* Scroll control */
function up() {
	var t;
	var top = Math.max(document.body.scrollTop,document.documentElement.scrollTop);
	if(top > 0) {
		window.scrollBy(0,-100);
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
function hideUpBtn () {
    document.querySelector(".up__btn").style.display = "none";
}
/* Main features */
function main_day() {
    title.innerHTML = `
    <div class="loader__placeholder">
        <div class="lds-ellipsis loader"><div></div><div></div><div></div><div></div></div>
    </div>`;
    let trendType = '';
    if(1 === 2){
        trendType = 'movie';
    }else if(1 === 2){
        trendType = 'tv';
    }else{
        trendType = 'all';
    };
	fetch(`https://api.themoviedb.org/3/trending/${trendType}/day?api_key=dcaf7f5ea224596464b7714bac28142f&language=ru`)
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
            let mediaType = item.title ? 'movie' : 'tv';
            const poster = item.poster_path ? img + item.poster_path : './img/noposter.png';
            let dataInfo = `data-id="${item.id}" data-type="${mediaType}"`;
            inner += `
            <div class="item">
                <img src="${poster}" class="poster" alt="${nameItem}" ${dataInfo}>
                <h5>${nameItem.substr(0, 25)}</h5>
            </div>
            `;
        });
        sleep(1000);
        title.innerHTML = '<h4 class="title" >Самые популярные фильмы и сериалы сегодня</h4>';
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
function main_week() {
    title.innerHTML = `
    <div class="loader__placeholder">
        <div class="lds-ellipsis loader"><div></div><div></div><div></div><div></div></div>
    </div>`;
    let trendType = '';
    if(1 === 2){
        trendType = 'movie';
    }else if(1 === 2){
        trendType = 'tv';
    }else{
        trendType = 'all';
    };
	fetch(`https://api.themoviedb.org/3/trending/${trendType}/week?api_key=dcaf7f5ea224596464b7714bac28142f&language=ru`)
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
            let mediaType = item.title ? 'movie' : 'tv';
            const poster = item.poster_path ? img + item.poster_path : './img/noposter.png';
            let dataInfo = `data-id="${item.id}" data-type="${mediaType}"`;
            inner += `
            <div class="item">
                <img src="${poster}" class="poster" alt="${nameItem}" ${dataInfo}>
                <h5>${nameItem.substr(0, 25)}</h5>
            </div>
            `;
        });
        sleep(1000);
        title.innerHTML = '<h4 class="title" >Самые популярные фильмы и сериалы за неделю</h4>';
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
        const poster1 = output.poster_path ? img + output.poster_path : './img/noposter.png';
        title__item.innerHTML = 
        item.innerHTML = `<h4 class="title" >${output.name || output.title}</h4>`;
        item.innerHTML = `
        <div class="item__poster">
            <img src='${poster1}' alt='${output.name || output.title}' class='poster__info'>
            ${(output.homepage) ? `<p class='center'> <a href="${output.homepage}" target="_blank"> Официальная страница </a> </p>` : ''}
            ${(output.imdb_id) ? `<p class='center'> <a href="https://imdb.com/title/${output.imdb_id}" target="_blank"> Страница на IMDB.COM </a> </p>` : ''}
        </div>
        <div class="item__info">
            <p>Рейтинг: ${output.vote_average}</p>
            <p>Премьера: ${output.first_air_date || output.release_date} </p>
            <p>Описание: ${output.overview.substr(0, 600) || 'К сожалению описание отсутствует.'}</p>
            <br>
            <div class='youtube'></div>
        </div>
        `;
        sleep(1000);
    getVideo(id, type);
    })
    .catch(function(reason){
        movie.innerHTML = `<h4 class="title">Упс, что-то пошло не так!</h4>`;
        console.error('error: ' + reason);
    });
    devCheck();
}
function addEventMedia(){
    const media = movie.querySelectorAll('img[data-id]');
            media.forEach(function(elem){
                elem.style.cursor = 'pointer';
                elem.addEventListener('click', showFullInfo);
            });
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
		    videoFrame += '<div class="trailer__frame"><iframe class="iframe" src="https://www.youtube.com/embed/' + item.key + '" frameborder="0"></iframe></div>';
		});
        trailer.innerHTML = videoFrame;
	    })
	    .catch((reason) => {
		trailer.innerHTML = `<h3 class="title" >К сожалению трейлеры отсутствуют</h3>`;
		console.error(reason || reason.status);
	    });
        }
        output.results.forEach((item)=>{
            videoFrame += '<div class="trailer__frame"><iframe class="iframe" src="https://www.youtube.com/embed/' + item.key + '" frameborder="0"></iframe></div>';
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
	if(1 === 2){
        searchType = 'movie';
    }
    else if(1 === 2){
        searchType = 'tv';
    }
    else{
        searchType = 'multi';
    }
    fetch(`https://api.themoviedb.org/3/search/${searchType}?api_key=dcaf7f5ea224596464b7714bac28142f&language=ru&query=${searchText}`)
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
                const poster = item.poster_path ? img + item.poster_path : './img/noposter.png';
                let dataInfo = '';
                if(item.media_type !== 'person') dataInfo = `data-id="${item.id}" data-type="${item.media_type}"`;
                inner += `
                <div class="item">
                    <img src="${poster}" class="poster" alt="${nameItem}" ${dataInfo}>
                    <h5>${nameItem}</h5>
                </div>
                `;
            });
            sleep(1000);
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
    devCheck();
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
            chartdata.push(
                {
                    y: item.popularity,
                    name: item.name || item.title
                },
            )
            chart2data.push(
                {
                    label: item.name || item.title,
                    y: item.vote_average
                },
            )
            tabledata.push(
                {
                    name: item.name || item.title,
                    x: item.popularity,
                    y: item.vote_average

                },
            )
        })
        sleep(1000);
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
                toolTipContent: "<b>{name}</b>: ${y} (#percent%)",
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
                dataPoints: chart2data
            }]
        });
        chart2.render();
})
}
