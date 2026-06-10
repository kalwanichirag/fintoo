export default function SpeakerModal({ isOpen, onClose, onBookSession }) {
  const handleBookNow = () => {
    onClose();
    onBookSession?.();
  };

  return (
    <>
      <div id="speakerModalBackdrop" className={`tw-fixed tw-inset-0 tw-bg-black/60 tw-z-50 ${isOpen ? "" : "tw-hidden"}`} onClick={onClose}></div>
      <div id="speakerModal" className={`tw-fixed tw-inset-0 tw-z-[1000] tw-overflow-y-auto ${isOpen ? "" : "tw-hidden"}`}>
        <div className="tw-min-h-full tw-flex tw-items-center tw-justify-center tw-p-3 sm:tw-p-6">
          <div className="tw-w-full tw-max-w-4xl tw-bg-white tw-rounded-3xl tw-shadow-2xl tw-border tw-border-gray-100 tw-max-h-[92vh] tw-overflow-hidden tw-flex tw-flex-col">
            <div className="tw-p-4 tw-pb-0 sm:tw-p-8 tw-border-b tw-border-gray-100 tw-flex tw-items-start tw-justify-between tw-gap-4">
              <div className="tw-flex tw-items-center tw-gap-4">
                <img
                  src="static/media/womoneya/1738563461009.jpeg"
                  alt="Bandita Patro"
                  className="tw-w-16 tw-h-16 sm:tw-w-20 sm:tw-h-20 tw-rounded-2xl tw-object-cover tw-shadow-md tw-border tw-border-purple-100"
                />
                <div>
                  <h3 className="tw-text-2xl sm:tw-text-3xl tw-font-bold tw-text-gray-900 tw-mb-0">Bandita Patro</h3>
                  <p className="tw-text-gray-600 tw-mt-0 tw-mb-0">Perception Strategist and Executive Presence Expert</p>
                </div>
              </div>
              <button
                id="closeSpeakerModalTop"
                type="button"
                onClick={onClose}
                className="tw-w-10 tw-h-10 tw-rounded-full tw-bg-gray-100 tw-text-gray-700 hover:tw-bg-gray-200 tw-transition"
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>

            <div className="tw-p-4 sm:tw-p-8 tw-overflow-y-auto">
              <div className="tw-grid tw-grid-cols-1 md:tw-grid-cols-3 tw-gap-8">
                <div className="md:tw-col-span-2 tw-space-y-5 tw-text-gray-700 tw-leading-relaxed">
                  <p>
                    Bandita Patro is a perception strategist and executive presence expert with over 18 years of experience transforming how
                    leaders, brands, and institutions show up in the world. From beginning her journey as an engineer at 19 to becoming a
                    director in global consulting, she has built a reputation as a trusted authority in image transformation and leadership
                    influence.
                  </p>
                  <p>
                    She has trained over 50,000 professionals, from CEOs and C-suite leaders to institutional heads, and transformed 100+
                    brands across luxury, retail, hospitality, and media. As Lead Trainer for Tanishq Pan India, she elevated luxury
                    customer experience standards nationwide.
                  </p>
                  <p>
                    Her work spans Bollywood and corporate impact, having styled and advised personalities such as Anup Soni, Sandhya
                    Mridul, and Iqbal Khan. Globally certified and trained under Judith Rasband (Conselle Institute, USA), Bandita believes
                    image is not vanity, it is influence.
                  </p>
                  <p>
                    Through her Power Style Playbook workshop, she helps women align their presence with ambition, refine leadership impact,
                    and confidently own every room they enter.
                  </p>
                </div>
                <div className="tw-bg-gradient-to-br tw-from-purple-50 tw-to-pink-50 tw-rounded-2xl tw-p-6 tw-border tw-border-purple-100">
                  <h4 className="tw-text-lg tw-font-bold tw-text-gray-900 tw-mb-4">Session Snapshot</h4>
                  <div className="tw-space-y-3 tw-text-sm tw-text-gray-700">
                    <div className="tw-flex tw-items-start tw-gap-2">
                      <i className="fa-solid fa-circle-check tw-text-purple-600 tw-mt-1"></i>
                      <span>Executive presence through wardrobe strategy</span>
                    </div>
                    <div className="tw-flex tw-items-start tw-gap-2">
                      <i className="fa-solid fa-circle-check tw-text-purple-600 tw-mt-1"></i>
                      <span>Role-based dressing frameworks</span>
                    </div>
                    <div className="tw-flex tw-items-start tw-gap-2">
                      <i className="fa-solid fa-circle-check tw-text-purple-600 tw-mt-1"></i>
                      <span>Color, fit, and confidence fundamentals</span>
                    </div>
                    <div className="tw-flex tw-items-start tw-gap-2">
                      <i className="fa-solid fa-circle-check tw-text-purple-600 tw-mt-1"></i>
                      <span>Q&A tailored for your women workforce</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="tw-sticky tw-bottom-0 tw-border-t tw-border-gray-100 tw-bg-white/95 tw-backdrop-blur-sm tw-p-4 sm:tw-p-5">
              <button
                type="button"
                id="speakerModalBookNow"
                onClick={handleBookNow}
                className="tw-w-full tw-inline-flex tw-items-center tw-justify-center tw-bg-gradient-to-r tw-from-purple-600 tw-to-pink-500 tw-text-white tw-px-4 tw-py-4 tw-rounded-xl tw-font-bold hover:tw-shadow-xl tw-transition"
              >
                Book Power Style Playbook Session
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
