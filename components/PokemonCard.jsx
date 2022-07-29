import React from "react";
import { Tooltip } from "@nextui-org/react";
import Info from "../icons/Info";

const PokemonCard = ({ pokemon, index, owned }) => {
  return (
    <article
      key={index}
      className={`text-white bg-white/20 border-2 border-white/40 pt-3 pl-3 pr-4 pb-4 rounded-md mr-4 flex drop-shadow-[0_0_5px_rgba(255,255,255,0.3)] shadow-[0_0_5px_rgba(255,255,255,0.3)] ${
        owned &&
        "bg-green-500/30 border-green-500/80 drop-shadow-[0_0_5px_rgba(50,255,50,0.3)] shadow-[0_0_5px_rgba(50,255,50,0.5)]"
      }`}
    >
      <div className="flex flex-col mr-3">
        <span className="flex items-center justify-between mx-2">
          <h3>{pokemon.name}</h3>
          <h3>N.º{pokemon.id}</h3>
        </span>
        <img className="w-[9rem] h-[9rem]" src="./pokemon2.png" alt="pokemon placeholder" />
      </div>
      <div>
        <h3>Stats</h3>
        <p className="">Evolution: {pokemon.evolution}</p>
        <p className="">Elements: {pokemon.elements.toString()}</p>
        <p className="">Weaknesses: {pokemon.weaknesses.toString()}</p>
        <div className="mt-1">
          <h3 className="text-base">Skills</h3>
          <span>
            {pokemon.skills.map((skill, index) => {
              return (
                <span className="" key={index}>
                  <Tooltip
                    content={
                      <span className="flex items-center">
                        <Info className="w-5 h-5 mr-1" />
                        {skill.description}
                      </span>
                    }
                    placement="bottom"
                    color="invert"
                    rounded={false}
                  >
                    <p>{skill.name}</p>
                  </Tooltip>
                </span>
              );
            })}
          </span>
        </div>
      </div>
    </article>
  );
};

export default PokemonCard;
