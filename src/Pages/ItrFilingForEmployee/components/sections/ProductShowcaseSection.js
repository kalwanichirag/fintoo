import Slider from 'react-slick';
import CtaButton from '../shared/CtaButton';
import Icon from '../shared/Icon';

export default function ProductShowcaseSection({ onBook }) {
  const sliderSettings = {
    arrows: true,
    dots: false,
    infinite: true,
    speed: 450,
    slidesToShow: 4,
    slidesToScroll: 1,
    prevArrow: <ShowcaseArrow direction="prev" />,
    nextArrow: <ShowcaseArrow direction="next" />,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          arrows: false,
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 640,
        settings: {
          arrows: false,
          slidesToShow: 1,
        },
      },
    ],
  };

  return (
    <section className="product-showcase" aria-label="Fintoo filing experience">
      <div className="showcase-header fade-up">
        <h2 className="tw-text-3xl md:tw-text-4xl lg:tw-text-5xl">ITR filing that feels <span>guided, visual, and precise.</span></h2>
        <p className="tw-text-[1rem]">From income import to deductions, regime selection, and refund clarity, every step is reviewed live with your Tax Expert.</p>
      </div>
      <div className="showcase-slider-wrap">
        <Slider className="showcase-slider" {...sliderSettings}>
          <MotionCard title="Income details pulled together before your call" description="Salary, interest, capital gains, and AIS data are organized so your Tax Expert starts with context, not guesswork." type="broker" wash="rgba(4,43,98,.07)" />
          <MotionCard title="No deduction left sitting in your documents" description="Your tax expert checks what applies and explains what should be claimed, line by line." type="deductions" wash="rgba(221,115,0,.08)" />
          <MotionCard title="Right form, right regime, selected with proof" description="See the math clearly before filing, with your Tax Expert validating the final choice." type="regime" wash="rgba(4,43,98,.06)" />
          <MotionCard title="Every number visualized before submission" description="Refund, taxable income, deductions, and liability are presented clearly before you approve filing." type="refund" wash="rgba(221,115,0,.07)" />
        </Slider>
      </div>
      <div className="showcase-cta fade-up">
        <div>
          <strong className="tw-text-[1.05rem]">File ITR with expert accuracy, not form-filling anxiety.</strong>
          <span className="tw-text-[0.86rem]">Book a free intro call and understand your filing path in minutes.</span>
        </div>
        <CtaButton onClick={() => onBook('free')}><Icon name="calendar" /> Start Filing</CtaButton>
      </div>
    </section>
  );
}

function ShowcaseArrow({ className, direction, onClick }) {
  return (
    <button type="button" className={`${className || ''} showcase-arrow showcase-arrow-${direction}`} onClick={onClick} aria-label={direction === 'prev' ? 'Previous showcase item' : 'Next showcase item'}>
      <Icon name={direction === 'prev' ? 'arrowLeft' : 'arrowRight'} />
    </button>
  );
}

function MotionCard({ title, description, type, wash }) {
  return (
    <article className="motion-card" style={{ '--card-wash': wash }}>
      <div className="motion-stage"><MotionStage type={type} /></div>
      <div className="motion-copy"><h3 className="tw-text-lg md:tw-text-xl">{title}</h3><p className="tw-text-sm">{description}</p></div>
    </article>
  );
}

function MotionStage({ type }) {
  if (type === 'broker') {
    return (
      <div className="broker-stack">
        {[
          ['AIS', '82%', 'FETCHING'],
          ['16', '68%', 'MATCHED'],
          ['CG', '76%', 'SYNCED'],
        ].map(([logo, width, status]) => (
          <div className="broker-pill" key={logo}>
            <div className="broker-logo tw-text-[0.75rem]">{logo}</div>
            <div className="broker-line"><span style={{ '--w': width }} /></div>
            <div className="broker-status tw-text-[0.72rem]">{status}</div>
          </div>
        ))}
      </div>
    );
  }

  if (type === 'regime') {
    return (
      <div className="regime-card">
        <div className="mini-title tw-text-[0.78rem]">Best regime comparison</div>
        {[
          ['New regime', 'Estimated tax payable: Rs. 3,68,807', '58%', true],
          ['Old regime', 'Estimated tax payable: Rs. 5,78,567', '88%'],
        ].map(([label, tax, width, best]) => (
          <div className={`regime-option${best ? ' best' : ''}`} key={label}>
            <div className="regime-label tw-text-[0.82rem]"><span>{label}</span><span>{best ? <Icon name="check" /> : 'Compare'}</span></div>
            <div className="regime-tax tw-text-[0.72rem]">{tax}</div>
            <div className="regime-bar"><span style={{ '--w': width }} /></div>
          </div>
        ))}
      </div>
    );
  }

  if (type === 'refund') {
    return (
      <div className="refund-card">
        <div className="mini-title tw-text-[0.78rem]">Interactive tax summary</div>
        <div className="refund-amount tw-text-[2.25rem]">Rs. 88,090</div>
        <div className="refund-flow">
          {[
            ['Gross income', 'Rs. 30,26,152'],
            ['Deductions', 'Rs. 3,99,673'],
            ['Taxable income', 'Rs. 26,26,479'],
          ].map(([label, value], index) => (
            <div key={label}>
              <div className="flow-row tw-text-[0.78rem]"><span>{label}</span><span>{value}</span></div>
              {index < 2 && <div className="flow-line" />}
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="mini-panel">
      <div className="mini-title tw-text-[0.78rem]">Deductions reviewed automatically</div>
      {[
        ['Standard deduction', 'Rs. 75,000'],
        ['Section 80C', 'Rs. 1,50,000'],
        ['HRA exemption', 'Found'],
      ].map(([label, value]) => (
        <div className="mini-row scanning tw-text-[0.8rem]" key={label}>
          <span>{label}</span>
          <strong>{value}</strong>
          <span className="mini-check"><Icon name="check" /></span>
        </div>
      ))}
    </div>
  );
}
