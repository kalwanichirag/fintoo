import { Helmet } from "react-helmet-async";

export default function PageHelmet({ pageStyles }) {
  return (
    <>
      <Helmet>
        <title>Womoneya 3.0 - A Fintoo Initiative</title>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" href="https://fintoo.in/static/media/favicon.ico" />

        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Playfair+Display:wght@700;800;900&display=swap"
          rel="stylesheet"
        />

        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
        <script>{"window.FontAwesomeConfig = { autoReplaceSvg: 'nest' };"}</script>
        <script
          src="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/js/all.min.js"
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
        ></script>
      </Helmet>

      <style>{pageStyles}</style>
    </>
  );
}
