export default function OtpStep({
  mobile,
  otp,
  setOtp,
  onBack,
  onVerify,
  onResend,
  resendTimer,
  canResend,
  errorMessage,
  isLoading,
}) {

  const otpValue = otp.join("");

  const handleChange = (e) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 6);
    setOtp(value.split(""));
  };

  return (
    <>
      <h2 className="tw-text-lg tw-font-semibold tw-mb-2">
        Enter OTP
      </h2>

      <p className="tw-text-sm tw-text-slate-500 tw-mb-4">
        OTP sent to +91 {mobile}
      </p>

      <input
        type="text"
        inputMode="numeric"
        autoFocus
        maxLength={6}
        value={otpValue}
        onChange={handleChange}
        placeholder="Enter OTP"
        className="tw-w-full tw-h-14 tw-rounded-xl tw-border tw-border-slate-300 tw-text-center tw-text-lg  tracking-widest focus:tw-outline-none focus:tw-border-fintoo-blue"
      />
      <p className="tw-mt-3 tw-mb-0 tw-text-sm tw-text-slate-500">
  {canResend ? (
    <button
      onClick={onResend}
      className="tw-text-fintoo-blue tw-font-medium"
    >
      Resend OTP
    </button>
  ) : (
    <>Resend OTP in {resendTimer}s</>
  )}
</p>

      {errorMessage && (
        <p className="tw-mt-1 tw-text-sm tw-text-red-500">
          {errorMessage} 
        </p>
      )}

      <div className="tw-mt-3 tw-flex tw-gap-3">
        <button
          onClick={onBack}
          className="tw-flex-1 tw-rounded-xl tw-border tw-py-3"
        >
          Back
        </button>

        <button
          onClick={onVerify}
          disabled={isLoading || otpValue.length < 6}
          className="tw-flex-1 tw-rounded-xl tw-bg-fintoo-blue tw-py-3 tw-text-white disabled:tw-opacity-50"
        >
          {isLoading ? "Verifying..." : "Verify OTP"}
        </button>
      </div>
    </>
  );
}
