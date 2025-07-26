
const closedEnvelope = document.getElementById('closed-envelope');
const mainContent = document.getElementById('main-content');
const backgroundMediaWrapper = document.getElementById('background-media-wrapper');
const backgroundVideoLeft = document.getElementById('background-video-left');
const backgroundVideoRight = document.getElementById('background-video-right');
const backgroundImage = document.getElementById('background-image');
const yesButton = document.getElementById('yesButton');
const noButton = document.getElementById('noButton');
const responseDisplay = document.getElementById('responseDisplay');
const backgroundMusic = document.getElementById('background-music');
const musicVolume = 0.15;
if (backgroundMusic) {
    backgroundMusic.volume = musicVolume; 
    backgroundMusic.play().then(() => {
        console.log("Music autoplayed successfully on load.");
    }).catch(error => {
        console.log("Music autoplay blocked on load. Will attempt to play on first user interaction.");
        
        const playMusicOnInteraction = () => {
            if (backgroundMusic && backgroundMusic.paused) {
                backgroundMusic.play().then(() => {
                    console.log("Music started playing on user interaction.");
                    document.removeEventListener('click', playMusicOnInteraction);
                    document.removeEventListener('touchend', playMusicOnInteraction);
                }).catch(err => {
                    console.error("Failed to play music on interaction:", err);
                });
            }
        };
        document.addEventListener('click', playMusicOnInteraction);
        document.addEventListener('touchend', playMusicOnInteraction);
    });
}

closedEnvelope.addEventListener('click', function() {
    closedEnvelope.querySelector('.envelope').classList.add('envelope-open');
    closedEnvelope.classList.add('clicked');
    setTimeout(() => {
        closedEnvelope.classList.add('display-none');
        closedEnvelope.classList.remove('clicked');
        mainContent.classList.remove('hidden');
        mainContent.style.animation = 'fadeInContent 1.5s ease-in-out forwards';

        if (backgroundMediaWrapper) {
            backgroundMediaWrapper.classList.remove('hidden');

            preloadMedia().then(() => {
                if (backgroundVideoLeft) {
                    backgroundVideoLeft.play().catch(error => {
                        console.log("Video left autoplay prevented or failed:", error);
                    });
                }
                if (backgroundVideoRight) {
                    backgroundVideoRight.play().catch(error => {
                        console.log("Video right autoplay prevented or failed:", error);
                    });
                }
            }).catch(error => {
                console.error("Error preloading media:", error);
            });
        }
        document.body.style.backgroundColor = 'transparent';

        if (backgroundMusic && backgroundMusic.paused) {
            backgroundMusic.play().catch(error => {
                console.log("Music play after envelope click prevented or failed:", error);
            });
        }

    }, 600);
});

function preloadMedia() {
    const promises = [];

    if (backgroundVideoLeft) {
        promises.push(new Promise((resolve, reject) => {
            backgroundVideoLeft.oncanplaythrough = () => resolve();
            backgroundVideoLeft.onerror = () => reject(new Error(`Failed to load video: ${backgroundVideoLeft.src}`));
            backgroundVideoLeft.load();
        }));
    }

    if (backgroundVideoRight) {
        promises.push(new Promise((resolve, reject) => {
            backgroundVideoRight.oncanplaythrough = () => resolve();
            backgroundVideoRight.onerror = () => reject(new Error(`Failed to load video: ${backgroundVideoRight.src}`));
            backgroundVideoRight.load(); 
        }));
    }

    if (backgroundImage) {
        promises.push(new Promise((resolve, reject) => {
            const img = new Image();
            img.src = backgroundImage.src; 
            img.onload = () => resolve();
            img.onerror = () => reject(new Error(`Failed to load image: ${img.src}`));
        }));
    }

    return Promise.all(promises);
}


if (yesButton) {
    yesButton.addEventListener('click', function() {
        responseDisplay.style.display = 'block';
        responseDisplay.innerHTML = '<b>ตกลงแล้วนะ รักไอเด็กที่สุดเลย❤</b>';
        
        const selectionButtonsContainer = document.querySelector('.selection-buttons');
        if (selectionButtonsContainer) {
            selectionButtonsContainer.style.display = 'none'; 
        }
    });
}

if (noButton) {
    noButton.addEventListener('click', function() {
        responseDisplay.style.display = 'block';
        responseDisplay.innerHTML = '<b>ตลกละต๋องแต๋ง</b>';

    });
}