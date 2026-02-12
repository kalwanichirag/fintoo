import { useEffect, useRef, useState } from "react";

const SmallcaseGateway = (
    props
) => {
    const gatewayRef = useRef(null);
    const [sdkLoaded, setSdkLoaded] = useState(false);
    const [gatewayReady, setGatewayReady] = useState(false);



    /* ---------------------------------------------------------------------- */
    /*                        LOAD SMALLCASE SDK SCRIPT                         */
    /* ---------------------------------------------------------------------- */

    useEffect(() => {
        if (window.scDK) {
            setSdkLoaded(true);
            return;
        }

        const script = document.createElement("script");
        script.src = "https://gateway.smallcase.com/scdk/2.0.0/scdk.js";
        script.type = "text/javascript";
        script.async = true;
        console.log("script", script)
        script.onload = () => {
            setSdkLoaded(true);
        };

        script.onerror = () => {
            console.error("Failed to load Smallcase SDK");
        };

        document.body.appendChild(script);

        return () => {
            document.body.removeChild(script);
        };
    }, []);

    /* ---------------------------------------------------------------------- */
    /*                      INITIALIZE GATEWAY INSTANCE                         */
    /* ---------------------------------------------------------------------- */
    useEffect(() => {
        if (!sdkLoaded) return;

        gatewayRef.current = new window.scDK({
            gateway: props.gatewayName,
            smallcaseAuthToken: props.authToken,
            config: {
                amo: true
            }
        });
        setGatewayReady(true)
    }, [sdkLoaded, props.gatewayName, props.authToken]);

    useEffect(() => {
        console.log("sdkLoaded", sdkLoaded, gatewayReady);
        if (!gatewayReady) return;
        startTransaction();
    }, [gatewayReady])

    /* ---------------------------------------------------------------------- */
    /*                      TRIGGER TRANSACTION                                 */
    /* ---------------------------------------------------------------------- */
    const startTransaction = async () => {
        if (!gatewayRef.current) {
            console.error("Gateway not initialized");
            return;
        }

        try {
            const response = await gatewayRef.current.triggerMfTransaction({
                transactionId: props.transactionId
            });
            debugger

            if (response?.transactionId) {
                props.setIsLoading(true);
                if (props?.fetcEcas) {
                    setTimeout(async () => {
                        const fetchEcasResp = await props.fetchEcasData();
                        if (fetchEcasResp) {
                            props.setShowSuccessPopup(true);
                        }
                        props.setIsLoading(false);
                    }, 10000);
                }
                if (props?.parSnippet) {
                    if (props?.isLastView) {
                        setTimeout(async () => {
                            let res = await props.generateParSnippet(3);
                            if (res === true) {
                                props.setShowSuccessPopupSpinner(true);
                                // props.ShowSuccessPopup();
                            } else {
                                if (props.areBothSelected.stockStatus === false) {
                                    props.setAreBothSelected(prev => ({ ...prev, MFStatus: false }))
                                    props.setInvestmentTypeView('SUCCESSVIEW');
                                } else {
                                    props.setShowSuccessPopupSpinner(true);
                                }
                                props.setIsLoading(false);
                            }
                        }, 20000);
                    } else {
                        setTimeout(async () => {

                            let res = await props.generateParSnippet(2);
                            if (res === true) {
                                props.setShowSuccessPopupSpinner(true);
                            } else {
                                props.setAreBothSelected(prev => ({ ...prev, MFStatus: false }))
                                props.setIsLoading(false);
                            }

                        }, 20000);
                    }
                }
                if (props?.portfolio || props?.dg) {
                    props.setModalType(2)
                }
                if (props?.dg) {
                    props.setModalType(2)
                    props.fetchSmallcase();
                    props.setIsLoading(false);
                }
            }
            console.log("Transaction success:", response);
        } catch (err) {
            console.error("Transaction failed:", err.message || err);
            if (props.onError) {
                props.onError(err);
            }
        }
    };

};

export default SmallcaseGateway;
