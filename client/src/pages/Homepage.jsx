import React from "react";
import GraphCountry from "../components/GraphCountry";
import { FaHandPointDown } from "react-icons/fa";

function Homepage() {
  return (
    <main className="flex flex-col items-center justify-center w-full max-w-5xl min-h-screen gap-4 p-24 mx-auto">
      <article className="w-full">
        <h1 className="text-xl font-bold">
          Population growth per country, 1950 to 2021
        </h1>
        <p className="inline-flex items-center gap-2">
          Click on the legend below to filter by continent{" "}
          <span>
            <FaHandPointDown className="text-yellow-700" />
          </span>
        </p>
      </article>
      <GraphCountry />
    </main>
  );
}

export default Homepage;
