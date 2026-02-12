import { useEffect } from "react";
import Footer from "../components/MainComponents/Footer";
import { ReactComponent as Logo } from "../Assets/Images/logo.svg";
import MainLayout from "../components/Layout/MainLayout";
import { STATIC_URL } from "../constants";
import GuestLayout from "../components/Layout/GuestLayout";

const Privacypolicy = () => {
  useEffect(() => {
    document.body.classList.add("main-layout");
  }, []);
  return (
    <GuestLayout>
      <section className="privacy-banner text-center">
        <img className="w-100"

          src={process.env.REACT_APP_STATIC_URL + "media/privacy-policy.svg"}
          alt=""
        />
      </section>

      <section className="privacy-policy-section">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <h2>Overview</h2>
              <p>
              Fintoo Wealth Private Limited (hereinafter referred to as “Fintoo Wealth Private Limited” or
                “We” or “Us” or “Our”) is a limited liability partnership that
                provides financial services (“Services”) to customers (“User(s)”,
                “You”, “Your”) who visit the website www.fintoo.in (“Website”). Fintoo Wealth Private Limited is
                committed to protecting your privacy. The purpose of this notice is to
                supply you with the required information at the time of providing us
                with your personal data. This Privacy Notice explains how Fintoo Wealth Private Limited collects
                and uses User’s personal data and their rights and privileges in this
                regard.{" "}
              </p>
              <p>
                Users are urged to read this Privacy Notice carefully. By visiting the
                Website or using any of our services, User indicates their
                confirmation and consent to our use personal information as set out in
                this Privacy Notice.
              </p>
            </div>
            <div className="col-md-12">
              <h3>Collection of Data</h3>
              <p>
                In case you are availing services for advising via Fintoo’s website or
                app, you are required to provide your personal information which
                includes but not limited to Name, Address, PAN number, DOB, Bank
                Account details, etc (collectively KYC Information) at the time of
                availing such services/products.
              </p>
              <p>The said data is collected when User(s):</p>
              <ol type="a">
                <li>
                  registers on the Website(s), apply to use any of Services, become
                  our client, or contact us in person, by telephone, by email or by
                  post;{" "}
                </li>
                <li>
                  {" "}
                  provides feedback or complete a contact form on the Website(s).
                </li>
              </ol>
              <p />
            </div>
            <div className="col-md-12">
              <h3>Nature of Data</h3>
              <p>
                The data is collected depending on the kind of Services availed and
                may include:
              </p>
              <ol type="a">
                <li>
                  Contact details, such as name, job title, postal address, including
                  home address, where Users have provided this, business address,
                  telephone number, mobile phone number, fax number and email address;
                </li>
                <li>
                  {" "}
                  Date of birth, place of birth, employment status and tax
                  identification number (i.e. National Insurance Number);
                </li>
                <li> Personal identification details, PAN and utility bills;</li>
                <li>
                  {" "}
                  Details of the services requested from Fintoo Wealth Private Limited such as assets and
                  insurance details, income slab, profession, family details, tax
                  residency, nationality, gender, marital status;
                </li>
                <li>
                  {" "}
                  In some circumstances, personal data may be collected from a third
                  party source such as User’s organisation, other organisations with
                </li>
                whom they have dealings, government agencies, a credit reporting
                agency;
                <li> Employment status, income and source of wealth;</li>
                <li>
                  {" "}
                  IP address and browser-generated data when visiting the Website;
                </li>
              </ol>
              <p />
              <p>
                User agrees that data provided to Fintoo Wealth Private Limited is entirely voluntarily and User
                may choose not to consent or to provide personal data. However, there
                are circumstances in which Fintoo Wealth Private Limited cannot take action without certain of
                your personal data either to provide the Services or details if sought
                for by regulatory agencies.
              </p>
            </div>
            <div className="col-md-12">
              <h3>Use of Data</h3>
              <p>Fintoo Wealth Private Limited uses the data to</p>
              <ol type="a">
                <li>
                  process User’s application to avail Services and for Fintoo Wealth Private Limited to provide
                  requested Services;
                </li>
                <li>
                  {" "}
                  comply with Fintoo Wealth Private Limited’s obligations arising from any contracts entered
                  into between User and Fintoo Wealth Private Limited and to provide User with the information,
                  products and services that User requests from Fintoo Wealth Private Limited;
                </li>
                <li>
                  {" "}
                  help protect User information and prevent unauthorised access to it;
                </li>
                <li>
                  {" "}
                  deal with any queries, complaints or problems reported by User;
                </li>
                <li>
                  {" "}
                  generate statistics relating to Website use by customers, including
                  utility or popularity of certain features or services. However, Fintoo Wealth Private Limited
                  will not use personally identifiable information for these purposes;
                </li>
                <li>
                  {" "}
                  if required to do so by law and to the extent necessary for the
                  proper operation of Fintoo Wealth Private Limited’s systems, to protect Fintoo Wealth Private Limited and its customers,
                  or for the enforcement of any agreement between User and Fintoo Wealth Private Limited;
                </li>
                <li> to notify User of changes to our Services; and</li>
                <li>help improve the Services provided.</li>
              </ol>
              <p />
              <p>
                Data may also be used to provide User with information about other
                services offered that are similar to those that User may have applied
                for or enquired about (in the past) or to provide updates and
                information about Fintoo Wealth Private Limited through newsletters or emails. In such cases Fintoo Wealth Private Limited
                will obtain the User’s consent in Fintoo Wealth Private Limited’s reasonable judgement assessed
                that there is some benefit or value added if we communicate about it.
              </p>
            </div>
            <div className="col-md-12">
              <h3>Data Protection</h3>
              <ol>
                <li>
                  Fintoo Wealth Private Limited shall at all times take appropriate security measures (including
                  physical, electronic and procedural measures) to help protect the
                  confidentiality, integrity and availability of Users personal
                  information from unauthorised access and disclosure.
                </li>
                <li>
                  The data collected may be used for the purposes of providing the
                  Service, share it with entities that are actively engaged with or
                  within Fintoo Wealth Private Limited, or that become part of Fintoo Wealth Private Limited, its brokers, dealers, IT
                  providers, services providers and agents;
                </li>
                <li>
                  Fintoo Wealth Private Limited’s appointed auditors, accountants, lawyers and other
                  professional advisers (e.g. compliance consultants), to the extent
                  that they require access to the information in order to help Fintoo Wealth Private Limited
                  provide the Services;
                </li>
                <li>
                  {" "}
                  In rare cases and where required, meet applicable law, the order of
                  a Court or market rules and codes of practice applicable to the
                  circumstances at the time;
                </li>
                <li>
                  {" "}
                  To investigate or prevent fraud or activities believed to be illegal
                  or otherwise in breach of applicable law;
                </li>
                <li>
                  {" "}
                  If User provides personal data to us about someone else (such as one
                  of your directors or employees, or someone with whom you have
                  business dealings) User must ensure that it is entitled to disclose
                  that personal data to us and that, without our taking any further
                  steps, Fintoo Wealth Private Limited may collect, use and disclose that personal data as
                  described in this Privacy Policy. In particular, User must ensure
                  that the individual concerned is aware of the various matters
                  detailed in this Privacy Policy, as those matters relate to that
                  individual, including Fintoo Wealth Private Limited’s identity, how to contact us, our
                  purposes of collection, our personal data disclosure practices
                  (including disclosure to overseas recipients), the individual's
                  right to obtain access to the personal data and make complaints
                  about the handling of the personal data, and the consequences if the
                  personal data is not provided (such as our inability to provide
                  services).
                </li>
                <li>
                  {" "}
                  The User should ensure that details provided by third party service
                  providers who are associated with Us have adequate privacy
                  parameters and that the terms provided by such third party service
                  providers terms are complied with.
                </li>
              </ol>
            </div>
            <div className="col-md-12">
              <h3>Website Infrastructure</h3>
              <p>
                In order to provide you secure, reliable and continuous services the
                Website is hosted on a virtual private cloud on Amazon Web Services.
                These services can withstand increasing traffic and provide a platform
                that provides best-in-class security.
              </p>
              <p>
                Communication lines employed by the Website, upstream and downstream,
                are routed through servers protected by 256bit encryption HTTPS
                protocol. Certain cyber attacks and malignancies are prevented owing
                to this technology.
              </p>
              <p>
                We employ best-in-class anti-virus, anti-malware, systems that
                eliminate unauthorised intrusion protocols, have deployed file status
                and integrity mapping.
              </p>
            </div>
            <div className="col-md-12">
              <h3>Data Security</h3>
              <p>
                Users data are stored in encrypted format and all applications are
                checked for data and security check in the course of transactions. All
                data handled by internal teams are transmitted on a need to know basis
                with appropriate classification.
              </p>
              <p>
                We have adequate damage rescue and recovery protocols in place to
                ensure quick recovery and restoration from any untoward incidents or
                events.
              </p>
              <p>
                Users on our Website are prompted one-time password wherever
                applicable for completing transactions and actions.
              </p>
            </div>
            <div className="col-md-12">
              <h3>Data retention</h3>
              <ol type="a">
                <li>
                  Fintoo Wealth Private Limited is committed to only keeping User personal data for as long as
                  Fintoo Wealth Private Limited needs it in order to fulfil the relevant purpose (s) it was
                  collected for, as set out in this Privacy Policy, and for as long as
                  we are required or permitted to keep it by law.
                </li>
                <li>
                  Fintoo Wealth Private Limited retains copies of User contracts in order to enable Fintoo Wealth Private Limited to deal
                  with any legal issues and the information provided for
                  identification verification checks, for up to three (3) years after
                  termination or expiry of our contract with you. We retain details of
                  complaints for up to three (3) years from the date of receipt.
                </li>
              </ol>
            </div>
            <div className="col-md-12">
              <h3>User rights on Data provided to Fintoo Wealth Private Limited</h3>
              <ol type="a">
                <li>
                  User shall have the right to request a copy of their personal data,
                  which is held with Fintoo Wealth Private Limited, to have any inaccurate personal data
                  corrected and to object to or restrict our using said personal data.
                  User may report if it has a concern about our handling of your
                  personal data.
                </li>
                <li>
                  {" "}
                  When a request is made by User through email, Fintoo Wealth Private Limited will endeavour to
                  provide you with these details without delay and at the latest
                  within one month of receipt.
                </li>
                <li>
                  {" "}
                  When Fintoo Wealth Private Limited receives a subject access request we will provide a copy of
                  the information held free of charge. Fintoo Wealth Private Limited may charge a reasonable fee
                  to comply with requests for further copies of the same information.
                </li>
                <li>
                  {" "}
                  The User also has the following rights (unless exemptions apply),
                  which can be exercised by contacting us using the details provided
                  below: To ask us not to process your personal data for marketing
                  purposes; To prevent any processing of personal data that is causing
                  or is likely to cause unwarranted and substantial damage or distress
                  to you or another individual; To request the rectification or
                  completion of personal data which are inaccurate or incomplete; To
                  request its erasure under certain circumstances; To be informed
                  about any use of your personal data to make automated decisions
                  about you, and to obtain meaningful information about the logic
                  involved, as well as the significance and the envisaged consequences
                  of this processing; and If you would like to send a report as
                  mentioned above, User can contact Fintoo Wealth Private Limited at:{" "}
                  <a href="mailto:support@fintoo.in">support@fintoo.in</a>
                </li>
              </ol>
            </div>

            <div class="col-md-12">
              <h3>Collection of data (personal and non-personal)</h3>
              <p>Personal data: The methods by which we collect your personal information include, but are not limited to, the following:</p>
              <ol type="a">
                <li>When you register on our website and/or application.</li>
                <li>When you disclose your personal information, financial profile and/or family background to us during course of receiving services.</li>
                <li>When you use the features on our website and/or application.</li>
                <li>When you provide access to any other website and/or application.</li>
                <li>By the use of cookies.</li>
              </ol>
              <p>The data or information is collected to provide you with personalised and enhanced products and services.</p>
              <p>The personal data that we collect includes: name, PAN card details, AADHAAR card details, mobile number, email, date of birth, gender, address, banking details, income-related details, employment-related details, family details, etc. We also collect KYC details, credit information, assets, bank transactions, bank account balance, etc. with your explicit consent.</p>
              <p>Non-personal data: Sharing non-personal data does not disclose your identity.</p>
              <p>Under non-personal data, we collect technical information about your activities and interaction with our website, application, or platform. We use this data to understand user behaviour and improve our services.</p>
            </div>
            <div className="col-md-12">
              <h3>SMS Policy</h3>
              <p>
              SMS notifications are sent only to those who have subscribed to Fintoo's newsletters or updates. Subscribers' or customers' information will not be shared elsewhere; we respect your privacy.
              </p>
            </div>
            <div class="col-md-12">
              <h3>Disclosure of your data</h3>
              <p>We ensure that none of your data is disclosed to any unauthorised person or entity. However, the data may be disclosed to or shared with:</p>
              <p>A regulator or any other government authority:</p>
              <p>We may disclose your data to any regulator or government entity, in order to comply with legal or regulatory requirements.</p>
            </div>

            <div className="col-md-12">
              <h3>Contracting parties:</h3>
              <p>We may transmit or share your information with our service providers, group companies, or business partners, as necessary, in order to provide our services. In addition to the aforementioned scenarios, with your prior consent, we may divulge your personal information to third parties.</p>
            </div>

            <div className="col-md-12">
              <h3>Refund and Cancellations</h3>
              <p>
                We process the refund from our end, immediately once the request has
                been raised and confirmed from our team. So it should reflect into
                your account within the next 5 to 7 working days.
              </p>
            </div>
            <div className="col-md-12">
              <h3>Update of Terms</h3>
              <p>
                Fintoo Wealth Private Limited shall from time to time review these terms and hereby reserves the
                right to change or modify, any or all of them including, changing of
                the extent and scope of the Services and/or include any other
                category, service, facility or feature within the term ‘Service’, at
                the sole discretion of the Website.&nbsp;Any such change(s) shall be
                effective immediately upon the relevant webpage going
                ‘live’.&nbsp;User is urged to determine when these Terms were last
                revised by referring to <b>‘LAST UPDATED’</b> link in these
                Terms.&nbsp;
              </p>
              <p>
                E-mail: <a href="mailto:support@fintoo.in">support@fintoo.in</a>{" "}
              </p>
              <p style={{
                paddingBottom: "20px"
              }}>
                Address: B/309, Dynasty Business park, Opp Sangam Cinema, Andheri (East), J B Nagar, Mumbai, Maharashtra 400059
              </p>
            </div>
          </div>
        </div>
      </section>

    </GuestLayout>
  );
};
export default Privacypolicy;
