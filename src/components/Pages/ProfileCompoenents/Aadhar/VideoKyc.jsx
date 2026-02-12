import React, { useEffect, useRef } from 'react';
import { render } from 'react-dom';
// Widget Core
import Filerobot from '@filerobot/core';

// Plugins
import Explorer from '@filerobot/explorer';
import XHRUpload from '@filerobot/xhr-upload';

// - Filerobot Image Editor for inline image editing
// - Webcam photo and video capture
import Webcam from '@filerobot/webcam';

// Widget and Plugin styles (you can also use style.css instead of style.min.css)
import '@filerobot/core/dist/style.min.css';
import '@filerobot/explorer/dist/style.min.css';
// import '@filerobot/image-editor/dist/style.min.css';
import '@filerobot/webcam/dist/style.min.css';

const VideoKyc = () => {
  const filerobot = useRef(null);

  useEffect(() => {
    const demoContainer = 'scaleflex-tests-v5a';
    const demoSecurityTemplateID = '......';

    filerobot.current = Filerobot({
      securityTemplateID: demoSecurityTemplateID,
      container: demoContainer,
      dev: false // optional, default: false
    })
      .use(Explorer, {
        config: {
          limit: 50,
          tagging: {
            language: 'en',
            confidence: 60,
            limit: 10,
            provider: 'google'
          }
        },
        target: '#filerobot-widget',
        inline: true,
        width: 700,
        height: 530,
        showDetailsView: true,
      })
      .use(XHRUplaod)
    //   .use(ImageEditor, {
    //     cloudimageToken: 'demo' // not needed if the samea s container's token in core
    //   })
      .use(Webcam);

    return () => {
      filerobot.current.close();
    }
  }, [])

  return (
    <div>
      <h1>React Example</h1>
      <div id="filerobot-widget" />
    </div>
  )
}
export default VideoKyc;