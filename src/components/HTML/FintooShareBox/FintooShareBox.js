import { ReactComponent as LinkedinIcon } from "../../../Assets/Images/shareicons/linkedin.svg";
import { ReactComponent as CopyIcon } from "../../../Assets/Images/copy_icon.svg";
import { ReactComponent as TwitterIcon } from "../../../Assets/Images/shareicons/twitter.svg";
import { ReactComponent as WhatsappIcon } from "../../../Assets/Images/shareicons/whatsapp.svg";
import shareBox from "./style.module.css";
import { ToastContainer, toast } from "react-toastify";




function copy() {
    const el = document.createElement("input");
    el.value = window.location.href;
    document.body.appendChild(el);
    el.select();
    document.execCommand("copy");
    document.body.removeChild(el);

    toast.success("Url Copied Successfully!", {
      position: toast.POSITION.BOTTOM_LEFT,
      autoClose: 2000,
    });
  }
  
const FintooShareBox = () => {
    var url = window.location.href;
    return (
        <div
            className={shareBox.parent}
        >
            <a
                // href="https://www.linkdln.in/   "
                className={shareBox.link}
                rel="nofollow"
                target="_blank"
                onClick={copy}
            >
                <ToastContainer />
                <CopyIcon style={{cursor : "pointer"}}  width="35px" height="35px" />
            </a>
            {/* <a
                 href="https://www.linkdln.in/"
                className={shareBox.link}
                rel="nofollow"
                target="_blank"
            >
                <LinkedinIcon width="35px" height="35px" />
               
            </a> */}
            <a
                href={`https://twitter.com/intent/tweet?text=${url}`}
                className={shareBox.link}
                rel="nofollow"
                target="_blank"
            >
                <TwitterIcon width="35px" height="35px" />
            </a>
            <a
                href={
                    "https://api.whatsapp.com/send?text=" +
                    encodeURI(url)
                  }
                className={shareBox.link}
                rel="nofollow"
                target="_blank"
                data-action="share/whatsapp/share"
            >
                <WhatsappIcon width="35px" height="35px" />
            </a>
        </div>
    );
}
export default FintooShareBox;