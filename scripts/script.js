window.onload = () => {
        let videoArea = document.getElementById('current-video');
    let playlist = document.querySelector('.video-list');
    let videoItems = playlist.querySelectorAll('.playlist-video-item');
    let pasNav = 50;
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

        vid.addEventListener("click", (e) => {
            e.preventDefault();
            videoArea.src = vid.src;
            videoArea.play();
        })
    })

    $('input[type=file]').change(function () {
        let path = window.URL.createObjectURL(this.files[0]);
        videoArea.src = path;
    })

    document.getElementById('btn-next').addEventListener('click', (e) => {
        e.preventDefault();
        pasNav -= 200;
        playlist.style.marginLeft = pasNav + "px";
    })

    document.getElementById('btn-prev').addEventListener('click', (e) => {
        e.preventDefault();
        if (pasNav > 0) {
            pasNav += 200;
            playlist.style.marginLeft = pasNav + "px";
        }

    })


}

