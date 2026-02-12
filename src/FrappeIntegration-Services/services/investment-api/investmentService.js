import apiClient from "../apiClient"
import { CrmAPIEndPoints, ExternalAPIListEndpoints, investmentEndpoints, userManagementEndpoints } from "../../../constants"
import { res } from "react-email-validator";


// get_scheme_list
export const GetSchemeList = async (payload) => {
    try {
        const url = `${investmentEndpoints.GET_SCHEME_LIST_API_URL}`;
        const response = await apiClient(url, {
            method: 'POST',
            body: JSON.stringify(payload)
        });

        return response;
    } catch (error) {
        throw error;
    }
};

// get_mf_categories
export const GetMfCategories = async (payload) => {
    try {
        const url = `${investmentEndpoints.GET_MF_CATEGORIES}`;
        const response = await apiClient(url, {
            method: 'POST',
            body: JSON.stringify(payload)
        });

        return response;
    } catch (error) {
        throw error;
    }
};

// get_scheme_details
export const GetSchemeDetails = async (payload) => {
    try {
        const url = `${investmentEndpoints.GET_SCHEME_DETAILS_API_URL}`;
        const response = await apiClient(url, {
            method: 'POST',
            body: JSON.stringify(payload)
        });
       
        return response;
    } catch (error) {
        throw error;
    }
};

// get_cart_details
export const GetCartDetails = async (payload) => {
    try {
        const url = `${investmentEndpoints.GET_CART_DETAILS}`;
        const response = await apiClient(url, {
            method: 'POST',
            body: JSON.stringify(payload)
        });

        return response;
    } catch (error) {
        throw error;
    }
};

// update_cart
export const UpdateCartDetails = async (payload) => {
    try {
        const url = `${investmentEndpoints.UPDATE_CART_API_URL}`;
        const response = await apiClient(url, {
            method: 'POST',
            body: JSON.stringify(payload)
        });

        return response;
    } catch (error) {
        throw error;
    }
};

// add_to_cart
export const AddToCartDetails = async (payload) => {
    try {
        const url = `${investmentEndpoints.ADD_TO_CART_API_URL}`;
        const response = await apiClient(url, {
            method: 'POST',
            body: JSON.stringify(payload)
        });

        return response;
    } catch (error) {
        throw error;
    }
};

export const AddSwitchToCartDetails = async (payload) => {
    try {
        const url = `${investmentEndpoints.ADD_SWITCH_TO_CART_API_URL}`;
        const response = await apiClient(url, {
            method: 'POST',
            body: JSON.stringify(payload)
        });

        return response;
    } catch (error) {
        throw error;
    }
};

// add_to_wishlist
export const AddToWishlist = async (payload) => {
    try {
        const url = `${investmentEndpoints.ADD_TO_WISHLIST}`;
        const response = await apiClient(url, {
            method: 'POST',
            body: JSON.stringify(payload)
        });

        return response;
    } catch (error) {
        throw error;
    }
};
// fetch_wishlist
export const FetchMfWishlist = async (payload) => {
    try {
        const url = `${investmentEndpoints.FETCH_MF_WISHLIST}`;
        const response = await apiClient(url, {
            method: 'POST',
            body: JSON.stringify(payload)
        });

        return response;
    } catch (error) {
        throw error;
    }
};
// DELETE_FROM_WISHLIST
export const DeleteFromWishlist = async (payload) => {
    try {
        const url = `${investmentEndpoints.DELETE_FROM_WISHLIST}`;
        const response = await apiClient(url, {
            method: 'POST',
            body: JSON.stringify(payload)
        });

        return response;
    } catch (error) {
        throw error;
    }
};

// get_amc_list
export const GetAMCList = async () => {
    try {
        const url = `${investmentEndpoints.GET_AMC_LIST_API_URL}`;
        const response = await apiClient(url, {
            method: 'GET',
        });

        return response;
    } catch (error) {
        throw error;
    }
};

export const getNomineeDetails = async (payload) => {
    try {
        const response = await apiClient(investmentEndpoints.GET_NOMINEE_DETAILS, {
            method: 'POST',
            body: JSON.stringify(payload)
        });

        return response;
    } catch (error) {
        throw error;
    }
};


export const getOtherInvestments = async (payload) => {
  try {
    const queryParams = new URLSearchParams();

    queryParams.append("user_id", payload.user_id);

    if (payload.data_belongs_to) {
      queryParams.append("data_belongs_to", payload.data_belongs_to);
    }

    if (payload.grouped_data) {
      queryParams.append("grouped_data", payload.grouped_data);
    }

    if (payload.user_asset_id) {
      queryParams.append("user_asset_id", payload.user_asset_id);
    }

    // Build base URL
    let url = `${investmentEndpoints.GET_OTHER_INVESTMENTS}?${queryParams.toString()}`;

    // Append user_asset_for manually (to preserve commas)
    if (payload.user_asset_for) {
      url += `&user_asset_for=${payload.user_asset_for}`;
    }

    const response = await apiClient(url, { method: "GET" });
    return response;
  } catch (error) {
    throw error;
  }
};


export const saveUserAssetDetails = async (payload) => {
    try {
        const response = await apiClient(investmentEndpoints.ADVISORY_ADD_ASSETS_API, {
            method: 'POST',
            body: JSON.stringify(payload)
        });

        return response;
    } catch (error) {
        throw error;
    }
};

