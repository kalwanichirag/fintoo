import { ToastContainer, toast } from "react-toastify";
import React, { useEffect, useRef } from "react";
import { connect } from "react-redux";

const FintooToast = (props) => {
  useEffect(() => {
    if (
      typeof props.toastMessage == "object" &&
      Object.keys(props.toastMessage).length > 0
    ) {
      toast.dismiss();
      switch (props.toastMessage.type) {
        case "success":
          toast.success(props.toastMessage.message, {
            position: toast.POSITION.BOTTOM_LEFT,
            autoClose: props.toastMessage.autoClose || 2000,
          });
          break;
        case "error":
          toast.error(props.toastMessage.message, {
            position: toast.POSITION.BOTTOM_LEFT,
            autoClose: props.toastMessage.autoClose || 2000,
          });
          break;
        case "info":
          toast.info(props.toastMessage.message, {
            position: toast.POSITION.BOTTOM_LEFT,
            autoClose: props.toastMessage.autoClose || 2000,
          });
          break;
      }
    }
  }, [props.toastMessage]);

  return <ToastContainer />;
};

const mapStateToProps = (state) => ({
  toastMessage: state.toastMessage,
});

export default connect(mapStateToProps)(FintooToast);
