import style from './style.module.css'
import { maskBankAccNo } from '../../../../common_utilities'

const StepMessageComponent = ({ status, message }) => {

    const statusColor = status === 'PENDING' ? { primary: 'orange', secondary: '#ffa50014' } : { primary: 'red', secondary: '#ff000008' }

    return (
        <div className={`${style.stepMessageContainer}`} style={{ border: `1px solid ${statusColor.primary}`, background: `${statusColor.secondary}` }}>
            {
                message
            }
        </div>
    )
}

const Step = ({ stepNo, data, isLast, lineColorStatus, bankName, successDatetime, installmentDate }) => {

    const getAnimationNameForBubble = () => {
        switch (lineColorStatus) {
            case 'autopatcreate':
                return 'bubble_autopatcreate_key_frame'
            case 'Approved':
                return 'bubble_success_key_frame'
            case 'success':
                return 'bubble_success_key_frame'
            case 'installment':
                return 'bubble_installment_key_frame'
            case 'Pending':
                return 'bubble_pending_key_frame'
            case 'Cancelled':
                return 'bubble_failed_key_frame'
            case 'Rejected':
                return 'bubble_failed_key_frame'
            
        }
    }

    const getBubbleContent = () => {
        switch (lineColorStatus) {
            case 'autopatcreate':
                return '✓'
            case 'Approved':
                return '✓'
            case 'success':
                return '✓'
            case 'installment':
                return '✓'
            case 'Pending':
                return '!'
            case 'Cancelled':
                return '𐄂'
            case 'Rejected':
                return '𐄂'
            default:
                return '✓'
        }
    }

    const getLineBgColor = () => {
        switch (lineColorStatus) {
            case 'autopatcreate':
                return 'green'
            case 'Approved':
                return 'green'
            case 'success':
                return 'green'
            case 'installment':
                return 'green'
            case 'Pending':
                return '#ffa50078'
            case 'Cancelled':
                return '#ff0000a8'
            case 'Rejected':
                return '#ff0000a8'
            default:
                return ''
        }
    }

    return (
        <div className={`${style.stepContainer}`}>
            <div className={`${style.stepElementsContainer}`}>
                <div style={{ position: 'relative' }}>
                    <div style={{ animationDelay: `${stepNo == 0 ? '0s' : `${stepNo * 2}s`}`, marginLeft: `${isLast ? '1px' : ''}`, paddingLeft: `${isLast ? '1px' : ''}`, animationIterationCount: `${isLast ? 'infinite' : '1'}` }} className={`${style.bubble} ${style[getAnimationNameForBubble(data.status)]}`}>
                    </div>
                    <div style={{ padding: `${isLast ? '0 0 2px 2px ' : ''}` }} className={`${style.bubble_content}`} >{getBubbleContent(data.status)}</div>
                </div>
                {
                    !isLast ? <div style={{ width: '2px', flex: '1', background: '#D3D3D3' }} >
                        <div className={`${style.line}`} style={{ background: `${getLineBgColor(lineColorStatus)}`, animationDelay: `${stepNo == 0 ? '0s' : `${stepNo * 2}s`}` }} ></div>
                    </div> : null
                }
                <div className='d-none d-md-block' style={{ paddingTop: "7px" }}>
                    {
                        !isLast ? <div style={{ width: '100%',marginLeft : "175px", height: "2px", flex: '1', background: '#D3D3D3', position: " relative", left: "40px" }}>
                            <div className={`${style.line}`} style={{ position: "absolute", background: `${getLineBgColor(lineColorStatus)}`, animationDelay: `${stepNo === 0 ? '0s' : `${stepNo * 2}s`}` }} ></div>
                        </div> : null
                    }
                </div>

            </div>
            <div className='d-none d-md-block'>
                <div style={{ paddingTop: `20px`, textAlign : "center" }}>
                    <div className={`${style.stepText}`}>{data.statusText}</div>
                    {
                        stepNo == 1 ?
                            <div className={`${style.stepBankname}`}>{data.bankName}</div> : null
                    }
                    {
                        stepNo == 2 ?
                            <div className={`${style.stepBankname}`}>{data.successDatetime}</div> : null
                    }
                </div>
            </div>
            <div className='d-md-none d-block'>
                <div style={{ padding: `0 0 ${isLast ? '0' : '3rem'} 0`, }}>
                    <div className={`${style.stepText}`}>{data.statusText}</div>
                    {
                        stepNo == 1 ?
                            <div className={`${style.stepBankname}`}>{data.bankName}</div> : null
                    }
                    {
                        stepNo == 2 ?
                            <div className={`${style.stepBankname}`}>{data.successDatetime}</div> : null
                    }
                </div>
            </div>
        </div>)

}


const MandateStepcomponet = ({data, status}) => {
    console.log("MandateStepcomponet data:", data);
    return (
        <>
            <div className='d-md-block d-none'>
                <div className='d-flex'>
                    <Step stepNo={0} data={{ statusText: 'Autopay Created' }} lineColorStatus={'success'} />
                    <Step stepNo={1} data={{
                        statusText:
                            data['mandate_status'] === 'Approved'
                                ? 'Autopay Authentication Approved'
                                : data['mandate_status'] === 'Rejected'
                                    ? 'Autopay Authentication Rejected'
                                    : data['mandate_status'] === 'Pending'
                                        ? 'Autopay Authentication Under Process'
                                        : data['mandate_status'] === 'Cancelled'
                                            ? 'Autopay Authentication Failed'
                                            : 'Autopay Authentication Under Process', status: data['mandate_status']}} lineColorStatus={status} />
                    <Step
                        stepNo={2}
                        data={{
                            statusText:
                                data['mandate_status'] === 'Approved'
                                    ? 'Autopay Approved'
                                    : data['mandate_status'] === 'Rejected'
                                        ? 'Autopay Rejected'
                                        : data['mandate_status'] === 'Pending'
                                            ? 'Autopay Approved/Rejected'
                                            : data['mandate_status'] === 'Cancelled'
                                                ? 'Autopay Failed'
                                                : 'Unknown Status'
                        }}
                        isLast={true}
                        lineColorStatus={status}
                    />

                </div>
            </div>

        </>
    );
};

export default MandateStepcomponet;
