let songs;
let currsong = new Audio();
let index = 0;

let currfolder;
async function getSongs(folder) {
  currfolder = folder;
  let a = await fetch(`./${folder}/`);
  let response = await a.text();
  let div = document.createElement("div");
  div.innerHTML = response;
  let atags = div.getElementsByTagName("a");
  songs = [];
  for (let index = 0; index < atags.length; index++) {
    const element = atags[index];
    if (element.href.endsWith(".mp3")) {
      songs.push(element.href.split(`/${folder}/`)[1]);
    }
  }
  let songul = document.querySelector(".songlibrary").getElementsByTagName("ul")[0];
  songul.innerHTML = "";
  index=0
  for (let song of songs) {
    songul.innerHTML =
      songul.innerHTML +
      `<li><div class="songdetail invert"><img class="img1" src="Img/music.svg" height="30">
        <div class="detail invert">   
         <div class="title"><b>${decodeURIComponent(song).replace(".mp3"," ")}</b></div>
         <div class="artist">By Amna Kashif</div>
        </div>
        <div class="playbutton">
        <img class="img2" src="Img/play.svg" height="30">
        <span class="invert">Play Now</span>
        </div>
        </div></li>`;
  }

  Array.from(document.querySelector(".songlibrary").getElementsByTagName("li")).forEach((e, i) => {
    e.addEventListener("click", () => {
    
      index = i;
      playMusic(songs[index]);
      
    });
  });
  return songs;
}
getSongs();

async function albums() {
  let a = await fetch(`./songs/`);
  let response = await a.text();
  let div = document.createElement("div");
  div.innerHTML = response;
  let cardContainer = document.querySelector(".cardContainer");
  let as = div.getElementsByTagName("a");
  let arr = Array.from(as);
  for (let index = 0; index < arr.length; index++) {
    const e = arr[index];
    if (e.href.includes("/songs/")) {
      let folder = e.href.split("/").slice(-1)[0];
      

      let a = await fetch(`./songs/${folder}/info.json`);
      let response = await a.json();
      songs=response.songs.map(song=> `songs/${folder}/${song}`)

      cardContainer.innerHTML =
        cardContainer.innerHTML +
        ` 
        <div data-folder=${folder} class="card">
        <div class=playcard> 
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" width="28" height="28" fill="black">
                                <path d="M187.2 100.9C174.8 94.1 159.8 94.4 147.6 101.6C135.4 108.8 128 121.9 128 136L128 504C128 518.1 135.5 531.2 147.6 538.4C159.7 545.6 174.8 545.9 187.2 539.1L523.2 355.1C536 348.1 544 334.6 544 320C544 305.4 536 291.9 523.2 284.9L187.2 100.9z"></path>
                            </svg>
                            </div>
            <img src="./songs/${folder}/cover.jpeg" alt="" width="300">
            <h3>${response.title}</h3>
            <p>${response.Description}</p>
            </div>
            </div>`;
    }
  }
  Array.from(document.getElementsByClassName("card")).forEach((e) => {
    e.addEventListener("click", async (item) => {
      songs = await getSongs(`songs/${item.currentTarget.dataset.folder}`);
      playMusic(songs[0]);

      document.querySelector(".left").style.left="0"
    });
  });
      
    
}

function playMusic(name, pause = false) {
  currsong.src = `./${currfolder}/` +name;

  let playerbtn = document.querySelector(".playpause .play img");
  if (!pause) {
    currsong.play();
    playerbtn.src = "Img/pause.svg";
  } else {
    playerbtn.src = "Img/play.svg";
  }
  let songname = document.querySelector(".songname");
  songname.innerHTML = decodeURIComponent(name).replace(".mp3"," ").trim();
  document.querySelector(".songname").innerHTML = decodeURIComponent(name).replace(".mp3"," ");
  document.querySelector(".songtime").innerHTML = "00:00/00:00";

  
}
playMusic();

function gettime(seconds) {
  if (isNaN(seconds) || seconds < 0) {
    return "00:00";
  }
  let min = Math.floor(seconds / 60);
  let sec = Math.floor(seconds % 60);
  let totalmin = String(min).padStart(2, "0");
  let totalsec = String(sec).padStart(2, "0");

  return `${totalmin}:${totalsec}`;
}
gettime();

async function main() {
  await getSongs(`songs/2025_Hits`);
  albums();
  playMusic(songs[0], true);
  let playerbtn = document.querySelector(".playpause .play img");
  playerbtn.addEventListener("click", () => {
    if (currsong.paused) {
      currsong.play();
      playerbtn.src = "Img/pause.svg";
    } else {
      currsong.pause();
      playerbtn.src = "Img/play.svg";
    }
  });

  document.querySelector(".nextsong").addEventListener("click", () => {
    if (index + 1 < songs.length) {
      index++;
      playMusic(songs[index]);
    }
  });
  document.querySelector(".prevsong").addEventListener("click", () => {
    if (index - 1 >= 0) {
      index--;
      playMusic(songs[index]);
    }
  });

  let songtime = document.querySelector(".songtime");
  currsong.addEventListener("timeupdate", () => {
    songtime.innerHTML = `${gettime(currsong.currentTime)}/${gettime(
      currsong.duration
    )}`;
    document.querySelector(".circle").style.left =
      (currsong.currentTime / currsong.duration) * 100 + "%";
  });
  document.querySelector(".progressbar").addEventListener("click", (e) => {
    let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
    document.querySelector(".circle").style.left = percent + "%";
    currsong.currentTime = (currsong.duration * percent) / 100;
  });

  document.querySelector(".close").addEventListener("click",()=>{
    document.querySelector(".left").style.left="-120%" 
  })
    (currsong.currentTime / currsong.duration) * 100 + "%";

  document
    .querySelector(".range")
    .getElementsByTagName("input")[0]
    .addEventListener("change", (e) => {
      currsong.volume = parseInt(e.target.value) / 100;
      if (currsong.volume > 0) {
        document.querySelector(".volume>img").src = document
          .querySelector(".volume>img")
          .src.replace("Img/mute.svg", "Img/volume.svg");
      }
    });
  document.querySelector(".volume>img").addEventListener("click", (e) => {
    if (e.target.src.includes("Img/volume.svg")) {
      e.target.src = e.target.src.replace("Img/volume.svg", "Img/mute.svg");
      currsong.volume = 0;
      document
        .querySelector(".range")
        .getElementsByTagName("input")[0].value = 0;
    } else {
      e.target.src = e.target.src.replace("Img/mute.svg", "Img/volume.svg");
      currsong.volume = 0.1;
      document
        .querySelector(".range")
        .getElementsByTagName("input")[0].value = 10;
    }
  });
}

main();


