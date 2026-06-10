import React from "react";
import Slider from "react-slick";
import Style from "./style.module.css";
import Avatar from "react-avatar";
const reviews = [
  {
    name: "Vijay Rajagopal",
    link: "https://www.google.com/search?q=fintoo&rlz=1C5CHFA_enIN857IN858&oq=fintoo+&aqs=chrome.0.69i59j46i175i199i512j69i60l3j69i65j69i61l2.4396j1j7&sourceid=chrome&ie=UTF-8#lrd=0x3be7b723032fffff:0x91a61c8dda6c86c3,1,,,",
    useAvatar: true,
    review:
      "Very happy with the services provided by Fintoo so far. We consulted with them for Financial planning and we feel very comfortable that we have reached out to the right people for advise. Their response is also very prompt. Shout out to our advisor Meghna Jain for taking time to explain things patiently and always putting customer first and chalking out an action plan with us to help us achieve our goals.",
  },
  {
    name: "Shivaranjan Guru",
    link: "https://www.google.com/search?q=fintoo&rlz=1C5CHFA_enIN857IN858&oq=fintoo+&aqs=chrome.0.69i59j46i175i199i512j69i60l3j69i65j69i61l2.4396j1j7&sourceid=chrome&ie=UTF-8#lrd=0x3be7b723032fffff:0x91a61c8dda6c86c3,1,,,",
    image: "https://lh3.googleusercontent.com/a-/ACB-R5QjkST2h8iF4EsRxEo2XRK1ULyLvJY3aOVamfw0M94=s40-c-c0x00000000-cc-rp-mo-br100",
    review:
      "I have been using Fintoo's expertise on my financial planning since few months and it's been a very useful journey so far. Meghna who has been coordinating and communicating has been very prompt and approachable. The plans she shared looked very practical and holistic. Hoping the journey to continue for long and fruitful.",
  },
  {
    name: "Mayank Pandey",
    link: "https://www.google.com/search?q=fintoo&rlz=1C5CHFA_enIN857IN858&oq=fintoo+&aqs=chrome.0.69i59j46i175i199i512j69i60l3j69i65j69i61l2.4396j1j7&sourceid=chrome&ie=UTF-8#lrd=0x3be7b723032fffff:0x91a61c8dda6c86c3,1,,,",
    useAvatar: true,
    review:
      "I have been customer of fintoo for last 10 months and I must say that am absolutely delighted with your service. It is really refreshing to work with Ms Harjas Kaur, my financial adviser who is truly interested in their client’s needs, circumstances and preferences. What really impressed me was the way you took the time to get a feeling for where I was at, your depth of knowledge, lateral thinking and your common sense approach. Your professional, ethical and caring demeanour elicits my trust and respect and I gladly recommend your services whenever possible.",
  },
  {
    name: "Arunava C",
    link: "https://www.google.com/search?q=fintoo&rlz=1C5CHFA_enIN857IN858&oq=fintoo+&aqs=chrome.0.69i59j46i175i199i512j69i60l3j69i65j69i61l2.4396j1j7&sourceid=chrome&ie=UTF-8#lrd=0x3be7b723032fffff:0x91a61c8dda6c86c3,1,,,",
    useAvatar: true,
    review:
      "Meghna has done a brilliant job of organising my savings for my retirement. She understood my requirements and made a plan which is as per my risk appetite and goals. Your savings are in safe hands if you invest with Meghna Jain of Fintoo.",
  },
  {
    name: "Sanghamitra Das",
    link: "https://share.google/f1a8nvUfxOY8POjlK",
    useAvatar: true,
    review:
      "I've been associated with Fintoo and my financial advisor Pranjal for little over a year now, and it has been an excellent experience throughout. From our very first discussion, Pranjal explained the plan and projections with great clarity, keeping my goals and risk appetite in mind. He understands the emotional aspects of financial management and supports accordingly aligned with my requirements. He and the entire Fintoo team are very very supportive and just a ping away. It's been a trustable journey with Fintoo so far, and I look forward to continuing this long-term association. However, I would probably be more happy to have a better website and app. Their app and website definitely need an upgrade to be more real time, modern and user friendly.",
  },
  {
    name: "Peush Garg",
    link: "https://share.google/p8iO64WFt7WGAVGTE",
    useAvatar: true,
    review:
      "I have been associated with Fintoo and my wealth manager, Ms. Harjas, for over a year now, and the experience has been truly rewarding. Even before officially onboarding me, she had proactively worked on my financial plan, which showed her commitment and dedication right from day one. Throughout this journey, she has been in constant touch, offering timely advice on various aspects of my financial decisions and ensuring that I always stay on track with my goals. What impressed me further was her professionalism when she went on leave; she not only assigned me a point of contact but also created a detailed execution plan with her counterpart to ensure there were no gaps in service. It has been a fruitful and reassuring association, and I look forward to continuing this relationship in the future. I genuinely appreciate Ms. Harjas for her professionalism, reliability, and client-first approach. Highly recommended",
  },
  {
    name: "Prannay Srivastava",
    link: "https://share.google/o7wknR2ib2Ttqa1Wy",
    useAvatar: true,
    review:
      "Feedback on Fintoo - Financial Advisory and Investment Platform. Fintoo has proven to be a reliable and professional financial advisory service. The platform offers personalized investment guidance aligned with individual financial goals and risk profiles. Its interface is user-friendly, and the advisory team demonstrates strong domain expertise and responsiveness. Portfolio reviews are conducted regularly, and the insights provided are both timely and actionable. The platform maintains transparency in its recommendations and fee structures, fostering trust and confidence. Special thanks to Zeel Jain and Alby Varghese my Relationship Manager and Financial Advisor",
  },
  {
    name: "Prasadini Deshpande",
    link: "https://share.google/K115yJijMiYRhQ2yb",
    useAvatar: true,
    review:
      "We have been using Fintoo services for the past 20 years and have consistently received excellent support. The financial planning has always been thorough and perfectly aligned with our goals. Shama and her team are always approachable, attentive to our queries, and provides clear, helpful guidance. We highly recommend all of their services.",
  },
  {
    name: "sibal seema",
    link: "https://share.google/z7Ykoit1ldTmeWzlY",
    useAvatar: true,
    review:
      "Fintoo. I have been a client of financial hospitals for the last 20 years & our journey with them has been very fruitful as they have guided us to take financial decisions in a very balanced manner . There financial consultant Shama has always resolved all our queries in a very prompt manner & always been personally available to guide us through financial juggernaut. There financial acumen & reliable service has been there pillar of success.",
  },
  {
    name: "Sujata Yadav",
    link: "https://share.google/NjBkGnthSxkTo0g98",
    useAvatar: true,
    review:
      "We have been in touch with Fintoo since last year. We have had very good experience with Fintoo, especially our advisor Harjas Kaur. She created detailed budget and financial plan for us, also pivoted when required.",
  },
  {
    name: "Vinodkrishna Poyyale",
    link: "https://share.google/j6ddeMef95IJzifRC",
    useAvatar: true,
    review:
      "My association with Fintoo began when it was previously known as Financial Hospital almost 11 years ago. Shama Taj who convinced me to take up their services has been able to build credibility of Fintoo due to which I have been able to completely trust their advise and recommendations for my investment consideration. What I like about Fintoo are professional approach and commitment to the role of wealth advisor.",
  },
  {
    name: "Akhil Panwar",
    link: "https://share.google/yiG71m2Cfb29YuCkk",
    useAvatar: true,
    review:
      "I am happy with their services. Good recommendations for long term MF and also short term investments. Ashish Lawani made sure we connect for weekly reviews. His high availability and rationality behind decision takes out a lot of anxiety navigating the markets. Even used their CA services for taxation.",
  },
  {
    name: "Raj kumar",
    link: "https://share.google/D0bWDf0fuF4SGfHQ9",
    useAvatar: true,
    review:
      "Big thanks to FINTOO for their expert guidance and support in managing my investment planning. Special shoutout to Ankita from the team - she's been incredibly helpful in keeping me updated on all the right opportunities and making the whole process smooth and transparent. Highly recommend FINTOO for anyone looking for smart, reliable financial planning support!",
  },
  {
    name: "Arya Pandey",
    link: "https://share.google/Dnp7XofyyekXf4qWr",
    useAvatar: true,
    review:
      "Three years of trust, faith and fruitful financial guidance. Fintoo for sure knows what it means to manage someone's money, especially for someone like me who is absolutely risk averse. Above and beyond their financial prowess I have been extremely fortunate to have been supported by them through the selection of right asset mix, time horizon decisions that aligns to my future need, hedging and value creation. Three years back, I made a substantial financial wrong decision and that's when I contacted Fintoo. With the right product mix suggested by Fintoo, I can safely say that I am slowly coming out of deep waters. Wishing best of luck and hope you have more clients that can be helped.",
  },
];



