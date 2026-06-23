import Icon from '../shared/Icon';

export default function StickyBar({ isVisible, onBook }) {
  return (
    <div className={`sticky-bar${isVisible ? ' visible' : ''}`}>
      <span className="tw-text-[0.9rem]">File Your ITR Accurately & Avoid A Notice From the Income Tax Department.</span>
      <button type="button" className="btn-gold tw-text-[0.85rem] tw-text-white" onClick={() => onBook('free')}>
        <Icon name="calendar" /> File Your ITR
      </button>
    </div>
  );
}
