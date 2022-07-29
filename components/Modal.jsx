import React, { useEffect, useState } from "react";
import { useContractWrite, usePrepareContractWrite } from "wagmi";

const Modal = ({ onClose, contract }) => {
  const [name, setName] = useState("");

  const { config } = usePrepareContractWrite({
    ...contract,
    functionName: "createPokemon",
    args: [name],
  });

  const { data, isLoading, isSuccess, write } = useContractWrite({
    ...config,

    // Function to invoke when an error is thrown while attempting to write.
    onError(error) {
      console.log("onError", error);
    },
    // Function fires before the contract write function and is passed same variables
    // the contract write function would receive.Value returned from this function will
    // be passed to both onError and onSettled functions in event of a failure.

    // My notes: this gets trigerred when metamask is opened. 
    onMutate({ args }) {
      console.log("onMutate", { args });
    },
    // Function to invoke when write is settled (either successfully sent, or an error has thrown).
    onSettled(data, error) {
      console.log("onSettled", { data, error });
    },
    // Function to invoke when write is successful.
    onSuccess(data) {
      console.log("onSuccess", data);
    },
  });

  useEffect(() => {
    console.log("data has changed", data);
  }, [data]);
  useEffect(() => {
    console.log("isLoading has changed", isLoading);
  }, [isLoading]);
  useEffect(() => {
    console.log("isScucess has changed", isSuccess);
  }, [isSuccess]);

  const onMintPokemon = () => {
    console.log("mintingg");
    write();
  };

  return (
    <div
      className="fixed top-0 left-0 right-0 bottom-0 bg-black/50 flex items-center justify-center z-10"
      onClick={onClose}
    >
      <div
        className="w-[320px] h-[185px] rounded-lg z-20 bg-neutral-800 drop-shadow-[0_0_15px_rgba(0,0,0,0.7)] py-4 px-4 flex flex-col justify-between"
        onClick={e => {
          e.stopPropagation();
        }}
      >
        <h3 className="text-white mb-5">Mint a new pokemon</h3>
        <span className="flex align-items text-white ">
          <label htmlFor="pokemonName" className="mr-2 text-lg">
            Name:
          </label>
          <input
            id="pokemonName"
            type="text"
            className="text-white py-1 px-2 rounded-md bg-white/10 flex items-center justify-center"
            value={name}
            onChange={e => {
              setName(e.target.value);
            }}
          />
        </span>
        <button
          className="btn mt-8 w-full"
          disabled={name.length < 2}
          onClick={() => {
            if (name.length >= 2) {
              onMintPokemon();
            }
          }}
        >
          MINT POKEMON
        </button>
      </div>
    </div>
  );
};

export default Modal;
