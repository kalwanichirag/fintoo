import Styles from './style.module.css';
const ContactUs = () => {
    return (<>
    <section className={Styles.section}>
        <div className={`container ${Styles.container}`}>
            <div className="row">
                <div className="col-md-7 col-12 d-flex align-items-center">
                    <div className="text-center">
                        <h2>Contact Us</h2>
                        <h3>Connect with our Financial Experts over a Free 30 Minutes Session and get all your concerns addressed.</h3>
                    </div>
                </div>
                <div className="col-md-5 col-12 mb-4">
                    <div className={Styles.calender}>
                        <iframe style={{width: '100%', height: '100%'}} src="https://calendly.com/fintoo/30-minutes-consultation-call?embed_domain=www.fintoo.in&embed_type=Inline&hide_event_type_details=1&hide_gdpr_banner=1" />
                    </div>
                </div>
            </div>
        </div>
    </section>
    </>);
}
export default ContactUs;
