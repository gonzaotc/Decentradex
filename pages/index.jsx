import { ConnectButton } from "@rainbow-me/rainbowkit";
import Head from "next/head";
import { useEffect, useState } from "react";
import {
  useAccount,
  useContract,
  useProvider,
  useContractEvent,
  useContractRead,
  useContractReads,
  useContractWrite,
} from "wagmi";
import PokemonCard from "../components/PokemonCard";
import abi from "../abi.json";
import Modal from "../components/Modal";

const Home = () => {
  const { address, isConnecting, isDisconnected } = useAccount();
  const [userAddress, setUserAddress] = useState(undefined);

  const [ownedPokemons, setOwnedPokemons] = useState([]);
  const [notOwnedPokemons, setNotOwnedPokemons] = useState([]);
  const [loadingPokemons, setLoadingPokemons] = useState(true);

  const [modal, setModal] = useState(false);

  // const provider = useProvider();
  // const contract = useContract({
  //   addressOrName: "0x01f63f2e5057452eb00d643fc0f4efb61e55f4ba",
  //   contractInterface: abi,
  // });

  const contract = {
    addressOrName: "0x352f462ca60fb48ea0b576693c1ee32dc83cb573",
    contractInterface: abi,
  };

  const {
    data,
    isError: isReadError,
    isLoading: isReadLoading,
  } = useContractReads({
    contracts: [
      {
        ...contract,
        functionName: "getAllPokemons",
      },
      {
        ...contract,
        functionName: "getAllElements",
      },
      {
        ...contract,
        functionName: "getAllSkills",
      },
    ],
    watch: true,
  });

  // Get data from blockchain -> when:
  // 1. User enters the app
  // 2. Creation/Training events are listened

  // Filter the data when:
  // 1. The user enters the app
  // 2. The user changes address

  useEffect(() => {
    console.log("address", address);
    console.log("data", data);
    setLoadingPokemons(true);
    const owned = [];
    const notOwned = [];
    console.log(data);
    data[0].forEach(pokemon => {
      const formattedPokemon = {
        owner: pokemon.owner,
        name: pokemon.name,
        id: pokemon.id.toString(),
        evolution: pokemon.evolution.toString(),
        elements: pokemon.elements,
        weaknesses: pokemon.weaknesses,
        skills: pokemon.skills,
      };
      pokemon.owner == address ? owned.push(formattedPokemon) : notOwned.push(formattedPokemon);
    });
    setOwnedPokemons(owned);
    setNotOwnedPokemons(notOwned);
    setLoadingPokemons(false);
  }, [address, data]);

  // userAddress is only used to display it in the UI.
  useEffect(() => {
    if (address) {
      setUserAddress(address);
    } else {
      setUserAddress(undefined);
    }
  }, [address]);

  return (
    <div className={`bg-zinc-900 flex justify-center min-h-screen `}>
      <Head>
        <title>Cryptopokemons</title>
        <meta
          name="description"
          content="A React + Solidity small fun app to mint and evolve Pokemons!"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="w-11/12 flex flex-col items-center">
        {modal && (
          <Modal
            contract={contract}
            onClose={() => {
              setModal(false);
            }}
          />
        )}
        <nav className="w-full flex justify-between items-center pb-2 mt-2 mb-4 border-b-2 border-white/10">
          <h1>Cryptopokemons</h1>
          <h3>{userAddress}</h3>
          <ConnectButton accountStatus="address" />
        </nav>

        {loadingPokemons && (
          <p className="text-green-500 text-3xl font-semibold fixed top-[50%] translate-y-[-50%]">
            LOADING...
          </p>
        )}
        {!loadingPokemons && (
          <main className="w-full flex flex-col">
            <>
              <section className="flex mb-2">
                {address && ownedPokemons.length < 3 && (
                  <button
                    className="btn"
                    onClick={() => {
                      setModal(true);
                    }}
                  >
                    Mint Pokemon
                  </button>
                )}
                {ownedPokemons.length > 0 && <button className="btn">Train Pokemon</button>}
              </section>
              {address && (
                <section className="mb-4">
                  <h3 className="mb-2">Your pokemons</h3>
                  <div className="flex">
                    {ownedPokemons.map((pokemon, index) => (
                      <PokemonCard key={index} pokemon={pokemon} owned={true} />
                    ))}
                    {ownedPokemons.length === 0 && (
                      <p className="text-white">You dont own any cryptopokemons.</p>
                    )}
                  </div>
                </section>
              )}
              <section className="mb-4">
                <h3 className="mb-2">All the pokemons</h3>
                <div className="flex">
                  {notOwnedPokemons.map((pokemon, index) => {
                    return <PokemonCard key={index} pokemon={pokemon} />;
                  })}
                  {notOwnedPokemons.length === 0 && (
                    <p className="text-white">There is no cryptopokemons made.</p>
                  )}
                </div>
              </section>
            </>
          </main>
        )}
      </div>
    </div>
  );
};

export default Home;
