import React from "react";
import { imagePath } from "../../../../../constants";

const DataNotFound = () => {
  return (
    <div className="no-data-found text-center">
      <div className="container">
        <div className="row justify-content-center align-items-center">
          <div className="col-md-10">
            <img
              src={imagePath + "/static/media/DG/data-not-found.svg"}
              alt="Data not found"
            />
            <p>
              Since you missed to fill in the required information which is
              needed here, we are not able to show you this section. Kindly
              click on below button to provide all the necessary inputs.
              Providing all the information as asked will ensure more accurate
              financial planning report. Once you fill in the data, same will be
              reflected here.
            </p>
            <a
              // href="/web/datagathering/assets-liabilities"
              href={`${process.env.PUBLIC_URL}/datagathering/assets-liabilities`}
              target="_blank"
              className="link"
            >
              Complete Assets & Liabilities
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataNotFound;
