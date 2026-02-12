import "../Insurance/tailwind.css"
import image1 from "../../../src/Assets/Images/retirement/image-1.jpg"
export default function Hero() {
    const scrollToCTA = () => {
        const element = document.getElementById("final-cta");
        if (element) {
            element.scrollIntoView({ behavior: "smooth" });
        }
    };
    const ExploreMore = () => {
        const element = document.getElementById("how-fintoo-helps");
        if (element) {
            element.scrollIntoView({ behavior: "smooth" });
        }
    };
    return (
        <>
           <section id="hero-section" className="tw-bg-gradient-to-br tw-from-blue-50 tw-to-white py-5 lg:tw-py-24">
    <div className="tw-container tw-mx-auto tw-px-6">
        <div className="tw-grid lg:tw-grid-cols-2 tw-gap-12 tw-items-center">
            <div className="tw-space-y-8 tw-order-2 lg:tw-order-1">
                <div className="tw-space-y-6">
                    <h1 className="tw-text-4xl lg:tw-text-6xl tw-font-bold tw-text-fintoo-blue tw-leading-tight">
                        Retire Early. Live Free. <span className="tw-text-fintoo-orange">Plan Smart</span> with Fintoo.
                    </h1>
                    <p className="tw-text-base lg:tw-text-xl tw-text-gray-600 tw-leading-relaxed">
                        Our retirement dreams deserve more than hope. They deserve a plan. Whether it's a personal pension scheme, a retirement mutual fund, or a defined benefit retirement plan — Fintoo helps you build a strategy to retire on your terms.
                    </p>
                </div>
                <div className="tw-flex tw-flex-col sm:tw-flex-row tw-gap-4">
                    <button  onClick={scrollToCTA} className="tw-bg-fintoo-orange  tw-text-white tw-font-bold tw-text-lg tw-px-8 tw-py-4 tw-rounded-lg tw-shadow-lg tw-transition-all tw-duration-300 tw-transform hover:tw-scale-105">
                        <i className="fa-solid fa-calendar-check tw-mr-2"></i>
                        Book My Free 1-on-1 Consultation
                    </button>
                    {/* <button onClick={ExploreMore} className="tw-border-2 tw-border-fintoo-blue tw-text-fintoo-blue hover:tw-bg-fintoo-blue hover:tw-text-white tw-font-semibold tw-px-8 tw-py-4 tw-rounded-lg tw-transition-all tw-duration-300">
                        Learn More
                    </button> */}
                </div>
                <div className="tw-flex tw-items-center tw-space-x-6 tw-text-sm tw-text-gray-600">
                    <div className="tw-flex tw-items-center">
                        <i className="fa-solid fa-shield-halved tw-text-green-500 tw-mr-2"></i>
                        100% Secure
                    </div>
                    <div className="tw-flex tw-items-center">
                        <i className="fa-solid fa-clock tw-text-blue-500 tw-mr-2"></i>
                        Free 15-min consultation
                    </div>
                    <div className="tw-flex tw-items-center">
                        <i className="fa-solid fa-users tw-text-purple-500 tw-mr-2"></i>
                        2,50,000+ Happy Clients
                    </div>
                </div>
            </div>
            <div className="tw-relative tw-order-1 lg:tw-order-2">
                <div className="tw-bg-white tw-rounded-2xl tw-shadow-2xl tw-p-8 tw-relative tw-z-10">
                    <img className="tw-w-full tw-h-40 lg:tw-h-80 tw-object-cover tw-rounded-xl" src={image1} alt="confident Indian professional smiling while working from home, modern home office setup, laptop and financial documents, warm lighting, aspirational lifestyle" />
                    <div className="tw-absolute -tw-top-4 -tw-right-4 tw-bg-fintoo-orange tw-text-white tw-p-3 tw-rounded-full tw-shadow-lg">
                        <i className="fa-solid fa-trophy tw-text-2xl"></i>
                    </div>
                </div>
                
            </div>
        </div>
    </div>
</section>
        </>
    )
}
