import Cookies from "js-cookie";
import { DATA_BELONGS_TO } from "../../constants";
import { clearLocalStorageExcept } from "../../Utils/storage";

const apiClient = async (url, options = {}, externalToken) => {
  try {
    const token = externalToken ? externalToken : Cookies.get("token");

    const isFormData = options.body instanceof FormData;
    let body = options.body;

    if (body && !isFormData) {
      try {
        let parsedBody = JSON.parse(body);

        if (!parsedBody.data_belongs_to) {
          parsedBody.data_belongs_to = DATA_BELONGS_TO;
        }

        body = JSON.stringify(parsedBody);
      } catch (err) {
        console.warn("apiClient: failed to parse body JSON", err);
      }
    }

    const headers = {
      ...(isFormData ? {} : { "Content-Type": "application/json" }),
      ...(options.headers || {}),
      ...(token ? { Authorization: `token ${token}` } : {}),
    };

    const response = await fetch(url, {
      ...options,
      headers,
      body,
    });

    const responseObj = await response.json();

    if (token &&
      (
        responseObj?.exc_type === "AuthenticationError" ||
        responseObj?.exc_type === "PermissionError" ||
        responseObj?.exc_type === "SessionStopped" ||
        responseObj?.status_code === 401 ||
        response.status === 401
      )
    ) {
      Cookies.remove("token");
      Cookies.remove("user_data");
      clearLocalStorageExcept(["leadData"]);
      localStorage.removeItem("sky");
      localStorage.setItem("logoutNow", Date.now().toString());

      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
      return;
    }

    return responseObj;
  } catch (error) {
    return {
      status_code: "500",
      message: "Internal client error",
      errors: { network: error.message },
      data: {},
      error: true,
    };
  }
};

export default apiClient;
