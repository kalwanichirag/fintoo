import React, { useEffect } from "react";
import Dropzone from "react-dropzone";
import Styles from "./ProfileDetails.module.css";
import { ToastContainer, toast } from 'react-toastify';
import DgDragDrop from "../../../components/HTML/DgDragDrop";

function ProfileFillDetails() {
  useEffect(() => {
    document.body.classList.add("ProfileDetails-Page");
  }, []);
const Submit =()=>{
  toast.success("Profile Data Updated Successfully.", { position: "bottom-left" });
}

  return (
    <>
       <ToastContainer />
      <section
        className="basic-details-section bg-white ng-scope"
        ng-controller="profileupdateController"
      >
        <div className="container">
          <div className="top-wrapper">
            <a href="/userflow/profile/" target="_self" className={`${Styles.backarrow}`}>
              <img
                alt="Back Arrow"
                src={ imagePath + "/static/media/Images/userflow/img/icons/back-arrow.svg"}
              />
            </a>
          </div>
          <div className={`${Styles.ProfileFillDetailsBox}`}>
            <div className={`mt-md-5 ${Styles.Login_Block}`}>
              <div className={`${Styles.TextLabel}`}>
                <p>Your Profile</p>
              </div>
              <div className={`${Styles.subTxt}`}>
                <p>Take a step ahead and fill in your details</p>
              </div>
              <div className={`${Styles.ProfilePicSection}`}>
                <p>Add your Profile picture</p>
                <div className={`${Styles.DragDrop}`}>
                  <Dropzone
                    onDrop={(acceptedFiles) => console.log(acceptedFiles) 
                    }
                  >
                    {({ getRootProps, getInputProps }) => (
                      <section >
                        <div {...getRootProps()}>
                          <input {...getInputProps()} />
                          <p>
                           
                          </p>
                        </div>
                      </section>
                    )}
                  </Dropzone>
                </div>
              </div>
              <div className={`${Styles.NoteSection}`}>
                <p>
                  Note : 1) Upload Profile Image in JPEG,JPG,PNG Format Only &
                  Max file Size is upto 5 MB
                </p>
                <p>
                  2) To change your mobile number or email id, send a request to{" "}
                  <a
                    href="mailto:support@fintoo.in"
                    style={{
                      color: "#6151c9",
                    }}
                  >
                    <u>support@fintoo.in</u>
                  </a>
                </p>
              </div>
              <div className={`${Styles.FormBox}`}>
                <div>
                  <div className="row justify-content-center">
                    <div className="col-md-4 col-12">
                      <div className="material input">
                        <input
                          type="text"
                          tabindex="1"
                          placeholder=""
                          name="Fname"
                          id="Fname"
                          value=""
                          className="default-input"
                        />
                      </div>
                    </div>
                    <div className="col-md-4 col-12">
                      <div className="material input">
                        <input
                          type="text"
                          tabindex="2"
                          placeholder=""
                          name="Lname"
                          id="Lname"
                          value=""
                          className="default-input"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="row justify-content-center">
                    <div className="col-md-4 col-12">
                      <div className="material input">
                        <input
                          type="mail"
                          tabindex="3"
                          placeholder=""
                          name="Mail"
                          id="Mail"
                          value=""
                          className="default-input"
                        />
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="material input">
                        <input
                          type="mail"
                          tabindex="4"
                          placeholder=""
                          name="Mail"
                          id="Mail"
                          value=""
                          className="default-input"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="row justify-content-center">
                    <div className="col-md-8 col-12">
                      <div className={`${Styles.inputs}`}>
                        <input
                          type="number"
                          tabindex="5"
                          placeholder=""
                          name="Mail"
                          id="Mail"
                          value=""
                          className="default-input"
                        />
                      </div>
                    </div>
                  </div>
                  <div
                    className={`justify-content-center text-center ${Styles.Submit}`}
                  >
                    <button onClick={Submit}>Submit</button>
                  </div>
                </div>
              </div>
            </div>

            <div className={`mt-md-5 ${Styles.BGSvg}`}>
              <div className={`${Styles.fillindetails}`}></div>
              {/* <img src="https://images.minty.co.in/static/userflow/img/dashboard/fill-in-details.svg" alt="" class="h100" /> */}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default ProfileFillDetails;
