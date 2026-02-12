import { useState, useEffect } from "react";
import BoldSectionHeader from "../../BoldSectionHeader";
import styles from "./style.module.css";
import { ADVISORY_GET_BLOG_API_URL } from "../../../constants";
import { apiCall } from "../../../common_utilities";
import { useNavigate } from "react-router-dom";
const KnowledgeBase = () => {
  const [blogdata, setBlogData] = useState([]);
  const [error, setError] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    getBlog();
  }, []);
  const getBlog = async () => {
    // try {
    //   var res = await apiCall(ADVISORY_GET_BLOG_API_URL, "", false, false);
    //   setBlogData(res.slice(0, 3));
    // } catch (e) {
    //   setError(true);
    // }
  };
  return (
    <section className={`${styles.kb} py-5`}>
      <div className={`container ${styles.container}`}>
        <BoldSectionHeader headerText={"Knowledge Base"} />
        <div className="row pt-4">
          {blogdata?.map((v, i) => (
            <div id={"blg-fnt-" + i} key={i} className={`${styles.blogpost} col-12 col-md-4 text-center`}>
              <a className={styles.blogLink} target="_blank" href={v.yoast_head_json.og_url}>
                {'og_image' in v.yoast_head_json && v.yoast_head_json.og_image.length > 0 && v.yoast_head_json.og_image[0].url ? (
                  <img
                    className={`img-fluid ${styles.blogimage}`}
                    src={v.yoast_head_json.og_image[0].url}
                  />
                ) : (
                  <div style={{width: '315px', height: '210px'}}></div>
                )}
                <h3 className={styles.headline}>
                  {/* {v.title} */}
                  {v.yoast_head_json.og_title}
                </h3>
                <p >
                  {/* {v.text} */}
                  {v.yoast_head_json.og_description}
                </p>
              </a>
            </div>
          ))}
        </div>
        <div className="text-center py-3">
          <a href="https://www.fintoo.in/blog" className={styles.viewmore}>
            Read more
          </a>
        </div>
      </div>
    </section>
  );
};
export default KnowledgeBase;
