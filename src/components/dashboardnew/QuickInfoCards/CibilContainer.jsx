import React, { useEffect, useState, useCallback, useRef } from "react";
import CibilScoreCard from "./CibilScoreCard";
import CibilDetailsModal from "./CibilDetailsModal";

const STORAGE_KEY = "cibil_report_v1";

export default function CibilContainer() {
  const [showModal, setShowModal] = useState(false);
  const [cibilData, setCibilData] = useState(null);
  const [scoreRefreshKey, setScoreRefreshKey] = useState(0);

  const hasHydrated = useRef(false);

  /* ---------------- HYDRATE ONCE ---------------- */
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed) {
          setCibilData(parsed);
        }
      }
    } catch (e) {
      console.error("Failed to hydrate CIBIL data", e);
    } finally {
      hasHydrated.current = true;
    }
  }, []);

  /* ---------------- PERSIST SAFELY ---------------- */
  useEffect(() => {
    if (!hasHydrated.current) return;

    if (cibilData) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cibilData));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [cibilData]);

  /* ---------------- HANDLERS ---------------- */
  const handleCheckCibil = useCallback(() => {
    setShowModal(true);
  }, []);

  const handleRefreshCibil = useCallback(() => {
    setShowModal(true);
  }, []);

  const handleSuccess = useCallback((data) => {
    if (!data) return;
    setCibilData(data);
    setScoreRefreshKey((prev) => prev + 1);
    setShowModal(false);
  }, []);

  const cardState = cibilData ? "filled" : "empty";

  return (
    <>
      <CibilScoreCard
        state={cardState}
        cibilResponse={cibilData}
        refreshKey={scoreRefreshKey}
        onCheckCibil={handleCheckCibil}
        onRefresh={handleRefreshCibil}
      />

      {showModal && (
        <CibilDetailsModal
          onClose={() => setShowModal(false)}
          onSuccess={handleSuccess}
        />
      )}
    </>
  );
}
