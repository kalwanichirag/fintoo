import React from "react";
import Slider from "react-slick";

const TestimonialsSection = () => {
  const testimonials = [
    {
      text: `"Fintoo helped me increase my portfolio returns by 4% annually. Their personalized approach and transparent advice made all the difference in achieving my retirement goals."`,
      name: "Rajesh Sharma",
      role: "IT Professional, Bangalore",
      img: "https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-2.jpg",
    },
    {
      text: `"As a business owner, I needed sophisticated tax planning. Fintoo's strategies saved me ₹8 lakhs annually while optimizing my investment portfolio beautifully."`,
      name: "Priya Patel",
      role: "Entrepreneur, Mumbai",
      img: "https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-5.jpg",
    },
    {
      text: `"The best financial decision I made was partnering with Fintoo. Their goal-based planning helped me buy my dream home 2 years ahead of schedule."`,
      name: "Arjun Singh",
      role: "Engineer, Hyderabad",
      img: "https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-4.jpg",
    },
    {
      text: `"Fintoo's wealth management strategies transformed our family's financial security. We've built a robust portfolio that supports our children's education dreams."`,
      name: "Meera Gupta",
      role: "Doctor, Delhi",
      img: "https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-6.jpg",
    },
    {
      text: `"I was skeptical about financial advisors, but Fintoo's transparent approach and consistent performance convinced me. My wealth has grown 3x in 5 years."`,
      name: "Vikram Reddy",
      role: "CA, Chennai",
      img: "https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-8.jpg",
    },
    {
      text: `"Fintoo's investment consulting helped me navigate market volatility with confidence. Their risk management strategies protected and grew my portfolio simultaneously."`,
      name: "Kavita Joshi",
      role: "Consultant, Pune",
      img: "https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-7.jpg",
    },
  ];

  const settings = {
    dots: false,
    infinite: true,
    speed: 600,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: false,
    responsive: [
      {
        breakpoint: 1024, // tablet
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          dots: false,
        },
      },
      {
        breakpoint: 768, // mobile
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          dots: false,
        },
      },
    ],
  };

  return (
    <section id="testimonials" className="tw-py-20 tw-bg-white">
      <div className="tw-container tw-mx-auto tw-px-6">
        {/* Header */}
        <div className="tw-text-center tw-mb-16">
          <h2 className="tw-text-4xl tw-font-bold tw-text-gray-800 tw-mb-4">
            What Our Clients Say
          </h2>
          <p className="tw-text-lg tw-text-gray-600 tw-max-w-2xl tw-mx-auto">
            Real stories from real clients who have transformed their financial
            futures with Fintoo&apos;s expert guidance.
          </p>
        </div>

        {/* Slider */}
        <Slider {...settings}>
          {testimonials.map((t, index) => (
            <div key={index} className="tw-p-4 ">
              <div className="tw-border-solid tw-border-[#e9e9e9] tw-border tw-p-8 tw-rounded-2xl tw-shadow-lg tw-bg-white tw-h-full hover-lift">
                {/* Stars */}
                <div className="tw-flex tw-items-center tw-mb-4">
                  <div className="tw-flex tw-text-yellow-400">
                    {Array(5)
                      .fill(0)
                      .map((_, i) => (
                        <i key={i} className="fas fa-star"></i>
                      ))}
                  </div>
                  <span className="tw-ml-2 tw-text-sm tw-text-gray-600">
                    5.0
                  </span>
                </div>

                {/* Text */}
                <p className="tw-text-gray-700 tw-mb-6 tw-italic">{t.text}</p>

                {/* User Info */}
                <div className="tw-flex tw-items-center">
                  {/* <img
                    src={t.img}
                    alt={t.name}
                    className="tw-w-12 tw-h-12 tw-rounded-full tw-mr-4"
                  /> */}
                  <div>
                    <div className="tw-font-semibold tw-text-gray-800">
                      {t.name}
                    </div>
                    <div className="tw-text-sm tw-text-gray-600">{t.role}</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </section>
  );
};

export default TestimonialsSection;
