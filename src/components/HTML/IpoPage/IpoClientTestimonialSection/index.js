import SectionHeader from '../../../SectionHeader';
import Testimonial from '../../../Testimonial';
import styles from './style.module.css';

const IpoClientTestimonialSection = () => {
    return (
        <section className={`${styles['insurance-clients-testemonial-section']}`}>
            <SectionHeader headerText={'Trusted By 1,40,000+ Clients Across The Country'} />
            <br /><br />
            <div>
                <Testimonial data={[
                    { text: 'A complete system for streamlining personal financial operations through the best in class financial service providers by a team of professionals of ‘Fintoo Wealth Private Limited’ committed in helping deliver such financial tools and personalised wealth management services on household budgeting, tax return preparation, retirement planning, investment tracking, bill payment and seminars for always keeping all it’s members abreast with the latest economic policies.', from: 'J.P. SINGH', designation: 'Ex ARMY & RELIANCE IND.' },
                    { text: 'Fintoo is the platform which which gives complete complete wealth advisory. I’m a consultant cardiologist and get very less time to analyse my finance.Fintoo( formerly Fintoo Wealth Private Limited) came for my rescue in 2017 when I met FINTOO Team who helped me to with plan my investment and linked it with my goals.Since than they are helping me with my finances, and found their advisory unbiased and appropriate.', from: 'DR. DASH', designation: 'CARDIOLOGIST, DUBAI' },
                    { text: 'I have been associated with Fintoo for over 5 years for tax planning and wealth management. Their independent unbiased & personalised service, customized approach, wide range of product solutions put them on top of the chart in the wealth advisory space. It is one of the most customer-obsessed investment advisory firms i have known.', from: 'Vijayesh GUPTA', designation: 'PRESIDENT, WOCKHARDT' },
                    { text: 'Best Financial Solution providing co offering tailor made investment option along with tax efficient solutions. Especially Shama who with her expertise in financial field and customer centric approach has ensured investors like me make more than expected returns.', from: 'Pragnesh Shastri', designation: '' },
                    { text: 'Very good service and talented team of people. I got their service recently and special mention to Mihir Shah who was extremely helpful with his customer centric approach and in depth knowledge of domain to create a good financial plan.', from: 'Ritesh Ranjan ', designation: '' }
                ]} />
            </div>
        </section>
    );
}
export default IpoClientTestimonialSection;