export const updateUserAssetDetails = async (payload) => {
    try {
        const response = await apiClient(investmentEndpoints.ADVISORY_UPDATE_ASSETS_API, {
            method: 'PUT',
            body: JSON.stringify(payload)
        });

        return response;
    } catch (error) {
        throw error;
    }
};

export const deleteUserAssetDetails = async (payload) => {
    try {
        const response = await apiClient(investmentEndpoints.DELETE_OTHER_INVESTMENTS, {
            method: 'POST',
            body: JSON.stringify(payload)
        });

        return response;
    } catch (error) {
        throw error;
    }
};

export const getMfSummaryPortfolio = async (payload) => {
    try {
        const response = await apiClient(investmentEndpoints.GET_MF_SUMMARY_PORTFOLIO, {
            method: 'POST',
            body: JSON.stringify(payload)
        });

        return response;
    } catch (error) {
        throw error;
    }
};
export const getMfPerformance = async (payload) => {
    try {
        const response = await apiClient(investmentEndpoints.GET_MF_PERFORMANCE, {
            method: 'POST',
            body: JSON.stringify(payload)
        });

        return response;
    } catch (error) {
        throw error;
    }
};


export const getMfDetailedPortfolio = async (payload) => {
    try {
        const response = await apiClient(investmentEndpoints.GET_MF_DETAILED_PORTFOLIO, {
            method: 'POST',
            body: JSON.stringify(payload)
        });

        return response;
    } catch (error) {
        throw error;
    }
};

export const getDashboardDataPortfolio = async (payload) => {
    try {
        const response = await apiClient(investmentEndpoints.GET_DASHBOARD_DATA, {
            method: 'POST',
            body: JSON.stringify(payload)
        });

        return response;
    } catch (error) {
        throw error;
    }
};

export const getTransactionsHistory = async (payload) => {
    try {
        const response = await apiClient(investmentEndpoints.DMF_GET_MF_TRANSACTIONS_API_URL, {
            method: 'POST',
            body: JSON.stringify(payload)
        });

        return response;
    } catch (error) {
        throw error;
    }
};

export const addNomineeDetails = async (payload) => {
    try {
        const response = await apiClient(investmentEndpoints.ADD_NOMINEE_DETAILS, {
            method: 'POST',
            body: JSON.stringify(payload)
        });

        return response;
    } catch (error) {
        throw error;
    }
};


export const updateNomineeDetails = async (payload) => {
    try {
        const response = await apiClient(investmentEndpoints.UPDATE_NOMINEE_DETAILS, {
            method: 'POST',
            body: JSON.stringify(payload)
        });

        return response;
    } catch (error) {
        throw error;
    }
};

export const GetUsEquityShares = async () => {
    try {
        const url = `${ExternalAPIListEndpoints.GET_US_EQUITY_SHARES}`;
        const response = await apiClient(url, {
            method: 'GET',
        });

        return response;
    } catch (error) {
        throw error;
    }
};

export const DeleteCart = async (payload) => {
    try {
        const response = await apiClient(investmentEndpoints.DELETE_CART_FUND, {
            method: 'POST',
            body: JSON.stringify(payload)
        });

        return response;
    } catch (error) {
        throw error;
    }
};


export const PlaceOrder = async (payload) => {
    try {
        const response = await apiClient(investmentEndpoints.PLACE_ORDER, {
            method: 'POST',
            body: JSON.stringify(payload)
        });

        return response;
    } catch (error) {
        throw error;
    }
};

export const SuccessOrder = async (payload) => {
    try {
        const response = await apiClient(investmentEndpoints.SUCCESS_ORDER, {
            method: 'POST',
            body: JSON.stringify(payload)
        });

        return response;
    } catch (error) {
        throw error;
    }
};

export const Cancelorder = async (payload) => {
    try {
        const response = await apiClient(investmentEndpoints.CANCEL_ORDER, {
            method: 'POST',
            body: JSON.stringify(payload)
        });

        return response;
    } catch (error) {
        throw error;
    }
};

export const GetAssetAllocation = async (payload) => {
    try {
        const response = await apiClient(investmentEndpoints.GET_ASSET_ALLOCATION, {
            method: 'POST',
            body: JSON.stringify(payload)
        });

        return response;
    } catch (error) {
        throw error;
    }
};


export const DeleteBankDetails = async (payload) => {
    try {
        const response = await apiClient(userManagementEndpoints.DELETE_BANK_DETAILS, {
            method: 'POST',
            body: JSON.stringify(payload)
        });

        return response;
    } catch (error) {
        throw error;
    }
};


export const MaintenanceStatus = async () => {
    try {
        const url = `${CrmAPIEndPoints.MAINTENANCE_DETAILS}`;
        const response = await apiClient(url, {
            method: 'GET',
        });

        return response;
    } catch (error) {
        throw error;
    }
};

export const AddTransaction = async (payload) => {
    try {
        const response = await apiClient(investmentEndpoints.ADD_TRANSACTION, {
            method: 'POST',
            body: JSON.stringify(payload)
        });

        return response;
    } catch (error) {
        throw error;
    }
};


export const AddSwitchTransaction = async (payload) => {
    try {
        const response = await apiClient(investmentEndpoints.ADD_SWITCH_TRANSACTION, {
            method: 'POST',
            body: JSON.stringify(payload)
        });

        return response;
    } catch (error) {
        throw error;
    }
};

export const SwitchOrderEntry = async (payload) => {
    try {
        const response = await apiClient(investmentEndpoints.SWITCH_ORDER_ENTRY, {
            method: 'POST',
            body: JSON.stringify(payload)
        });

        return response;
    } catch (error) {
        throw error;
    }
};

