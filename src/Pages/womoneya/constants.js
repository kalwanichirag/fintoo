export const ABOUT_STAGE_IMAGES = [
  "/static/media/womoneya/stage/one.jpeg",
  "/static/media/womoneya/stage/two.jpeg",
  "/static/media/womoneya/stage/third.jpeg",
  "/static/media/womoneya/stage/fourth.jpeg",
  "/static/media/womoneya/stage/fiveth.jpeg",
  "/static/media/womoneya/stage/six.jpeg",
  "/static/media/womoneya/stage/seven.jpeg",
  "/static/media/womoneya/stage/eight.jpeg",
  "/static/media/womoneya/stage/nine.JPG",
  "/static/media/womoneya/stage/ten.jpeg",
  "/static/media/womoneya/stage/eleven.jpeg",
  "/static/media/womoneya/stage/tweleve.jpeg",
];

export const GALLERY_IMAGES = [
  "/static/media/womoneya/award/0E8EEEE6-16D1-41D8-BE86-985A32EF783C_1_105_c.jpeg",
  "/static/media/womoneya/award/1FE65389-F62E-4B5D-A540-743A75109225_1_105_c.jpeg",
  "/static/media/womoneya/award/772A03CE-5249-4A13-88EA-D19123D45B07_1_105_c.jpeg",
  "/static/media/womoneya/award/7E27B0A5-BB15-43DC-9D6F-5C70744D1006_1_105_c.jpeg",
  "/static/media/womoneya/award/96ED674F-D61D-4EC5-8C65-6DD2F4BB6F88_1_105_c.jpeg",
  "/static/media/womoneya/award/9EC9F139-4552-4DED-91AD-855F9482E4AF_1_105_c.jpeg",
  "/static/media/womoneya/award/BFF1AF8E-CFD7-4532-B086-A1EF8B543E26_1_105_c.jpeg",
  "/static/media/womoneya/award/D9480BDF-0D00-4A1D-A929-5CADB2144054_1_105_c.jpeg",
  "/static/media/womoneya/award/JIT_6902.jpg",
  "/static/media/womoneya/award/JIT_6949.jpg",
  "/static/media/womoneya/award/JIT_6950.jpg",
  "/static/media/womoneya/award/JIT_6951.jpg",
  "/static/media/womoneya/award/JIT_6970.jpg",
  "/static/media/womoneya/award/JIT_6979.jpg",
  "/static/media/womoneya/award/JIT_7140.jpg",
  "/static/media/womoneya/award/JIT_7116.jpg",
];

export const WHY_WOMONEYA_ITEMS = [
  {
    icon: "fa-heart",
    bg: "tw-from-purple-600 tw-to-purple-400",
    title: "Demonstrates Genuine Appreciation",
    body: "Show your women employees that you value their wellbeing beyond the workplace. This initiative demonstrates real commitment to their personal and professional growth, fostering loyalty and engagement.",
  },
  {
    icon: "fa-users",
    bg: "tw-from-pink-600 tw-to-pink-400",
    title: "Strengthens Women-Focused Initiatives",
    body: "Align with global best practices in gender diversity and inclusion. Position your organization as a leader in supporting women's empowerment and professional development in meaningful, actionable ways.",
  },
  {
    icon: "fa-shield-heart",
    bg: "tw-from-orange-600 tw-to-orange-400",
    title: "Supports Employee Wellbeing",
    body: "Address critical aspects of holistic wellness-financial security, mental health, and physical fitness. Healthy, financially secure employees are more productive, engaged, and committed to organizational success.",
  },
  {
    icon: "fa-handshake-angle",
    bg: "tw-from-blue-600 tw-to-blue-400",
    title: "Aligns with DEI Commitments",
    body: "Demonstrate tangible action toward diversity, equity, and inclusion goals. This initiative provides measurable impact on your organization's commitment to creating an equitable workplace for all.",
  },
  {
    icon: "fa-comments",
    bg: "tw-from-green-600 tw-to-green-400",
    title: "Creates Meaningful Engagement",
    body: "Transform Women's Day from a symbolic gesture into an impactful experience. Provide practical knowledge and tools that women can apply immediately to improve their lives and careers.",
  },
  {
    icon: "fa-trophy",
    bg: "tw-from-indigo-600 tw-to-indigo-400",
    title: "Investment in Your Workforce",
    body: "This is not just a session-it's a strategic investment in developing confident, financially literate, and resilient women leaders who will drive your organization's future success and innovation.",
  },
];

