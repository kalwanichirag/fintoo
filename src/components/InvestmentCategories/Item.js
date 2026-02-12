import Style from './style.module.css';

const InvestmentCategoriesItem = ({data}) => {
  return (
    <a className={Style.itemLink} href={`../direct-mutual-fund/funds/all?category=`+data.param} target="_blank">
    <div className={Style.imgCenter}>
      <div className="imgBorderUS">
        <img
            className='d-inline-block'
          src={data.image}
          style={{ width: 40, height: 40 }}
        />
      </div>
      <div className="pt-2">
        <div className={Style.SliderText}>{data.title}</div>
      </div>
    </div>
    </a>
  );
};
export default InvestmentCategoriesItem;
