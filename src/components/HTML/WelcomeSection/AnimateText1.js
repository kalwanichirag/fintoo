import { useEffect, useRef } from "react";
import './animate-text.css';

const AnimationText = () => {

    const timer = useRef();

    useEffect(()=> {
        
        var count = document.querySelectorAll('.animate-text-mxhshyy7 span').length;
        var a = 0;
        var t = setInterval(function() {
            if(document.querySelector('.animate-text-mxhshyy7').style.visibility === 'hidden') {
                document.querySelector('.animate-text-mxhshyy7').style.visibility = 'visible';
            }
            var elements = document.querySelectorAll('.animate-text-mxhshyy7 span');
            for (var i = 0; i < elements.length; i++) {
                elements[i].classList.remove('active');
            }
            document.querySelectorAll('.animate-text-mxhshyy7 span')[a].classList.add('active');
            a++;
            if(a >= count) {
                a = 0;
            }
        }, 2000);
        // timer.current = t;
        return ()=> {
            clearInterval(t);
        }
    }, []);

    return (
        <p className="animate-text-mxhshyy7" style={{visibility: 'hidden'}}>
            <span className="active">Click here to start chatting...</span>
            <span>Need advice on goals</span>
            <span>Click here to start chatting...</span>
            <span>Looking for advice on personal tax</span>
            <span>Click here to start chatting...</span>
            <span>I need advice on investment</span>
            <span>Click here to start chatting...</span>
            <span>Help me with money management</span>
        </p>
    );
}
export default AnimationText;