import { memo } from 'react';
import styles from './style.module.css';
import zero from '././assets/images/zero.svg'
import one from '././assets/images/one.svg'
import two from '././assets/images/two.svg'
import three from '././assets/images/three.svg'
import four from '././assets/images/four.svg'
import five from '././assets/images/five.svg'
import six from '././assets/images/six.svg'
import seven from '././assets/images/seven.svg'
import eight from '././assets/images/eight.svg'
import nine from '././assets/images/nine.svg'
import ten from '././assets/images/ten.svg'
import eleven from '././assets/images/eleven.svg'
import twelve from '././assets/images/twelve.svg'
import thirteen from '././assets/images/thirteen.svg'
import fourteen from '././assets/images/fourteen.svg'
import fifteen from '././assets/images/fifteen.svg'
import sixteen from '././assets/images/sixteen.svg'
import seventeen from '././assets/images/seventeen.svg'
import eighteen from '././assets/images/eighteen.svg'
import nineteen from '././assets/images/nineteen.svg'
import twenty from '././assets/images/twenty.svg'
import twentyone from '././assets/images/twentyone.svg'
import twentytwo from '././assets/images/twentytwo.svg'
import twentythree from '././assets/images/twentythree.svg'
import twentyfour from '././assets/images/twentyfour.svg'
import twentyfive from '././assets/images/twentyfive.svg'
import twentysix from '././assets/images/twentysix.svg'
import twentyseven from '././assets/images/twentyseven.svg'
import twentyeight from '././assets/images/twentyeight.svg'
import twentynine from '././assets/images/twentynine.svg'
import thirty from '././assets/images/thirty.svg'
import thirtyone from '././assets/images/thirtyone.svg'

const cardIconObj = {
    "0": zero,
    "1": one,
    "2": two,
    "3": three,
    "4": four,
    "5": five,
    "6": six,
    "7": seven,
    "8": eight,
    "9": nine,
    "10": ten,
    "11": eleven,
    "12": twelve,
    "13": thirteen,
    "14": fourteen,
    "15": fifteen,
    "16": sixteen,
    "17": seventeen,
    "18": eighteen,
    "19": nineteen,
    "20": twenty,
    "21": twentyone,
    "22": twentytwo,
    "23": twentythree,
    "24": twentyfour,
    "25": twentyfive,
    "26": twentysix,
    "27": twentyseven,
    "28": twentyeight,
    "29": twentynine,
    "30": thirty,
    "31": thirtyone,
}

const CalcDisplay = ({ calcData }) => {

    return (
        <>
            {
                calcData.length > 0 ? <div className={`${styles['calcdisplay-container']}`}>
                    {
                        calcData.map((calc, index) => <div key={index} className={`${styles['calcdisplay-card']}`}>
                            <div >
                                <div className={`${styles['calcdisplay-card-heading']}`}>{calc.heading}</div>
                                <div className={`${styles['calcdisplay-card-txt']}`}>
                                    {calc.info}
                                </div>
                            </div>

                            <a className={`${styles['calcdisplay-card-calc-btn']}`} href={calc.redirectUrl} target="_blank" rel="noopener noreferrer">Calculate</a>
                            <img className={`${styles['calcdisplay-card-calc-img']}`} src={cardIconObj[calc.index]} />
                        </div>)
                    }
                </div> :
                    <div className={`${styles['no-result-container']}`}>No results found</div>

            }
        </>

    );
}
export default memo(CalcDisplay);