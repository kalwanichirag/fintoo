import { useEffect } from "react";
import Footer from "../components/MainComponents/Footer";
import { ReactComponent as Logo } from "../Assets/Images/logo.svg";
import MainLayout from "../components/Layout/MainLayout";
import GuestLayout from "../components/Layout/GuestLayout";
import { Helmet } from "react-helmet-async";


const ComplaintsStatus = () => {
  useEffect(() => {
    document.body.classList.add("main-layout");
  }, []);
  const TableStyle = {
    color: "#042b62",

    // width : 100
  };
  return (
    <GuestLayout>
       <Helmet>
        <title>Complain Status raised and resolved.</title>
        <meta name="description" content="This page give detailed count of number of complaints raised and resolved on our platform through SEBI (Scores) or other sources." />
        </Helmet>
      <section  className="privacy-policy-section" style={{ paddingTop: 30 }}>
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <h2>Complaints Status</h2>
              <p className="bold">Data for the month ending , March 2025</p>
              <table   style={TableStyle} className="table ComplaintTable">
                <thead >
                  <tr className="borderColor">
                    <th>Sr. No</th>
                    <th>Received from</th>
                    <th>Pending at the end of last month</th>
                    <th>Received</th>
                    <th>Resolved*</th>
                    <th>Total Pending#</th>
                    <th>Pending complaints &gt; 3months</th>
                    <th>Average Resolution time (in days)^</th>
                  </tr>
                </thead>
                <tbody className="borderColor">
                  <tr>
                    <td>1</td>
                    <td>Directly from Investors</td>
                    <td>0</td>
                    <td>0</td>
                    <td>0</td>
                    <td>0</td>
                    <td>0</td>
                    <td>0</td>
                  </tr>
                  <tr>
                    <td>2</td>
                    <td>SEBI (SCORES)</td>
                    <td>0</td>
                    <td>1</td>
                    <td>1</td>
                    <td>0</td>
                    <td>0</td>
                    <td>0</td>
                  </tr>
                  <tr>
                    <td>3</td>
                    <td>Other Sources (if any)</td>
                    <td>0</td>
                    <td>0</td>
                    <td>0</td>
                    <td>0</td>
                    <td>0</td>
                    <td>0</td>
                  </tr>
                  <tr>
                    <td />
                    <td>
                      <strong>Grand Total</strong>
                    </td>
                    <td>0</td>
                    <td>0</td>
                    <td>0</td>
                    <td>0</td>
                    <td>0</td>
                    <td>0</td>
                  </tr>
                </tbody>
              </table>
              <p>
                ^ Average Resolution time is the sum total of time taken to
                resolve each complaint in days, in the current month divided by
                total number of complaints resolved in the current month.
              </p>
              <table className="table table-bordered">
                <thead>
                  <tr>
                    <th>Sr. No.</th>
                    <th>Month</th>
                    <th>Carried forward from previous month</th>
                    <th>Received</th>
                    <th>Resolved*</th>
                    <th>Pending#</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>1</td>
                    <td>Apr, 2022</td>
                    <td>0</td>
                    <td>0</td>
                    <td>0</td>
                    <td>0</td>
                  </tr>
                  <tr>
                    <td>2</td>
                    <td>May, 2022</td>
                    <td>0</td>
                    <td>0</td>
                    <td>0</td>
                    <td>0</td>
                  </tr>
                  <tr>
                    <td>3</td>
                    <td>June, 2022</td>
                    <td>0</td>
                    <td>0</td>
                    <td>0</td>
                    <td>0</td>
                  </tr>
                  <tr>
                    <td>4</td>
                    <td>July, 2022</td>
                    <td>0</td>
                    <td>0</td>
                    <td>0</td>
                    <td>0</td>
                  </tr>
                  <tr>
                    <td>5</td>
                    <td>Aug , 2022</td>
                    <td>0</td>
                    <td>0</td>
                    <td>0</td>
                    <td>0</td>
                  </tr>
                  <tr>
                    <td>6</td>
                    <td>Sep, 2022</td>
                    <td>0</td>
                    <td>0</td>
                    <td>0</td>
                    <td>0</td>
                  </tr>
                  <tr>
                    <td>7</td>
                    <td>Oct, 2022</td>
                    <td>0</td>
                    <td>0</td>
                    <td>0</td>
                    <td>0</td>
                  </tr>
                  <tr>
                    <td>8</td>
                    <td>Nov, 2022</td>
                    <td>0</td>
                    <td>0</td>
                    <td>0</td>
                    <td>0</td>
                  </tr>
                  <tr>
                    <td>9</td>
                    <td>Dec, 2022</td>
                    <td>0</td>
                    <td>0</td>
                    <td>0</td>
                    <td>0</td>
                  </tr>
                  <tr>
                    <td>10</td>
                    <td>Jan, 2023</td>
                    <td>0</td>
                    <td>0</td>
                    <td>0</td>
                    <td>0</td>
                  </tr>
                  <tr>
                    <td>11</td>
                    <td>Feb, 2023</td>
                    <td>0</td>
                    <td>0</td>
                    <td>0</td>
                    <td>0</td>
                  </tr>
                  <tr>
                    <td>12</td>
                    <td>Mar, 2023</td>
                    <td>0</td>
                    <td>0</td>
                    <td>0</td>
                    <td>0</td>
                  </tr>
                  <tr>
                    <td>13</td>
                    <td>Apr, 2023</td>
                    <td>0</td>
                    <td>0</td>
                    <td>0</td>
                    <td>0</td>
                  </tr>
                  <tr>
                    <td>14</td>
                    <td>May, 2023</td>
                    <td>0</td>
                    <td>0</td>
                    <td>0</td>
                    <td>0</td>
                  </tr>
                  <tr>
                    <td>15</td>
                    <td>June, 2023</td>
                    <td>0</td>
                    <td>0</td>
                    <td>0</td>
                    <td>0</td>
                  </tr>
                  <tr>
                    <td>16</td>
                    <td>July, 2023</td>
                    <td>0</td>
                    <td>0</td>
                    <td>0</td>
                    <td>0</td>
                  </tr>
                  <tr>
                    <td>17</td>
                    <td>Aug, 2023</td>
                    <td>0</td>
                    <td>1</td>
                    <td>1</td>
                    <td>0</td>
                  </tr>
                  <tr>
                    <td>18</td>
                    <td>Sep, 2023</td>
                    <td>0</td>
                    <td>0</td>
                    <td>0</td>
                    <td>0</td>
                  </tr>
                  <tr>
                    <td>19</td>
                    <td>Oct, 2023</td>
                    <td>0</td>
                    <td>0</td>
                    <td>0</td>
                    <td>0</td>
                  </tr>
                  <tr>
                    <td>20</td>
                    <td>Nov, 2023</td>
                    <td>0</td>
                    <td>0</td>
                    <td>0</td>
                    <td>0</td>
                  </tr>
                  <tr>
                    <td>21</td>
                    <td>Dec, 2023</td>
                    <td>0</td>
                    <td>0</td>
                    <td>0</td>
                    <td>0</td>
                  </tr>
                  <tr>
                    <td>22</td>
                    <td>Jan, 2024</td>
                    <td>0</td>
                    <td>0</td>
                    <td>0</td>
                    <td>0</td>
                  </tr>
                  <tr>
                    <td>23</td>
                    <td>Feb, 2024</td>
                    <td>0</td>
                    <td>0</td>
                    <td>0</td>
                    <td>0</td>
                  </tr>
                  <tr>
                    <td>24</td>
                    <td>Mar, 2024</td>
                    <td>0</td>
                    <td>0</td>
                    <td>0</td>
                    <td>0</td>
                  </tr>
                  <tr>
                    <td>25</td>
                    <td>Apr, 2024</td>
                    <td>0</td>
                    <td>0</td>
                    <td>0</td>
                    <td>0</td>
                  </tr>
                  <tr>
                    <td>26</td>
                    <td>May, 2024</td>
                    <td>0</td>
                    <td>0</td>
                    <td>0</td>
                    <td>0</td>
                  </tr>
                  <tr>
                    <td>27</td>
                    <td>June, 2024</td>
                    <td>0</td>
                    <td>0</td>
                    <td>0</td>
                    <td>0</td>
                  </tr>
                  <tr>
                    <td>28</td>
                    <td>July, 2024</td>
                    <td>0</td>
                    <td>0</td>
                    <td>0</td>
                    <td>0</td>
                  </tr>
                  <tr>
                    <td>29</td>
                    <td>Aug, 2024</td>
                    <td>0</td>
                    <td>0</td>
                    <td>0</td>
                    <td>0</td>
                  </tr>
                  <tr>
                    <td>30</td>
                    <td>Sep, 2024</td>
                    <td>0</td>
                    <td>0</td>
                    <td>0</td>
                    <td>0</td>
                  </tr>
                  <tr>
                    <td>31</td>
                    <td>Oct, 2024</td>
                    <td>0</td>
                    <td>0</td>
                    <td>0</td>
                    <td>0</td>
                  </tr>
                  <tr>
                    <td>32</td>
                    <td>Nov, 2024</td>
                    <td>0</td>
                    <td>0</td>
                    <td>0</td>
                    <td>0</td>
                  </tr>
                  <tr>
                    <td>33</td>
                    <td>Dec, 2024</td>
                    <td>0</td>
                    <td>0</td>
                    <td>0</td>
                    <td>0</td>
                  </tr>
                  <tr>
                    <td>34</td>
                    <td>Jan, 2025</td>
                    <td>0</td>
                    <td>0</td>
                    <td>0</td>
                    <td>0</td>
                  </tr>
                  <tr>
                    <td>35</td>
                    <td>Feb, 2025</td>
                    <td>0</td>
                    <td>0</td>
                    <td>0</td>
                    <td>0</td>
                  </tr>
                  <tr>
                    <td>36</td>
                    <td>Mar, 2025</td>
                    <td>0</td>
                    <td>0</td>
                    <td>0</td>
                    <td>0</td>
                  </tr>
                  <tr>
                    <td />
                    <td>
                      <strong>Grand Total</strong>
                    </td>
                    <td>0</td>
                    <td>1</td>
                    <td>1</td>
                    <td>0</td>
                  </tr>
                </tbody>
              </table>
              <p>
                *Inclusive of complaints of previous months resolved in the
                current month.
              </p>
              <p>
                #Inclusive of complaints pending as on the last day of the
                month.
              </p>
              <p>Trend of annual disposal of complaints</p>
              <table className="table table-bordered">
                <thead>
                  <tr>
                    <th>SN</th>
                    <th>Year</th>
                    <th>Carried forward from previous year</th>
                    <th>Received</th>
                    <th>Resolved*</th>
                    <th>Pending#</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>1</td>
                    <td>2020-21</td>
                    <td>0</td>
                    <td>0</td>
                    <td>0</td>
                    <td>0</td>
                  </tr>
                  <tr>
                    <td>2</td>
                    <td>2021-22</td>
                    <td>0</td>
                    <td>0</td>
                    <td>0</td>
                    <td>0</td>
                  </tr>
                  <tr>
                    <td>3</td>
                    <td>2022-23</td>
                    <td>0</td>
                    <td>0</td>
                    <td>0</td>
                    <td>0</td>
                  </tr>
                  <tr>
                    <td>4</td>
                    <td>2023-24</td>
                    <td>0</td>
                    <td>1</td>
                    <td>1</td>
                    <td>0</td>
                  </tr>
                  <tr>
                    <td>5</td>
                    <td>2024-25</td>
                    <td>0</td>
                    <td>0</td>
                    <td>0</td>
                    <td>0</td>
                  </tr>
                  <tr>
                    <td />
                    <td>
                      <strong>Grand Total</strong>
                    </td>
                    <td>0</td>
                    <td>1</td>
                    <td>1</td>
                    <td>0</td>
                  </tr>
                </tbody>
              </table>
              <p>
                *Inclusive of complaints of previous years resolved in the
                current year.
              </p>
              <p>
                #Inclusive of complaints pending as on the last day of the year.
              </p>
            </div>
          </div>
        </div>
      </section>
    </GuestLayout>
  );
};
export default ComplaintsStatus;
