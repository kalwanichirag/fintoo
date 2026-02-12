import FintooInlineLoader from "../FintooInlineLoader";

const WhiteOverlay = (props) => {
    return (<>
        {Boolean(props.show) && (<>
            <div style={{ width: '100vw', height: '100vh', position: 'fixed', top: 0, left: 0, zIndex: 1000000 }}>
                <div style={{
                    display: 'flex',
                    width: '100%',
                    height: '100%',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    <FintooInlineLoader isLoading={true} />
                </div>
            </div>
        </>)
        }
    </>)
}
export default WhiteOverlay;