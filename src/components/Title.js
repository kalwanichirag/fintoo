import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import metadata from "../meta-data.json";
import schemaTemplate from "../schema-template.json";
import { removeSlash } from "../common_utilities";

const Title = () => {
  const location = useLocation();
  let url = removeSlash(location.pathname);
  const serviceData = {
    "/": {
      "@type": "Service",
      name: "Fintoo",
    },
    "/web/financial-planning-page": {
      "@type": "Service",
      keywords:
        "Certified Financial Planner, Certified Financial Planner in India, Certified Financial Planner in Mumbai, Financial Planning, Financial Advisor, online financial advisor, financial consultant, certified financial planner india, best financial advisor in india, financial,online financial advisor, personal financial advisor, best financial advisors, financial advisory companies in India, online investment advisor india, online financial advisor india, best financial planners in india, certified financial planner in mumbai, top financial consultants, financial advisor website ",
      name: "Financial Planning",
      keywords:
        "Certified Financial Planner, Certified Financial Planner in India, Certified Financial Planner in Mumbai, Financial Planning, Financial Advisor, online financial advisor, financial consultant, certified financial planner india, best financial advisor in india, financial,online financial advisor, personal financial advisor, best financial advisors, financial advisory companies in India, online investment advisor india, online financial advisor india, best financial planners in india, certified financial planner in mumbai, top financial consultants, financial advisor website",
    },
    "/web/retirement-planning-page": {
      "@type": "Service",
      name: "Retirement Planning",
      keywords: "",
    },
    "/web/investment-planning-page": {
      "@type": "Service",
      name: "Investment Planning",
      keywords: "",
    },
    "/web/tax-planning-page": {
      "@type": "Service",
      name: "Tax Planning",
      keywords: "",
    },
    "/web/risk-management": {
      "@type": "Service",
      name: "Risk Management",
      keywords: "",
    },
    "/web/direct-mutual-funds": {
      "@type": "DirectMutualFundService",
      name: "Direct Mutual Fund",
      keywords: "",
    },
    "/web/bond-investment": {
      "@type": "BondInvestmentService",
      name: "Bond Investment",
      keywords: "",
    },
    "/web/stock-advisory": {
      "@type": "StockAdvisory",
      name: "Stock Advisory",
      keywords: "",
    },
    "/web/international-equity": {
      "@type": "InternationalEquityService",
      name: "International Equity",
      keywords: "",
    },
    "/web/ipo": {
      "@type": "IPOService",
      name: "IPO",
      keywords: "",
    },
    // "/web/itr-file": {
    //   "@type": "ITRFilingService",
    //   name: "ITR Filing",
    //   keywords: "",
    // },
    "/web/nri-taxation": {
      "@type": "NRITaxationService",
      name: "NRI Taxation",
      keywords: "",
    },
    "/web/notices": { "@type": "IncomeTaxNoticeService", name: "Notices" },
    "/web/tax-planning-page": { "@type": "TaxService", name: "Tax Planning" },
    // "/web/tax-calculators": {
    //   "@type": "TaxCalculatorsService",
    //   name: "Tax Calculators",
    // },

    "/web/pricing": { "@type": "FintooPricing", name: "Pricing" },
  };

    const addSchema = (page) => {
        try {
            if (url in serviceData || page === "home") {
                // Remove old schema scripts
                const oldScripts = document.querySelectorAll('script[type="application/ld+json"]');
                oldScripts.forEach(script => script.remove());
    
                const script = document.createElement('script');
                script.type = 'application/ld+json';
                const schemaData = { ...schemaTemplate };
    
                if (url === "/web/itr-file") {
                    const fullPath = `${location.pathname}${location.search}`;
                    schemaData["url"] = "https://www.fintoo.in/" + fullPath;
                    schemaData["mainEntityOfPage"]["@id"] = "https://www.fintoo.in/" + fullPath;
                } else if (page === "home") {
                    schemaData["url"] = "https://www.fintoo.in/";
                    schemaData["publisher"]["contactPoint"] = {
                        "@type": "ContactPoint",
                        "telephone": "9699800600",
                        "contactType": "customer service",
                        "areaServed": ["IN", "AE"],
                        "availableLanguage": ["en", "Hindi"]
                    };
                    if ("mainEntityOfPage" in schemaData) {
                        delete schemaData["mainEntityOfPage"];
                    }
                } else {
                    schemaData["url"] = "https://www.fintoo.in/" + url;
                    schemaData["mainEntityOfPage"]["@id"] = "https://www.fintoo.in/" + url;
                }
    
                let metaKeywordsContent = "";
    
                if (page === "home") {
                  if (!schemaData.about) {
                    schemaData.about = {
                      "@type": "FinancialService",
                      "name": "Financial Planning"
                    };
                  }
                  
                  schemaData.about.description = metadata["/"]?.description;
                    schemaData["name"] = metadata["/"]["title"];
                    schemaData["about"]["@type"] = serviceData["/"]["@type"];
                    schemaData["about"]["name"] = serviceData["/"]["name"];
                    schemaData["about"]["serviceType"] = [
                        "Financial Planning",
                        "Investment Advisory",
                        "Tax Planning",
                        "Insurance Services",
                        "Mutual Funds"
                    ];
                    metaKeywordsContent = serviceData["/"]["keywords"]; 
                } else {
                    // Ensure about object exists before accessing it
                    if (!schemaData["about"]) {
                        schemaData["about"] = {};
                    }
                    schemaData["about"]["description"] = metadata[url]['description'];
                    schemaData["name"] = metadata[url]["title"];
                    schemaData["about"]["@type"] = serviceData[url]["@type"];
                    schemaData["about"]["name"] = serviceData[url]["name"];
                    schemaData["about"]["serviceType"] = serviceData[url]["name"];
                    metaKeywordsContent = serviceData[url]["keywords"]; 
                }
    
                if (serviceData[url]?.faq) {
                  schemaData["faq"] = serviceData[url]["faq"];
              }
              if (serviceData[url]?.Person) {
                  schemaData["Person"] = serviceData[url]["Person"];
              }
                script.textContent = JSON.stringify(schemaData);
    
                const head = document.head;
                head.insertBefore(script, head.firstChild);
                
                let metaKeywords = document.querySelector('meta[name="keywords"]');
                if (!metaKeywords) {
                    metaKeywords = document.createElement('meta');
                    metaKeywords.name = "keywords";
                    head.appendChild(metaKeywords);
                }
                metaKeywords.setAttribute('content', metaKeywordsContent);
            }

        }
        catch(e){
            console.error(e)
        }
    };


  useEffect(() => {
    let url = removeSlash(location.pathname);

    if (url in metadata) {
      document.title = metadata[url]["title"];

      const metaDescription = document.querySelector(
        'meta[name="description"]'
      );
      if (metaDescription) {
        metaDescription.setAttribute("content", metadata[url]["description"]);
      }
      addSchema();
    } else {
      document.title = metadata["/"]["title"];

      const metaDescription = document.querySelector(
        'meta[name="description"]'
      );
      if (metaDescription) {
        metaDescription.setAttribute("content", metadata["/"]["description"]);
      }
      addSchema("home");
    }
  }, [location]);
  return <></>;
};
export default Title;
