import styles from "./style.module.css";
import commonStyles from "../../../Layout/Fullpage/style.module.css";
import SectionHeader from '../../../SectionHeader';
import { FaRegListAlt, FaUserClock } from 'react-icons/fa';
import { TbSearch } from 'react-icons/tb';

function HowWeWorkSection() {

    return (
        <>
            <section className={`${styles['how-we-work-section']} ${commonStyles['padding-class']} pb-5 pt-5`} >
                <div className={`${styles['how-we-work-section-heading']}`}>
                    <SectionHeader headerText={'How We Work'} />
                    <div className='pb-5 pt-5'>
                        <div className={`${styles['card-widget-container']}`}>
                            <div className={`${styles['card-widget-item']} mb-4`}>
                                <div className={`${styles['card-widget-item-container']}`} >
                                    <div className={`${styles['card-widget-item-icon']}`} >
                                        <div className={`${styles['icon-container']}`}>
                                            <FaRegListAlt />
                                        </div>
                                    </div>
                                    <div className={`${styles['card-widget-item-text-content']}`} >
                                        <div>
                                            <span className={`${commonStyles['widget-header-text']}`} > You Share Your Requirement</span>
                                            <div className={`${styles['card-widget-item-content']} ${commonStyles['widget-content-text']}`}>Once we understand your requirements related to life or health insurance, we focus on getting to know you, your family members, existing investments, liabilities, current financial position, health status and a few more details. This process enables us to find a perfect combination of plans that will help you to achieve all your objectives.</div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className={`${styles['card-widget-item']} mb-4`}>
                                <div className={`${styles['card-widget-item-container']}`} >
                                    <div className={`${styles['card-widget-item-icon']}`} >
                                        <div className={`${styles['icon-container']}`}>
                                            <TbSearch />
                                        </div>
                                    </div>
                                    <div className={`${styles['card-widget-item-text-content']}`} >
                                        <div>
                                            <span className={`${commonStyles['widget-header-text']}`} >We Find The Best Plans At The Best Prices</span>
                                            <div className={`${styles['card-widget-item-content']} ${commonStyles['widget-content-text']}`}>As soon as the plans get shortlisted we start comparing all the similar plans offered by the most trusted companies and get the best one at the best price for you.</div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className={`${styles['card-widget-item']} mb-4`}>
                                <div className={`${styles['card-widget-item-container']}`} >
                                    <div className={`${styles['card-widget-item-icon']}`} >
                                        <div className={`${styles['icon-container']}`}>
                                            <FaUserClock />
                                        </div>
                                    </div>
                                    <div className={`${styles['card-widget-item-text-content']}`} >
                                        <div>
                                            <span className={`${commonStyles['widget-header-text']}`} >Complete The Process And Way Further</span>
                                            <div className={`${styles['card-widget-item-content']} ${commonStyles['widget-content-text']}`}>We help you to complete the process in a quick, secure and stress-free way. Once you are insured, we keep a regular check on the status of your insurance and assist you with timely renewals, reviews, changes and claims.</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </section>
        </>
    )
}

export default HowWeWorkSection