export const TESTIMONIALS = [
  {
    bg: "tw-from-purple-50",
    quote:
      '"A complete system for streamlining personal financial operations through the best-in-class financial service providers by a team of professionals of Fintoo committed in helping deliver such financial tools and personalised wealth management services on household budgeting, bill payment and seminars for always keeping all its members abreast with the latest economic policies."',
    name: "J.P. Singh",
    role: "Reliance Industries",
  },
  {
    bg: "tw-from-pink-50",
    quote:
      '"Sincere thanks for accepting our invitation to conduct a very successful webinar for us, on the topic of \'Post Covid - Money & Business\' on 22nd April for our Respected audience of highly qualified Drs across the country. There were more than 2600 Drs participated in the webinar and widely appreciated as we have received feedback from many of them."',
    name: "D. Mahendra Varman",
    role: "Deputy General Manager, Pharma Care, Sun Pharmaceutical Industries Ltd.",
  },
  {
    bg: "tw-from-orange-50",
    quote:
      '"Thank you for the insightful and wonderful session. We truly appreciate the knowledge shared. I would specifically like to thank you for managing and being prompt in handling the entire event."',
    name: "Mukul Kulkarni",
    role: "Human Resource Business Partner, Airtel India",
  },
  {
    bg: "tw-from-blue-50",
    quote:
      '"I have been associated with Fintoo for over 5 years for tax planning and wealth management. Their independent, unbiased & personalised service, customized approach, wide range of product solutions put them on top of the chart in the wealth advisory space. Itis one of the most customer-obsessed investment advisory firms I have known."',
    name: "Vijayesh Gupta",
    role: "President, Wokhardt",
  },
];

export const pageStyles = `
.womoneya-page {
  font-family: 'Inter', sans-serif;
}

.font-display {
  font-family: 'Playfair Display', serif;
}

.womoneya-page .font-display {
  font-family: 'Playfair Display', serif;
}

@keyframes float {
  0%,
  100% {
    transform: translateY(0px);
  }

  50% {
    transform: translateY(-20px);
  }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes sparkle {
  0%,
  100% {
    opacity: 0;
    transform: scale(0);
  }

  50% {
    opacity: 1;
    transform: scale(1);
  }
}

.womoneya-page .animate-float {
  animation: float 3s ease-in-out infinite;
}

.womoneya-page .animate-fadeInUp {
  animation: fadeInUp 0.8s ease-out forwards;
}

.womoneya-page .sparkle {
  position: absolute;
  width: 4px;
  height: 4px;
  background: #F59E0B;
  border-radius: 50%;
  animation: sparkle 2s ease-in-out infinite;
}

.womoneya-page .gradient-text {
  background: linear-gradient(135deg, #EC4899, #8B5CF6, #3B82F6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.womoneya-page .sticky-cta {
  position: fixed;
  bottom: 30px;
  right: 30px;
  z-index: 1000;
  opacity: 0;
  transform: translateY(100px);
  transition: all 0.4s ease;
}

.womoneya-page .sticky-cta.visible {
  opacity: 1;
  transform: translateY(0);
}

@keyframes heroMarquee {
  0% {
    transform: translateX(0);
  }

  100% {
    transform: translateX(-50%);
  }
}

.womoneya-page .hero-marquee-track {
  display: flex;
  width: max-content;
  animation: heroMarquee 12s linear infinite;
}

.womoneya-page .about-stage-slide {
  opacity: 0;
  transition: opacity 0.6s ease-in-out;
}

.womoneya-page .about-stage-slide.active {
  opacity: 1;
}

@media (max-width: 640px) {
  .womoneya-page .sticky-cta {
    bottom: 16px;
    right: 12px;
  }
}
`;
