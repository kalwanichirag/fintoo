import { useState } from "react";

const MainLayout = (props) => {

    const [verified, setVerified] = useState(true);

    return <>{verified ? props.children : <div style={{ minHeight: '80vh' }}></div>}</>;
};

export default MainLayout;
