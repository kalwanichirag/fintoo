import * as toastr from "toastr";

const socket = new WebSocket("wss://webvwlive.finvu.in/consentapi");

// socket.onclose = function(event) {
//   if (event.wasClean) {
//   } else {
//     console.error('Connection abruptly closed');
//   }
//   toastr.options.positionClass = "toast-bottom-left";
//   toastr.error('Session Expired!');
//   setTimeout(() => {
//     window.location.reload();
//   }, 5000);
// };

export default socket;

export function onMessageHandler(event) {
  
  const data = JSON.parse(event.data);
  return data;
}