import React, { useEffect, useState } from "react";
import { useContractEvent } from "wagmi";
import Info from "../icons/Info";

const Banner = ({ contract }) => {
  const [eventData, setEventData] = useState(undefined);
  const [message, setMessage] = useState("");
  useContractEvent({
    ...contract,
    eventName: "eventNewPokemon",
    listener: event => {
      console.log(event);
      setEventData({ event: "eventNewPokemon", data: event });
    },
  });

  useContractEvent({
    ...contract,
    eventName: "eventPokemonTrained",
    listener: event => {
      console.log(event);
      setEventData({ event: "eventPokemonTrained", data: event });
    },
  });

  // let stars = "";
  // if ((eventData.event = "eventPokemonTrained" && eventData.data.length > 0)) {
  //   for (let i = 0; i < eventData?.data[3].toString(); i++) {
  //     stars.concat("⭐");
  //   }
  // }

  useEffect(() => {
    if (eventData) {
      console.log(eventData);
      eventData.event == "eventNewPokemon" &&
        setMessage(
          eventData?.data[0].substring(0, 5) +
            "..." +
            eventData?.data[0].substring(38, 42) +
            " has just minted " +
            eventData?.data[1] +
            " who is type [" +
            eventData?.data[4].toString() +
            "]" +
            " and weak to " +
            "[" +
            eventData?.data[5].toString() +
            "]. "
        );
      eventData?.event == "eventPokemonTrained" &&
        setMessage(
          eventData?.data[1] +
            "who is owned by " +
            eventData?.data[0].substring(0, 5) +
            "..." +
            eventData?.data[0].substring(38, 42) +
            +" has evolved to evolution" +
            eventData?.data[3].toString() +
            " and has learn the skill " +
            eventData?.data[4]
        );
      setTimeout(() => {
        setEventData({ event: "", eventData: ["", "", "", "", "", "", ""] });
      }, 15000);
    }
  }, [eventData]);

  useEffect(() => {
    message && console.log(message);
  }, [message]);

  return (
    <>
      <div
        className={`w-full max-h-[16] py-3 bg-green-200 flex items-center justify-center transition-all duration-500 ${
          !message && "!max-h[0] !py-0"
        }`}
      >
        <div className="flex items-center justify-center">
          {message && <Info className="text-green-600 w-[23px] h-[23px] mr-0.5" />}
          <p className="relative bottom-[1px] font-medium text-base text-green-700">{message}</p>
        </div>
      </div>
    </>
  );
};

export default Banner;
