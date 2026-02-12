import { useEffect, useState } from "react";
import { IoChevronBackCircleOutline } from "react-icons/io5";
import Menu from "../../Assets/Dashboard/menu.png";
import Back from "../../Assets/Dashboard/back.png";
import Cart from "../../Assets/Dashboard/cart.png";
import Search from "../../Assets/Dashboard/Search.png";
import Profile from "../../Assets/Dashboard/profile.png";
import Addmember from "../../Assets/Dashboard/add.png";
import Settings from "../../Assets/Dashboard/account.png";
import Wishlist from "../../Assets/Dashboard/wishlist.png";
import Logout from "../../Assets/Dashboard/logout.png";
import Female from "../../Assets/Dashboard/female.png";
import { BiChevronDown } from "react-icons/bi";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
// import AddMembers from "../../Pages/DMF/ProfileInsider/AddMembers";
import { connect } from "react-redux";
import { Link } from "react-router-dom";

const DashboardTopMenu = (props) => {
  const [isOpen, setIsOpen] = useState(false);
  const handleTrigger = () => setIsOpen(!isOpen);

  useEffect(() => {
    
    if (localStorage.getItem("hideSideBar") == "true") {
      props.dispatch({ type: "HIDE_SHOW_SIDEBAR", payload: true });
    }
  }, []);

  return (
    <>
      <div
        id="header-menu"
        className={`sidebar ${isOpen ? "sidebar--open" : ""}`}
      >
        <div className="Portfolio-Header">
          <Navbar className="navbar fintooheader" expand="lg">
            <Container fluid className="">
              <Navbar.Toggle aria-controls="responsive-navbar-nav" />
              <Navbar.Collapse
                id="responsive-navbar-nav "
                className="NavList  justify-content-end"
              >
                <Nav>
                  <NavDropdown title="Advisory" id="collasible-nav-dropdown">
                    <NavDropdown.Item href={process.env.PUBLIC_URL + "/financial-planning-page/"}>
                      Financial Planning
                    </NavDropdown.Item>
                    <NavDropdown.Item href={process.env.PUBLIC_URL + "/retirement-services/"}>
                      Retirement Planning
                    </NavDropdown.Item>
                    <NavDropdown.Item href={process.env.PUBLIC_URL + "/tax-planning-page-strategies"}>
                      Tax Planning
                    </NavDropdown.Item>
                    <NavDropdown.Item data-canonical href={process.env.PUBLIC_URL + "/investment-planning-page/"}>
                      Investment Planning
                    </NavDropdown.Item>
                  </NavDropdown>
                  <Nav.Link href="/">Mutual Fund</Nav.Link>

                  <NavDropdown title="Invest" id="collasible-nav-dropdown">
                    <NavDropdown.Item href={process.env.PUBLIC_URL + "/direct-mutual-fund/"}>
                      Direct Mutual Fund
                    </NavDropdown.Item>
                    <NavDropdown.Item href={process.env.PUBLIC_URL + "/stocks/"}>
                      Stocks
                    </NavDropdown.Item>
                  </NavDropdown>
                  <NavDropdown title="ITR Filling" id="collasible-nav-dropdown">
                    <NavDropdown.Item href={process.env.PUBLIC_URL + "/pricing/#tax_plan"}>
                      File Your ITR
                    </NavDropdown.Item>
                    <NavDropdown.Item href={process.env.PUBLIC_URL + "/wealthmanagement/virtual-itr-helpdesk-landing-page/"}>
                      ITR Virtual Help Desk
                    </NavDropdown.Item>
                  </NavDropdown>
                  <Nav.Link eventKey={2} href={process.env.PUBLIC_URL + "/pricing/"}>
                    Pricing
                  </Nav.Link>
                  <Nav.Link eventKey={2} href={process.env.PUBLIC_URL + "/blog"}>
                    Blog
                  </Nav.Link>
                  <NavDropdown title="Events" id="collasible-nav-dropdown">
                    <NavDropdown.Item href={process.env.PUBLIC_URL + "/our-events/?previous"}>
                      Previous
                    </NavDropdown.Item>
                    <NavDropdown.Item href={process.env.PUBLIC_URL + "/our-events/?upcoming"}>
                      Upcoming
                    </NavDropdown.Item>
                    <NavDropdown.Item href={process.env.PUBLIC_URL + "/our-events/?ongoing"}>
                      Ongoing
                    </NavDropdown.Item>
                  </NavDropdown>
                  <Nav.Link eventKey={2} href={process.env.PUBLIC_URL + "/login/"}>
                    Login
                  </Nav.Link>
                  <Nav.Link eventKey={2} href={process.env.PUBLIC_URL + "/login/"}>
                    <img
                      style={{
                        width: "20px",
                      }}
                      src={Search}
                      className="ProfileSearch mobileProfileSearch"
                    />
                  </Nav.Link>
                  <Nav.Link eventKey={2} href={process.env.PUBLIC_URL + "/login/"}>
                    <img
                      style={{
                        width: "20px",
                      }}
                      src={Cart}
                      className="ProfileSearch mobileProfileSearch"
                    />
                  </Nav.Link>
                  <Nav.Link eventKey={2} className="d-flex justify-content-center">
                    <img
                      style={{
                        width: "29px",
                      }}
                      src={Profile}
                      className="ProfileSearch mobileProfileSearch"
                    />
                    <div
                      className="ProfileName ps-2 pt-1"
                    >
                      Welcome, Ramesh
                    </div>{" "}
                    <span>
                      <BiChevronDown
                        style={{
                          fontSize: "27px",
                          color: "#042b62",
                          cursor: "pointer",
                        }}
                        className="mt-1"
                      />{" "}
                    </span>
                  </Nav.Link>
                </Nav>
              </Navbar.Collapse>
            </Container>
          </Navbar>
        </div>
      </div>
    </>
  );
};
const mapStateToProps = (state) => ({
  hideSideBar: state.hideSideBar,
});

export default connect(mapStateToProps)(DashboardTopMenu);
