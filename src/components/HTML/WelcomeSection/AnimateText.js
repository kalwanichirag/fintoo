import { useEffect, useRef } from "react";
import "./animate-text.css";

const AnimationText = () => {
  const timer = useRef();
  const pRef = useRef();
  

  useEffect(() => {
    var a = [
      'Need advice on goals ',
      'Looking for advice on personal tax ',
      'I need advice on investment ',
      'Help me with money management ',
    ];
    var i = 0;
    var txt = 0;
    var t = setInterval(function () {
      
      if(i == 0) {
        pRef.current.innerHTML = '';
      }
      if (i == a[txt].length) {
        i = -10;
        txt++;
      }
      if (txt == a.length) {
        txt = 0;
      }
      if(i > -1) {
        pRef.current.innerHTML = pRef.current.innerHTML + a[txt][i];
      }
      i++;
    }, 100);
    // timer.current = t;
    return () => {
      clearInterval(t);
      i = 0;
      txt = 0;
      
    };
  }, []);

  return (
    <p
      className="animate-text-mxhshyy7"
      ref={pRef}
    ></p>
  );
};
export default AnimationText;
