import Style from './style.module.css';

const ToolTip = ({ children }) => (
    <>
        <div className={Style['nil-tooltip']}>
            <img src={require('../../../components/Assets/info.png')} style={{ width: '.9rem' }} />
            <div className={Style['nil-tooltip-text']}>
                {children}
            </div>
        </div>

    </>
)
export default ToolTip;