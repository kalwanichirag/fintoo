import React from "react";
import { CountdownCircleTimer } from "react-countdown-circle-timer";
import moment from "moment";
import { useNavigate } from "react-router-dom";

const maxLimit = 300;

const timerProps = {
  isPlaying: true,
  size: 120,
  strokeWidth: 6,
};

export default function PaymentApprove() {

  const navigate = useNavigate();

  const redirectToPaymentFailed = () => {
    navigate(`${process.env.PUBLIC_URL}/direct-mutual-fund/PaymentFailed`);
    // props.confirmOrder()
  };

  return (
    <div
      style={{
        fontWeight: "700",
      }}
    >
      <CountdownCircleTimer
        {...timerProps}
        colors="#042b62"
        duration={maxLimit}
        initialRemainingTime={maxLimit}
        onComplete={() => {
          redirectToPaymentFailed();
        }}
      >
        {({ elapsedTime, color }) => (
          <span style={{ color : '#042b62' }}>
            {moment.utc((maxLimit - elapsedTime) * 1000).format("mm:ss")}
            <p style={{
                color
            }} className="text-center">Mins</p>
          </span>
        )}
      </CountdownCircleTimer>
    </div>
  );
}
