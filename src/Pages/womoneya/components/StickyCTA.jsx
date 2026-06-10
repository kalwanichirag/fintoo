export default function StickyCTA({ isVisible, onBookSession }) {
  return (
    <div
      className={`tw-fixed tw-right-3 sm:tw-right-5 lg:tw-right-8 tw-bottom-3 sm:tw-bottom-5 lg:tw-bottom-8 tw-z-[1000] tw-transition-all tw-duration-300 ${
        isVisible
          ? "tw-opacity-100 tw-translate-y-0"
          : "tw-opacity-0 tw-translate-y-24 tw-pointer-events-none"
      }`}
    >
      <button
        type="button"
        onClick={onBookSession}
        className="tw-bg-gradient-to-r tw-from-purple-600 tw-to-pink-500 tw-text-white tw-px-3 sm:tw-px-6 lg:tw-px-8 tw-py-2.5 sm:tw-py-4 tw-rounded-full tw-font-bold tw-text-xs sm:tw-text-base tw-shadow-2xl hover:tw-shadow-3xl tw-transition tw-transform hover:tw-scale-105 tw-flex tw-items-center tw-space-x-2"
      >
        <i className="fa-solid fa-calendar-check"></i>
        <span>Book Now</span>
      </button>
    </div>
  );
}
