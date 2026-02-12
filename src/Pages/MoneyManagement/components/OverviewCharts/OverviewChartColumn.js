import { useEffect, useState } from "react";
import Styles from '../../moneymanagement.module.css';
import { indianRupeeFormat } from "../../../../common_utilities";

const OverviewChartColumn = (props) => {

    const geColHeight = (height) => {
        if (height == 0) return 25;
        if (height < 25) return 30;
        return height;
    }

    const formatBalance = (balance) => {
        if (balance == undefined) return ''

        if (balance >= 10000000) {
            return '₹ ' + (balance / 10000000).toFixed(1) + ' Cr';
        } else if (balance >= 100000) {
            return '₹ ' + (balance / 100000).toFixed(1) + ' L';
        } else if (balance >= 1000) {
            return '₹ ' + (balance / 1000).toFixed(1) + ' K';
        } else {
            const currentBal = indianRupeeFormat(balance);
            if (currentBal.endsWith(".00")) {
                const trimmedBal = currentBal.slice(0, -3);
                return trimmedBal;
            } else {
                return currentBal;
            }
        }
    };

    return (
        <div className={`${Styles.overviewChartColumnElem}`} >
            <div className={`${Styles.overviewChartColumnOuter}`} onClick={() => props.changeView && props.changeView(props.view)} style={{ height: `${geColHeight(props.height)}px`,cursor: `${props.changeView ? 'pointer' : ''}` }}>
                {
                    <div className={`${Styles.overviewChartColumnValue}`}>{formatBalance(props.value)}</div>
                }
                <div style={{ width: '100%', borderRadius: '7px', backgroundColor: props.colorTheme, flex: '1' }}></div>
            </div>
            <div className={`${Styles.overviewChartColumnLabel}`}>{props.label}</div>
        </div>
    );
};
export default OverviewChartColumn;
