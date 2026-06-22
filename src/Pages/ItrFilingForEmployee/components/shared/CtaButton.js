export default function CtaButton({ children, onClick, variant = 'primary', href }) {
  const baseClassName = 'tw-inline-flex tw-items-center tw-justify-center tw-gap-2 tw-rounded-lg tw-px-7 tw-py-[0.9375rem] tw-text-[0.95rem] tw-font-bold tw-no-underline tw-transition-all tw-duration-200 tw-border tw-border-solid tw-cursor-pointer';
  const variantClassName = variant === 'secondary'
    ? 'btn-secondary tw-bg-transparent tw-text-white tw-border-white/20 hover:tw-border-white/50 hover:tw-bg-white/5 hover:tw-text-white hover:-tw-translate-y-px hover:tw-shadow-[0_0.5rem_1.5rem_rgba(255,255,255,0.1)]'
    : 'btn-primary tw-bg-fintoo-orange tw-text-[#f4f7fb] tw-border-transparent hover:tw-bg-[#f08a18] hover:-tw-translate-y-px hover:tw-shadow-[0_0.5rem_1.5rem_rgba(221,115,0,0.3)]';
  const className = `${variantClassName} ${baseClassName}`;

  if (href) {
    return <a className={className} href={href}>{children}</a>;
  }

  return (
    <button type="button" className={className} onClick={onClick}>
      {children}
    </button>
  );
}
