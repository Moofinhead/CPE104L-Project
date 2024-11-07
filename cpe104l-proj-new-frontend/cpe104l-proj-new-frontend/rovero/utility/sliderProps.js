//TODO: Check

function SampleNextArrow(props) {
  const { className, extraClass, onClick } = props;
  return (
    <b className={className} onClick={onClick}>
      <span className={extraClass} />
    </b>
  );
}
export const sliderProps = {
  home1: {
    dots: true,
    fade: true,
    autoplay: true,
    autoplaySpeed: 5000,
    arrows: true,
    prevArrow: (
      <SampleNextArrow extraClass="fa-solid fa-long-arrow-alt-left l-a" />
    ),
    nextArrow: (
      <SampleNextArrow extraClass="fa-solid fa-long-arrow-alt-right r-a" />
    ),
    responsive: [
      {
        breakpoint: 767,
        settings: {},
      },
    ],
  },
  roomsHm1Active: {
    infinite: false,
    dots: true,
    arrows: false,
    slidesToShow: 3,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1000,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 767,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 2,
        },
      },
    ],
  },
  featureHm1Active: {
    dots: false,
    arrows: true,
    prevArrow: (
      <SampleNextArrow extraClass="fa-solid fa-long-arrow-alt-left l-a" />
    ),
    nextArrow: (
      <SampleNextArrow extraClass="fa-solid fa-long-arrow-alt-right r-a" />
    ),
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  },
  testimonialActive: {
    infinite: false,
    dots: true,
    arrows: false,
    slidesToShow: 3,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1000,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 767,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 2,
        },
      },
    ],
  },
  brandActive: {
    infinite: true,
    dots: false,
    arrows: false,
    autoplay: true,
    autoplaySpeed: 2000,
    slidesToShow: 4,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1000,
        settings: {
          slidesToShow: 4,
        },
      },
      {
        breakpoint: 767,
        settings: {
          slidesToShow: 3,
        },
      },
      {
        breakpoint: 576,
        settings: {
          slidesToShow: 2,
        },
      },
    ],
  },
};
