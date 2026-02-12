import { Fetch_External_User_Loan_Details } from
  "../../../FrappeIntegration-Services/services/financial-planning-api/liabilities";
import { DATA_BELONGS_TO } from "../../../constants";

export async function fetchCibilUsingEquifax(member, is_plan = false) {
  const payload = {
    user_name: member.name,
    user_id: member.liability_member_id || member.id,
    user_pan: member.pan,
    user_dob: String(member.dob),
    data_belongs_to: DATA_BELONGS_TO,
    user_loan_for: member.liability_member_id || member.id,
    user_mobile: Number(member.mobile),
    ...(is_plan ? {} : { is_plan }),
  };

  return Fetch_External_User_Loan_Details(payload);
}
