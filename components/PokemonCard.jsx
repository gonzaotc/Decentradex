import React, { useState } from "react";
import { Tooltip } from "@nextui-org/react";
import Info from "../icons/Info";

const PokemonCard = ({ pokemon, index, owned }) => {
  const pokeColor = [];
  pokemon.color.forEach(color => {
    pokeColor.push(color.toNumber());
  });

  const pokeColorFormatted = "rgb(" + pokeColor.toString() + ")";
  const pokeDropShadow = " drop-shadow(0 0 1px " + pokeColorFormatted + ") ";
  const pokeColorClass =
    "opacity(1)" +
    pokeDropShadow +
    pokeDropShadow +
    pokeDropShadow +
    pokeDropShadow +
    pokeDropShadow +
    pokeDropShadow;
  

  return (
    <article
      key={index}
      className={`text-white bg-white/10 border-2 border-white/40 pt-3 pl-3 pr-4 pb-4 rounded-md flex drop-shadow-[0_0_5px_rgba(255,255,255,0.3)] shadow-[0_0_5px_rgba(255,255,255,0.3)] ${
        owned &&
        "bg-green-500/30 border-green-500/80 drop-shadow-[0_0_5px_rgba(50,255,50,0.3)] shadow-[0_0_5px_rgba(50,255,50,0.5)]"
      }`}
    >
      <div className="flex flex-col mr-3 w-[50%] items-center">
        <span className="flex items-center justify-between w-10/12 md:w-11/12">
          <p className="text-lg sm:text-base">{pokemon.name}</p>
          <p className="text-lg sm:text-base">N.º{pokemon.id}</p>
        </span>
        <img
          style={{ filter: pokeColorClass }}
          className={`w-full max-w-[120px] self-center`}
          src="./pokemonBlack.png"
          alt="pokemon placeholder"
        />
      </div>
      <div className="w-[50%]">
        <p className="text-lg sm:text-base mb-0.5">Stats</p>
        <p className="sm:text-xs">Evolution: {pokemon.evolution}</p>
        <p className="sm:text-xs">Elements: {pokemon.elements.toString()}</p>
        <p className="sm:text-xs">Weaknesses: {pokemon.weaknesses.toString()}</p>
        <div className="mt-1">
          <p className="text-lg sm:text-base">Skills</p>
          <span>
            {pokemon.skills.map((skill, index) => {
              return (
                <span className="" key={index}>
                  <Tooltip
                    content={
                      <span className="flex items-center w-[200px]">
                        <Info className="w-[40px] h-[40px] mr-1" />
                        <p className="">{skill.description}</p>
                      </span>
                    }
                    placement="bottom"
                    color="invert"
                    rounded={false}
                  >
                    <p className="sm:text-xs">{skill.name}</p>
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
