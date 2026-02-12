export default function Benefits() {
    return (
        <section id="benefits-section" className="tw-gradient-bg tw-text-white tw-py-20">
            <div className="tw-max-w-7xl tw-mx-auto tw-px-6">
                <div className="tw-text-center tw-mb-16">
                    <h2 className="tw-text-4xl lg:tw-text-5xl tw-font-bold tw-mb-6">
                        Why Lacs of Indians Trust Fintoo for Retirement Planning
                    </h2>
                    <p className="tw-text-xl tw-text-blue-100 tw-max-w-3xl tw-mx-auto">
                        Experience the difference of working with India's most trusted retirement planning platform
                    </p>
                </div>

                <div className="tw-grid tw-grid-cols-1 md:tw-grid-cols-2 lg:tw-grid-cols-4 tw-gap-8 tw-mb-16">
                    <div className="tw-bg-white tw-bg-opacity-10 tw-p-6 tw-rounded-xl tw-backdrop-blur-sm">
                        <div className="tw-w-12 tw-h-12 tw-bg-fintoo-orange tw-rounded-full tw-flex tw-items-center tw-justify-center tw-mb-4">
                            <i className="fa-solid fa-user-cog tw-text-white tw-text-xl"></i>
                        </div>
                        <h3 className="tw-text-lg tw-font-semibold tw-mb-3">Personalized Plans</h3>
                        <p className="tw-text-blue-100 tw-text-sm">
                            From short-term investment plans to comprehensive long-term savings strategies tailored to your goals.
                        </p>
                    </div>

                    <div className="tw-bg-white tw-bg-opacity-10 tw-p-6 tw-rounded-xl tw-backdrop-blur-sm">
                        <div className="tw-w-12 tw-h-12 tw-bg-fintoo-orange tw-rounded-full tw-flex tw-items-center tw-justify-center tw-mb-4">
                            <i className="fa-solid fa-chart-line tw-text-white tw-text-xl"></i>
                        </div>
                        <h3 className="tw-text-lg tw-font-semibold tw-mb-3">Smart Returns</h3>
                        <p className="tw-text-blue-100 tw-text-sm">
                            Identify the best investment plans with high returns through our AI-powered portfolio optimization.
                        </p>
                    </div>

                    <div className="tw-bg-white tw-bg-opacity-10 tw-p-6 tw-rounded-xl tw-backdrop-blur-sm">
                        <div className="tw-w-12 tw-h-12 tw-bg-fintoo-orange tw-rounded-full tw-flex tw-items-center tw-justify-center tw-mb-4">
                            <i className="fa-solid fa-shield-alt tw-text-white tw-text-xl"></i>
                        </div>
                        <h3 className="tw-text-lg tw-font-semibold tw-mb-3">Guaranteed Options</h3>
                        <p className="tw-text-blue-100 tw-text-sm">
                            Explore best annuity plans and monthly income plans for senior citizens with guaranteed returns.
                        </p>
                    </div>

                    <div className="tw-bg-white tw-bg-opacity-10 tw-p-6 tw-rounded-xl tw-backdrop-blur-sm">
                        <div className="tw-w-12 tw-h-12 tw-bg-fintoo-orange tw-rounded-full tw-flex tw-items-center tw-justify-center tw-mb-4">
                            <i className="fa-solid fa-hands-helping tw-text-white tw-text-xl"></i>
                        </div>
                        <h3 className="tw-text-lg tw-font-semibold tw-mb-3">All-in-One Guidance</h3>
                        <p className="tw-text-blue-100 tw-text-sm">
                            From health insurance for retirees to retirement savings accounts - complete financial wellness.
                        </p>
                    </div>
                </div>

                <div className="tw-grid tw-grid-cols-1 lg:tw-grid-cols-2 tw-gap-12 tw-items-center">
                    <div>
                        <h3 className="tw-text-3xl tw-font-bold tw-mb-6">The Fintoo Advantage</h3>
                        <div className="tw-space-y-6">
                            {["Zero Hidden Charges", "Tax Optimization", "Regular Reviews", "Digital Platform"].map((title, idx) => (
                                <div className="tw-flex tw-items-start tw-space-x-4" key={idx}>
                                    <div className="tw-w-8 tw-h-8 tw-bg-fintoo-orange tw-rounded-full tw-flex tw-items-center tw-justify-center tw-flex-shrink-0">
                                        <i className="fa-solid fa-check tw-text-white"></i>
                                    </div>
                                    <div>
                                        <h4 className="tw-text-lg tw-font-semibold tw-mb-2">{title}</h4>
                                        <p className="tw-text-blue-100">
                                            {[
                                                "Complete transparency in all fees and charges. No surprises, ever.",
                                                "Maximize tax benefits under Section 80C, 80CCC, and 10(10A) with our expert guidance.",
                                                "Quarterly portfolio reviews and rebalancing to keep you on track.",
                                                "Track your progress 24/7 with our award-winning mobile app and web platform."
                                            ][idx]}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="tw-relative">
                        <img
                            className="tw-w-full tw-h-80 tw-object-cover tw-rounded-2xl"
                            src="https://storage.googleapis.com/uxpilot-auth.appspot.com/f4fe5b1fc0-761b8a1f1a26d242598a.png"
                            alt="modern Indian family using digital financial planning app on tablet, technology and finance concept"
                        />
                        <div className="tw-absolute tw-inset-0 tw-bg-gradient-to-t tw-from-fintoo-blue tw-via-transparent tw-to-transparent tw-rounded-2xl"></div>
                    </div>
                </div>
            </div>
        </section>
    )
}