const NextArrow = (props) => {
  const { onClick } = props;
  return (
    <div className={`${Style.nextArrow}`} onClick={onClick}>
      <svg width="42" height="42" viewBox="0 0 42 42" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="20.9297" cy="21.375" r="20" stroke="#D7D6DE" />
        <path d="M29.4297 21.875H13.8731M18.4296 26.875L13.4297 21.875L18.4297 16.875" stroke="black" stroke-width="1.5" />
      </svg>
    </div>
  );
};

const PrevArrow = (props) => {
  const { onClick } = props;
  return (
    <div className={`${Style.prevArrow}`} onClick={onClick}>
      <svg width="42" height="42" viewBox="0 0 42 42" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="20.9297" cy="21.375" r="20" stroke="#D7D6DE" />
        <path d="M13.4297 21.875H29.0012M24.4298 26.875L29.4297 21.875L24.4297 16.875" stroke="black" stroke-width="1.5" />
      </svg>
    </div>
  );
};

function Responsive() {
  var settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 3,
    initialSlide: 0,
    nextArrow: <PrevArrow />,
    prevArrow: <NextArrow />,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
          infinite: true,
          dots: true
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          initialSlide: 2
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1
        }
      }
    ]
  };

  return (
    <div className="slider-container">
      <Slider {...settings}>
        {reviews.map((review, index) => (
          <div key={index}>
            <div className={`${Style.ReviewCard}`}>
              <div className={`${Style.ReviewTxt}`}>
                “{review.review}”
              </div>
              <div className="d-flex align-items-center gap-3" style={{ marginTop: "auto" }}>

                {review.image ? (
                  <div>
                    <img
                      src={review.image}
                      alt={review.name}
                      width="40"
                      height="40"
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                ) : (
                  <Avatar
                    round={true}
                    name={review.name}
                    size="40"
                    textSizeRatio={1.75}
                  />
                )}
                <div>
                  <div style={{ color: "#202939", fontWeight: "500" }}>{review.name}</div>
                  <div style={{ color: "#697586" }}>{review.position}</div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
}

export default Responsive;
