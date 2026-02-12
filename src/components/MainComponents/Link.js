import React from "react";

import { Link as ReactLink } from "react-router-dom";

function Link(props) {
  return (
    <ReactLink {...props} to={`${process.env.PUBLIC_URL}${props.to}`}>
      {props.children}
    </ReactLink>
  );
}

export default Link;
