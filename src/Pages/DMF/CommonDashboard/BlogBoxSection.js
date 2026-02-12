import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { apiCall } from "../../../common_utilities";
import NextImg from "../../../Assets/Images/CommonDashboard/Next.svg";
import style from "./style.module.css";
import { BASE_API_URL, imagePath } from "../../../constants";

export default function BlogBoxSection() {
  const [blogdata, setBlogData] = useState([]);
  const [error, setError] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    getBlog();
  }, []);
  const getBlog = async () => {
    // try {
    //   var res = await apiCall(ADVISORY_GET_BLOG_API_URL, "", false, false);
    //   setBlogData(res);
    // } catch (e) {
    //   setError(true);
    // }
  };
  return (
    <>

      
      <div className="BlogBox">
        <div className={`${style.Newsbox} ml-auto`}>
          {blogdata.slice(0, 1).map((v) => (
            <div className="row" key={v.id}
            >
              <div className="d-md-flex col-md-12 col-lg-12 col-12">
                <div className="NewsImg">
                  {v.yoast_head_json.og_image[0].url ? (
                    <img
                      src={v.yoast_head_json.og_image[0].url}
                      className={style.img_8}
                    />
                  ) : (
                    <img src={Blog} className={style.img_8} />
                  )}
                </div>
                <div className="ms-3">
                  <div className="NewsHeading">
                    <h3 className={style.blogTitle}>
                      {v.yoast_head_json.og_title}
                    </h3>
                  </div>
                  <div style={{ padding: "1rem 0" }} className="">
                    <div className={style.NewsText}>
                      {v.yoast_head_json.og_description}
                    </div>

                    {/* <div className="me-2 mt-3">
                      <a href={v.link}>
                        <img className="pointer" src={NextImg} width={20} />
                      </a>
                    </div> */}
                  </div>
                  <div className="d-flex justify-content-between">
                    {/* <div style={{color: "#717171"}} className="d-flex justify-content-between align-items-center">
                      <div>
                        4 min
                      </div>
                      <div className={style.blogDot}></div>
                      <div>
                        March 5th, 2024
                      </div>
                    </div> */}
                    <div className="me-3">
                      <a style={{
                        color: "#042b62",
                        fontSize: "1.2rem",
                        fontWeight: "500"
                      }} href={v.link}>
                        Read More
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
