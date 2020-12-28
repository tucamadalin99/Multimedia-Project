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

    //pozitioneaza canvas-ul peste elementul video pentru a nu fi doua
    videoArea.style.position = 'absolute'
    videoArea.style.zIndex = -1;

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
                reviewVideo.src = vid.src;
                videoArea.play();
            })
        })
    }

    let addDeleteBtn = function () {
        videoItems[videoItems.length - 1].parentNode.insertAdjacentHTML("afterbegin", `<button class="btn-del-item"><i class="material-icons">delete_forever</i></button>`);
        let currentDeleteBtn = videoItems[videoItems.length - 1].parentNode.firstChild;
        currentDeleteBtn.addEventListener('click', (e) => {
            e.preventDefault();
            currentDeleteBtn.parentNode.remove();
            tranzCount--;
            itemsLength -= 1;
            if (itemsLength === 0) {
                videoItems.length = 0;
                playlistArea.insertAdjacentHTML('beforeend', '<h3 class="empty-playlist">Empty playlist</h3>')
            }
        });
    }

    //Gaseste pozitia videoului din ecranul principal si returneaza path-ul urmatorului video
    let returnNextVid = function (videoItems, videoArea) {
        let nextVid;
        videoItems.forEach((vid, index) => {
            if (vid.src === videoArea.src) {
                if (videoItems[index + 1]) {
                    nextVid = videoItems[index + 1].src;
                }
            }
        })
        return nextVid;
    }

    let returnPrevVideo = function (videoItems, videoArea) {
        let prevVid;
        videoItems.forEach((vid, index) => {
            if (vid.src === videoArea.src) {
                if (videoItems[index - 1]) {
                    prevVid = videoItems[index - 1].src;
                }
            }
        })
        return prevVid;
    }

    //Verifica daca durata curenta si durata totala a videoului sunt egale, daca da, va da play la urmatorul video din playlist
    //In caz contrar, se va relua ultimul videoclip
    let goToNextVid = function () {
        if (returnNextVid(videoItems, videoArea) != null) {
            if (videoArea.duration === videoArea.currentTime) {
                videoArea.src = returnNextVid(videoItems, videoArea);
                reviewVideo.src = videoArea.src;
                videoArea.play();
            }
        }
    }

    addListeners();
    //Functia verifica la un scurt interval daca s-a ajuns la final de videoclip si trece la urm. videoclip
    //Intoarce calea oricarui videoclip de pe disc
    let videoPath = document.querySelector('input[type=file]');
    videoPath.addEventListener('change', (e) => {
        e.preventDefault();
        let path = window.URL.createObjectURL(e.target.files[0]);
        reviewVideo.src = path;
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
            tranzCount++;
        }
        console.log(videoItems.length, tranzCount);
        console.log("Items ", videoItems);
       
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
        playlist.insertAdjacentHTML('beforeend', `<li><video class="playlist-video-item" src="${videoArea.src}" width="200px" height="112.5px" /></li>`)
        videoItems = playlist.querySelectorAll('.playlist-video-item');
        videoItems[videoItems.length - 1].addEventListener('click', (e) => {
            e.preventDefault();
            videoArea.src = e.target.src;
            reviewVideo.src = e.target.src;
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
        //tranzCount++;
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
            tranzCount--;
            playlist.style.marginLeft -= btn.parentNode.width;
            videoItems.pop();
            console.log(videoItems);
            if (itemsLength === 0) {
                videoItems.length = 0;
                playlistArea.insertAdjacentHTML('beforeend', '<h3 class="empty-playlist">Empty playlist</h3>')
            }
        })

       
    })

    //Boolean butoane efecte
    let selectatNimic = false;
    let selectatBw = false;
    let selectatNegative = false;
    let selectatNeon = false;
    let selectatWarm = false;
    let selectatCold = false;
    document.getElementById('btn-add-bw').addEventListener('click', (e) => {
        e.preventDefault();
        selectatBw = true;
        //deselect restul butoanelor
        selectatNegative = false;
        selectatNimic = false;
        selectatNeon = false;
        selectatCold = false;
        selectatWarm = false;
    })

    document.getElementById('btn-add-inv').addEventListener('click', (e) => {
        e.preventDefault();
        selectatNegative = true;
        //deselect
        selectatBw = false;
        selectatNimic = false;
        selectatNeon = false;
        selectatWarm = false;
        selectatCold = false;
    })

    document.getElementById('btn-normal').addEventListener('click', (e) => {
        e.preventDefault();
        selectatNimic = true;
        //deselectare
        selectatBw = false;
        selectatNegative = false;
        selectatNeon = false;
        selectatWarm = false;
        selectatCold = false;
    })

    document.getElementById('btn-add-neon').addEventListener('click', (e) => {
        e.preventDefault();
        selectatNeon = true;
        //deselectare
        selectatNimic = false;
        selectatBw = false;
        selectatNegative = false;
        selectatWarm = false;
        selectatCold = false;
    })

    document.getElementById('btn-add-warm').addEventListener('click', (e) => {
        e.preventDefault();
        selectatWarm = true;
        //deselect restul
        selectatNimic = false;
        selectatBw = false;
        selectatNegative = false;
        selectatNeon = false;
        selectatCold = false;

    })

    document.getElementById('btn-add-cold').addEventListener('click', (e) => {
        e.preventDefault();
        selectatCold = true;
        //deselect restul
        selectatNimic = false;
        selectatBw = false;
        selectatNegative = false;
        selectatNeon = false;
        selectatWarm = false;
    })


    let canvas = document.getElementById('canvas1');
    let context = canvas.getContext("2d");
    let hVolum = 384;

    function drawFrame() {
        let W = canvas.width = videoArea.clientWidth;
        let H = canvas.height = videoArea.clientHeight;

        context.drawImage(videoArea, 0, 0, W, H);

        let imgData = context.getImageData(0, 0, W, H);
        let pixels = imgData.data;
        
        //efectele se fac aici
        
        for (let y = 0; y < H; y++)
            for (let x = 0; x < W; x++) {
                let i = (y * W + x) * 4;
                let avg = (pixels[i] + pixels[i + 1] + pixels[i + 2]) / 3;
                if (selectatBw) {
                    pixels[i] = avg;
                    pixels[i + 1] = avg;
                    pixels[i + 2] = avg;
                }
                if (selectatNegative) {
                    pixels[i] = pixels[i] ^ 255; //inverseaza rosu
                    pixels[i + 1] = pixels[i + 1] ^ 255; // inverseaza verde
                    pixels[i + 2] = pixels[i + 2] ^ 255; //inverseaza albastru
                }
                if (selectatNimic) {
                    pixels[i] = pixels[i]
                    pixels[i + 1] = pixels[i + 1]
                    pixels[i + 2] = pixels[i + 2]
                }
                if (selectatNeon) {
                    pixels[i + 1] = avg / 2; //violet
                    pixels[i + 2] = pixels[i + 2] + 30; //accentueaza albastru
                }
                if (selectatWarm) {
                    pixels[i] += 10;
                    pixels[i + 1] += 10;
                }
                if (selectatCold) {
                    pixels[i + 2] += 20;
                }
            }
    

        
        context.globalAlpha = 0.5; //semi-transparent
        context.putImageData(imgData, 0, 0);
        context.font = "bold 16px sans-serif";
        context.fillStyle = "red";
        context.fillText(videoArea.currentTime.toFixed(0) + "s", 10, H - 30);
        context.strokeText(videoArea.currentTime.toFixed(0) + "s", 10, H - 30);
        context.strokeStyle = 'black';
        //Desenare buton play
        context.beginPath();
        context.moveTo(10, H - 45);
        context.lineTo(10, H - H / 7.5);
        context.lineTo(W / 22, H - H / 9);
        context.fillStyle = 'red';
        context.stroke();
        context.fill();
        //Desenare buton pauza

        let xLinie1 = 45;
        let x2Linie1 = 52;
        context.beginPath();
        context.moveTo(xLinie1, H - 45);
        context.lineTo(xLinie1, H - H / 7.5);
        context.lineTo(x2Linie1, H - 69.5);
        context.lineTo(x2Linie1, H - 45);
        context.lineTo(xLinie1, H - 45);
        context.fillStyle = 'red';
        context.stroke();
        context.fill();
        context.beginPath();
        xLinie1 = 58;
        x2Linie1 = 65;
        context.moveTo(xLinie1, H - 45);
        context.lineTo(xLinie1, H - H / 7.5);
        context.lineTo(x2Linie1, H - 69.5);
        context.lineTo(x2Linie1, H - 45);
        context.lineTo(xLinie1, H - 45);
        context.fillStyle = 'red';
        context.stroke();
        context.fill();

        //Desenare progress bar
        context.beginPath();
        context.fillStyle = 'red';
        //Desenare progresiva pe parcursul duratei videoului
        desenProgresBar(videoArea.duration, W - 25);
        context.rect(10, H - 25, W - 25, 10);
        context.fill();
        goToNextVid();
        
        //Desenare next
        context.beginPath();
        context.moveTo(W - 30, 20);
        context.lineTo(W - 30, 35);
        context.lineTo(W - 15, 27);
        context.lineTo(W - 30, 18);
        context.fill();
        //Desenare prev
        context.beginPath();
        context.moveTo(30, 20);
        context.lineTo(30, 35);
        context.lineTo(15, 27);
        context.lineTo(30, 18);
        context.fill();
        //Desenare volum
        context.beginPath();
        context.fillStyle = 'red';
        context.globalAlpha = 0.3;
        context.rect(W - 27, H - 135, 10, 100);
        context.fill();
        //desen vol
        desenVolum(hVolum);
        

    }

    window.setInterval(drawFrame, 30);


    let W = canvas.width = videoArea.clientWidth;
    let H = canvas.height = videoArea.clientHeight;
    
    function desenProgresBar(durata, latimeBara) {
        let xProgressBar = 10;
        let yProgressBar = H - 25;
        //impartim latimea barii la durata videoului si obtinem coeficientul de pixeli
        // impartim coeficientul obtinut la timpul curent din video si desenam un dreptunghi continuu pana la finalul barii
        let vitezaDesenare = (latimeBara / durata) * videoArea.currentTime;
        context.moveTo(xProgressBar, yProgressBar);
        context.rect(xProgressBar, yProgressBar, vitezaDesenare, 10);
        context.fillStyle = 'red';
        context.lineWidth = 2;
        context.strokeStyle = 'black';
        context.stroke();
        context.fill();
    }
    function desenVolum(y) {
        context.beginPath();
        context.rect(W - 27, y, 10, 10);
        context.globalAlpha = 1;
        context.stroke();
        context.fill();
    }

    function functiiVideo(canvas, e) {
        let rect = canvas.getBoundingClientRect();
        let x = e.clientX - rect.left;
        let y = e.clientY - rect.top;
        console.log(x, y)

        let xPlayStart = 10;
        let xPlayEnd = xPlayStart + 25;
        let yPlayStart = 450;
        let yPlayEnd = yPlayStart + 25;
        if ((x >= xPlayStart && x <= xPlayEnd) && (y >= yPlayStart && y <= yPlayEnd)) {
            videoArea.play();
        }
        let xPauzaStart = 45;
        let xPauzaEnd = xPauzaStart + 20;
        let yPauzaStart = yPlayStart;
        let yPauzaEnd = yPlayEnd
        if ((x >= xPauzaStart && x <= xPauzaEnd) && (y >= yPauzaStart && y <= yPauzaEnd)) {
            videoArea.pause();
        }
        let xBarStart = 10;
        let xBarEnd = 775;
        let yBarStart = H - 15;
        let yBarEnd = yBarStart - 10;
        //Calcul coeficient pixeli, impartit la ox mouse = timp selectat pe progress bar
        if ((x >= xBarStart && x <= xBarEnd) && (y >= yBarEnd && y <= yBarStart)) {
            let coeficientPx = (xBarEnd / videoArea.duration);
            let durataCurenta = x / coeficientPx;
            videoArea.currentTime = durataCurenta;
            console.log(durataCurenta);
        }

        let xNextStart = W - 30;
        let xNextEnd = W - 15;
        let yNextStart = 18;
        let yNextEnd = 35;

        if ((x >= xNextStart && x <= xNextEnd) && (y >= yNextStart && y <= yNextEnd)) {
            let nextVideo = returnNextVid(videoItems, videoArea);
            if (nextVideo != null)
                videoArea.src = nextVideo;
        }

        let xPrevStart = 15;
        let xPrevEnd = 30;
        let yPrevStart = yNextStart;
        let yPrevEnd = yNextEnd;

        if ((x >= xPrevStart && x <= xPrevEnd) && (y >= yPrevStart && y <= yPrevEnd)) {
            let prevVideo = returnPrevVideo(videoItems, videoArea);
            if (prevVideo != null)
                videoArea.src = prevVideo;
        }

        let xVolStart = W - 27;
        let xVolEnd = W - 16;
        let yVolStart = H - 135;
        let yVolEnd = H - 38;
    
        if ((x >= xVolStart && x <= xVolEnd) && (y >= yVolStart && y <= yVolEnd)) {
            //TODO
            hVolum = y;
            if (y <= yVolEnd + 5 && y >= yVolEnd)
                videoArea.volume = 0;
            else {
                let coefVolum = (y - (H - 135));
                let volum = 100;
                let volumCurent = (volum - coefVolum) / 100;
                videoArea.volume = volumCurent;
            }
            
        }



    }

    canvas.addEventListener('click', (e) => {
        functiiVideo(canvas, e);
        
    })

    //Implementare review cadru
    let reviewVideo = document.getElementById('review-video');
    let rect = canvas.getBoundingClientRect();
      let xBarStart = 10;
        let xBarEnd = 775;
        let yBarStart = H - 15;
    let yBarEnd = yBarStart - 10;
    //Am luat coordonatele progress bar-ului

    //La intrarea mouse-ului pe canvas, daca mouse-ul se afla in limtele progress bar-ului, se afiseaza cadrul la momentu respectiv
    canvas.addEventListener('mousemove', (e) => {
        let x = e.clientX - rect.left;
        let y = e.clientY - rect.top;
        if ((x >= xBarStart && x <= xBarEnd) && (y >= yBarEnd && y <= yBarStart)) {
            reviewVideo.style.left = x + rect.left + "px";
            reviewVideo.style.display = "block";
            let coeficientPx = (xBarEnd / videoArea.duration);
            let durataCurenta = x / coeficientPx;
            reviewVideo.currentTime = durataCurenta;
            reviewVideo.pause();
            console.log(durataCurenta);
        }
    })
    //La iesirea cursorului din limtele progress bar-ului, cadrul de preview dispare
    canvas.addEventListener('mouseleave', (e) => {
        let x = e.clientX - rect.left;
        let y = e.clientY - rect.top;
        if (!((x >= xBarStart && x <= xBarEnd) && (y >= yBarEnd && y <= yBarStart))) {
            reviewVideo.style.display = 'none';
        } 
    })
}


