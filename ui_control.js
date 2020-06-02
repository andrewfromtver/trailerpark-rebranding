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
/* Liked */
    liked = JSON.parse(localStorage.getItem(sessionStorage.session)) || [];
    likedList = JSON.parse(localStorage.getItem(sessionStorage.session + '_list')) || [];
    function like() {
        document.querySelector('.item__cheked').innerHTML = `<img src='./img/chek.png' width="13" height="13" class='cheked__by__user'>`;
        liked.push(document.querySelector('.item__info').id);
        localStorage.setItem(sessionStorage.session, JSON.stringify(liked));
        likedList.push(document.querySelector('.item__info').id + '|' + document.querySelector('.item__poster').id);
        localStorage.setItem(sessionStorage.session + '_list', JSON.stringify(likedList));
    }
    function alredyLiked() {
        let chekedId = document.querySelector('.item__info').id;
        if (liked.includes(`${chekedId}`)) {
            document.querySelector('.item__cheked').style.display = 'none';
        }
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
/* Input control */
    function maxLengthCheck(object) {
        if (object.value.length > object.maxLength)
        object.value = object.value.slice(0, object.maxLength)
    }
