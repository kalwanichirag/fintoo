export default function Header({ onBookSession }) {
  return (
    <header id="header" className="tw-fixed tw-top-0 tw-left-0 tw-right-0 tw-bg-white/95 tw-backdrop-blur-md tw-z-50 tw-border-b tw-border-gray-100">
      <div className="tw-max-w-7xl tw-mx-auto tw-px-4 sm:tw-px-6 lg:tw-px-8 tw-py-4 sm:tw-py-5 tw-flex tw-items-center tw-justify-between tw-gap-4">
        <div className="tw-flex tw-items-center tw-space-x-3">
          <div className="tw-rounded-xl tw-flex tw-items-center tw-justify-center">
            <span className="tw-text-white tw-font-bold tw-text-xl">
              <img className="tw-w-28 sm:tw-w-32" src="https://www.fintoo.in/static/media/wp/Fintoologo_.svg" alt="Fintoo" />
            </span>
          </div>
          <div></div>
        </div>

        <nav className="tw-hidden lg:tw-flex tw-items-center tw-space-x-8">
          <a href="#about" className="tw-text-gray-700 hover:tw-text-purple-600 tw-font-medium tw-transition">About</a>
          <a href="#Sessions" className="tw-text-gray-700 hover:tw-text-purple-600 tw-font-medium tw-transition">Sessions</a>
          <a href="#why-womoneya" className="tw-text-gray-700 hover:tw-text-purple-600 tw-font-medium tw-transition">Why This Matters</a>
          <a href="#testimonials" className="tw-text-gray-700 hover:tw-text-purple-600 tw-font-medium tw-transition">Testimonials</a>
          <a href="#events" className="tw-text-gray-700 hover:tw-text-purple-600 tw-font-medium tw-transition">Past Events</a>
        </nav>

        <button
          type="button"
          onClick={onBookSession}
          className="tw-bg-gradient-to-r tw-from-purple-600 tw-to-pink-500 tw-text-white tw-px-4 sm:tw-px-6 tw-py-2.5 sm:tw-py-3 tw-text-sm sm:tw-text-base tw-rounded-full tw-font-semibold hover:tw-shadow-xl tw-transition tw-transform hover:tw-scale-105"
        >
          Book a Session
        </button>
      </div>
    </header>
  );
}
