import { useState, useEffect } from "react";
import Slider from "react-slick";


export default function Testimonials() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768); // md breakpoint
    handleResize(); // initial check
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const testimonials = [
    {
      name: "Priya Sharma",
      role: "Software Engineer, Bangalore",
      rating: 5,
      text: "Started planning at 28 with Fintoo. Now at 35, I'm already 60% towards my retirement goal of ₹3 crores.",
      value: "₹1.8 Cr",
      label: "Current Portfolio Value"
    },
    {
      name: "Rajesh Kumar",
      role: "Business Owner, Delhi",
      rating: 5,
      text: "As a business owner, irregular income was a challenge. Fintoo created a flexible plan that adapts to my cash flow.",
      value: "55 Years",
      label: "Planned Retirement Age"
    },
    {
      name: "Meera Patel",
      role: "NRI, USA",
      rating: 5,
      text: "Managing retirement planning across two countries seemed impossible. Fintoo's NRI-specific solutions made it seamless.",
      value: "Cross-border",
      label: "Planning Success"
    }
  ];

  const sliderSettings = {
    dots: false,
    infinite: true,
    speed: 4000,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 0,
    
    pauseOnHover: true
  };

  return (
    <section id="success-stories" className="tw-bg-white tw-py-8 lg:tw-py-20">
      <div className="tw-max-w-7xl tw-mx-auto tw-px-6">
        <div className="tw-text-center tw-mb-16">
          <h2 className="tw-text-3xl lg:tw-text-5xl tw-font-bold tw-text-fintoo-blue tw-mb-6">
            Real Stories, Real Results
          </h2>
          <p className="tw-text-base lg:tw-text-xl tw-text-gray-600">
            See how Fintoo has helped thousands of Indians achieve their retirement dreams
          </p>
        </div>

        {isMobile ? (
          <Slider {...sliderSettings}>
            {testimonials.map((t, idx) => (
              <div key={idx} className="tw-px-2">
                <div className="tw-bg-gray-50 tw-p-8 tw-rounded-2xl custom-shadow">
                  <div className="tw-flex tw-items-center tw-mb-6">
                    <div>
                      <h4 className="tw-text-lg tw-font-semibold tw-text-fintoo-blue pb-0">{t.name}</h4>
                      <p className="tw-text-sm tw-text-gray-600">{t.role}</p>
                    </div>
                  </div>
                  <div className="tw-mb-4">
                    <div className="tw-flex tw-text-yellow-400 tw-mb-2">
                      {[...Array(t.rating)].map((_, i) => (
                        <i key={i} className="fa-solid fa-star" />
                      ))}
                    </div>
                    <p className="tw-text-gray-700 tw-italic">{t.text}</p>
                  </div>
                  <div className="tw-border-t tw-pt-4">
                    <div className="tw-text-2xl tw-font-bold tw-text-fintoo-orange">{t.value}</div>
                    <div className="tw-text-sm tw-text-gray-600">{t.label}</div>
                  </div>
                </div>
              </div>
            ))}
          </Slider>
        ) : (
          <div className="tw-grid tw-grid-cols-1 md:tw-grid-cols-3 tw-gap-8 tw-mb-0">
            {testimonials.map((t, idx) => (
              <div key={idx} className="tw-bg-gray-50 tw-p-8 tw-rounded-2xl custom-shadow">
                <div className="tw-flex tw-items-center tw-mb-6">
                  <div>
                    <h4 className="tw-text-lg tw-font-semibold tw-text-fintoo-blue pb-0">{t.name}</h4>
                    <p className="tw-text-sm tw-text-gray-600">{t.role}</p>
                  </div>
                </div>
                <div className="tw-mb-4">
                  <div className="tw-flex tw-text-yellow-400 tw-mb-2">
                    {[...Array(t.rating)].map((_, i) => (
                      <i key={i} className="fa-solid fa-star" />
                    ))}
                  </div>
                  <p className="tw-text-gray-700 tw-italic">{t.text}</p>
                </div>
                <div className="tw-border-t tw-pt-4">
                  <div className="tw-text-2xl tw-font-bold tw-text-fintoo-orange">{t.value}</div>
                  <div className="tw-text-sm tw-text-gray-600">{t.label}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
