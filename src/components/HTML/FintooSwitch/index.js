import Switch from 'react-switch';

const FintooSwitch = (props) => {
    return (
        <Switch
            onChange={() => props.onChange()}
            checked={props.checked}
            className="react-switch"
            onColor="#DCDCDC"
            offColor="#DCDCDC"
            height={20}
            width={50}
            uncheckedIcon={
                <div
                    style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        height: "100%",
                        fontSize: 10,
                        paddingRight: 2,
                        color: '#042b62',
                        fontWeight: 800
                    }}
                >
                    No
                </div>
            }
            checkedIcon={
                <div
                    style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        height: "100%",
                        fontSize: 10,
                        paddingRight: 2,
                        color: '#042b62',
                        fontWeight: 800
                    }}
                >
                    &nbsp;Yes
                </div>
            }
        />
    );
}
export default FintooSwitch;