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
    window.addEventListener("resize", function() {devCheck();});
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
/* Input control */
    function maxLengthCheck(object) {
        if (object.value.length > object.maxLength)
        object.value = object.value.slice(0, object.maxLength)
    }
/* Liked */
    liked = JSON.parse(localStorage.getItem(sessionStorage.session)) || [];
    likedList = JSON.parse(localStorage.getItem(sessionStorage.session + '_list')) || [];
    function like() {
        document.querySelector('.item__cheked').innerHTML = `<img src='./img/chek.png' width="13" height="13" class='cheked__by__user'>`;
        liked.push(document.querySelector('.item__info').id);
        localStorage.setItem(sessionStorage.session, JSON.stringify(liked));
        likedList.push(document.querySelector('.titleContent').innerText + '|' + document.querySelector('.item__info').id + ',' + `'${document.querySelector('.item__poster').id}'`);
        localStorage.setItem(sessionStorage.session + '_list', JSON.stringify(likedList));
    }
    function alredyLiked() {
        let chekedId = document.querySelector('.item__info').id;
        if (liked.includes(`${chekedId}`)) {
            document.querySelector('.item__cheked').style.display = 'none';
        }
    }
/* Liked list */
    function likedByUser() {
        title__item.innerHTML = `
        <div class="loader__placeholder">
            <div class="lds-ellipsis loader"><div></div><div></div><div></div><div></div></div>
        </div>
        `;
        /* Liked movies */
        let inner = `
            <h4 class="title">Избранные фильмы</h4>
            <table class="table">
                <thead>
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">Название</th>
                    </tr>
                </thead>
                <tbody>
            `;
        resultMovies = likedList.filter(word => word.substr(word.length - 7) == "'movie'");
        let movieCount = 1;
        let contentMovie = '';
        resultMovies.forEach(element => {
            contentMovie += `
            <tr>
                <th scope="row">${movieCount}</th>
                <td onclick="showById(${element.split('|')[1]})">${element.split('|')[0]}</td>
                <td class="deleteRow" onclick="deleteRow(${element.split('|')[1]},'${element.split('|')[0]}')"><img src="./img/delete.png" width="15" height="15"></td>
            </tr>
            `;
            movieCount += 1;
        });
        inner += contentMovie;
        inner += `
                </tbody>
            </table>
            `;
        /* Liked tv series */
        inner += `
            <h4 class="title">Избранные сериалы</h4>
            <table class="table">
                <thead>
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">Название</th>
                    </tr>
                </thead>
                <tbody>
            `;
        resultTvs = likedList.filter(word => word.substr(word.length - 4) == "'tv'");
        let tvCount = 1;
        let contentTv = '';
        resultTvs.forEach(element => {
            contentTv += `
            <tr>
                <th scope="row">${tvCount}</th>
                <td onclick="showById(${element.split('|')[1]})">${element.split('|')[0]}</td>
                <td class="deleteRow" onclick="deleteRow(${element.split('|')[1]},'${element.split('|')[0]}')"><img src="./img/delete.png" width="15" height="15"></td>
            </tr>
            `;
            tvCount += 1;
        });
        inner += contentTv;
        inner += `
                </tbody>
            </table>
            `;
        trending.innerHTML = inner;
        title__item.innerHTML = `<h4 class="title" >Пользовательская статистика</h4>`;
        item.innerHTML = '';
        document.querySelector('.rec__list').innerHTML = ``;
        trailer.innerHTML = '';
    }
    function deleteRow(id, type, name) {
        let listPreset = name + '|' + id + ',' + `'${type}'`;        
        result = likedList.filter(function(item) { 
            return item !== listPreset;
        })
        let preset = id;
        resultId = liked.filter(function(item) { 
            return item !== `${preset}`;
        })
        localStorage.setItem(sessionStorage.session, JSON.stringify(resultId));
        localStorage.setItem(sessionStorage.session + '_list', JSON.stringify(result));
        liked = resultId;
        likedList = result;
        likedByUser();
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
