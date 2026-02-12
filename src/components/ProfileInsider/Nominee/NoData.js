import FintooButton from '../../HTML/FintooButton';

const NomineeNoData = ({ onAdd }) => {
    return (<>
    <div>
        <div className='row'>
            <div className='col-3'>
                <img src={require('../../../Assets/Images/profileInsider/no-data-883.jpg')} style={{ width: '300px' }} />
            </div>
            <div className='col-5'>
                <div className='pt-4'>
                    <h4>Add New Nominee</h4>
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
                    <FintooButton title="Add" onClick={()=> onAdd()} />
                </div>
            </div>

        </div>
    </div>
    </>);
}
export default NomineeNoData;