import { FINVU_WEBSOCKET_URL } from "../../../constants";
import { Link, useNavigate } from "react-router-dom";
import * as toastr from "toastr";

let socket = null;

try {
  if (window.location.pathname === "/money-management/track-bank-account") {
    socket = new WebSocket(FINVU_WEBSOCKET_URL);
    socket.onclose = function(event) {
      if (event.wasClean) {
      } else {
        console.error('Connection abruptly closed from Money Management Module');
      }
      toastr.options.positionClass = "toast-bottom-left";
      toastr.error('Session Expired!!!!!!');
      setTimeout(() => {
        window.location.reload();
      }, 5000);
    };
  }
} catch (error) {
  console.error("######## WebSocket connection failed #########", error);
  if (window.location.pathname === "/money-management/track-bank-account") {
    toastr.options.positionClass = "toast-bottom-left";
    toastr.error('Session Expired!!!!!!');
    setTimeout(() => {
      window.location.reload();
    }, 2000);
  }

}

export default socket;

export function onMessageHandler(event) {
  const data = JSON.parse(event.data);
  return data;
}