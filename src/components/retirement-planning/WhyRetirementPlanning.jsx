import { useState, useEffect } from "react";
import Slider from "react-slick";
import image2 from "../../../src/Assets/Images/retirement/image-2.jpg";
import image3 from "../../../src/Assets/Images/retirement/image-3.jpg";


export default function WhyRetirementPlanning() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Combine first and second row items for mobile slider
  const allItems = [
    {
      icon: "fa-chart",
      iconBg: "tw-bg-red-100",
      iconColor: "tw-text-red-600",
      title: "Rising Costs Mean Savings Alone Won't Be Enough",
      desc: "With inflation averaging 6-7% annually, your ₹1 lakh today will be worth only ₹55,000 in 10 years. Traditional savings can't beat inflation."
    },
    {
      icon: "fa-heart-pulse",
      iconBg: "tw-bg-blue-100",
      iconColor: "tw-text-blue-600",
      title: "Longer Life Expectancy Demands Steady Income",
      desc: "Indians now live longer, healthier lives. You need 25-30 years of post-retirement income to maintain your lifestyle."
    },
    {
      icon: "fa-seedling",
      iconBg: "tw-bg-green-100",
      iconColor: "tw-text-green-600",
      title: "Early Planning = Lower Stress, Higher Wealth",
      desc: "Starting at 25 vs 35 can mean 3x more retirement wealth due to compound interest. Time is your biggest asset."
    },
    {
      icon: "fa-shield-heart",
      iconBg: "tw-bg-purple-100",
      iconColor: "tw-text-purple-600",
      title: "Protects Your Loved Ones",
      desc: "Life insurance retirement plans ensure your family's financial security even if something happens to you."
    },
    {
      icon: "fa-plane",
      iconBg: "tw-bg-orange-100",
      iconColor: "tw-text-fintoo-orange",
      title: "Freedom to Pursue Your Passions",
      desc: "Whether it's travel, hobbies, or starting a new venture, financial independence gives you choices."
    }
  ];

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: false,
    autoplaySpeed: 3000,
  };

  return (
    <section id="why-retirement-planning" className="tw-bg-white tw-py-20">
      <div className="tw-max-w-7xl tw-mx-auto tw-px-6">
        {/* Header */}
        <div className="tw-text-center lg:tw-mb-16 tw-mb-8">
          <h2 className="tw-text-3xl lg:tw-text-5xl tw-font-bold tw-text-fintoo-blue tw-mb-6">
            Why Planning for Retirement Can't Wait
          </h2>
          <p className="tw-text-base lg:tw-text-xl tw-text-gray-600 tw-max-w-3xl tw-mx-auto">
            The sooner you start, the more time your money has to grow. Don't let procrastination cost you your dream retirement.
          </p>
        </div>

        {/* Desktop Layout */}
        {!isMobile && (
          <>
            {/* First Row */}
            <div className="tw-grid tw-grid-cols-1 lg:tw-grid-cols-2 tw-gap-12 tw-items-center lg:tw-mb-16 tw-mb-8">
              <div>
                <img
                  className="tw-w-full tw-h-80 tw-object-cover tw-rounded-2xl custom-shadow"
                  src={image2}
                  alt="Indian family looking worried about rising costs and inflation, financial stress concept"
                />
              </div>
              <div className="tw-space-y-8">
                {allItems.slice(0, 3).map((item, idx) => (
                  <div key={idx} className="tw-flex tw-items-start tw-space-x-4">
                    <div className={`tw-w-12 tw-h-12 ${item.iconBg} tw-rounded-full tw-flex tw-items-center tw-justify-center tw-flex-shrink-0`}>
                      <i className={`fa-solid ${item.icon} ${item.iconColor} tw-text-xl`}></i>
                    </div>
                    <div>
                      <h3 className="tw-text-xl tw-font-semibold tw-text-fintoo-blue tw-mb-2 pb-0">{item.title}</h3>
                      <p className="tw-text-gray-600">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Second Row */}
            <div className="tw-grid tw-grid-cols-1 lg:tw-grid-cols-2 tw-gap-12 tw-items-center">
              <div className="tw-space-y-8 tw-order-2 lg:tw-order-1">
                {allItems.slice(3).map((item, idx) => (
                  <div key={idx} className="tw-flex tw-items-start tw-space-x-4">
                    <div className={`tw-w-12 tw-h-12 ${item.iconBg} tw-rounded-full tw-flex tw-items-center tw-justify-center tw-flex-shrink-0`}>
                      <i className={`fa-solid ${item.icon} ${item.iconColor} tw-text-xl`}></i>
                    </div>
                    <div>
                      <h3 className="tw-text-xl tw-font-semibold tw-text-fintoo-blue tw-mb-2 pb-0">{item.title}</h3>
                      <p className="tw-text-gray-600">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="tw-hidden lg:tw-block tw-order-1 lg:tw-order-2">
                <img
                  className="tw-w-full tw-h-80 tw-object-cover tw-rounded-2xl custom-shadow"
                  src={image3}
                  alt="happy Indian senior couple enjoying retirement, traveling and pursuing hobbies, financial freedom concept"
                />
              </div>
            </div>
          </>
        )}

        {/* Mobile Layout */}
        {isMobile && (
        <>
           <img
                  className="tw-w-full tw-h-80 tw-object-cover tw-mb-8 tw-rounded-2xl custom-shadow"
                  src={image2}
                  alt="Indian family looking worried about rising costs and inflation, financial stress concept"
                />
          <Slider {...sliderSettings}>
  {allItems.map((item, idx) => (
    <div key={idx} className="tw-flex tw-flex-row tw-items-start tw-space-x-4 tw-px-2 tw-w-full">
      <div className={`tw-flex-shrink-0 tw-w-12 tw-h-12 ${item.iconBg} tw-rounded-full tw-flex tw-items-center tw-justify-center`}>
        <i className={`fa-solid ${item.icon} ${item.iconColor} tw-text-xl`}></i>
      </div>
      <div className="tw-flex-1 !tw-ml-0 tw-mt-2">
        <h3 className="tw-text-xl tw-font-semibold tw-text-fintoo-blue tw-mb-2 pb-0">{item.title}</h3>
        <p className="tw-text-gray-600">{item.desc}</p>
      </div>
    </div>
  ))}
</Slider>

            </>
        )}
      </div>
    </section>
  );
}
