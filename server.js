const compression = require('compression');
const express = require("express");
const path = require("path");
const app = express();
const fs = require("fs");
const metadata = require("./src/meta-data.json");
const structuredData = require("./src/schema-template.json");
const cheerio = require("cheerio");

app.use(compression({ filter: shouldCompress }))

function shouldCompress(req, res) {
  if (req.headers['x-no-compression']) {
    // don't compress responses with this request header
    return false
  }
  // fallback to standard filter function
  return compression.filter(req, res)
}

app.use(function (req, res, next) {
  res.locals.page = fs.readFileSync(
    path.join(__dirname, "backup", "index.html"),
    "utf8"
  );
  let $ = cheerio.load(res.locals.page);

  if (req.path in metadata) {
    $("title").text(metadata[req.path]["title"]);
    $('meta[name="description"]').attr(
      "content",
      metadata[req.path]["description"]
    );
    if (metadata[req.path]["keywords"]) {
      $('head').append(`<meta name="keywords" content="${metadata[req.path]["keywords"]}">`);
    }
  }
  let newFullUrl = 'https://' + req.get('host');
 
  if(req.originalUrl.indexOf("web/financial-planning-page")) {
    $('head').append(`<script type="application/ld+json">${JSON.stringify(structuredData["webPage"])}</script>`);
    $('head').append(`<script type="application/ld+json">${JSON.stringify(structuredData["mainEntityOfPage"])}</script>`);
    $('head').append(`<script type="application/ld+json">${JSON.stringify(structuredData["publisher"])}</script>`);
    $('head').append(`<script type="application/ld+json">${JSON.stringify(structuredData["Person"])}</script>`);
    $('head').append(`<script type="application/ld+json">${JSON.stringify(structuredData["FAQPage"])}</script>`);
    $('head').append(`<script type="application/ld+json">${JSON.stringify(structuredData["ServiceSchema"])}</script>`);
  }
  if (removeSlash(req.originalUrl) == "/" || removeSlash(req.originalUrl) == "/web") {
    $("head").append(`<link rel="canonical" href="${newFullUrl}" />`);
  } else {
    $("head").append(`<link rel="canonical" href="${newFullUrl}${removeSlash(req.originalUrl)}" />`);
  }


  // if (req.headers.host.indexOf("fintoo.ae") > -1 || req.headers.host.indexOf("fintoo.in") > -1) {
  //   $("script").each((i, v)=> {
  //     let srcStr = ($(v).attr('src')??'');
  //     srcStr = srcStr.substring(srcStr.lastIndexOf('/'), srcStr.length);
  //     if(srcStr.indexOf('main.') > -1 && srcStr.indexOf('.js') > -1) {
  //       $(v).attr('src', 'https://static.fintoo.in/web/..'  + $(v).attr('src'));
  //     }
  //   });
  //   $("link").each((i, v)=> {
  //     let srcStr = ($(v).attr('href')??'');
  //     srcStr = srcStr.substring(srcStr.lastIndexOf('/'), srcStr.length);
  //     if(srcStr.indexOf('main.') > -1 && srcStr.indexOf('.css') > -1) {
  //       $(v).attr('href', 'https://static.fintoo.in/web/..'  + $(v).attr('href'));
  //     }
  //   });
  // }


  if (req.headers.host.includes("fintoo.ae")) {
    // add facebook pixel
    $("head").append(`<!-- Google Tag Manager -->
    <script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
    new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
    j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
    'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
    })(window,document,'script','dataLayer','GTM-MKPQ8XQ');</script>
    <!-- End Google Tag Manager -->`);
    $("body").prepend(`<!-- Google Tag Manager (noscript) -->
    <noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-MKPQ8XQ"
    height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
    <!-- End Google Tag Manager (noscript) -->`);

    $("head").append(`\n<script>
    !function(f,b,e,v,n,t,s)
    {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
    n.callMethod.apply(n,arguments):n.queue.push(arguments)};
    if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
    n.queue=[];t=b.createElement(e);t.async=!0;
    t.src=v;s=b.getElementsByTagName(e)[0];
    s.parentNode.insertBefore(t,s)}(window,document,'script',
    'https://connect.facebook.net/en_US/fbevents.js');
    fbq('init', '3441872112791896'); 
    fbq('track', 'PageView');\n</script>\n\n<noscript><img height="1" width="1" src="https://www.facebook.com/tr?id=3441872112791896&ev=PageView&noscript=1"/></noscript>\n\n`);
  } else {
    // add google analytics code
    $("head").append(`\n\n<!-- Google tag (gtag.js) -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=G-2KNJNX73N1"></script>
    <script>
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
    
      gtag('config', 'G-2KNJNX73N1');
    </script>\n\n`);

    // add google tag manager
    $("head").append(`\n\n<!-- Google Tag Manager -->
    <script>
      (function (w, d, s, l, i) {
        w[l] = w[l] || [];
        w[l].push({ "gtm.start": new Date().getTime(), event: "gtm.js" });
        var f = d.getElementsByTagName(s)[0],
          j = d.createElement(s),
          dl = l != "dataLayer" ? "&l=" + l : "";
        j.async = true;
        j.src = "https://www.googletagmanager.com/gtm.js?id=" + i + dl;
        f.parentNode.insertBefore(j, f);
      })(window, document, "script", "dataLayer", "GTM-M6ZJSZB");
    </script>
    <!-- End Google Tag Manager -->\n\n`);
    // add facebook pixel
    $("head").append(`\n<script>
    !function(f,b,e,v,n,t,s)
    {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
    n.callMethod.apply(n,arguments):n.queue.push(arguments)};
    if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
    n.queue=[];t=b.createElement(e);t.async=!0;
    t.src=v;s=b.getElementsByTagName(e)[0];
    s.parentNode.insertBefore(t,s)}(window,document,'script',
    'https://connect.facebook.net/en_US/fbevents.js');
    fbq('init', '257265244657888'); 
    fbq('track', 'PageView');\n</script>\n\n<noscript><img height="1" width="1" src="https://www.facebook.com/tr?id=257265244657888&ev=PageView&noscript=1"/></noscript>\n\n`);
  }

  if (req.originalUrl.includes("/web/financial-planning-page")) {
    $('head').append(`<script type="text/javascript">
      (function(w,s){
        var e=document.createElement("script");
        e.type="text/javascript";
        e.async=true;
        e.src="https://cdn-in.pagesense.io/js/mihikainsurancefinancialcons/b969416df89c4a87a17f798fb13595e4.js";
        var x=document.getElementsByTagName("script")[0];
        x.parentNode.insertBefore(e,x);
      })(window,"script");
    </script>`);
  
    $('head').append(`<script src="https://cdn-in.pagesense.io/js/mihikainsurancefinancialcons/b969416df89c4a87a17f798fb13595e4.js"></script>`);
}


  res.locals.page = $.html();
  if (req.originalUrl == "/") {
    return res.send(res.locals.page);
  } else {
    next();
  }
});

app.use(express.static(path.join(__dirname, "build")));
app.use(express.static(path.join(__dirname, "backup")));

app.get("/web/sitemap", function (req, res) {
  return res.sendFile(path.join(__dirname, "build", "sitemap.html"));
});

app.get("/web/nri-desk-dubai", function (req, res) {
  if (req.headers.host.indexOf("fintoo.ae") > -1) {
    const $ = cheerio.load(res.locals.page);
    $("head").append(`<meta name="facebook-domain-verification" content="unl7vsnr01kg6jbwmt5hfknghz37jh" />\n\n`);
    res.locals.page = $.html();
  }
  return res.send(res.locals.page);
});

app.get("/*", function (req, res) {
  return res.send(res.locals.page);
});

app.listen(3000);
