//Asigurarea incarcarii elementelor in DOM inainte de executia scriptului
window.onload = () => {
    //preluare elemente html in variabile pentru manipulare
    let videoArea = document.getElementById('current-video');
    let playlist = document.querySelector('.video-list');
    let videoItems = playlist.querySelectorAll('.playlist-video-item');
    let playlistArea = document.querySelector("#video_player");
    let pasNav = 50;
    let tranzCount = videoItems.length;
    let itemsLength = videoItems.length;

    //adauga efectele de play la hover pe fiecare video din playlist
    var addListeners = function () {
            videoItems.forEach(vid => {
        vid.addEventListener('mouseover', (e) => {
            e.preventDefault();
            vid.muted = true;
            vid.play();
        })

        vid.addEventListener('mouseleave', (e) => {
            e.preventDefault();
            vid.pause();
            vid.currentTime = 0;
        })

                //Incarca video-ul in ecranul principal la click
        vid.addEventListener("click", (e) => {
            e.preventDefault();
            videoArea.src = vid.src;
            videoArea.play();
        })
    })
    }

    let addDeleteBtn = function () {
        videoItems[videoItems.length - 1].parentNode.insertAdjacentHTML("afterbegin", `<button class="btn-del-item">delete</button>`);
        let currentDeleteBtn = videoItems[videoItems.length - 1].parentNode.firstChild;
        currentDeleteBtn.addEventListener('click', (e) => {
            e.preventDefault();
            currentDeleteBtn.parentNode.remove();
            tranzCount--;
            itemsLength -= 1;
            //console.log(itemsLength);
            if (itemsLength === 0) {
                videoItems.length = 0;
                playlistArea.insertAdjacentHTML('beforeend', '<h3 class="empty-playlist">Empty playlist</h3>')
            }
        });
    }

    //Gaseste pozitia videoului din ecranul principal si returneaza path-ul urmatorului video
    let returnNextVid = function (videoItems, videoArea) {
        let nextVid;
        videoItems.forEach((vid,index) => {
            if (vid.src === videoArea.src) {
                if (videoItems[index + 1]) {
                    nextVid = videoItems[index + 1].src;
                }     
            }
        })
        return nextVid;
    }

    //Verifica daca durata curenta si durata totala a videoului sunt egale, daca da, va da play la urmatorul video din playlist
    //In caz contrar, se va relua ultimul videoclip
    let goToNextVid = function () {
        if (returnNextVid(videoItems, videoArea) != null) {
            if (videoArea.duration === videoArea.currentTime) {
                videoArea.src = returnNextVid(videoItems, videoArea);
                videoArea.play();
            }
        }
        else {
            videoArea.play();
        }
    }

    addListeners();
    //addDeleteBtn();
    //Functia verifica la un scurt interval daca s-a ajuns la final de videoclip si trece la urm. videoclip
    window.setInterval(goToNextVid, 100);

    //Intoarce calea oricarui videoclip de pe disc
    $('input[type=file]').change(function () {
        let path = window.URL.createObjectURL(this.files[0]);
        videoArea.src = path;
    })

    //Navigatie dreapta elemente playlist
    document.getElementById('btn-next').addEventListener('click', (e) => {
        e.preventDefault();
        if (tranzCount == videoItems.length)
            console.log("Max length")
        else {
        pasNav -= 200;
            playlist.style.marginLeft = pasNav + "px";
            //itemsLength++;
            tranzCount++;
        }
        console.log(itemsLength, tranzCount);
       
    })

    //Navigatie stanga elemente playlist
    document.getElementById('btn-prev').addEventListener('click', (e) => {
        e.preventDefault();
        console.log(pasNav)
         if (pasNav < 50) {
            pasNav += 200;
             playlist.style.marginLeft = pasNav + "px";
            //  itemsLength--;
             tranzCount--;
        }

    })

    //Adauga un nou videoclip in playlist
    document.getElementById('btn-add-playlist').addEventListener('click', (e) => {
        playlist.insertAdjacentHTML('beforeend', `<li class="playlist-video-item"><video class="playlist-video-item" src="${videoArea.src}" width="200px" height="112.5px" /></li>`)
        videoItems = playlist.querySelectorAll('.playlist-video-item');
        //console.log(videoItems.length, tranzCount);
        videoItems[videoItems.length - 1].addEventListener('click', (e) => {
            e.preventDefault();
            videoArea.src = e.target.src;
            videoArea.play();
        })
        videoItems[videoItems.length - 1].addEventListener('mouseover', (e) => {
            e.preventDefault();
            e.target.muted = true;
            e.target.play();
        })

        videoItems[videoItems.length - 1].addEventListener('mouseleave', (e) => {
            e.preventDefault();
            e.target.pause();
            e.target.currentTime = 0;
        })
        tranzCount++;
        addDeleteBtn();
        //addListeners();
        itemsLength += 1;
        if (itemsLength === 1) {
            document.querySelector('.empty-playlist').remove();
            tranzCount--;
            itemsLength -= 1;
        }
    })

    let delBtns = document.querySelectorAll('.btn-del-item');
    delBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            btn.parentNode.remove();
           // tranzCount--;
            itemsLength -= 1;
            console.log(itemsLength);
            if (itemsLength === 0) {
                videoItems.length = 0;
                playlistArea.insertAdjacentHTML('beforeend', '<h3 class="empty-playlist">Empty playlist</h3>')
            }
        })

       
    })


//TODO:NAV BUTTON TO FIX VALIDATIONS
    let canvas = document.getElementById('canvas1');
    let context = canvas.getContext("2d");

    function drawFrame() {
        let W = canvas.width = videoArea.clientWidth;
        let H = canvas.height = videoArea.clientHeight;

        context.drawImage(videoArea, 0, 0, W, H);

        let imgData = context.getImageData(0, 0, W, H);
        let pixels = imgData.data;
        
        //efectele se fac aici
        // for (let y = 0; y < H; y++)
        //     for (let x = 0; x < W; x++){
        //         let i = (y * W + x) * 4;
        //         let avg = (pixels[i] + pixels[i + 1] + pixels[i + 2]) / 3;
        //         // pixels[i] = pixels[i];
        //         // pixels[i + 1] = pixels[i + 1];
        //         // pixels[i + 2] = pixels[i + 2];
        //     }
        
        context.putImageData(imgData, 0, 0);
         context.font = "bold 16px sans-serif";
            context.fillStyle = "blue";
            context.fillText("Current Time: " + videoArea.currentTime.toFixed(1) + "s", 10, 20);

    }

    window.setInterval(drawFrame, 30);
}

