document.addEventListener("DOMContentLoaded",()=>{console.log("SP IT Academy frontend initialized");});


/* =========================================================
   STUDENT SUCCESS CAROUSEL
   ========================================================= */

const successSlides =
  document.querySelectorAll(".success-slide");

const successPrev =
  document.getElementById("success-prev");

const successNext =
  document.getElementById("success-next");

const successNumber =
  document.getElementById("success-number");

const successDots =
  document.querySelectorAll(".success-dot");


let successCurrent = 0;

let successTimer;


/* =========================================================
   SHOW SUCCESS SLIDE
   ========================================================= */

function showSuccessSlide(index) {

  successSlides.forEach((slide, i) => {

    slide.classList.toggle(
      "active",
      i === index
    );


    const video =
      slide.querySelector("video");


    if (video) {

      if (i === index) {

        video.currentTime = 0;

        video.play().catch(() => {});

      } else {

        video.pause();

        video.currentTime = 0;

      }

    }

  });


  /* Counter */

  successNumber.textContent =
    String(index + 1).padStart(2, "0");


  /* Dots */

  successDots.forEach((dot, i) => {

    dot.classList.toggle(
      "active",
      i === index
    );

  });

}


/* =========================================================
   NEXT
   ========================================================= */

function nextSuccessSlide() {

  successCurrent++;

  if (
    successCurrent >=
    successSlides.length
  ) {

    successCurrent = 0;

  }

  showSuccessSlide(successCurrent);

  restartSuccessTimer();

}


/* =========================================================
   PREVIOUS
   ========================================================= */

function previousSuccessSlide() {

  successCurrent--;

  if (successCurrent < 0) {

    successCurrent =
      successSlides.length - 1;

  }

  showSuccessSlide(successCurrent);

  restartSuccessTimer();

}


/* =========================================================
   AUTO PLAY
   ========================================================= */

function startSuccessTimer() {

  successTimer =
    setInterval(() => {

      nextSuccessSlide();

    }, 7000);

}


function restartSuccessTimer() {

  clearInterval(successTimer);

  startSuccessTimer();

}


/* =========================================================
   BUTTONS
   ========================================================= */

if (successNext) {

  successNext.addEventListener(
    "click",
    nextSuccessSlide
  );

}


if (successPrev) {

  successPrev.addEventListener(
    "click",
    previousSuccessSlide
  );

}


/* =========================================================
   DOTS
   ========================================================= */

successDots.forEach((dot) => {

  dot.addEventListener(
    "click",
    () => {

      successCurrent =
        Number(dot.dataset.slide);

      showSuccessSlide(successCurrent);

      restartSuccessTimer();

    }
  );

});


/* =========================================================
   INITIALIZE
   ========================================================= */

if (successSlides.length) {

  showSuccessSlide(0);

  startSuccessTimer();

}