import Style from "./style.module.css";

const ITRHowToFile = () => {
  return (
    <>
      <section className={Style.section}>
        <h2 className={`text-center ${Style.title}`}>
          How To File ITR In <span style={{
            color : "#042b62"
          }}>30 Mins</span>
        </h2>
        <h3 className={`text-center ${Style.subtitle}`}>
          Offering end-to-end assistance to make ITR filing, simple, swift, and
          stress-free.
        </h3>
        <div
          className={Style.cardBox}
        >
         <div>
          <img src={process.env.PUBLIC_URL + "/static/media/ITR/8 infographic-011.png"}
            alt="ITR Flow" />
         </div>
         <div>
          <img src={process.env.PUBLIC_URL + "/static/media/ITR/8 infographic-01.png"}
            alt="ITR Flow" />
         </div>
        </div>
      </section>

      
    </>
  );
};
export default ITRHowToFile;
