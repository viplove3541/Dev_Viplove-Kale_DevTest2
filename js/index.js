function controlVideo(vidcontrol) {
  var div = document.getElementById("video-popup");
  var iframe = div.getElementsByTagName("iframe")[0].contentWindow;
  iframe.postMessage(
    '{"event":"command","func":"' + vidcontrol + '","args":""}',
    "*"
  );
}

function validateForm() {
  const email = document.getElementById("email").value;
  const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  // Check if the email matches the pattern
  if (!emailPattern.test(email)) {
    alert("Please enter a valid email address.");
    return false; // Prevent form submission
  }
  return true; // Allow form submission
}

// controlVideo('pauseVideo')

const openPopup = () => {
  document.querySelector(".popup").classList.add("popup--show");
  controlVideo("playVideo");
};

const closePopup = () => {
  document.querySelector(".popup").classList.remove("popup--show");
  controlVideo("stopVideo");
};

const openMenu = () => {
  document.querySelector(".header").classList.add("header--open");
};
const closeMenu = () => {
  document.querySelector(".header").classList.remove("header--open");
};

var Slider = function (id) {
  this.slider = document.getElementById(id);
  this.slideList = this.slider.getElementsByClassName("js-slide-list")[0];
  this.slideListItems =
    this.slider.getElementsByClassName("js-slide-list-item");
  this.slideWidth = this.slideListItems[0].offsetWidth;
  this.slidesLength = this.slideListItems.length;
  this.current = 1;
  this.direction;
  this.animating = false;
};

Slider.prototype = {
  constructor: Slider,
  init: function () {
    this.listenEvents();
    this.cloneFirstAndLastItem();
  },

  listenEvents: function () {
    var that = this;
    var arrowButtons = this.slider.getElementsByClassName("js-arrow-button");
    for (var i = 0; i < arrowButtons.length; i++) {
      arrowButtons[i].addEventListener("click", function () {
        that.clickArrowButton(this);
      });
    }
    var pagerItems = this.slider.getElementsByClassName("js-pager-item");
    for (var i = 0; i < pagerItems.length; i++) {
      pagerItems[i].addEventListener("click", function () {
        that.clickPagerItem(this);
      });
    }
  },

  cloneFirstAndLastItem: function () {
    var firstSlide = this.slideListItems[0];
    var lastSlide = this.slideListItems[this.slidesLength - 1];
    var firstSlideClone = firstSlide.cloneNode(true);
    var lastSlideClone = lastSlide.cloneNode(true);

    firstSlideClone.removeAttribute("data-slide-index");
    lastSlideClone.removeAttribute("data-slide-index");

    this.slideList.appendChild(firstSlideClone);
    this.slideList.insertBefore(lastSlideClone, firstSlide);
  },

  clickArrowButton: function (el) {
    var direction = el.getAttribute("data-direction");
    var pos = parseInt(this.slideList.style.left) || 0;
    var newPos;
    // direction will be added to current slide number
    this.direction = direction === "prev" ? -1 : 1;
    newPos = pos + -1 * 100 * this.direction;
    if (!this.animating) {
      this.slideTo(
        this.slideList,
        function (progress) {
          return Math.pow(progress, 2);
        },
        pos,
        newPos,
        500
      );
      // Update current slide number
      this.current += this.direction;
    }
  },

  clickPagerItem: function (el) {
    var slideIndex = el.getAttribute("data-slide-index");
    var targetSlide = this.slider.querySelector(
      '.js-slide-list-item[data-slide-index="' + slideIndex + '"]'
    );
    var pos = parseInt(this.slideList.style.left) || 0;
    var newPos =
      Math.round(targetSlide.offsetLeft / targetSlide.offsetWidth) * 100 * -1;

    if (!this.animating && pos !== newPos) {
      this.slideTo(
        this.slideList,
        function (progress) {
          return Math.pow(progress, 2);
        },
        pos,
        newPos,
        500
      );
      // Update current slide number
      this.current = parseInt(slideIndex) + 1;
    }
  },

  slideTo: function (element, deltaFunc, pos, newPos, duration) {
    this.animating = true;
    this.animate({
      delay: 20,
      duration: duration || 1000,
      deltaFunc: deltaFunc,
      step: function (delta) {
        var direction = pos > newPos ? 1 : -1;
        element.style.left =
          pos + Math.abs(newPos - pos) * delta * direction * -1 + "%";
      },
    });
  },

  animate: function (opts) {
    var that = this;
    var start = new Date();
    var id = setInterval(function () {
      var timePassed = new Date() - start;
      var progress = timePassed / opts.duration;

      if (progress > 1) {
        progress = 1;
      }
      var delta = opts.deltaFunc(progress);
      opts.step(delta);

      if (progress === 1) {
        clearInterval(id);
        that.animating = false;
        that.checkCurrentSlide();
      }
    }, opts.delay || 10);
  },

  checkCurrentSlide: function () {
    var cycle = false;
    //this.current += this.direction;
    cycle = !!(this.current === 0 || this.current > this.slidesLength);
    if (cycle) {
      // update current in order to adapt new slide list
      this.current = this.current === 0 ? this.slidesLength : 1;
      this.slideList.style.left = -1 * this.current * 100 + "%";
    }

    if (document.querySelector(".slider-pager__item.active")) {
      document
        .querySelector(".slider-pager__item.active")
        .classList.remove("active");
    }

    document
      .querySelector(".slider-pager__item:nth-child(" + this.current + ")")
      .classList.add("active");
  },
};

document.addEventListener("DOMContentLoaded", function () {
  new Slider("slider").init();
});
