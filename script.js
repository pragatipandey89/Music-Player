const wrapper = document.querySelector(".wrapper"),
musicImg = wrapper.querySelector(".img-area img"),
musicName = wrapper.querySelector(".song-details .name"),
musicArtist = wrapper.querySelector(".song-details .artist"),
mainAudio = wrapper.querySelector("#main-audio"),
playPauseBtn  = wrapper.querySelector(".play-pause"),


prevBtn  = wrapper.querySelector("#prev"),
nextBtn  = wrapper.querySelector("#next"),

progressBar= wrapper.querySelector(".progress-bar"),
progressArea= wrapper.querySelector(".progress-area"),

musicList= wrapper.querySelector(".music-list"),
showMusicBtn= wrapper.querySelector("#more-music"),
hideMusicBtn= musicList.querySelector("#close");


let musicIndex = Math.floor((Math.random()*allmusic.length)+1);


window.addEventListener("load", ()=>{
    loadMusic(musicIndex); //calling load fun once window is loaded
    nowPlaying();
})

//load funtion
function loadMusic(indexNum)
{
    musicName.innerText = allmusic[indexNum-1].name;
    musicArtist.innerText = allmusic[indexNum-1].artist;
    musicImg.src= `img/${allmusic[indexNum-1].img}.jfif`;
    mainAudio.src= `songs/${allmusic[indexNum-1].src}.mp3`;
} 

//play music funtion
function playMusic()
{
    wrapper.classList.add("paused");
    playPauseBtn.querySelector("i").innerText="pause";
    mainAudio.play();
    nowPlaying();
}

function pauseMusic()
{
    wrapper.classList.remove("paused");
    playPauseBtn.querySelector("i").innerText="play_arrow";
    mainAudio.pause();
}

function nextMusic()
{
    musicIndex++;
    (musicIndex > allmusic.length) ? musicIndex=1 : musicIndex=musicIndex;
    loadMusic(musicIndex);
    playMusic();
    nowPlaying();

}

function prevMusic()
{
    musicIndex--;
    (musicIndex < 1) ? musicIndex=allmusic.length : musicIndex=musicIndex;
    loadMusic(musicIndex);
    playMusic();
    nowPlaying();

}

playPauseBtn.addEventListener("click",()=>{
    const isMusicPaused = wrapper.classList.contains("paused");
    isMusicPaused ? pauseMusic() : playMusic();
});

nextBtn.addEventListener("click",()=>{
    nextMusic();
});

prevBtn.addEventListener("click",()=>{
    prevMusic();
});

mainAudio.addEventListener("timeupdate",(e)=>{

    // console.log(e);

    const currentTime = e.target.currentTime;
    const duration = e.target.duration;
    let progressWidth = (currentTime/duration)*100;
    progressBar.style.width = `${progressWidth}%`;

    mainAudio.addEventListener("loadeddata", () =>{
        musicDuration = wrapper.querySelector(".max-current");

        let audioDuration = mainAudio.duration;
        let sec = Math.floor(audioDuration%60);
        if(sec<10)
        {
            sec=`0${sec}`;
        }
        musicDuration.innerText = `${Math.floor(audioDuration/60)}:${sec}`;
    })

    let sec = Math.floor(currentTime%60);
    if(sec<10)
    {
        sec=`0${sec}`;
    }
    let musicCurrentTime = wrapper.querySelector(".current");
    musicCurrentTime.innerHTML = `${Math.floor(currentTime/60)}:${sec}`;
});

progressArea.addEventListener("click", (e)=>{
    let widthval= progressArea.clientWidth; // getting the width of the progress bar
    let clicked = e.offsetX;
    let songduration = mainAudio.duration;

    mainAudio.currentTime = (clicked / widthval) * songduration;
    playMusic();
})


const repeatBtn = wrapper.querySelector("#repeat-plist");
// const shuffleBtn = wrapper.querySelector("#repeat-plist");

repeatBtn.addEventListener("click", () =>{
    let getText = repeatBtn.innerText;

    switch(getText){
        case "repeat":
            repeatBtn.innerText = "repeat_one";
            repeatBtn.setAttribute("title", "Repeat");
            break;
        case "repeat_one":
            repeatBtn.innerText = "shuffle";
            repeatBtn.setAttribute("title", "Shuffle");
            break;
        case "shuffle":
            repeatBtn.innerText = "repeat";
            repeatBtn.setAttribute("title", "PlayList looped");
            break;
    }
});

mainAudio.addEventListener("ended", () => {
    let getText = repeatBtn.innerText;
    switch(getText){
        case "repeat":
            nextMusic();
            break;
        case "repeat_one":
            mainAudio.currentTime=0;
            loadMusic(musicIndex);
            playMusic();
            break;
        case "shuffle":
            let rand = Math.floor((Math.random()*allmusic.length)+1);
            do{
                rand = Math.floor((Math.random()*allmusic.length)+1);
            }while(musicIndex==rand);
            musicIndex=rand;
            loadMusic(musicIndex);
            playMusic();
            nowPlaying();
            break;
    }
})


showMusicBtn.addEventListener("click", () =>{
    musicList.classList.toggle("show");
});

hideMusicBtn.addEventListener("click", () =>{
    showMusicBtn.click();
})

const ulTag = wrapper.querySelector("ul");

for(let i=0; i<allmusic.length; i++)
{
    let liTag= `<li li-index="${i}">
                    <div class="row">
                        <span>${allmusic[i].name}</span>
                        <p>${allmusic[i].artist}</p>
                    </div>
                    <audio class="${allmusic[i].src}" src="songs/${allmusic[i].src}.mp3"></audio>
                    <span id="${allmusic[i].src}" class="audio-duration">3:40</span>
                </li>`;

    ulTag.insertAdjacentHTML('beforeend',liTag); 

    let liAudioTag = ulTag.querySelector(`.${allmusic[i].src}`);
    let liAudioDuration = ulTag.querySelector(`#${allmusic[i].src}`);
    // console.log(liAudioTag);
    if(liAudioTag)
    {
    liAudioTag.addEventListener('loadeddata', () => {
        let duration = liAudioTag.duration;
        let sec = Math.floor(duration%60);
        if(sec<10)
        {
            sec=`0${sec}`;
        }
        liAudioDuration.innerText = `${Math.floor(duration/60)}:${sec}`;
        liAudioDuration.setAttribute("t-duration", `${Math.floor(duration/60)}:${sec}`);
    });
    }
}

const allLiTags = ulTag.querySelectorAll('li');
// console.log(allLiTags);

function nowPlaying() {
    for(let j=0; j<allLiTags.length; j++) {

        let audioTag = allLiTags[j].querySelector(".audio-duration");

        if(allLiTags[j].classList.contains("Playing"))
        {
            allLiTags[j].classList.remove("Playing");
            let adDuration = audioTag.getAttribute("t-duration");
            audioTag.innerText=adDuration;
        }

        if(allLiTags[j].getAttribute("li-index")== musicIndex-1)
        {
            allLiTags[j].classList.add("Playing");
            audioTag.innerText = "Playing";
        }
        allLiTags[j].setAttribute("onclick", "clicked(this)");
    }
}

function clicked(ele)
{
    let getLiIndex = ele.getAttribute("li-index");
    musicIndex = getLiIndex;
    musicIndex++;
    console.log(musicIndex);
    loadMusic(musicIndex);
    playMusic();
    nowPlaying();
}
