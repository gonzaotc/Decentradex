import React from "react";

const Train = ({ contract, ownedPokemons }) => {
  const [id, setId] = useState("");
  const [inputError, setInputError] = useState({ display: false, error: "" });
  const [firstInputRender, setFirstInputRender] = useState(true);

  const isOwned = id => {
    return ownedPokemons.some(pokemon => pokemon.id == id);
  };

  // The contractNameArg will be set in the mintButton call, to evitate
  // multiple usePrepareContractWrite when the user changes the name input
  // This is actually not working, because it says that mint() it's not defined.
  const [contractNameArg, setContractNameArg] = useState("");

  const { config } = usePrepareContractWrite({
    ...contract,
    functionName: "trainPokemon",
    args: [id],
  });

  const {
    data: mintData,
    isError: isTrainingError,
    error: trainingError,
    isLoading: isTrainingLoading,
    isSuccess: isTrainingStarted,
    write: train,
  } = useContractWrite({
    ...config,
  });

  const {
    isSuccess: isTxSuccess,
    isLoading: isTxLoading,
    isError: isTxError,
  } = useWaitForTransaction({
    hash: mintData?.hash,
  });

  useEffect(() => {
    firstInputRender && setFirstInputRender(false);
    setInputError({ display: false, error: "first render disable" });
    if (!firstInputRender) {
      if (!isOwned(id)) {
        setInputError({ display: true, error: "You must own the pokemon" });
      }
      if (isOwned(id)) {
        setInputError({ display: false, error: "" });
      }
    }
  }, [id]);
  {
    /* mintData, isMintLoading, isMintStarted, isMintingError*/
  }
  {
    /* isTxSuccess, isTxLoading,  isTxError */
  }

  useEffect(() => {
    if (isTxSuccess) {
      onClose();
    }
  }, [isTxSuccess]);

  const onTrainPokemon = () => {
    console.log("trigering onTrainPokemon");
    // Falta agregar debouncing al minting
    setContractNameArg(id);
    train();
  };
  return (
    <>
      <h3 className="text-white mb-5">Train a pokemon</h3>
      <span className="flex align-items text-white ">
        <label htmlFor="pokemonId" className="mr-2 text-lg">
          Id:
        </label>
        <span className="relative">
          <input
            id="pokemonId"
            type="number"
            className="text-white py-1 px-2 rounded-md bg-white/10 flex items-center justify-center"
            value={id}
            onChange={e => {
              setId(e.target.value);
            }}
          />
          {inputError.display && (
            <p className="text-red-600 text-sm absolute top-[2.2rem]">{inputError.error}</p>
          )}
        </span>
      </span>
      {/* mintData, isMintLoading, isMintStarted, isMintingError*/}
      {/* isTxSuccess, isTxLoading,  isTxError */}
      <Tooltip
        content={
          isTrainingError && (
            <span className="flex items-center">
              <Error className="w-5 h-5 mr-1 text-red-500" />
              <p className="text-red-500">{trainingError.toString()}</p>
            </span>
          )
        }
        placement="bottom"
        color="invert"
        rounded={false}
        className={"mt-8 !w-full"}
      >
        <button
          className="btn w-full h-10"
          disabled={inputError.error || isTrainingLoading || isTxLoading}
          onClick={() => {
            if (!inputError.error) {
              onTrainPokemon();
            }
          }}
        >
          <p className="mr-2">
            {isTrainLoading && "Waiting confirmation"}
            {isTrainingError && "Transaction rejected. Try Again"}
            {isTxError && "Transaction error"}
            {isTxLoading && "Waiting transaction"}
            {isTxSuccess && "Transaction processed!"}

            {!isTrainLoading &&
              !isTrainingError &&
              !isTxLoading &&
              !isTxError &&
              !isTxSuccess &&
              "TRAIN POKEMON"}
          </p>

          {(isTrainLoading || isTxLoading) && (
            <Loading size="sm" color="currentColor" textColor={"primary"} />
          )}
        </button>
      </Tooltip>
    </>
  );
};

export default Train;
