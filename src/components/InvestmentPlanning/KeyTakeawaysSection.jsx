import React, { useState, useEffect } from 'react';

const takeaways = [
  {
    icon: 'fa-bullseye',
    iconBg: 'tw-bg-fintoo-blue',
    title: 'Tailored Investment Strategies',
    description:
      'Align your financial goals with the best investment plans — from short-term opportunities to long-term wealth creation.',
    gradientFrom: 'tw-from-blue-50',
    gradientTo: 'tw-to-white',
    borderColor: 'tw-border tw-border-blue-100',
  },
  {
    icon: 'fa-user-tie',
    iconBg: 'tw-bg-fintoo-orange',
    title: 'Expert-Led Portfolio Management',
    description:
      'Access SEBI-registered financial advisors who craft diversified, risk-adjusted investment plans across asset classes.',
    gradientFrom: 'tw-from-orange-50',
    gradientTo: 'tw-to-white',
    borderColor: 'tw-border tw-border-orange-100',
  },
  {
    icon: 'fa-flag-checkered',
    iconBg: 'tw-bg-green-600',
    title: 'Goal-Based Financial Planning',
    description:
      "Whether it's a 5-year investment plan, education investment plan, or retirement corpus, we make every rupee work toward your goals.",
    gradientFrom: 'tw-from-green-50',
    gradientTo: 'tw-to-white',
    borderColor: 'tw-border tw-border-green-100',
  },
  {
    icon: 'fa-calculator',
    iconBg: 'tw-bg-purple-600',
    title: 'Smart & Tax-Efficient Investments',
    description:
      'Maximize returns through money-saving schemes, short-term investment plans with high returns, and long-term compounding strategies.',
    gradientFrom: 'tw-from-purple-50',
    gradientTo: 'tw-to-white',
    borderColor: 'tw-border tw-border-purple-100',
  },
  {
    icon: 'fa-handshake',
    iconBg: 'tw-bg-indigo-600',
    title: 'Transparent & Fee-Based Advisory',
    description:
      'No commissions. No hidden charges. Just pure, data-backed financial planning advice designed to deliver measurable results.',
    gradientFrom: 'tw-from-indigo-50',
    gradientTo: 'tw-to-white',
    borderColor: 'tw-border tw-border-indigo-100',
  },
  {
    icon: 'fa-mobile-alt',
    iconBg: 'tw-bg-teal-600',
    title: 'Digital-First Experience',
    description:
      'Access your portfolio, track performance, and communicate with advisors through our intuitive digital platform.',
    gradientFrom: 'tw-from-teal-50',
    gradientTo: 'tw-to-white',
    borderColor: 'tw-border tw-border-teal-100',
  },
];

const KeyTakeawayCard = ({
  icon,
  iconBg,
  title,
  description,
  gradientFrom,
  gradientTo,
  borderColor,
}) => {
  const [isOpen, setIsOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  // Detect screen size
  useEffect(() => {
    const checkScreen = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      setIsOpen(!mobile); // always open on desktop
    };
    checkScreen();
    window.addEventListener('resize', checkScreen);
    return () => window.removeEventListener('resize', checkScreen);
  }, []);

  return (
    <div
      className={`tw-bg-gradient-to-br ${gradientFrom} ${gradientTo} lg:tw-p-8 tw-p-6 tw-rounded-2xl tw-shadow-lg ${borderColor} tw-hover:tw-shadow-xl tw-transition-shadow`}
    >
      {/* Header */}
      <div
        className={`tw-flex tw-items-center tw-justify-between ${
          isMobile ? 'tw-cursor-pointer' : ''
        }`}
        onClick={() => isMobile && setIsOpen(!isOpen)}
      >
        <div className="tw-flex md:tw-grid tw-items-center tw-gap-4">
          <div
            className={`tw-w-16 tw-h-12 lg:tw-w-16 lg:tw-h-16 ${iconBg} tw-rounded-xl tw-flex tw-items-center tw-justify-center`}
          >
            <i className={`fas ${icon} tw-text-white tw-text-xl lg:tw-text-2xl`}></i>
          </div>
          <h3 className="tw-text-xl lg:tw-text-2xl tw-font-bold tw-text-fintoo-blue tw-pb-0 tw-mb-0">
            {title}
          </h3>
        </div>

        {/* Toggle only visible on mobile */}
        {isMobile && (
          <i
            className={`fas fa-chevron-${isOpen ? 'up' : 'down'} tw-text-fintoo-blue tw-text-xl tw-transition-transform`}
          ></i>
        )}
      </div>

      {/* Description (collapsible only on mobile) */}
      <div
        className={`tw-overflow-hidden tw-transition-all tw-duration-300 ${
          isOpen ? 'tw-max-h-40 tw-mt-3' : 'tw-max-h-0 tw-mt-0'
        } ${!isMobile ? 'tw-max-h-full tw-mt-0' : ''}`}
      >
        <p className="tw-text-gray-600 tw-leading-relaxed tw-mt-4 tw-mb-0">{description}</p>
      </div>
    </div>
  );
};

export default function KeyTakeawaysSection() {
  return (
    <section id="key-takeaways" className="tw-py-20 tw-bg-white">
      <div className="tw-max-w-7xl tw-mx-auto tw-px-4 sm:tw-px-6 lg:tw-px-8">
        <div className="tw-text-center tw-mb-16">
          <h2 className="tw-text-4xl tw-font-bold tw-text-fintoo-blue tw-mb-4">
            Why Choose Fintoo?
          </h2>
          <p className="tw-text-xl tw-text-gray-600 tw-max-w-3xl tw-mx-auto">
            Our comprehensive approach to wealth management combines expertise,
            technology, and personalized service to deliver exceptional results.
          </p>
        </div>

        <div className="tw-grid md:tw-grid-cols-2 lg:tw-grid-cols-3 tw-gap-8">
          {takeaways.map((item, idx) => (
            <KeyTakeawayCard key={idx} {...item} />
          ))}
        </div>
      </div>
    </section>
  );
}
