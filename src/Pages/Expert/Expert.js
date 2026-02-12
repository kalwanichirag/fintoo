import React, { useEffect, useRef, useState } from "react";
import ExpertHeader from "../../components/Expert/ExpertHeader/ExpertHeader";
import Styles from "./Style.module.css";
import ApplyWhiteBg from "../../components/ApplyWhiteBg";
import Expertrm from "../../components/Expert/ExpertRm/Expertrm";
import ExpertFilter from "../../components/Expert/ExpertFilter/ExpertFilter";
import ExpertRmDetails from "../../components/Expert/ExpertRmDetails/ExpertRmDetails";
import { BASE_API_URL, ADVISORY_GET_RM_LIST_API } from "../../constants";
import { apiCall, fetchData } from "../../common_utilities";
import TaxExpertRmDetails from "../../components/Expert/ExpertRmDetails/TaxExpertRmDetails";
import { useSearchParams } from "react-router-dom";

function Expert() {
  const [rmDetails, setRmDetails] = useState(0);
  const allDataRef = useRef([]);
  const [searchParams] = useSearchParams();
  const service = searchParams.get('service');

  useEffect(() => {
    document.body.classList.add("Expert-bg");
    // getrmdetailslist();
    return () => {
      document.body.classList.remove("Expert-bg");
    };
  }, []);

  const getrmdetailslist = async () => {
    try {
      // var payload = {
      //   url: ADVISORY_GET_RM_LIST_API,
      //   method: "get",
      // };

      const taxRMs = await apiCall(
        BASE_API_URL + '/restapi/getexpertlist/',
        {
          "plan_id": ["44"]
        },
        false,
        false
      );

      // allDataRef.current = d.data;
      allDataRef.current = taxRMs.data;
      // setRmDetails(d.data.length);
      setRmDetails(taxRMs.data.length);
    } catch (error) {
      console.log(error);
    }
  };

  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({});
  const handleChange = (v) => {
    setSearchTerm(v);
  };
  const handleFilter = (v) => {
    setFilters({ ...v });
  };
  return (
    <>
      <ApplyWhiteBg />
      <div className={`${Styles.ExpertSection}`}>
        <ExpertHeader
          handleChange={(v) => handleChange(v)}
          searchTerm={searchTerm}
          totalRM={rmDetails}
        />
        <section className={` ${Styles.MainSection}`}>
          <ExpertFilter isTaxRm={service === 'tax-planning'} onFilterChange={(v) => handleFilter(v)} />
          <Expertrm
            searchTerm={searchTerm}
            filters={filters}
            rmDetails={rmDetails}
            isTaxRm={service === 'tax-planning'}
            setRmLength={setRmDetails}
          />
          {
            service === 'tax-planning' ? <TaxExpertRmDetails /> : <ExpertRmDetails />
          }
        </section>
      </div>
    </>
  );
}

export default Expert;
