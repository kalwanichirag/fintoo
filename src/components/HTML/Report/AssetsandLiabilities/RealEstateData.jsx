import RealEstate from "../../../../Assets/Datagathering/Graph/RealEstate";
import RealEstateCommercial from "../../../../Assets/Datagathering/Graph/RealEstateCommercia,";
import { imagePath } from "../../../../constants";

function RealEstateData(props) {
  const PARData = props.PARData;
  const realEstate = props.PARData.realestdata_recomm;
  const realEstateData = props.PARData.realestdata_recomm?.realestatedata;
  // const residential = props.PARData.realestdata_recomm?.realestatedata?.["residential_premises"];
  const residential = props.PARData.realestdata_recomm?.realestatedata?.["residential_premises"];
  const residentialArray = residential ? [residential] : [];
  const commercial = props.PARData.realestdata_recomm?.realestatedata?.["commercial"];
  const sectionText = props.PARData?.section_text;
  // const setTab = props.setTab;

  return (
    <div>
      {realEstate && Object.keys(realEstate).length > 0  && realEstateData && Object.keys(realEstateData)?.length > 0 ?
        (
            <div className="debt-deposit">
              <div className="row">
                <div className="col-md-12">
                  <div className="recomm-box">
                    <div className="green cardBox d-flex">
                      <div>
                        {" "}
                        <img
                          alt=""
                          src={imagePath + "/static/media/DG/reports/current-investments/real-estate-recommendation.svg"}
                        />
                      </div>
                      <div> Real Estate Recommendation</div>
                    </div>

                    <div className="rContent ">
                       <p>While it does require a sizeable corpus, investing in
                        residential or commercial property after weighing all the
                        pros and cons offers your portfolio ample benefits. It
                        diversifies your portfolio, can offer rental income and also
                        has the potential to offer tax advantages, thus assisting
                        you with smart tax planning.</p>
                    </div>
                  </div>
                  {residentialArray && residentialArray.length > 0 ? (
                    <div className="recomm-box">
                      <div className="green cardBox d-flex">
                        <div>
                          {" "}
                          <img
                            alt=""
                            src={imagePath + "/static/media/DG/reports/current-investments/residential-premises.svg"}
                          />
                        </div>
                        <div> Residential Premises</div>
                      </div>
                      <div className="rContent ">
                        <p>As you own a residential property that you have offered on
                          rent, the table below showcases the rental yield you are
                          currently receiving as well as the average rental yield for
                          your city. Find out if the rental income you are receiving
                          is less than, equal to, or more than the average rental
                          yield.</p>
                      </div>
                      <div className="row align-items-center">
                        <div className="col-md-6">
                          <div className="table-responsive rTable">
                            <table className="bgStyleTable asset-table">
                              <thead>
                                <tr>
                                  <th colSpan={3} className="text-center">
                                    Existing Rental Yield
                                  </th>
                                  <th colSpan={1} className="text-center">
                                    Recommendation
                                  </th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr className="outline">
                                  <td>Name of Assets</td>
                                  <td>Invested Product</td>
                                  <td>Rental Yield </td>
                                  <td>Average Rental Yield</td>
                                </tr>
                                {residentialArray ? residentialArray.map((data, index) => (
                                  <tr key={index}>
                                    <td>{data.asset_name}</td>
                                    <td>{data.category}</td>
                                    <td>{data.rental_yield + "%"}</td>
                                    <td>{data.avg_yield + "%"}</td>
                                  </tr>
                                )) : ""}
                              </tbody>
                            </table>
                          </div>
                        </div>
                        <div
                          className="col-md-6 mt-3"
                          style={{
                            backgroundColor: "#fff",
                          }}
                        >
                          <div className="col-md-11 ">
                            <div className="text-center">
                              <h4>Real Estate Recommendation</h4>
                            </div>
                            <div className="d-grid place-item-center">
                              <RealEstate
                                residential={residentialArray}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : ""}
                  {commercial && commercial.length > 0 ? (
                    <div className="recomm-box">
                      <div className="green cardBox">
                        <div>
                          {""}
                          <img
                            alt=""
                            src={imagePath + "/static/media/DG/reports/current-investments/commercial.svg"}
                          />{" "}
                          Commercial{" "}
                          </div>
                      </div>
                      <div className="rContent ">
                        <p>
                          To assess your investment in a commercial property, you
                          should know whether the rental income you are earning
                          through it is less than, equal to, or more than the average
                          rental yield. The table below indicates this by listing the
                          rental yield you are currently earning, as well as the
                          average rental yield for your city.
                        </p>
                      </div>
                      <div className="row align-items-center">
                        <div className="col-md-6">
                          <div className="table-responsive rTable">
                            <table className="bgStyleTable asset-table">
                              <thead>
                                <tr>
                                  <th colSpan={3} className="text-center">
                                    Existing Rental Yield
                                  </th>
                                  <th colSpan={1} className="text-center">
                                    Recommendation
                                  </th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr className="outline">
                                  <td>Name of Assets</td>
                                  <td>Invested Product</td>
                                  <td>Rental Yield</td>
                                  <td>Average Rental Yield</td>
                                </tr>
                                {commercial ? commercial.map((data, index) => (
                                  <tr key={index}>
                                    <td>{data.asset_name}</td>
                                    <td>{data.category}</td>
                                    <td>{data.rental_yield + "%"}</td>
                                    <td>{data.avg_yield + "%"}</td>
                                  </tr>
                                )) : ""}
                              </tbody>
                            </table>
                          </div>
                        </div>
                        <div
                          className="col-md-6 mt-3"
                          style={{
                            backgroundColor: "#fff",
                          }}
                        >
                          <div className="col-md-11 ">
                            <div className="text-center">
                              <h4>Real Estate Recommendation</h4>
                            </div>
                            <div className="d-grid place-item-center">
                              <RealEstateCommercial
                                commercial={commercial}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : ""}
                </div>
              </div>
            </div>
        ) : (
          <div className="no-data-found text-md-center">
            <div className="container">
              <div className="row justify-content-center align-items-center">
                <div className="col-md-10">
                  <img
                    alt="Data not found"
                    src={imagePath + "/static/media/DG/data-not-found.svg"}
                  />
                  <p>
                    Since you missed to fill in the required information which is
                    needed here, we are not able to show you this section. Kindly
                    click on below button to provide all the necessary inputs.
                    Providing all the information as asked will ensure more accurate
                    financial planning report. Once you fill in the data, same will
                    be reflected here.
                  </p>
                  <a
                    href={process.env.PUBLIC_URL + "/datagathering/assets-liabilities"}
                    target="_blank"
                    className="link"
                  >
                    Complete Assets &amp; Liabilities
                  </a>
                </div>
              </div>
            </div>
          </div>
        )
      }
    </div>
  );
}

export default RealEstateData;
