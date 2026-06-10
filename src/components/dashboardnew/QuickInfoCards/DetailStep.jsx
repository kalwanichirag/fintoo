import { useState, useEffect } from "react";
import { updateBasicDetails } from "../../../FrappeIntegration-Services/services/user-management-api/userApiService";
import commonEncode from "../../../commonEncode";

export default function DetailsStep({
  members,
  selectedMember,
  setSelectedMember,
  onClose,
  onNext,
  errorMessage,
  isLoading,
}) {
  const [pan, setPan] = useState("");
  const [mobile, setMobile] = useState("");
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setPan(selectedMember?.pan || "");
    setMobile(selectedMember?.mobile || "");
    setErrors({});
  }, [selectedMember]);

  const validate = () => {
    const newErrors = {};

    if (!pan) newErrors.pan = "PAN required";
    else if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(pan))
      newErrors.pan = "Invalid PAN";

    if (!mobile) newErrors.mobile = "Mobile required";
    else if (!/^[0-9]{10}$/.test(mobile))
      newErrors.mobile = "Invalid mobile";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleContinue = async () => {
    if (!validate()) return;

    const panChanged = pan !== selectedMember?.pan;
    const mobileChanged = mobile !== selectedMember?.mobile;

    try {
      if (panChanged || mobileChanged) {
        setSaving(true);

        await updateBasicDetails({
          pan: pan,
          mobile: mobile,
          user_id: selectedMember?.id, // important
        });
      }

      const updatedMember = {
        ...selectedMember,
        pan,
        mobile,
      };

      try {
        const storedMembers = JSON.parse(
          commonEncode.decrypt(localStorage.getItem("member")) || "[]"
        );
        const nextMembers = storedMembers.map((member) =>
          String(member?.id) === String(updatedMember?.id)
            ? { ...member, pan, mobile }
            : member
        );
        localStorage.setItem(
          "member",
          commonEncode.encrypt(JSON.stringify(nextMembers))
        );
      } catch (storageError) {
        console.error("Failed to persist member cache:", storageError);
      }

      setSelectedMember(updatedMember);
      onNext(updatedMember);
    } catch (err) {
      console.error("Update failed:", err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <h2 className="tw-text-lg tw-font-semibold tw-text-slate-800 tw-mb-6">
        Verify to View CIBIL Score
      </h2>

      {errorMessage && (
        <p className="tw-mb-4 tw-text-sm tw-text-red-500">{errorMessage}</p>
      )}

      <div className="tw-space-y-5">
        <select
          value={selectedMember?.id != null ? String(selectedMember.id) : ""}
          onChange={(e) => {
            const next = members.find(
              (m) => String(m.id) === e.target.value
            );
            setSelectedMember(next || null);
          }}
          className="tw-w-full tw-rounded-xl tw-border tw-border-slate-300 tw-px-4 tw-py-3"
        >
          {!members.length && (
            <option value="" disabled>
              No members found
            </option>
          )}
          {members.map((m) => (
            <option key={m.id} value={m.id}>
              {m.name}
            </option>
          ))}
        </select>

        {/* PAN input editable */}
        <div>
          <input
            type="text"
            value={pan}
            onChange={(e) => setPan(e.target.value.toUpperCase())}
            placeholder="Enter PAN"
            className="tw-w-full tw-rounded-xl tw-border tw-border-slate-300 tw-px-4 tw-py-3"
          />
          {errors.pan && (
            <p className="tw-text-red-500 tw-text-sm">{errors.pan}</p>
          )}
        </div>

        {/* Mobile editable */}
        <div>
          <input
            type="text"
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
            placeholder="Enter Mobile Number"
            className="tw-w-full tw-rounded-xl tw-border tw-border-slate-300 tw-px-4 tw-py-3"
          />
          {errors.mobile && (
            <p className="tw-text-red-500 tw-text-sm">{errors.mobile}</p>
          )}
        </div>
      </div>

      <div className="tw-mt-8 tw-flex tw-gap-3">
        <button
          onClick={onClose}
          className="tw-flex-1 tw-rounded-xl tw-border tw-py-3"
        >
          Cancel
        </button>

       <button
  onClick={handleContinue}
  disabled={isLoading || saving}
  className="tw-flex-1 tw-rounded-xl tw-bg-fintoo-blue tw-py-3 tw-text-white"
>
  {saving || isLoading ? "Processing..." : "Continue"}
</button>
      </div>
    </>
  );
}
