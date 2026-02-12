import React from "react";
import Slider from "react-slick";
import Style from "./style.module.css";
import Avatar from "react-avatar";
const reviews = [
  {
    name: "Vijay Rajagopal",
    review: "Very happy with the services provided by Fintoo so far. We consulted with them for Financial planning and we feel very comfortable that we have reached out to the right people for advise. Their response is also very prompt. Shout out to our advisor Meghna Jain for taking time to explain things patiently and always putting customer first and chalking out an action plan with us to help us achieve our goals.",
    googleId: <Avatar googleId round={true} name="Vijay Rajagopal" size="40" textSizeRatio={1.75} />,
    imageTrue: false
  },
  {
    name: "Shivaranjan Guru",
    review: "I have been using Fintoo's expertise on my financial planning since few months and it's been a very useful journey so far. Meghna who has been coordinating and communicating has been very prompt and approachable. The plans she shared looked very practical and holistic. Hoping the journey to continue for long and fruitful.",
    image: "https://lh3.googleusercontent.com/a-/ACB-R5QjkST2h8iF4EsRxEo2XRK1ULyLvJY3aOVamfw0M94=s40-c-c0x00000000-cc-rp-mo-br100",
    imageTrue: true
  },
  {
    name: "Manish Sharma",
    review: "I am with Fintoo since last 6 months and since then I am getting all the possible help from them in the financial world. They helped me in creating financial plan for future on the basis of my earnings and also recommended some investments, all the things were also thoroughly discussed with me. They also helps in keeping you market aware with best stock recommendations. I want to thanks Ms. Palak Mundhra for all till now and also looking forward for more interesting investments.",
    image: "https://lh3.googleusercontent.com/a-/ACB-R5RnHLBlfcfru2eox0Nt9PQlkD7Qa61r2bYgcZzByDM=s40-c-c0x00000000-cc-rp-mo-ba3-br100",
    imageTrue: true
  },
  {
    name: "Bhagat Singh",
    review: "It has been a great journey with Fintoo so far. I am consulting them for financial planning and they have not disappointed me in their methods, research and the plan was custom made to fit my needs and goals. Special thanks to Mr. Kosar and Ms. Kiran for their valuable and prompt support on any financial query that I have.",
    image: "https://lh3.googleusercontent.com/a-/ACB-R5SHuGIJoXuNTiCv0BvRdKiwT81kytYRhXaacUkNCJM=s40-c-c0x00000000-cc-rp-mo-br100",
    imageTrue: true
  },
  {
    name: "Sharad Kumar",
    review: "I am a client of Fintoo for many years by now. I had a wonderful experience with Ms Ragni for Income Tax revision filing. She helped me quite expeditiously and adroitly. I wish her and the company all luck.",
    googleId: <Avatar googleId round={true} name="Sharad Kumar" size="40" textSizeRatio={1.75} />,
    imageTrue: false
  },
  {
    name: "Mayank Pandey",
    review: "I have been customer of fintoo for last 10 months and I must say that am absolutely delighted with your service. It is really refreshing to work with Ms Harjas Kaur, my financial adviser who is truly interested in their client’s needs, circumstances and preferences. What really impressed me was the way you took the time to get a feeling for where I was at, your depth of knowledge, lateral thinking and your common sense approach. Your professional, ethical and caring demeanour elicits my trust and respect and I gladly recommend your services whenever possible.",
    image: "https://gi-strapi.s3.ap-south-1.amazonaws.com/aditya_f9bee07a9d.jpg"
  },
  {
    name: "Sarath Patro",
    review: "I am really happy to connect with Fintoo, especially Palak. She guided us well and gave different perspective to save and grow our money. I would definitely recommend Fintoo. One of the best Financial Planner in India. Good Job Palak.",
    image: "https://lh3.googleusercontent.com/a-/ACB-R5SeT0UDFaBqVZka5VLYt2SAMs71Ax3ka3BQYZxJaA=s40-c-c0x00000000-cc-rp-mo-ba4-br100"
  },
  {
    name: "Rajyalakshmi Aravalli",
    review: "Fintoo is continuously helping me in my IT returns since last 9 years. Ragini Vasu is extremely good and constantly supporting me for IT returns. She is very approachable and have sound knowledge regarding IT returns. Many thanks to you ragini for all your nice gestures. Kudos to entire team.",
    image: "https://lh3.googleusercontent.com/a-/ACB-R5RnHLBlfcfru2eox0Nt9PQlkD7Qa61r2bYgcZzByDM=s40-c-c0x00000000-cc-rp-mo-ba3-br100"
  },
  {
    name: "Sundaram Ragunathan",
    review: "I have been using Fintoo for the last four years. During 2020 pandemic setback our net worth had eroded and we were in for a shock. But our advisor Mr Koser advises us to maintain calm, to be patient and with his good effort resurrected the portfolio and it has almost come to pre-pandemic level. Our retirement savings got 'saved' thanks to Koser. Thanks a lot, our advisor-friend.",
    image: "https://lh3.googleusercontent.com/a-/ACB-R5RPHU4dcPJSqIWxOOY8WNMwNfcd11IIHOzvjBjr=s40-c-c0x00000000-cc-rp-mo-br100"
  },
  {
    name: "Sumeet Dash",
    review: "Fintoo helped me with a personalized plan based on my earning potential and is ready to change it as per my priority going forward. They helped me in fine-tuning my equity portfolio. Thanks to Palak and team.",
    googleId: <Avatar googleId round={true} name="Sumeet Dash" size="40" textSizeRatio={1.75} />,
    imageTrue: false
  },
  {
    name: "Arunava C",
    review: "Meghna has done a brilliant job of organizing my savings for my retirement. She understood my requirements and made a plan which is as per my risk appetite and goals. Your savings are in safe hands if you invest with Meghna Jain of Fintoo.",
    googleId: <Avatar googleId round={true} name="Arunava C" size="40" textSizeRatio={1.75} />,
    imageTrue: false
  },
  {
    name: "Jyothy Jaikrishnan",
    review: "We have been associated with Fintoo for 14-15 yrs now. They have been giving us financial advisory services and managing our finance portfolio. Since my Husband's death, Fintoo team has been great in helping me understand my finances and especially Kosar Tidiwala who has been always available and approachable for me to ask questions, learn about my finances and also make the right decisions. They have strengthened my financial stability to a great extent.",
    googleId: <Avatar googleId round={true} name="Jyothy Jaikrishnan" size="40" textSizeRatio={1.75} />,
    imageTrue: false
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

                {
                  review.imageTrue === false ? (
                    review.googleId

                  ) : (
                    <div>
                      <img src={review.image} alt={review.name} />
                    </div>
                  )
                }
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
