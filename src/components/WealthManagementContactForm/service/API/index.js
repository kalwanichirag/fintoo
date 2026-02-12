import axios from "axios";

const callBackServiceUrl = process.env.REACT_APP_CONTACT_FORM;

export const sendContactData = async (contactData) => {
    try {
        const config = {
            headers: {
                "Content-Type": "application/json",
            },
        };

        const res = await axios.post(callBackServiceUrl, contactData, config);

        return res.data.error_code === "0"
    } catch (error) {
        console.log(error)
    }

}