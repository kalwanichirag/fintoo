import { useEffect } from "react";
import Footer from "../components/MainComponents/Footer";
import { ReactComponent as Logo } from '../Assets/Images/logo.svg';
import MainLayout from "../components/Layout/MainLayout";
import { STATIC_URL } from "../constants";
import GuestLayout from "../components/Layout/GuestLayout";

const Terms = () => {
    useEffect(() => {
        document.body.classList.add('main-layout');

    }, []);
    return (
        <GuestLayout>


            <section className="privacy-banner text-center">
                <img
                    src={process.env.REACT_APP_STATIC_URL + "media/privacy-policy.svg"}

                    alt=""
                />
            </section>

            <section className="privacy-policy-section">
                <div className="container">
                    <div className="row">
                        <div className="col-md-12">
                            <h2>Terms and Conditions</h2>
                            <p>
                                If you continue to browse and use this website, you acknowledge and
                                are agreeing to comply with and be bound with the Terms and Conditions
                                (as stated below) of use with all applicable laws and regulations, in
                                addition to our Privacy Policy.
                            </p>
                            <p>
                                Fintoo Wealth Private Limited operates the website www.fintoo.in (“Website”) under brand names
                                “Fintoo” or any other name as may be set up by Fintoo Wealth Private Limited from time to time.
                                Fintoo Wealth Private Limited provides the user (“User”, You”, “you”, “your”) in person and or
                                through the Website investment and wealth management services to the
                                Users (“Services”). Fintoo Wealth Private Limited is committed to operating its website and
                                mobile website with the highest ethical standards and appropriate
                                internal controls. The terms herein are aligned with the definition of
                                electronic contract under the Information Technology Act 2000 and its
                                amendments from time to time. They do not need physical or digital
                                signature and may be accepted as found on the Website.
                            </p>
                        </div>
                        <div className="col-md-12">
                            <h3>Terms of Use</h3>
                            <p>
                                The terms herein govern the User’s visit to and use of the Website
                                (the “Terms” or the “Agreement”) are a binding contract between you
                                and Fintoo Wealth Private Limited. If you have any questions, comments, or concerns regarding
                                these terms or the Services, please contact us at&nbsp;
                                <a href="mailto:support@fintoo.in">support@fintoo.in</a>.{" "}
                            </p>
                            <p>
                                The use of the Website shall deem your acceptance of these Terms and
                                your using the Services in any way means that you agree to all of
                                these Terms, and these Terms will remain in effect while you use the
                                Services. These Terms include the provisions mentioned below, as well
                                as those in the&nbsp;<a href="/web/privacy-policy/">Privacy Policy.</a>
                            </p>
                            <ol>
                                <li>
                                    You confirm and accept that all information, content, materials,
                                    products on the Website is protected and secured. You acknowledge
                                    that the software and hardware underlying the Website as well as
                                    other Internet related software which are required for accessing the
                                    Website are the legal property of either Fintoo Wealth Private Limited or its respective
                                    third-party vendors. The permission given by Fintoo Wealth Private Limited to access the
                                    Website will not convey any proprietary or ownership rights in the
                                    any software/hardware.
                                </li>
                                <li>
                                    {" "}
                                    You understand and accept that you are allowed to&nbsp;&nbsp;track
                                    your financial life through the use of Website. You agree that you
                                    will be allowed to make any transaction through the Website when you
                                    complete the KYC process and provides the complete information
                                    including personal information in accordance with the Know your
                                    client (“KYC”) guidelines issued by Securities and Exchange Board of
                                    India or any other regulator/government authorities/agencies/AMCs
                                    from time to time.
                                </li>
                                <li>
                                    {" "}
                                    You agree that you are and will at all times be responsible for
                                    maintaining the confidentiality of your account information and are
                                    fully responsible for all activities that occur under Your account
                                    and also agree to keep your login credentials safe and confidential
                                    at all times. You&nbsp;further agree to promptly inform Us
                                    immediately in case of any actual or suspected unauthorized use of
                                    Your Account. We cannot and will not be liable for any loss or
                                    damage arising from Your failure to comply with this provision.
                                </li>
                                <li>
                                    {" "}
                                    You understand and accept that not all the products and services
                                    offered on or through the Website are available at all times or in
                                    all locations and you shall contact our representative for all
                                    clarity on these issues before you take further steps. Fintoo Wealth Private Limited and its
                                    third party providers (including distributors) reserve the right to
                                    determine the availability and eligibility for any product or
                                    service offered on the Website.
                                </li>
                                <li>
                                    {" "}
                                    Fintoo Wealth Private Limited does not make any warranties and expressly disclaims all
                                    warranties express or implied, including without limitation, those
                                    of merchantability and fitness for a particular purpose, title or
                                    non-infringement with respect to any information or services or
                                    products that are available or advertised or sold through these
                                    third-party platforms.
                                </li>
                                <li>
                                    {" "}
                                    You understand and accept that Fintoo Wealth Private Limited is not responsible for the
                                    availability of content or other services on third party sites
                                    (including distributors or resellers) linked from the Website. You
                                    are aware that access of hyperlinks to other internet sites are at
                                    your own risk and the content, accuracy, opinions expressed, and
                                    other links provided by these sites are not verified, monitored or
                                    endorsed by Fintoo Wealth Private Limited in any way.{" "}
                                </li>
                                <li>
                                    {" "}
                                    You agree that transactions made through Fintoo Wealth Private Limited Website shall be
                                    through your own bank account only and the said transactions do not
                                    contravene any Act, Rules, Regulations, Notifications of Income tax
                                    Act, Anti money laundering laws, Anti-corruption laws or any other
                                    applicable laws.
                                </li>
                                <li>
                                    {" "}
                                    You agree that you will not use the Website for any purpose that is
                                    unlawful or prohibited by these Terms. You also agree you will not
                                    use the Website in any manner that could damage, disable or impair
                                    the Website or interfere with any other party’s use, legal rights,
                                    or enjoyment of the Website. You hereby represent and warrant that
                                    you shall make use of the Website as a prudent, reasonable and law
                                    abiding citizen and you shall comply with relevant necessary laws.
                                </li>
                                <li>
                                    {" "}
                                    If the User is found engaging in any fraudulent/illegal activities
                                    including but not limited to the following activities i.e abusing
                                    any of the representatives of the organization, indulge in
                                    fraudulent activities on the Website, using mass media and/or bots
                                    to engage with the platform, using mass media and/or bots to malign
                                    the organization’s reputation Fintoo Wealth Private Limited reserves the right in its sole
                                    discretion to delete, block, restrict, disable, suspend your account
                                    or part thereof and further these activities may be referred to
                                    appropriate legal authority for a legal recourse.
                                </li>
                                <li>
                                    {" "}
                                    The User hereby confirms through the usage of the Website or
                                    Services of Fintoo Wealth Private Limited that:
                                </li>
                                <ol type="a">
                                    <li>
                                        &nbsp;User is 18 years of age or older and where you are acting as
                                        guardian on behalf of a minor, you have the necessary authority to
                                        register/sign up for the Services on behalf of the minor.&nbsp;Fintoo Wealth Private Limited
                                        will not be held responsible for information of persons below the
                                        age of 18 and User is urged to contact Fintoo Wealth Private Limited representative assigned
                                        to User for providing such information.
                                    </li>
                                    <li>
                                        &nbsp;User has read and understood the Privacy Policy published on
                                        the Website and unconditionally confirm that the information
                                        provided by User upon registration or when prompted on the Website
                                        is true and correct. In the event, your information is not
                                        accessible online and you wish to change or delete your personal
                                        information or other information that you may have provided,
                                        please contact Fintoo Wealth Private Limited representative immediately.{" "}
                                    </li>
                                    <li>
                                        {" "}
                                        You shall notify and update Fintoo Wealth Private Limited promptly of any material change in
                                        your personal information and/or profile so as to enable Fintoo Wealth Private Limited to
                                        rely on the most recent information provided.
                                    </li>
                                    <li>
                                        {" "}
                                        You agree to be contacted by Fintoo Wealth Private Limited and its employees and partners
                                        over phone and/or E-mail and/or SMS or any other form of
                                        electronic communication in connection with your registration,
                                        advisory and transactions.
                                    </li>
                                </ol>
                            </ol>
                        </div>
                        <div className="col-md-12">
                            <h3>Services&nbsp;</h3>
                            <ol>
                                <li>
                                    The Website offers the Services to the Users which include, advisory
                                    and investment services to the Users relating to investing in,
                                    purchasing, selling or otherwise dealing in securities or investment
                                    products, and advice on investment portfolio containing securities
                                    or investment products.&nbsp;Services may be provided by Fintoo Wealth Private Limited
                                    directly or through third party service providers, including
                                    distributors.
                                </li>
                                <li>
                                    {" "}
                                    The User hereby agrees and acknowledges that all the decisions of
                                    the User, notwithstanding the Services rendered by Fintoo Wealth Private Limited, in relation
                                    to buy, sell, hold or otherwise deal in the investment securities
                                    shall be based on User’s own independent evaluation of the risks and
                                    rewards of the investments and User’s own verification of all the
                                    relevant facts, including financial and other circumstances and a
                                    proper evaluation thereof.
                                </li>
                                <li>
                                    {" "}
                                    User agrees that the Services are in the nature of advice and
                                    guidance enabling the User to make informed decisions and neither
                                    Fintoo Wealth Private Limited nor any of our employees or agents shall be liable for any
                                    advice or representation made by them hereunder and it will be the
                                    User’s responsibility to make an independent assessment pursuant to
                                    the availing/using of the Website/Services or availing any product
                                    or services from the third-party provider.
                                </li>
                                <li>
                                    {" "}
                                    User acknowledges and agrees that no warranties or commitments are
                                    being made by Fintoo Wealth Private Limited or any of its employees, agents or representatives
                                    that availing of the Services from the Website will result in
                                    profits or avoid losses or meet the objectives, including the
                                    investment objectives, of the User or that availing/using of the
                                    Services/Website will not at any time be affected by adverse tax
                                    consequences, technical failures, timely regulatory compliance to a
                                    new law. Fintoo Wealth Private Limited will not be liable to the User or any person claiming
                                    for or on their behalf for any error of judgement or loss suffered
                                    by the User in connection with the Services provided to the User.
                                </li>
                                <li>
                                    {" "}
                                    Fintoo Wealth Private Limited does not disburse loans or provide direct financial facilities
                                    but may facilitate User to compare the best possible options and
                                    apply for loans to institutions offering these services and
                                    facilities. You acknowledge that the loan rates vary from bank to
                                    bank and it is dependent on your credit profile and the
                                    loan/policies/scheme you decide to opt for. Fintoo Wealth Private Limited shall not be
                                    responsible for any commercial, legal or other terms and conditions
                                    made by these institutions or agencies.
                                </li>
                                <li>{" "}
                                    You understand and accept that while providing services to you, Fintoo Wealth Private Limited  might require access to your last year’s bank statement via FINVU (Account Aggregator) to analyse your income and expenses in order to enhance your money management with a financial plan with additional accuracy. You may check the terms and conditions of FINVU on  <a style={{ color: "blue" }} href="https://finvu.in/terms" target="_blank" rel="noopener noreferrer">https://finvu.in/terms</a>.
                                </li>
                            </ol>
                        </div>
                        <div className="col-md-12">
                            <h3>Privacy&nbsp;</h3>
                            <p>
                                You agree that you will provide Fintoo Wealth Private Limited or its third party providers
                                (including distributors, agents or employees) with proprietary,
                                confidential or similar information and other data as mentioned under
                                these Terms herein during your use and access of the Website or the
                                availing of the Services. Fintoo Wealth Private Limited and its aforesaid constituents respect
                                the privacy and confidentiality of such data and the provisions
                                pertaining to such private information and data as provided shall be
                                governed under the Website’ Privacy Policy under the link marked
                                “Privacy Policy” on the Website. By using and visiting the Website and
                                availing the Services, you also agree to be governed by said Privacy
                                Policy.
                            </p>
                        </div>
                        <div className="col-md-12">
                            <h3>Confidentiality</h3>
                            <p>
                                The User acknowledges that, in the course of engagement with Fintoo Wealth Private Limited and
                                while availing the Services, User may obtain information relating to
                                the Services and/or Fintoo Wealth Private Limited (“Confidential Information”). Such Proprietary
                                Information shall belong solely to Fintoo Wealth Private Limited and includes, but is not
                                limited to, the features and mode of operation of the Services,
                                computer code, internal documentation, problem reports, analysis and
                                other technical, business, product, plans and data. In regard to this
                                Confidential Information the User shall not use (except as expressly
                                authorized by this Agreement) or disclose Confidential Information
                                without the prior written consent of Fintoo Wealth Private Limited unless such Confidential
                                Information becomes generally publicly available without your breach
                                of this Agreement. User shall at all times all measures to maintain
                                the Confidential Information and Services in confidence.
                            </p>
                        </div>
                        <div className="col-md-12">
                            <h3>Use and Protection of Intellectual Property Rights</h3>
                            <p>
                                Fintoo Wealth Private Limited Website are protected by intellectual property rights belonging to
                                Fintoo Wealth Private Limited in the form of copyright, trademarks, patents, trade secret and/or
                                other relevant laws. No information, content or material from the
                                Website may be copied, reproduced, republished, uploaded, posted,
                                transmitted or distributed in any way without Fintoo Wealth Private Limited's express written
                                permission. The User is permitted a limited licence to use the Website
                                for personal and non-commercial use, subject to the Website Terms and
                                Conditions.&nbsp;User agrees not to sell, license, distribute, copy,
                                modify, publicly perform or display, transmit, publish, edit, adapt,
                                create derivative works from, or otherwise make unauthorized use of
                                the Fintoo Wealth Private Limited Website.&nbsp;
                            </p>
                        </div>
                        <div className="col-md-12">
                            <h3>Limitation of Liability, Indemnity, and Warranty</h3>
                            <ol>
                                <li>
                                    {" "}
                                    The User warrants all the details and information provided to Fintoo Wealth Private Limited or
                                    its directors, employees, associates, partners, or suppliers while
                                    using this Website (including for the purposes of carrying out
                                    investments) shall be correct, accurate and genuine. In no event
                                    shall Fintoo Wealth Private Limited or its directors, employees, associates, partners, or
                                    suppliers be liable or responsible to User, their representatives or
                                    any persons claiming under them for any loss or damage that may
                                    cause or arise from or in relation to the use of the Website or
                                    availing of the Services any investments made following use of
                                    Website or availing the Services.
                                </li>
                                <li>
                                    {" "}
                                    The User shall indemnify Fintoo Wealth Private Limited or its directors, employees,
                                    associates, partners or suppliers for all the liabilities (including
                                    claims, damages, suits or legal expenses in defending itself in
                                    relation to the foregoing) arising due to
                                    <ol type="i">
                                        <li>use or misuse of the Website</li>
                                        <li>
                                            {" "}
                                            non-performance and/or non-observance of the duties and
                                            obligations under these terms and conditions or due to the
                                            User’s or any of its constituents’ acts or omissions
                                        </li>
                                        <li> any act, neglect, misconduct or fraud on your part.</li>
                                    </ol>
                                </li>
                                <li>
                                    {" "}
                                    The User shall be solely responsible for any investment decision
                                    made based on the Services and Fintoo Wealth Private Limited shall not be liable for any loss
                                    or damage caused to you or other users of this Website due to such
                                    investment decision, or any kind of reliance upon it.
                                </li>
                            </ol>
                        </div>
                        <div className="col-md-12">
                            <h3>Disclaimer</h3>
                            <p>
                                THE USER AGREES AND UNDERSTANDS THAT THE WEBSITE AND SERVICES ARE
                                PROVIDED STRICTLY ON “AS IS”, “WHERE IS” AND “AS AVAILABLE” BASIS WITH
                                NO REPRESENTATIONS OR WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED, AS
                                TO THE OPERATION OF THE WEBSITE, SERVICES, INFORMATION, CONTENT
                                WHETHER PROVIDED HEREIN OR IN PERSON. USER ACKNOWLEDGES AND AGREES
                                THAT SERVICES AVAILED AND USE OF THE WEBSITE IS AT THEIR SOLE RISK AS
                                TO COSTS AND CONSEQUENCES.
                            </p>
                            <p>
                                TO THE FULLEST EXTENT PERMISSIBLE BY APPLICABLE LAW, Fintoo Wealth Private Limited DISCLAIMS ALL
                                WARRANTIES, EXPRESS OR IMPLIED. WHILE ALL ENDEAVOURS WILL BE TAKEN BY
                                IT TO ENSURE OTHERWISE, Fintoo Wealth Private Limited CANNOT AND DOES NOT WARRANT THAT THE
                                WEBSITE, ITS SERVERS, OR EMAIL/ OTHER COMMUNICATION SENT FROM THE
                                WEBSITE ARE FREE OF VIRUSES OR OTHER HARMFUL COMPONENTS. WE WILL NOT
                                BE LIABLE FOR ANY DAMAGES OF ANY KIND ARISING FROM THE USE OF THE
                                WEBSITE, INCLUDING, BUT NOT LIMITED TO DIRECT, INDIRECT, INCIDENTAL,
                                PUNITIVE AND CONSEQUENTIAL DAMAGES.
                            </p>
                            <p>
                                USER ACKNOWLEDGES THAT ALL INVESTMENTS ARE SUBJECT TO MARKET RISKS AND
                                THAT PAST PERFORMANCES ARE NOT INDICATOR OF FUTURE RETURNS. Fintoo Wealth Private Limited
                                STRICTLY DISCLAIMS AND DOES NOT WARRANT, ENDORSE, GUARANTEE, OR ASSUME
                                RESPONSIBILITY FOR ANY PRODUCT OR SERVICE ADVERTISED OR OFFERED BY A
                                THIRD-PARTY PROVIDER IN ANY MANNER. FURTHER Fintoo Wealth Private Limited OR ITS REPRESENTATIVES
                                ARE NOT PARTY TO OR IN ANY WAY BE RESPONSIBLE FOR ANY TRANSACTION
                                BETWEEN USER AND SUCH PARTY PROVIDER. AS WITH THE PURCHASE OF A
                                PRODUCT OR SERVICE THROUGH ANY MEDIUM THROUGH SUCH THIRD-PARTY
                                PROVIDER, USER IS URGED TO EXERCISE PRUDENT JUDGMENT AND EXERCISE
                                CAUTION WHERE APPROPRIATE. THE USER EXPRESSLY AGREES AND ACKNOWLEDGES
                                TO HOLD Fintoo Wealth Private Limited HARMLESS IN RESPECT OF ANY COST, CLAIMS, DAMAGE, LOSS OR
                                EXPENSES ACCRUED, SUFFERED, INCURRED BY Fintoo Wealth Private Limited OR ANY THIRD PARTY ARISING
                                OUT OF OR IN CONNECTION WITH ANY SUCH COMMUNICATION, INTERACTION,
                                DEALINGS AND TRANSACTIONS BETWEEN THE USER AND THIRD-PARTY PROVIDERS.
                                THE USER ACKNOWLEDGES THAT WE DO NOT HAVE ANY CONTROL OVER SUCH
                                DEALINGS AND TRANSACTIONS AND PLAYS NO DETERMINATIVE ROLE IN THE
                                PERFORMANCE IN RESPECT OF THE SAME&nbsp;&nbsp;AND WE SHALL NOT BE
                                LIABLE FOR THE OUTCOMES OF SUCH COMMUNICATION, INTERACTION, DEALINGS
                                AND TRANSACTIONS BETWEEN THE USERS AND THE THIRD-PARTY
                                PROVIDERS.&nbsp;
                            </p>
                        </div>
                        <div className="col-md-12">
                            <h3>Consideration</h3>
                            <p>
                                Fintoo Wealth Private Limited may at its sole option choose and the User hereby unconditionally
                                accepts that Fintoo Wealth Private Limited may charge its Users a fee for use of Website, which
                                charges may be updated without notice to any party.&nbsp;
                            </p>
                        </div>
                        <div className="col-md-12">
                            <h3>Force majeure</h3>
                            <p>
                                If the Services or use of the Website is prevented, hindered or
                                delayed by a Force Majeure event (as defined below), Fintoo Wealth Private Limited shall not be
                                liable for any failure to perform any of its obligations under these
                                terms and conditions or those applicable specifically to its
                                services/facilities, and in such case its obligations shall be
                                suspended for so long as the Force Majeure event continues. “Force
                                Majeure Event” means any event, due to any cause beyond the reasonable
                                control of Fintoo Wealth Private Limited, including without limitations, unavailability of any
                                communication systems, breach, or virus in the digital processes or
                                payment or delivery mechanism, sabotage, fire, flood, explosion, acts
                                of God, civil commotion, strikes or industrial action of any kind,
                                riots, insurrection, war, acts of government, lockdown, computer
                                hacking, unauthorised access to computer data and storage devices,
                                computer crashes, malfunctioning in the computer terminal or the
                                systems getting affected by any malicious, destructive or corrupting
                                code or program, mechanical or technical errors/failures or power shut
                                down, faults or failures in telecommunication etc.&nbsp;
                            </p>
                        </div>
                        <div className="col-md-12">
                            <h3>General Terms</h3>
                            <p>
                                No failure on the part of any party to exercise, and no delay on its
                                part in exercising any right or remedy under this Agreement will
                                operate as a waiver thereof, nor will any single or partial exercise
                                of any right. All illegality, invalidity or unenforceability of any
                                provision of these Terms under the law of any jurisdiction will not
                                affect its legality, validity or enforceability under the law of any
                                other jurisdiction nor the legality, validity or enforceability of any
                                other provision. These Terms including the Privacy Policy and any
                                other arrangement/agreement in relation the Services, including the
                                Advisory Agreement (applicable to advisory clients), constitute the
                                entire agreement between the User and Fintoo Wealth Private Limited and supersede all previous
                                agreements, promises, proposals, representations, understandings and
                                negotiations, whether written or oral, between the User and US
                                pertaining to the subject matter hereof.
                            </p>
                            <p>
                                The provisions related to Limitation of liability,&nbsp;Indemnity,
                                Warranty,&nbsp;Intellectual Property,&nbsp;Confidentiality, Dispute
                                Resolution, Governing Law and Jurisdiction shall survive expiry or
                                termination of these terms and without prejudice, any provisions of
                                this Agreement which by implication are to survive the termination of
                                this Agreement shall survive such termination. Any expiry or
                                termination of the Agreement shall not nullify or amend causes of
                                action prior to such termination.
                            </p>
                            <p>
                                <b style={{fontWeight : "600"}}>Communications</b> : You hereby expressly agree to receive communication (including transactional messages) or by way of SMS/RCS (Rich Communication Services) and/or E-mail or through WhatsApp from the Company or any third party in connection with the Services or your registration on the Platform. We may contact you telephonically or through emails to introduce new Product/service offerings and in case of you do not want us to contact you, you are requested to actively opt out.
                            </p>
                        </div>
                        <div className="col-md-12">
                            <h3>Dispute Resolution</h3>
                            <p>
                                Any dispute, controversy, claims or disagreement of any kind
                                whatsoever between the Parties in connection with or arising out of
                                this Agreement shall be referred for arbitration, to a sole arbitrator
                                appointed by Fintoo Wealth Private Limited, through arbitration to be conducted in accordance
                                with Mumbai Centre for International Arbitration’s rules. The venue of
                                such arbitration shall be at Mumbai, India. All proceedings of such
                                arbitration, including, without limitation, any awards, shall be in
                                the English language. The award shall be final and binding on the
                                Parties.&nbsp;
                            </p>
                        </div>
                        <div className="col-md-12">
                            <h3>Governing laws</h3>
                            <p>
                                Subject to arbitration provisions herein, these Terms shall be
                                governed, interpreted, and construed in accordance with the laws of
                                India, without regard to any conflict of law provisions.
                                Notwithstanding the foregoing, you agree that (i) Fintoo Wealth Private Limited has the right to
                                bring any proceedings before any court/forum of competent jurisdiction
                                and you irrevocably submit to the jurisdiction of such courts or
                                forum; and (ii) any proceeding brought by you shall be exclusively
                                before the courts in Mumbai, India.
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
                                revised by referring to <b>‘LAST UPDATED’</b> link in these Terms.
                            </p>
                        </div>
                        <div className="col-md-12">
                        <p>
                        Fintoo Wealth Private Limited (Brand Name - Fintoo.in, Fintoo app, Fintoo) makes no warranties or representations, express or implied, on products and services offered through the platform. It accepts no liability for any damages or losses, however, caused in connection with the use of, or on the reliance of its advisory or related services.
                        </p>
                        <p>
                        Past performance is not indicative of future returns. Please consider your specific investment requirements, risk tolerance, goal, time frame, risk and reward balance and the cost associated with the investment before choosing a fund, or designing a portfolio that suits your needs. Performance and returns of any investment portfolio can neither be predicted nor guaranteed. Investments made on advisory are subject to market risks, read all scheme related documents carefully.
                        </p>
                        <p>
                        © Fintoo Wealth Private Limited [SEBI RIA Registration No: INA000020031] [BASL Membership ID: 2252] [Type of Registration: Non-Individual] [Validity of registration: March 26,2025-Perpetual] [Address: Fintoo Wealth Private Limited, B/309, Dynasty Business park, Opp Sangam Cinema, Andheri (East), J B Nagar, Mumbai, Maharashtra 400059]  [CIN - U66301MH2023PTC414206] [GST No : 27AAFCF7114E1ZV] [Principal Officer details : Mr. Mihir Shah (mihir.shah@fintoo.in)] [Compliance Officer details : Mrs. Nisha Harchekar (nisha.harchekar@fintoo.in)] [Corresponding SEBI regional/local office: Plot No. C 4-A , G Block, Near Bank of India, Bandra Kurla Complex,Bandra East, Mumbai, Maharashtra 400051]
                        </p>
                        </div>
                    </div>
                </div>
            </section>



            {/* <Footer /> */}
        </GuestLayout>
    );
}
export default Terms;