import { useState } from 'react';
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import PortfolioLayout from "../../../components/Layout/Portfolio";
import pmc from '../../../components/Layout/Portfolio/portfolio.module.css';
import { FaUserAlt, FaLongArrowAltUp, FaCalendarAlt, FaChevronRight } from "react-icons/fa";
import Table from 'react-bootstrap/Table';
import iciciLogo from '../../../Assets/Images/01_icici.png';
import FintooButton from '../../../components/HTML/FintooButton';
import { IoChevronBackCircleOutline } from "react-icons/io5";

const PortfolioEcasUpload = (props) => {
    const [selectedFile, setSelectedFile] = useState("");

    const changeHandler = (e) => {
        if (e.target.files.length > 0) {
            let filename = e.target.files[0].name;
            setSelectedFile(filename);
        }
    }
    return (
        <PortfolioLayout>
            <p style={{ height: '2rem' }}></p>


            <div className="pt-section-container" style={{marginBottom: '1rem'}}>
                <div className="portfolio-back-panel">
                    <span><IoChevronBackCircleOutline className="btn-fintoo-back" /></span>
                    <div>eCAS Upload</div>
                </div>
                <div className="pt-se-innerpadding">
                    <div className="row">
                        <div className="col-6">
                            <div>
                                <div className="mybagde-bx d-flex align-items-center">
                                    <div>1</div>
                                    <div>Step</div>
                                </div>
                            </div>
                            <div className="ds-border-1">
                                <p className="m-0"><strong>Download CAMS/Karvy CAS PDF</strong></p>
                                <ul className="pt-steps-section">
                                    <li>Visit CAMS website. camsonline.com</li>
                                    <li>Select 'MF Investors’</li>
                                    <li>Go to Statements View More then select CAS - CAMS+KFintech+F TAMIL</li>
                                    <li>Choose ‘Statement Type’ as Detailed (Includes transaction listing)</li>
                                    <li>Choose ‘Period’ as Specific Period of your choice</li>
                                    <li>Select “01-01-1990” in “From Date”</li>
                                    <li>Choose ‘Folio Listing’ as without Zero Balance Folios</li>
                                    <li>Enter your Email and choose password/key for your CAMS statement</li>
                                    <li>You will get your CAMS statement on your email within 10 minutes</li>
                                    <li>Invest ~ _ITR Filing Blog Events Login QW e Welcome, Ramesh v</li>
                                </ul>
                            </div>
                        </div>
                        <div className="col-6">
                            <div className="ps-4">
                                <div>
                                    <div className="mybagde-bx d-flex align-items-center">
                                        <div>2</div>
                                        <div>Step</div>
                                    </div>
                                </div>
                                <div className="pt-upload-padding">
                                    <p className="mb-2">Upload your downloaded CAMS or Karvy CAS PDF</p>
                                    <p className=" pt-note">Note : CAMS PDF can be uploaded one time a day (Per PAN)</p>
                                    <div className="pt-4 d-flex justify-content-center">
                                        <div className="cams-upload-box">
                                            <div className="txt-clr-1">Select CAMs or Karvy PDF*</div>
                                            <div>
                                                <label className="pointer" htmlFor="selectedfile">
                                                    <div className="d-none"><input accept="application/pdf" onChange={changeHandler} type="file" id="selectedfile" /></div>
                                                    <div className="pt-4">{selectedFile ? <img src={process.env.REACT_APP_STATIC_URL + "media/DMF/file-upload-1.svg-upload-1.svg"} /> : <img src={process.env.REACT_APP_STATIC_URL + "media/DMF/file-upload.svg"} />}</div>
                                                    <div className="upld-item cams-underline">{selectedFile ? (selectedFile.length > 50 ? '...' + selectedFile.substring(selectedFile.length - 50, selectedFile.length) : selectedFile) : 'Upload file'}</div>
                                                </label>
                                            </div>
                                            <div className="upld-item cams-underline"><input id="pdf-password" placeholder="PDF password (case sensitive)*" /></div>
                                            <div className="upld-item"><FintooButton title="Next" onClick={() => console.log(9998)} /></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </PortfolioLayout>
    );
};

export default PortfolioEcasUpload;
