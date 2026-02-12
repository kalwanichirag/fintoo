import { FINTOO_BASE_API_URL } from "../../../constants";

export const SendWsappMsgFile = async (payloadData) => {
    // const payload = {
    //     "mobile": payloadData.mobile,
    //     "whatsapp_msg": payloadData.whatsapp_msg,
    //     "whatsapp_file_msg": payloadData.whatsapp_file_msg,
    //     "file_name": payloadData.file_name,
    //     "file_path": payloadData.file_path
    // };
    // try {
    //     const response = await fetch(FINTOO_BASE_API_URL + "restapi/sendwhatsappmsgandfile/", {
    //         method: 'POST',
    //         // headers: myHeaders,
    //         body: JSON.stringify(payload),
    //     });
    //     if (response.ok) {

    //         return true
    //     } else {
    //         return false
    //     }
    // } catch (error) {
    //     console.error('SendWsappMsgFile', error);
    //     return false
    // }
};

export const SendMailFile = async (payloadData) => {

    const payload = {
        "userdata": { "to": payloadData.email },
        "subject": payloadData.subject,
        "template": payloadData.templateName,
        "attachment": payloadData.attachment,
        "contextvar": payloadData.contextvar
    };

    // try {
    //     const response = await fetch(FINTOO_BASE_API_URL + "restapi/sendmail/", {
    //         method: 'POST',
    //         headers: {
    //             'Content-Type': 'application/json',
    //         },
    //         body: JSON.stringify(payload),
    //     });

    //     if (response.ok) {
    //         const result = await response.json();
            
    //         // Check for different possible success indicators
    //         if (result.error_code === "0" || result.error_code === 0 || result.status === "success" || result.success === true) {
    //             return true;
    //         } else {
    //             console.error("API returned error code:", result.error_code, "Message:", result.message || result.error);
    //             return false;
    //         }
    //     } else {
    //         console.error("API request failed with status:", response.status);
    //         const errorText = await response.text();
    //         console.error("Error response:", errorText);
    //         return false;
    //     }
    // } catch (error) {
    //     console.error('SendMailFile error:', error);
    //     return false;
    // }
};