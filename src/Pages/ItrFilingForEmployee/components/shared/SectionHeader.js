export default function SectionHeader({ label, title, className = '' }) {
  return (
    <div className={`${className} fade-up`}>
      <div className="section-label tw-mb-3 tw-text-[0.72rem] tw-font-bold tw-uppercase tw-tracking-[0.14em] tw-text-fintoo-orange">{label}</div>
      <h2 className="section-title tw-text-3xl md:tw-text-4xl lg:tw-text-5xl tw-font-extrabold tw-leading-[1.12] tw-tracking-[0] tw-text-[#10233f]">{title}</h2>
    </div>
  );
}
