import { useState, useEffect } from "react";
import Slider from "react-slick";


export default function HowFintooHelps() {
  const [activeIndex, setActiveIndex] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024); // lg breakpoint
    handleResize(); // initial check
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const scrollToCTA = () => {
    const element = document.getElementById("final-cta");
    if (element) element.scrollIntoView({ behavior: "smooth" });
  };

  const cards = [
    {
      title: "Goal-Based Planning",
      icon: "fa-bullseye",
      iconBg: "tw-bg-blue-100",
      color: "tw-text-fintoo-blue",
      content: (
        <>
          <p className="tw-text-gray-600 tw-mb-6">
            Comprehensive planning for retirement, lifestyle goals, healthcare expenses, and legacy planning.
          </p>
          <ul className="tw-space-y-2 tw-text-sm tw-text-gray-600">
            <li className="tw-flex tw-items-center"><i className="fa-solid fa-check tw-text-green-500 tw-mr-2"></i>Retirement Corpus Calculation</li>
            <li className="tw-flex tw-items-center"><i className="fa-solid fa-check tw-text-green-500 tw-mr-2"></i>Healthcare Cost Planning</li>
            <li className="tw-flex tw-items-center"><i className="fa-solid fa-check tw-text-green-500 tw-mr-2"></i>Lifestyle Goal Mapping</li>
          </ul>
        </>
      )
    },
    {
      title: "Best Investment Access",
      icon: "fa-chart-pie",
      iconBg: "tw-bg-orange-100",
      color: "tw-text-fintoo-orange",
      content: (
        <>
          <p className="tw-text-gray-600 tw-mb-6">
            Access to top pension plans, government schemes, and high-return investment options.
          </p>
          <ul className="tw-space-y-2 tw-text-sm tw-text-gray-600">
            <li className="tw-flex tw-items-center"><i className="fa-solid fa-check tw-text-green-500 tw-mr-2"></i>NPS Pension Plans</li>
            <li className="tw-flex tw-items-center"><i className="fa-solid fa-check tw-text-green-500 tw-mr-2"></i>Retirement Mutual Funds</li>
            <li className="tw-flex tw-items-center"><i className="fa-solid fa-check tw-text-green-500 tw-mr-2"></i>Private Pension Schemes</li>
          </ul>
        </>
      )
    },
    {
      title: "Expert Guidance",
      icon: "fa-user-tie",
      iconBg: "tw-bg-green-100",
      color: "tw-text-green-600",
      content: (
        <>
          <p className="tw-text-gray-600 tw-mb-6">
            Certified retirement financial advisors with 15+ years of experience guide your journey.
          </p>
          <ul className="tw-space-y-2 tw-text-sm tw-text-gray-600">
            <li className="tw-flex tw-items-center"><i className="fa-solid fa-check tw-text-green-500 tw-mr-2"></i>Certified Financial Planners</li>
            <li className="tw-flex tw-items-center"><i className="fa-solid fa-check tw-text-green-500 tw-mr-2"></i>Regular Portfolio Reviews</li>
            <li className="tw-flex tw-items-center"><i className="fa-solid fa-check tw-text-green-500 tw-mr-2"></i>24/7 Support</li>
          </ul>
        </>
      )
    }
  ];

  const tailoredCards = [
    {
      title: "For Employees",
      icon: "fa-building",
      iconBg: "tw-bg-blue-100",
      iconColor: "tw-text-fintoo-blue",
      desc: "Optimize your EPF, PPF, and explore additional retirement savings beyond your corporate benefits."
    },
    {
      title: "For NRIs",
      icon: "fa-globe",
      iconBg: "tw-bg-orange-100",
      iconColor: "tw-text-fintoo-orange",
      desc: "Navigate cross-border retirement planning with NRE/NRO accounts and India-specific pension schemes."
    },
    {
      title: "For Self-Employed",
      icon: "fa-briefcase",
      iconBg: "tw-bg-green-100",
      iconColor: "tw-text-green-600",
      desc: "Build your own pension with flexible contribution plans and tax-efficient retirement strategies."
    }
  ];

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 600,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000
  };

  return (
    <section id="how-fintoo-helps" className="tw-bg-gray-50 tw-py-8 lg:tw-py-20">
      <div className="tw-max-w-7xl tw-mx-auto tw-px-6">
        <div className="tw-text-center tw-mb-16">
          <h2 className="tw-text-3xl lg:tw-text-5xl tw-font-bold tw-text-fintoo-blue tw-mb-6">
            Your Partner in Building the Best Retirement Plan
          </h2>
          <p className="tw-text-base lg:tw-text-xl tw-text-gray-600 tw-max-w-3xl tw-mx-auto">
            Fintoo goes beyond products — we design a holistic roadmap tailored to your unique financial goals and life aspirations.
          </p>
        </div>

        {/* Main cards (Goal / Investment / Expert) */}
        <div className={`tw-grid tw-gap-8 ${isMobile ? "tw-grid-cols-1" : "lg:tw-grid-cols-3"}`}>
          {cards.map((card, idx) => (
            <div
              key={idx}
              className="tw-bg-white lg:tw-p-8 tw-p-4 tw-rounded-2xl tw-custom-shadow hover:tw-shadow-xl tw-transition-all"
            >
              <div
                className={`tw-flex tw-items-center tw-justify-between tw-cursor-pointer ${isMobile ? "" : "tw-block"}`}
                onClick={() => isMobile && setActiveIndex(activeIndex === idx ? null : idx)}
              >
                <div className="tw-flex tw-items-center tw-space-x-4">
                  <div className={`tw-w-16 tw-h-16 ${card.iconBg} tw-rounded-full tw-flex tw-items-center tw-justify-center`}>
                    <i className={`fa-solid ${card.icon} ${card.color} tw-text-2xl`}></i>
                  </div>
                  <h3 className="tw-text-xl tw-font-semibold tw-text-fintoo-blue tw-pb-0">{card.title}</h3>
                </div>
                {isMobile && (
                  <i
                    className={`fa-solid fa-chevron-${activeIndex === idx ? "up" : "down"} tw-text-gray-400 tw-text-lg`}
                  ></i>
                )}
              </div>
              {(!isMobile || activeIndex === idx) && (
                <div className="tw-mt-6">{card.content}</div>
              )}
            </div>
          ))}
        </div>

        {/* Tailored solutions section */}
        <div className="tw-bg-white tw-p-8 tw-rounded-2xl tw-custom-shadow tw-mb-12 tw-mt-12">
          <h3 className="tw-text-2xl tw-font-semibold tw-text-fintoo-blue tw-mb-8 tw-text-center">
            Tailored Solutions for Every Indian
          </h3>

          {isMobile ? (
            <Slider {...sliderSettings}>
              {tailoredCards.map((card, idx) => (
                <div key={idx} className="tw-text-center tw-px-4">
                  <div className={`tw-w-20 tw-h-20 ${card.iconBg} tw-rounded-full tw-flex tw-items-center tw-justify-center tw-mx-auto tw-mb-4`}>
                    <i className={`fa-solid ${card.icon} ${card.iconColor} tw-text-2xl`}></i>
                  </div>
                  <h4 className="tw-text-lg tw-font-semibold tw-text-fintoo-blue tw-mb-2">{card.title}</h4>
                  <p className="tw-text-gray-600 tw-text-sm">{card.desc}</p>
                </div>
              ))}
            </Slider>
          ) : (
            <div className="tw-grid tw-grid-cols-3 tw-gap-8">
              {tailoredCards.map((card, idx) => (
                <div key={idx} className="tw-text-center">
                  <div className={`tw-w-20 tw-h-20 ${card.iconBg} tw-rounded-full tw-flex tw-items-center tw-justify-center tw-mx-auto tw-mb-4`}>
                    <i className={`fa-solid ${card.icon} ${card.iconColor} tw-text-2xl`}></i>
                  </div>
                  <h4 className="tw-text-lg tw-font-semibold tw-text-fintoo-blue tw-mb-2">{card.title}</h4>
                  <p className="tw-text-gray-600 tw-text-sm">{card.desc}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="tw-text-center tw-mt-12">
          <button
            onClick={scrollToCTA}
            className="tw-orange-gradient tw-text-white tw-px-8 tw-py-4 tw-rounded-full tw-text-lg tw-font-semibold hover:tw-shadow-lg tw-transition-all"
          >
            <i className="fa-solid fa-phone tw-mr-3"></i>
            Talk to a Retirement Advisor
          </button>
        </div>
      </div>
    </section>
  );
}
