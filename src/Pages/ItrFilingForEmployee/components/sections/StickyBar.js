import Icon from '../shared/Icon';

export default function StickyBar({ isVisible, onBook }) {
  return (
    <div className={`sticky-bar${isVisible ? ' visible' : ''}`}>
      <span className="tw-text-[0.9rem]">Need Help Filing Taxes?</span>
      <button type="button" className="btn-gold tw-text-[0.85rem]" onClick={() => onBook('free')}>
        <Icon name="calendar" /> Book Free 15-Min Consultation
      </button>
    </div>
  );
}
