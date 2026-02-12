import React from 'react'
import Styles from "./Style.module.css"
const ComplianceAuditStatus = () => {
  return (
    <div className={`${Styles.ComplianceAuditStatus}`}>
        <div className={`${Styles.HeaderText}`}>
            <p>Compliance Audit Status</p>
        </div>
        <div className={`${Styles.TableBox}`}>
            <table className='table table-bordered'>
                <thead>
                <tr>
                    <td>Sr. No</td>
                    <td>Financial Year</td>
                    <td>Compliance Audit Status</td>
                    <td>Remarks, if any</td>
                </tr>
                </thead>
                <tbody>
                <tr>
                    <td>1</td>
                    <td>2021-2022</td>
                    <td>Conducted</td>
                    <td>NA</td>
                </tr>
                <tr>
                    <td>2</td>
                    <td>2022-2023</td>
                    <td>Conducted</td>
                    <td>NA</td>
                </tr>
                <tr>
                    <td>3</td>
                    <td>2023-2024</td>
                    <td>Conducted</td>
                    <td>NA</td>
                </tr>
                <tr>
                    <td>4</td>
                    <td>2024-2025</td>
                    <td>Conducted</td>
                    <td>NA</td>
                </tr>
                </tbody>
            </table>
            </div>
    </div>
  )
}

export default ComplianceAuditStatus