import React, { useState, useEffect } from "react";
import ReactApexChart from "react-apexcharts";
import moment from "moment";
import { GetSchemeDetails } from "../../../../FrappeIntegration-Services/services/investment-api/investmentService";
import { getUserId } from "../../../../common_utilities";
import HideHeader from "../../../HideHeader";
import HideFooter from "../../../HideFooter";
import { useLocation } from "react-router-dom";

const numberFormat = (value) =>
    new Intl.NumberFormat("en-IN", { currency: "INR" }).format(value);

const ApexChartsPage = () => {
    const { search } = useLocation();
    const params = new URLSearchParams(search);
    const schemecode = params.get("schemecode");

    const userID = getUserId();

    const [Overview, setOverview] = useState(null); // Overview.graph_data will be formatted {x:ts,y:num}
    const [series, setSeries] = useState([]);
    const [selection, setSelection] = useState("six_month"); // default view
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(false);

    const options = {
        chart: {
            id: "area-datetime",
            type: "area",
            width: "100%",
            height: 350,
            toolbar: { show: false },
            animations: {
                enabled: true,
                easing: "easeinout",
                speed: 800,
                animateGradually: { enabled: true, delay: 150 },
                dynamicAnimation: { enabled: true, speed: 350 },
            },
        },
        annotations: {
            yaxis: [{ borderColor: "#999", label: { show: true, text: "", style: { color: "#fff", background: "#00E396" } } }],
            xaxis: [{ borderColor: "#999", label: { show: true, text: "", style: { color: "#fff", background: "#775DD0" } } }],
        },
        dataLabels: { enabled: false },
        markers: { size: 0, style: "hollow" },
        xaxis: { type: "datetime", tickAmount: 6 },
        tooltip: { x: { format: "dd-MM-yyyy" } },
    };

  // fetch + format graph_data into { x: <ms>, y: <number> }
  const fetchData = async () => {
    if (!schemecode) {
      console.error("No schemecode found in URL");
      setError(true);
      return;
    }

    setIsLoading(true);
    setError(false);
    try {
      const res = await GetSchemeDetails({ scheme_code: schemecode });
      if (res.message === "success" && res.data?.Overview) {
        const raw = res.data.Overview.graph_data || [];
        // const raw = [
        //     { "nav_date": "2022-01-17", "nav_rs": 10.12 },
        //     { "nav_date": "2022-05-18", "nav_rs": 100.35 },
        //     { "nav_date": "2022-10-19", "nav_rs": 99.98 },
        //     { "nav_date": "2023-01-20", "nav_rs": 100.25 },
        //     { "nav_date": "2023-05-21", "nav_rs": 100.50 },
        //     { "nav_date": "2023-10-22", "nav_rs": 100.18 },
        //     { "nav_date": "2024-05-23", "nav_rs": 100.40 },
        //     { "nav_date": "2024-10-24", "nav_rs": 99.95 },
        //     { "nav_date": "2025-05-25", "nav_rs": 100.10 },
        //     { "nav_date": "2025-10-26", "nav_rs": 100.28 }
        //   ]
          

        const formattedData = raw
          .map((item) => {
            // support different shapes but prefer nav_date/nav_rs
            const dateStr = item.nav_date ?? item.x;
            const val = item.nav_rs ?? item.y;

            if (!dateStr || val === undefined || val === null) return null;
            // parse date string to timestamp. Provided format in your sample is YYYY-MM-DD
            const ts = moment(dateStr, "YYYY-MM-DD", true).isValid()
              ? moment(dateStr, "YYYY-MM-DD").valueOf()
              : Date.parse(dateStr); // fallback

            if (!ts || Number.isNaN(Number(val))) return null;
            return { x: ts, y: Number(val) };
          })
          .filter(Boolean)
          // optional: sort ascending by timestamp (Apex prefers ascending timestamps)
          .sort((a, b) => a.x - b.x);

        setOverview({
          ...res.data.Overview,
          graph_data: formattedData,
        });

        // initial series will be set by the effect below that listens to Overview + selection
      } else {
        console.error("Unexpected response:", res);
        setError(true);
      }
    } catch (e) {
      console.error("fetchData error:", e);
      setError(true);
    } finally {
      setIsLoading(false);
    }
  };

  // fetch when component mounts or schemecode changes
  useEffect(() => {
    fetchData();
  }, [schemecode]);

  // helper: compute cutoff timestamp for a timeline
  const getCutoff = (timeline) => {
    switch (timeline) {
      case "three_month":
        return moment().subtract(3, "month").valueOf();
      case "six_month":
        return moment().subtract(6, "month").valueOf();
      case "one_year":
        return moment().subtract(1, "year").valueOf();
      case "three_year":
        return moment().subtract(3, "year").valueOf();
      case "five_year":
        return moment().subtract(5, "year").valueOf();
      default:
        return 0;
    }
  };

  // Recompute series whenever Overview or selection changes.
  // This guarantees the chart always reflects the current selection and the latest fetched data.
  useEffect(() => {
    if (!Overview?.graph_data) return;

    const cutoff = getCutoff(selection);
    // if cutoff is 0 (default/fallback) we keep all data
    const filtered =
      cutoff === 0 ? Overview.graph_data : Overview.graph_data.filter((p) => p.x >= cutoff);

    // If filtered is empty, we still set an empty series (Apex will render nothing)
    setSeries([{ name: "NAV", data: filtered }]);

    // Debug logs — remove if not needed
  }, [Overview, selection]);

  // clicking button only sets selection; effect above updates series
  const updateData = (timeline) => {
    setSelection(timeline);
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Something went wrong!</div>;
  if (!Overview) return <div>No data available</div>;

    return (
        <div className="m-4">
            <HideHeader />
            <div id="chart" className="Spline custom-spline-chart ">
                <div className="toolbar mb-4" style={{ display: "flex", justifyContent: "space-between" }}>
                    <div>
                        <div className="d-block d-md-none mobile-lines" style={{ float: "left", color: "gray", fontWeight: "900" }}>
                            <div className="pt-0">
                                Date: {moment(Overview.nav_date).format("DD/MM/YYYY")} | NAV: {numberFormat(Overview.navrs)}
                            </div>
                        </div>

                        <div className="d-none d-md-block">
                            <span style={{ float: "left", color: "gray", fontWeight: "900" }}>
                                Date: {Overview.nav_date ? moment(Overview.nav_date).format("DD/MM/YYYY") : moment(Overview.launch_date).format("DD/MM/YYYY")}
                                <span className="DiffLine"></span> NAV: {numberFormat(Overview.navrs)}
                            </span>
                        </div>
                    </div>

                    <div>
                        {["three_month", "six_month", "one_year", "three_year", "five_year"].map((t) => (
                            <button
                                key={t}
                                onClick={() => updateData(t)}
                                className={`chart-button-st ${selection === t ? "active" : ""}`}
                            >
                                {t === "three_month" ? "3M" : t === "six_month" ? "6M" : t === "one_year" ? "1Y" : t === "three_year" ? "3Y" : "5Y"}
                            </button>
                        ))}
                    </div>
                </div>

                <div id="chart-timeline mt-4">
                    <ReactApexChart options={options} series={series} type="area" height={350} />
                </div>
            </div>
            <HideFooter />
        </div>
    );
};

export default ApexChartsPage;
