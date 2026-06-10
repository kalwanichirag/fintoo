import LeadWithOtp from "./otp";


const LandingPageOtp = ({ variant = "full", pageName }) => {

    const urlParams = new URLSearchParams(window.location.search);
    let utm_source_value = urlParams.get("utm_source");
    let tags_value = urlParams.get("tags");
    if (utm_source_value) {
        utm_source_value = utm_source_value + ''
    }
    if (tags_value) {
        tags_value = tags_value + ''
    }

   
    if (variant === "minimal") {
        // Only Calendly widget UI
        return (
            <div className="py-4">
                <LeadWithOtp pageName={pageName}  />
            </div>
        );
    }

    return (
        <>
            <div className='py-5' style={{ background: "#042b62" }}>
                <div className='container'>
                    <div className='row align-items-center justify-content-betweeen g-md-5'>
                        <div className='col-lg-6'>
                            <h2 className='text-center text-white fs-2 fw-bold'>
                                Book an introductory<span style={{ color: "#dd7300" }}>  Complimentary 15 Minutes Call</span> with our Financial Experts to know more about our offerings and advice.

                            </h2>
                        </div>
                        <div className='col-lg-6'>
                <LeadWithOtp pageName={pageName}  />
                        </div>
                    </div>
                </div>
            </div>

        </>
    )
}

export default LandingPageOtp