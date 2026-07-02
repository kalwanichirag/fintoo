import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { pricingPlans } from '../data';
import Icon from '../shared/Icon';
import {
  deleteCookie,
  getUserId,
  loginRedirectGuest,
  setItemLocal,
} from '../../../../common_utilities';
import { X_CRM_ACCESS_TOKEN, X_CRM_USER } from '../../../../constants';
import { beginItrSignupJourney } from '../../../../Utils/Webengage/itrSignupTracking';

const trustBadges = [
  ['lock', '100% Secure & Confidential'],
  ['bolt', 'Quick & Accurate Filing'],
  ['userTie', 'Expert Tax Support'],
  ['rupee', 'Max Refund. Zero Stress.'],
  ['check', 'Tax Expert Reviewed & Verified'],
];

export default function PricingSection({ onBook, prices, enablePlanPurchase = false }) {
  const [purchasePlans, setPurchasePlans] = useState([]);
  const navigate = useNavigate();
  const displayPlans = prices
    ? pricingPlans.map((plan, index) => ({ ...plan, price: prices[index] ?? plan.price }))
    : pricingPlans;

  useEffect(() => {
    if (!enablePlanPurchase) return undefined;

    let active = true;
    deleteCookie('itr-page');

    if (getUserId() && localStorage.getItem('isGuest')) {
      localStorage.removeItem('isGuest');
      navigate(`${process.env.PUBLIC_URL}/itr-profile`);
      return undefined;
    }

    axios.get(
      `${process.env.REACT_APP_CRM_BASE_URL}/get_plan_category_list`,
      {
        headers: {
          'X-CRM-Access-Token': X_CRM_ACCESS_TOKEN,
          'X-CRM-User': X_CRM_USER,
        },
      }
    ).then((response) => {
      const plans = (response?.data?.data || [])
        .filter((plan) => plan.service === 'ITR Filing')
        .map((plan) => ({
          ...plan,
          plan_description: plan.plan_description
            ? JSON.parse(plan.plan_description)
            : null,
        }))
        .sort((a, b) => Number(a.plan_amount) - Number(b.plan_amount));

      if (active) setPurchasePlans(plans);
    }).catch((error) => {
      console.error('Plan API Error:', error);
    });

    return () => {
      active = false;
    };
  }, [enablePlanPurchase, navigate]);

  const trackPlanClick = (plan) => {
    if (!window?.webengage?.track) return;

    const mrp = Number(plan?.plan_description?.original_amount) || 0;
    const listPrice = Number(plan?.plan_amount) || 0;

    window.webengage.track('buy now clicked', {
      url: window.location.href,
      'list price': listPrice,
      MRP: mrp,
      'list discount': mrp - listPrice,
      'plan name': plan?.plan_name || '',
      'plan id': plan?.name || plan?.plan_id || plan?.plan_uuid || '',
      Service: plan?.service || 'ITR Filing',
    });
  };

  const purchasePlan = (displayPlan) => {
    const displayedAmount = Number(String(displayPlan.price).replace(/,/g, ''));
    const matchingNamePlans = purchasePlans.filter(
      (candidate) =>
        candidate?.plan_name?.trim().toLowerCase() === displayPlan.name.toLowerCase()
    );
    const plan = matchingNamePlans.find(
      (candidate) => Number(candidate?.plan_amount) === displayedAmount
    );

    if (!plan) {
      console.error(
        `No ${displayPlan.name} ITR plan found for ₹${displayPlan.price}.`
      );
      onBook(displayPlan.key);
      return;
    }

    trackPlanClick(plan);

    const profileUrl = `${process.env.PUBLIC_URL}/itr-profile`;
    if (getUserId() == null) {
      setItemLocal('pid', plan);
      localStorage.setItem('isGuest', 1);
      beginItrSignupJourney(plan);
      loginRedirectGuest('itr', `${window.location.origin}${profileUrl}`);
      return;
    }

    setItemLocal('pid', plan);
    navigate(profileUrl);
  };

  return (
    <section className="pricing-section" id="pricing">
      <div className="container">
        <div className="pricing-header fade-up">
          <div className="section-label tw-text-[0.72rem]">Transparent Pricing</div>
          <div className="pricing-tagline tw-text-[0.78rem]"><Icon name="file" /> Expert Guidance - Accurate Filing</div>
          <h2 className="section-title tw-text-3xl md:tw-text-4xl lg:tw-text-5xl">Fintoo ITR Rate Card 2026</h2>
        </div>
        <div className="pricing-grid">
          {displayPlans.map((plan) => (
            <PlanCard
              key={plan.key}
              plan={plan}
              onBook={enablePlanPurchase ? purchasePlan : onBook}
              purchaseEnabled={enablePlanPurchase}
            />
          ))}
        </div>
        <div className="pricing-trust fade-up">
          <div className="pricing-trust-track">
            {[...trustBadges, ...trustBadges].map(([icon, label], index) => (
              <span className="tw-text-[0.8rem]" key={`${label}-${index}`}><Icon name={icon} /> {label}</span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function PlanCard({ plan, onBook, purchaseEnabled }) {
  return (
    <article className={`plan-card${plan.popular ? ' popular' : ''} fade-up`}>
      {plan.popular && <div className="popular-badge tw-text-[0.72rem]"><Icon name="star" fill /> Most Popular</div>}
      <div className="plan-header">
        <div className="plan-label tw-text-[0.65rem]">{plan.label}</div>
        <div className="plan-name tw-text-[2rem]">{plan.name}</div>
        <div className="plan-subtitle tw-text-[0.8rem]">{plan.subtitle}</div>
        <div className="plan-price-wrap">
          <div className="plan-price-box">
            <span className="plan-price-actual tw-text-[1.8rem]">₹ {plan.price}</span>
            {/* <span className="plan-price-original tw-text-[0.75rem]">{plan.originalPrice}</span> */}
            <span className="plan-price-label tw-text-[0.68rem]">Rates exclude GST @ 18%</span>
          </div>
          {/* <div className="plan-savings tw-text-[0.72rem]">{plan.savings}</div> */}
        </div>
      </div>
      <div className="plan-body">
        <div className="plan-inclusions-label tw-text-[0.65rem]">Inclusions</div>
        <ul className="plan-features">{plan.features.map((feature) => <li className="tw-text-[0.82rem]" key={feature}>{feature}</li>)}</ul>
        <button type="button" className={`btn-plan ${plan.buttonClass} tw-text-[0.88rem]`} onClick={() => onBook(plan)}>
          <Icon name={purchaseEnabled ? 'rupee' : 'calendar'} />{' '}
          {purchaseEnabled ? 'Buy Now' : `Get Started with ${plan.name}`}
        </button>
      </div>
    </article>
  );
}
