import React from 'react'
import Styles from "./Style.module.css";
import './style.css';
const ExpertHeader = ({ handleChange, searchTerm, totalRM }) => {
  let rmListTotal = totalRM ? totalRM : 0;
  const openFilter = () => {
    document.querySelector('.filter-menu-ildfX').classList.add('active');
  }

  // const closeFilter = () =>{
  //   document.querySelector('body').classList.add('inactive');
  // }
  return (
    <section className={`${Styles.ExpertFlow}`} >
      <div className="d-md-flex ms-md-4">
        <div className={`d-md-flex ${Styles.BookTextlabel}`}>
          <div>
            <div className={`${Styles.BigText}`}> Book Your Appointment with Expert Now</div>
            <div className={`${Styles.SmallText} custom-color`}>
              We have {rmListTotal} Fintoo Wealth Experts to serve your needs
            </div>
          </div>
          <div className={`ms-md-5 d-flex ${Styles.searchbox}`}>
            <div className={`d-md-none ${Styles.Filter}`} onClick={() => openFilter()}>
              <img width={22} src="https://static.fintoo.in/static/userflow/img/icons/filter.png" />
              <span>Filter</span>
            </div>
            <input
              type="search"
              ng-model="searchRM"
              placeholder="Search"
              onChange={e => handleChange(e.target.value)}
              style={{}}
              value={searchTerm}
            />
          </div>
        </div>
      </div>
    </section>

  )
}

export default ExpertHeader