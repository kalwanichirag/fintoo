import { useNavigate } from 'react-router-dom';
import Style from './style.module.css';

const SliderItem = ({data}) => {
  const navigate = useNavigate();
  return (
    <div className={`pointer ${Style.imgCenter}`}>
      <div className="imgBorderUS">
        <img
          className='d-inline-block'
          src={`${process.env.PUBLIC_URL}/static/media/companyicons/${data.image}.png`}
          style={{ width: 40, height: 40, borderRadius: 50 }}
        />
      </div>
      <div className="pt-2 ps-2">
        <div className={Style.SliderText} onClick={() => {navigate(process.env.PUBLIC_URL + '/direct-mutual-fund/funds/all/?amc='+data.image)}}>{data.title}</div>
      </div>
    </div>
  );
};
export default SliderItem;
