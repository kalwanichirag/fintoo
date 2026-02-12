export const conversionFun = (trackingId, conversionId) => {
    window.dataLayer = window.dataLayer || [];
    function gtag() { window.dataLayer.push(arguments); }
    gtag('js', new Date());
    gtag('config', trackingId);

    try {
        gtag('event', 'conversion', { 'send_to': `${trackingId}/${conversionId}` });
    } catch (error) {
        console.error('Error sending WP conversion event', error);
    }
}