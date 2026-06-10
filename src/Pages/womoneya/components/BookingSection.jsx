export default function BookingSection({
  sectionRef,
  formData,
  onFieldChange,
  isOfflineMode,
  offlineCity,
  otherCity,
  showOtherCityInput,
  onModeChange,
  onOfflineCityChange,
  onOtherCityChange,
  onCityFocus,
  onCityBlur,
  onSubmit,
  isSubmitting,
  submitError,
}) {
  return (
    <section id="booking-form" ref={sectionRef} className="tw-py-10 md:tw-py-16 tw-bg-white">
      <div className="tw-max-w-7xl tw-mx-auto tw-px-4 sm:tw-px-6 lg:tw-px-8">
        <div className="tw-grid tw-grid-cols-1 lg:tw-grid-cols-2 tw-gap-10 lg:tw-gap-16 tw-items-center">
          <div>
            <div className="tw-inline-block tw-bg-gradient-to-r tw-from-purple-600 tw-to-pink-500 tw-text-white tw-px-6 tw-py-2 tw-rounded-full tw-text-sm tw-font-bold tw-mb-6">
              <i className="fa-solid fa-calendar-check tw-mr-2"></i>
              LIMITED SLOTS AVAILABLE
            </div>
            <h2 className="font-display tw-text-3xl md:tw-text-5xl tw-font-bold tw-text-gray-900 tw-mb-6">Empower the Women Who Power Your Organization</h2>
            <p className="tw-text-base  tw-text-gray-700 tw-mb-8 tw-leading-relaxed">
To make the women in your organization feel special, talk to us today. This March, let's make Womoneya a roaring success together.            </p>

            <div className="tw-space-y-5 md:tw-space-y-6">
              <div className="tw-flex tw-items-start tw-space-x-3 md:tw-space-x-4">
                <div className="tw-w-10 tw-h-10 md:tw-w-12 md:tw-h-12 tw-bg-purple-100 tw-rounded-xl tw-flex tw-items-center tw-justify-center tw-flex-shrink-0">
                  <i className="fa-solid fa-check tw-text-purple-600 tw-text-xl"></i>
                </div>
                <div>
                  <div className="tw-font-bold tw-text-gray-900 tw-mb-1 tw-text-sm md:tw-text-base">Flexible Scheduling</div>
                  <div className="tw-text-sm md:tw-text-base tw-text-gray-600">Choose online or offline sessions based on your preference</div>
                </div>
              </div>

              <div className="tw-flex tw-items-start tw-space-x-3 md:tw-space-x-4">
                <div className="tw-w-10 tw-h-10 md:tw-w-12 md:tw-h-12 tw-bg-pink-100 tw-rounded-xl tw-flex tw-items-center tw-justify-center tw-flex-shrink-0">
                  <i className="fa-solid fa-check tw-text-pink-500 tw-text-xl"></i>
                </div>
                <div>
                  <div className="tw-font-bold tw-text-gray-900 tw-mb-1 tw-text-sm md:tw-text-base">Expert Facilitators</div>
                  <div className="tw-text-sm md:tw-text-base tw-text-gray-600">Expert financial advisors and certified wellness coaches</div>
                </div>
              </div>

              <div className="tw-flex tw-items-start tw-space-x-3 md:tw-space-x-4">
                <div className="tw-w-10 tw-h-10 md:tw-w-12 md:tw-h-12 tw-bg-orange-100 tw-rounded-xl tw-flex tw-items-center tw-justify-center tw-flex-shrink-0">
                  <i className="fa-solid fa-check tw-text-orange-500 tw-text-xl"></i>
                </div>
                <div>
                  <div className="tw-font-bold tw-text-gray-900 tw-mb-1 tw-text-sm md:tw-text-base">Customizable Content</div>
                  <div className="tw-text-sm md:tw-text-base tw-text-gray-600">Tailored to your organization's specific needs</div>
                </div>
              </div>
            </div>

            <div className="tw-mt-8 md:tw-mt-10 tw-p-5 md:tw-p-6 tw-bg-gradient-to-r tw-from-purple-100 tw-to-pink-100 tw-rounded-2xl">
              <div className="tw-flex tw-items-center tw-space-x-3 md:tw-space-x-4">
                <div className="tw-w-12 tw-h-12 md:tw-w-16 md:tw-h-16 tw-bg-white tw-rounded-full tw-flex tw-items-center tw-justify-center">
                  <i className="fa-solid fa-phone tw-text-purple-600 tw-text-2xl"></i>
                </div>
                <div>
                  <div className="tw-font-bold tw-text-gray-900 tw-mb-1 tw-text-sm md:tw-text-base">Need Help?</div>
                  <div className="tw-text-sm md:tw-text-base tw-text-gray-700">
                    Call our partnerships team:
                    <a href="tel:+917738914692"> +91 77389 14692 </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="tw-bg-gradient-to-br tw-from-purple-50 tw-to-pink-50 tw-rounded-3xl tw-p-6 md:tw-p-10 tw-shadow-2xl">
            <h3 className="tw-text-xl md:tw-text-2xl tw-font-bold tw-text-gray-900 tw-mb-5 md:tw-mb-6">Book an Appointment</h3>

            <form id="bookingForm" className="tw-space-y-5" onSubmit={onSubmit}>
              <div>
                <label className="tw-block tw-text-gray-700 tw-font-medium tw-mb-2">Name *</label>
                <input
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={onFieldChange}
                  required
                  className="tw-w-full tw-px-4 tw-py-3 tw-rounded-xl tw-border-2 tw-border-gray-200 focus:tw-border-purple-600 focus:tw-outline-none tw-transition"
                  placeholder="Enter your name"
                />
              </div>

              <div>
                <label className="tw-block tw-text-gray-700 tw-font-medium tw-mb-2">Company Name *</label>
                <input
                  name="companyName"
                  type="text"
                  value={formData.companyName}
                  onChange={onFieldChange}
                  required
                  className="tw-w-full tw-px-4 tw-py-3 tw-rounded-xl tw-border-2 tw-border-gray-200 focus:tw-border-purple-600 focus:tw-outline-none tw-transition"
                  placeholder="Enter company name"
                />
              </div>

              <div>
                <label className="tw-block tw-text-gray-700 tw-font-medium tw-mb-2">Designation *</label>
                <input
                  name="designation"
                  type="text"
                  value={formData.designation}
                  onChange={onFieldChange}
                  required
                  className="tw-w-full tw-px-4 tw-py-3 tw-rounded-xl tw-border-2 tw-border-gray-200 focus:tw-border-purple-600 focus:tw-outline-none tw-transition"
                  placeholder="Your designation"
                />
              </div>

              <div>
                <label className="tw-block tw-text-gray-700 tw-font-medium tw-mb-2">Email *</label>
                <input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={onFieldChange}
                  required
                  className="tw-w-full tw-px-4 tw-py-3 tw-rounded-xl tw-border-2 tw-border-gray-200 focus:tw-border-purple-600 focus:tw-outline-none tw-transition"
                  placeholder="your.email@company.com"
                />
              </div>

              <div>
                <label className="tw-block tw-text-gray-700 tw-font-medium tw-mb-2">Phone Number *</label>
                <input
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={onFieldChange}
                  required
                  pattern="^(\+91[\-\s]?)?[6-9]\d{9}$"
                  minLength={10}
                  maxLength={14}
                  className="tw-w-full tw-px-4 tw-py-3 tw-rounded-xl tw-border-2 tw-border-gray-200 focus:tw-border-purple-600 focus:tw-outline-none tw-transition"
                  placeholder="+91 77389 14692"
                />
              </div>

              <div>
                <label className="tw-block tw-text-gray-700 tw-font-medium tw-mb-2">Select Session *</label>
                <select
                  name="sessionType"
                  value={formData.sessionType}
                  onChange={onFieldChange}
                  required
                  className="tw-w-full tw-px-4 tw-py-3 tw-rounded-xl tw-border-2 tw-border-gray-200 tw-bg-white focus:tw-border-purple-600 focus:tw-outline-none tw-transition"
                >
                  <option value="">Please select one session</option>
                  <option value="Power Style Playbook">Power Style Playbook</option>
                  <option value="Money Mastery for Women">Money Mastery for Women</option>
                  <option value="Mind and Body Wellness">Mind and Body Wellness</option>
                </select>
              </div>

              <div>
                <label className="tw-block tw-text-gray-700 tw-font-medium tw-mb-2">Preferred Mode *</label>
                <div className="tw-grid tw-grid-cols-2 tw-gap-4">
                  <label className="tw-flex tw-items-center tw-space-x-3 tw-p-4 tw-border-2 tw-border-gray-200 tw-rounded-xl tw-cursor-pointer  tw-border-solid hover:tw-border-purple-600 tw-transition">
                    <input
                      type="radio"
                      name="mode"
                      value="online"
                      checked={!isOfflineMode}
                      onChange={() => onModeChange("online")}
                      className="tw-w-5 tw-h-5 tw-text-purple-600"
                    />
                    <span className="tw-font-medium">Online</span>
                  </label>
                  <label className="tw-flex tw-items-center tw-space-x-3 tw-p-4 tw-border-2 tw-border-gray-200 tw-rounded-xl tw-cursor-pointer tw-border-solid hover:tw-border-purple-600 tw-transition">
                    <input
                      type="radio"
                      name="mode"
                      value="offline"
                      checked={isOfflineMode}
                      onChange={() => onModeChange("offline")}
                      className="tw-w-5 tw-h-5 tw-text-purple-600"
                    />
                    <span className="tw-font-medium">On Site</span>
                  </label>
                </div>
              </div>

              <div id="offlineCityBlock" className={isOfflineMode ? "" : "tw-hidden"}>
                <label className="tw-block tw-text-gray-700 tw-font-medium tw-mb-2">Select City (Offline) *</label>
                <select
                  id="offlineCitySelect"
                  name="offline_city"
                  value={offlineCity}
                  onChange={(event) => onOfflineCityChange(event.target.value)}
                  onFocus={onCityFocus}
                  onBlur={onCityBlur}
                  className="tw-w-full tw-px-4 tw-py-3 tw-rounded-xl tw-border-2 tw-border-gray-200 tw-bg-white focus:tw-border-purple-600 focus:tw-outline-none tw-transition"
                >
                  <option value="">Select a city</option>
                  <option value="Mumbai">Mumbai</option>
                  <option value="Delhi NCR">Delhi NCR</option>
                  <option value="Bengaluru">Bengaluru</option>
                  <option value="Chennai">Chennai</option>
                  <option value="Kolkata">Kolkata</option>
                  <option value="Hyderabad">Hyderabad</option>
                  <option value="Pune">Pune</option>
                  <option value="Ahmedabad">Ahmedabad</option>
                  <option value="Jaipur">Jaipur</option>
                  <option value="Lucknow">Lucknow</option>
                  <option value="Other">Other</option>
                </select>
                <div id="otherCityBlock" className={`tw-mt-3 ${showOtherCityInput ? "" : "tw-hidden"}`}>
                  <label className="tw-block tw-text-gray-700 tw-font-medium tw-mb-2">Other City *</label>
                  <input
                    id="otherCityInput"
                    name="offline_city_other"
                    type="text"
                    value={otherCity}
                    onChange={(event) => onOtherCityChange(event.target.value)}
                    className="tw-w-full tw-px-4 tw-py-3 tw-rounded-xl tw-border-2 tw-border-gray-200 focus:tw-border-purple-600 focus:tw-outline-none tw-transition"
                    placeholder="Enter city name"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="tw-w-full tw-bg-gradient-to-r tw-from-purple-600 tw-to-pink-500 tw-text-white tw-py-3.5 md:tw-py-4 tw-rounded-xl tw-font-bold tw-text-base md:tw-text-lg hover:tw-shadow-xl tw-transition tw-transform hover:tw-scale-105"
              >
                {isSubmitting ? "Submitting..." : "Submit Request"}
              </button>

              {submitError ? (
                <p className="tw-text-sm tw-text-red-600 tw-text-center">{submitError}</p>
              ) : null}

              <p className="tw-text-sm tw-text-gray-600 tw-text-center">Our partnerships team will contact you within 24 hours</p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
