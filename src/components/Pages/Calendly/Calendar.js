import { useEffect, useState } from "react";
import { InlineWidget, useCalendlyEventListener } from "react-calendly";
import { useSelector } from "react-redux";
import { calendlyCallbackFun } from "../../CalendlyCallback";
import { fetchData } from "../../../common_utilities";
import { fetchUserProfileDetails } from "../../../FrappeIntegration-Services/services/user-management-api/userApiService";
import { getUserId } from "../../../common_utilities";

const Calendar = ({ isWP, eventCode, url, serviceName, planId, extraParams = {}, SetShow, calendlyCallbackFunMFSnippet, addIncomSlabAndComment, itrPage , pageName}) => {
const [userLeadId, setUserLeadId] = useState(null);
        
          useEffect(() => {
            const getUserLead = async () => {
              const res = await fetchUserProfileDetails(getUserId());
              console.log(res, "userleadid response");
              setUserLeadId(res?.data?.user_lead_id);
            };
        
            getUserLead(); // ✅ call it
          }, []);
        
          useEffect(() => {
            if (!userLeadId) return;
        
            const loginWebEngage = () => {
              if (window.webengage) {
                webengage.user.login(userLeadId);
                console.log("WebEngage login done:", userLeadId);
              } else {
                setTimeout(loginWebEngage, 200); // retry every 200ms until SDK loads
              }
            };
        
            loginWebEngage();
          }, [userLeadId]);
  const leadData = useSelector(
    (state) => state.leadData
  );

  const loggedIn = useSelector((state) => state.loggedIn);

  const [prefillState, setPrefillState] = useState({
    email: '',
    name: '',
    location: '',
    customAnswers: {
      a2: '',
    },
  })

  useCalendlyEventListener({

    onEventScheduled: async (e) => {
      if (calendlyCallbackFunMFSnippet) {

        const r = await fetchData({
          url: e.data.payload.invitee.uri,
          method: "GET",
          headers: {
            Authorization:
              "Bearer eyJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL2F1dGguY2FsZW5kbHkuY29tIiwiaWF0IjoxNjQ4MjExMjQ0LCJqdGkiOiJmMmM1YWIwOC01N2ZiLTQ0YzAtODNjYy1lM2QxZWZhZGY2YzMiLCJ1c2VyX3V1aWQiOiI0ODVhZTAyZC02ZGNiLTQ1MjktODdiYi01MGY2NDE3NGI4ZWYifQ.5bIIwHH3DTn1Vp7Oj6hZlLkVIbI1q7jxqFogGaGkb1g",
          },
        });

        calendlyCallbackFunMFSnippet(r.resource.name, r.resource.email, r.resource.questions_and_answers[0].answer)
      } else {
        const r = await fetchData({
          url: e.data.payload.invitee.uri,
          method: "GET",
          headers: {
            Authorization:
              "Bearer eyJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL2F1dGguY2FsZW5kbHkuY29tIiwiaWF0IjoxNjQ4MjExMjQ0LCJqdGkiOiJmMmM1YWIwOC01N2ZiLTQ0YzAtODNjYy1lM2QxZWZhZGY2YzMiLCJ1c2VyX3V1aWQiOiI0ODVhZTAyZC02ZGNiLTQ1MjktODdiYi01MGY2NDE3NGI4ZWYifQ.5bIIwHH3DTn1Vp7Oj6hZlLkVIbI1q7jxqFogGaGkb1g",
          },
        });
        const mobileAnswer = r.resource.questions_and_answers.find(
          (q) => q.question === "Mobile Number"
        )?.answer;
        
        
        calendlyCallbackFun(
          pageName,
          {
          isWP: isWP,
          eventURL: e.data.payload.invitee.uri,
          eventURL2: e.data.payload.event.uri,
          eventType: eventCode,
          serviceName: serviceName,
          extraParams: extraParams,
          planId: planId,
          email: leadData.email,
          fullname: leadData.fullname,
          mobileNumber: itrPage ? mobileAnswer : leadData.mobile,
          loggedIn: loggedIn
        }, addIncomSlabAndComment, );
      }

      SetShow(true)
    },
  });

  useEffect(() => {
    setPrefillState(prev => ({
      ...prev, email: leadData.email, name: leadData.fullname, location: leadData.mobile,
      customAnswers: {
        ...prev.customAnswers, a2: '+91' + leadData.mobile
      }
    }))
  }, [leadData])

  return (
    <>
      <InlineWidget url={url} prefill={prefillState} />
    </>
  );
};
export default Calendar;
