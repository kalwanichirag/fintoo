import React, { useState, useRef, useEffect } from "react";

function News() {
  useEffect(() => {
    document.body.classList.add("main-layout");
  }, []);
  return (
    <div>
      {/* <MainHeader /> */}
      <div ng-controller="newsController" className="knowledge-base ng-scope">
        <div
          className="container"
          style={{
            maxWidth: "960px",
          }}
        >
          <div className="row">
            <div
              className="hidden-xs hidden-sm col-sm-12 col-xs-12"
              style={{ minHeight: 50 }}
            >
              &nbsp;
            </div>
            <div className="col-md-12">
              <h1
                className="page-header mb-4"
                style={{ fontSize: "32px !important", fontWeight: "600" }}
              >
                Featured In
              </h1>
            </div>

            <div className="col-md-4 col-lg-4 col-sm-6 col-xs-12 ">
              <div className="news_section">
                <img
                  alt="Divya Bhaskar"
                  src={
                    process.env.REACT_APP_STATIC_URL +
                    "media/News/clogo-5.svg"
                  }
                />

                <p>
                  Bhaskar explainer: Cashless hospital claims related to
                  coronavirus
                </p>
                <a
                  target="_blank"
                  href="https://www.divyabhaskar.co.in/dvb-original/news/the-hospital-cannot-refuse-to-treat-corona-cashless-if-not-heres-a-new-product-just-for-you-128440609.html?_branch_match_id=895225945276640782&utm_campaign=128440609&utm_medium=sharing"
                  className="default-btn"
                >
                  Read News
                </a>
              </div>
            </div>
            <div className="col-md-4 col-lg-4 col-sm-6 col-xs-12">
              <div className="news_section">
                <img
                  alt="TV9"
                  src={
                    process.env.REACT_APP_STATIC_URL + "media/News/TV9.svg"
                  }
                />

                <p>
                  How to claim covid treatment expenses: Expert explains IRDAI’s
                  cashless claim guidelines
                </p>
                <a
                  target="_blank"
                  href="https://www.tv9hindi.com/utility-news/how-to-claim-for-coronavirus-treatment-expenses-know-all-about-irdai-guidelines-for-cashless-claims-where-to-complain-if-hospital-deny-630827.html?utm_source=referral&utm_medium=WA&utm_campaign=social_share"
                  className="default-btn"
                >
                  Read News
                </a>
              </div>
            </div>
            {/* <div className="hidden-xs hidden-sm" /> */}
            <div className="col-md-4 col-lg-4 col-sm-6 col-xs-12">
              <div className="news_section">
                <img
                  alt="India Today"
                  src={
                    process.env.REACT_APP_STATIC_URL +
                    "media/News/India-today.svg"
                  }
                />
                <p>
                  Fintoo Wealth and Tax advisory platform launches new
                  AI-Advisor
                </p>
                <a
                  target="_blank"
                  href="https://www.indiatoday.in/pr-newswire?rkey=20210502EN62984&filter=4315"
                  className="default-btn"
                >
                  Read News
                </a>
              </div>
            </div>
            <div className="col-md-4 col-lg-4 col-sm-6 col-xs-12">
              <div className="news_section">
                <img
                  alt="Daily Hunt"
                  src={
                    process.env.REACT_APP_STATIC_URL +
                    "media/News/Daily-hunt.svg"
                  }
                />

                <p>
                  Fintoo Wealth and Tax advisory platform launches new
                  AI-Advisor
                </p>
                <a
                  target="_blank"
                  href="https://m.dailyhunt.in/news/nepal/marathi/navarashtra-epaper-nvrstrm/fintoo+vittiy+aani+kar+magadarshan+phintu+fintoo+manchatarphe+guntavanukadaransathi+ai+advisor+suvidha-newsid-n275905374"
                  className="default-btn"
                >
                  Read News
                </a>
              </div>
            </div>
            {/* <div className="hidden-xs hidden-sm" /> */}
            <div className="col-md-4 col-lg-4 col-sm-6 col-xs-12">
              <div className="news_section">
                <img
                  alt="Indo Asian New Service"
                  src={
                    process.env.REACT_APP_STATIC_URL + "media/News/IANS.svg"
                  }
                />

                <p>
                  Fintoo Wealth and Tax advisory platform launches new
                  AI-Advisor
                </p>
                <a
                  target="_blank"
                  href="https://ians.in/index.php?param=prnewswiredetail/PRN-1113350"
                  className="default-btn"
                >
                  Read News
                </a>
              </div>
            </div>
            <div className="col-md-4 col-lg-4 col-sm-6 col-xs-12">
              <div className="news_section">
                <img
                  alt="Dalal Street Investment"
                  src={
                    process.env.REACT_APP_STATIC_URL +
                    "media/News/Dalal-street-Investment.svg"
                  }
                />

                <p>
                  Fintoo Wealth and Tax advisory platform launches new
                  AI-Advisor
                </p>
                <a
                  target="_blank"
                  href="https://www.dsij.in/NewswireDetails/FileName/202105022330PR_NEWS_EURO_ND__EN62984"
                  className="default-btn"
                >
                  Read News
                </a>
              </div>
            </div>
            {/* <div className="hidden-xs hidden-sm" /> */}
            <div className="col-md-4 col-lg-4 col-sm-6 col-xs-12">
              <div className="news_section">
                <img
                  alt="News Delhi Times"
                  src={
                    process.env.REACT_APP_STATIC_URL +
                    "media/News/news-delhi-times.svg"
                  }
                />
                <p>
                  Fintoo Wealth and Tax advisory platform launches new
                  AI-Advisor
                </p>
                <a
                  target="_blank"
                  href="https://www.newdelhitimes.com/news-release/?rkey=20210502EN62984&filter=5147"
                  className="default-btn"
                >
                  Read News
                </a>
              </div>
            </div>
            <div className="col-md-4 col-lg-4 col-sm-6 col-xs-12">
              <div className="news_section">
                <img
                  alt="Business News This Week"
                  src={
                    process.env.REACT_APP_STATIC_URL +
                    "media/News/Business-news-this-week.svg"
                  }
                />

                <p>
                  Fintoo Wealth and Tax advisory platform launches new
                  AI-Advisor
                </p>
                <a
                  target="_blank"
                  href="http://businessnewsthisweek.com/prnews/?rkey=20210502EN62984&filter=601"
                  className="default-btn"
                >
                  Read News
                </a>
              </div>
            </div>
            {/* <div className="hidden-xs hidden-sm" /> */}
            <div className="col-md-4 col-lg-4 col-sm-6 col-xs-12">
              <div className="news_section">
                <img
                  alt="IBTN9"
                  src={
                    process.env.REACT_APP_STATIC_URL + "media/News/IBTN.svg"
                  }
                />

                <p>
                  Fintoo Wealth and Tax advisory platform launches new
                  AI-Advisor
                </p>
                <a
                  target="_blank"
                  href="https://ibtn9.com/pr-newswire/?rkey=20210502EN62984&filter=12202"
                  className="default-btn"
                >
                  Read News
                </a>
              </div>
            </div>
            <div className="col-md-4 col-lg-4 col-sm-6 col-xs-12">
              <div className="news_section">
                <img
                  alt="Outlook Money"
                  src={
                    process.env.REACT_APP_STATIC_URL +
                    "media/News/Outlook.svg"
                  }
                />

                <p>Stay calm &amp; get a health cover</p>
                <a
                  target="_blank"
                  href="https://www.outlookindia.com/outlookmoney/magazine/story/stay-calm-get-a-health-cover-727"
                  className="default-btn"
                >
                  Read News
                </a>
              </div>
            </div>
            {/* <div className="hidden-xs hidden-sm" /> */}
            <div className="col-md-4 col-lg-4 col-sm-6 col-xs-12">
              <div className="news_section">
                <img
                  alt="Business Standard"
                  src={
                    process.env.REACT_APP_STATIC_URL +
                    "media/News/Business-Standard.svg"
                  }
                />
                <p>Reduce your portfolio risk by rebalancing</p>
                <a
                  target="_blank"
                  href="https://www.business-standard.com/article/pf/steps-to-undertake-while-conducting-a-mid-year-review-of-your-portfolio-121070200790_1.html"
                  className="default-btn"
                >
                  Read News
                </a>
              </div>
            </div>
            <div className="col-md-4 col-lg-4 col-sm-6 col-xs-12">
              <div className="news_section">
                <img
                  alt="ET Market"
                  src={
                    process.env.REACT_APP_STATIC_URL +
                    "media/News/ET-market-Logo.svg"
                  }
                />
                <p>
                  Is Investing in a fund of funds better than investing in a
                  mutual fund?
                </p>
                <a
                  target="_blank"
                  href="https://economictimes.indiatimes.com/markets/bonds/is-investing-in-a-fund-of-funds-better-than-investing-in-a-mutual-fund/articleshow/84727818.cms"
                  className="default-btn"
                >
                  Read News
                </a>
              </div>
            </div>
            <div
              className="hidden-xs hidden-sm col-sm-12 col-xs-12"
              style={{ minHeight: 50 }}
            >
              &nbsp;
            </div>
          </div>
        </div>
        <div className="col-md-12" style={{ height: 50 }}>
          &nbsp;
        </div>
      </div>

      {/* <Footer /> */}
    </div>
  );
}

export default News;
