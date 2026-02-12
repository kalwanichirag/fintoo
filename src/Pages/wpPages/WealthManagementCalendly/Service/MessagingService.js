import { FINTOO_BASE_API_URL } from "../../../constants";

export const SendWsappMsgFile = async (payloadData) => {
    const payload = {
        "mobile": payloadData.mobile,
        "whatsapp_msg": payloadData.whatsapp_msg,
        "whatsapp_file_msg": payloadData.whatsapp_file_msg,
        "file_name": payloadData.file_name,
        "file_path": payloadData.file_path
    };
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

    // const payload = {
    //     "userdata": { "to": payloadData.email },
    //     "subject": payloadData.subject,
    //     "template": payloadData.templateName,
    //     "attachment": payloadData.attachment,
    //     "contextvar": payloadData.contextvar
    // };

    // try {
    //     const response = await fetch(FINTOO_BASE_API_URL + "restapi/sendmail/", {
    //         method: 'POST',
    //         body: JSON.stringify(payload),
    //     });
    //     if (response.ok) {
    //         const result = await response.json();
    //         if (result.error_code === "0") {
    //             return true
    //         } else {
    //             return false
    //         }
    //     } else {
    //         return false
    //     }
    // } catch (error) {
    //     console.error('SendMailFile', error);
    //     return false
    // }
};