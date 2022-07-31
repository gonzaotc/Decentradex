import React from "react";
const Emoji = (props) => {
  return (
    <span className="">
      <span
        key={props.key}
        className="emoji"
        role="img"
        aria-label={props.label ? props.label : ""}
        aria-hidden={props.label ? "false" : "true"}
      >
        {props.symbol}
      </span>
    </span>
  );
};

export default Emoji;
