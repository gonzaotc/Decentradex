import { ConnectButton } from "@rainbow-me/rainbowkit";
import Head from "next/head";
import { useEffect, useState } from "react";
import { useAccount, useContractReads } from "wagmi";
import PokemonCard from "../components/PokemonCard";
import abi from "../abi.json";
import Modal from "../components/Modal";
import PokemonContainer from "../components/PokemonContainer";
import Banner from "../components/Banner";
import Mint from "../components/Mint";
import Train from "../components/Train";

const Home = () => {
  const { address } = useAccount();

  const [ownedPokemons, setOwnedPokemons] = useState([]);
  const [notOwnedPokemons, setNotOwnedPokemons] = useState([]);
  const [loadingPokemons, setLoadingPokemons] = useState(true);

  const [modal, setModal] = useState({ display: false, content: "" });

  const contract = {
    addressOrName: "0x4b76d2f2818265d7aa5e1df3ab0e44a4406a7e30",
    contractInterface: abi,
  };

  const {
    data,
    // isError: isReadError,
    // isLoading: isReadLoading,
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
    console.log("data from blockchain read has changed:", data);
    setLoadingPokemons(true);
    const owned = [];
    const notOwned = [];
    console.log(data);
    data[0].forEach(pokemon => {
      const formattedPokemon = {
        owner: pokemon.owner,
        name: pokemon.name,
        id: pokemon.id.toString(),
        color: pokemon.color,
        evolution: pokemon.evolution.toString(),
        elements: pokemon.elements,
        weaknesses: pokemon.weaknesses,
        skills: pokemon.skills,
        lastTimeTrained: pokemon.lastTimeTrained.toString(),
      };
      pokemon.owner == address ? owned.push(formattedPokemon) : notOwned.push(formattedPokemon);
    });
    setOwnedPokemons(owned);
    setNotOwnedPokemons(notOwned);
    setLoadingPokemons(false);
  }, [address, data]);

  return (
    <div className={`bg-zinc-900 flex flex-col items-center min-h-screen `}>
      <Head>
        <title>Decentradex</title>
        <meta
          name="description"
          content="A React + Solidity small fun app to mint and evolve Pokemons!"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Banner contract={contract} />
      <div className="w-11/12 flex flex-col items-center">
        {modal.display && (
          <Modal
            contract={contract}
            onClose={() => {
              setModal({ display: false, content: "" });
            }}
          >
            {modal.content == "mint" && <Mint contract={contract} ownedPokemons={ownedPokemons} />}
            {modal.content == "train" && <Train contract={contract} />}
          </Modal>
        )}
        <nav className="w-full flex justify-between items-center pb-2 mt-2 mb-6 border-b-2 border-white/10">
          <h1 className="text-[1.4rem] sm:text-3xl">Decentradex</h1>
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
              <section className="flex mb-4">
                {address && ownedPokemons.length < 3 && (
                  <button
                    className="btn mr-2 w-full sm:w-auto"
                    onClick={() => {
                      setModal({ display: true, content: "mint" });
                    }}
                  >
                    Mint Pokemon
                  </button>
                )}
                {ownedPokemons.length > 0 && (
                  <button
                    className="btn w-full sm:w-auto"
                    onClick={() => {
                      setModal({ display: true, content: "train" });
                    }}
                  >
                    Train Pokemon
                  </button>
                )}
              </section>
              {address && (
                <section className="mb-4">
                  <h2 className="mb-3">Your pokemons</h2>
                  <PokemonContainer className="">
                    {ownedPokemons.map((pokemon, index) => (
                      <PokemonCard key={index} pokemon={pokemon} owned={true} />
                    ))}
                    {ownedPokemons.length === 0 && (
                      <p className="text-white">You dont own any pokemons.</p>
                    )}
                  </PokemonContainer>
                </section>
              )}
              <section className="mb-4">
                <h2 className="mb-3">All the pokemons</h2>
                <PokemonContainer className="">
                  {notOwnedPokemons.map((pokemon, index) => {
                    return <PokemonCard key={index} pokemon={pokemon} />;
                  })}
                  {notOwnedPokemons.length === 0 && (
                    <p className="text-white">There is no cryptopokemons made.</p>
                  )}
                </PokemonContainer>
              </section>
            </>
          </main>
        )}
      </div>
    </div>
  );
};

export default Home;
