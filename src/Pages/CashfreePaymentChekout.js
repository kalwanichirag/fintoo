import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { load } from "@cashfreepayments/cashfree-js";

const CashfreeCheckoutPage = () => {
  const [searchParams] = useSearchParams();

  const [cashfree, setCashfree] = useState(null);
  const [paymentMessage, setPaymentMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  const sessionId = searchParams.get("session_id");
  const paymentType = searchParams.get("type"); 

  useEffect(() => {
    const init = async () => {
      try {
        const cf = await load({
          mode: process.env.REACT_APP_MODE == "live" ? "production" : "sandbox",
        });
        setCashfree(cf);
      } catch (err) {
        console.error("Cashfree SDK failed to load", err);
        setPaymentMessage("Failed to load payment SDK");
        setMessageType("error");
      }
    };

    init();
  }, []);

  useEffect(() => {
    const startCheckout = async () => {
      if (!cashfree) return;

      if (!sessionId) {
        setPaymentMessage("Missing session ID in URL");
        setMessageType("error");
        return;
      }

      try {
        let result;

        if (paymentType === "onetime") {
          result = await cashfree.checkout({
            paymentSessionId: sessionId,
            redirectTarget: "_self",
          });
        } else if (paymentType === "subscription") {
          result = await cashfree.subscriptionsCheckout({
            subsSessionId: sessionId,
            redirectTarget: "_self",
          });
        } else {
          setPaymentMessage("Invalid payment type");
          setMessageType("error");
          return;
        }

        if (result?.error) {
          setPaymentMessage(result.error.message);
          setMessageType("error");
        }
      } catch (error) {
        setPaymentMessage("Something went wrong during checkout");
        setMessageType("error");
      }
    };

    startCheckout();
  }, [cashfree, sessionId, paymentType]);

  return (
    <div>
      {!paymentMessage && <p>Redirecting to payment...</p>}

      {paymentMessage && (
        <div
          className={
            messageType === "error"
              ? "alert alert-danger"
              : "alert alert-success"
          }
        >
          {paymentMessage}
        </div>
      )}
    </div>
  );
};

export default CashfreeCheckoutPage;