import Aos from "aos";

//TODO: Check

export const roveroUtility = {
  animation() {
    Aos.init();
  },
  bgImage() {
    document.querySelectorAll("[data-background]").forEach(function (element) {
      var backgroundUrl = element.getAttribute("data-background");
      element.style.backgroundImage = "url(" + backgroundUrl + ")";
    });
  },
  stickyNav() {
    var sticky = document.getElementById("header-sticky");
    window.addEventListener("scroll", function () {
      var scroll = window.scrollY;
      if (scroll < 2) {
        sticky.classList.remove("sticky-menu");
      } else {
        sticky.classList.add("sticky-menu");
      }
    });
  },
  scrollBtn() {
    var scrollBtn = document.querySelector(".scroll-up");
    if (scrollBtn) {
      scrollBtn.addEventListener("click", function () {
        window.scrollTo({
          top: 0,
          behavior: "smooth",
        });
      });
    }
    window.addEventListener("scroll", function () {
      var scrolling = window.pageYOffset || document.documentElement.scrollTop;

      if (scrolling > 500) {
        document.querySelector(".scroll-up").classList.add("show");
      } else {
        document.querySelector(".scroll-up").classList.remove("show");
      }
    });
  },
};

const scrollToTop = () => {
  let scrollUpElement = null;

  // Wait for DOM to be ready
  if (typeof window !== 'undefined') {
    window.addEventListener('load', () => {
      scrollUpElement = document.querySelector('.scroll-up');
    });

    window.addEventListener('scroll', () => {
      if (!scrollUpElement) {
        scrollUpElement = document.querySelector('.scroll-up');
      }

      if (scrollUpElement) {
        if (window.scrollY > 200) {
          scrollUpElement.classList.add('show');
        } else {
          scrollUpElement.classList.remove('show');
        }
      }
    });
  }
};

export default scrollToTop;
