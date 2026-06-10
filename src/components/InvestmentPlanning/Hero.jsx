import "../Insurance/tailwind.css"
import heroimage from "../../../src/Assets/Images/retirement/hero-image-2.jpg"

export default function HeroB() {
    return (
        <>
            <section className="tw-bg-gradient-to-br tw-from-bg-gray-100 tw-to-white lg:tw-py-20 tw-py-10">
                <div className="tw-max-w-7xl tw-mx-auto tw-px-4 sm:tw-px-6 lg:tw-px-8">
                    <div className="tw-grid lg:tw-grid-cols-2 tw-gap-12 tw-items-center">
                        {/* Left Side Content */}
                        <div className="tw-space-y-8 ">
                            {/* USP Badges */}


                            <h1 className="tw-text-3xl lg:tw-text-5xl tw-font-bold tw-text-fintoo-blue tw-leading-tight">
                                Transform Your Wealth with
                                <span className="tw-text-fintoo-orange"> Personalized</span>,
                                Goal-Based Investment Planning
                            </h1>

                            <p className="tw-text-base lg:tw-text-xl tw-text-gray-600 tw-leading-relaxed !tw-mt-3">
                                Smart, strategic and structured — Fintoo's Financial Experts help you design a customized roadmap to grow, protect, and optimize your wealth across life goals.
                            </p>

                            <div className="tw-flex tw-flex-col sm:tw-flex-row tw-gap-4">
                                <button onClick={() => {
                                    const element = document.getElementById("cta-form-section");
                                    if (element) {
                                        element.scrollIntoView({ behavior: "smooth" });
                                    }
                                }}
                                    className="tw-transition-all tw-duration-300 tw-transform hover:tw-scale-105 tw-bg-fintoo-orange tw-text-white tw-px-8 tw-py-4 tw-rounded-lg tw-font-semibold tw-text-lg tw-hover:bg-orange-600 tw-transition-colors tw-shadow-lg">
                                    <i className="fas fa-calendar-alt tw-mr-2"></i>Schedule Free Consultation
                                </button>
                            </div>

                            {/* Trust Indicators */}
                            <div className="tw-flex tw-items-center tw-space-x-6 lg:tw-pt-8 tw-border-t tw-border-gray-200">
                                <div className="tw-text-center">
                                    <div className="tw-text-2xl tw-font-bold tw-text-fintoo-blue">217CR+</div>
                                    <div className="tw-text-sm tw-text-gray-600">Assets Under Advisory</div>
                                </div>
                                <div className="tw-text-center">
                                    <div className="tw-text-2xl tw-font-bold tw-text-fintoo-blue">20+</div>
                                    <div className="tw-text-sm tw-text-gray-600">Years Experience</div>
                                </div>
                                <div className="tw-text-center">
                                    <div className="tw-text-2xl tw-font-bold tw-text-fintoo-blue">250K+</div>
                                    <div className="tw-text-sm tw-text-gray-600">Client Served</div>
                                </div>
                            </div>
                        </div>

                        {/* Right Side Image */}
                        <div className="tw-relative">
                            <div className="tw-relative tw-z-10">
                                <img className="tw-w-full tw-h-[290px]  lg:tw-h-[600px] tw-object-cover tw-rounded-2xl tw-shadow-2xl" src={heroimage} />
                            </div>
                            {/* Floating Cards */}


                        </div>
                    </div>
                </div>
            </section>

        </>
    )
}