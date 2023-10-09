import React, { useEffect, useState } from "react";
import axios from "axios";
import Chart from "chart.js/auto";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { FaPlay, FaRegPauseCircle } from "react-icons/fa";
import Box from "@mui/material/Box";
import Slider from "@mui/material/Slider";
import useCustomHook from "../hook/useCustomHook";

function GraphCountry() {
  const [year, setYear] = useState(1950);
  const [play, setPlay] = useState(false);
  const [total, setTotal] = useState("");
  const [chartState, setChartState] = useState(null);
  const regionLabel = ["Asia", "Europe", "Africa", "Oceania", "Americas"];
  const [yearInterval, setYearInterval] = useState(null);
  const { bgColor, borderColor, arrayMark, convertToNumberFormat, addRegion } =
    useCustomHook();

  const getData = async () => {
    try {
      const result = await axios.post(
        `${import.meta.env.VITE_API}/country/topcountry`,
        {
          year: year.toString(),
        }
      );
      const total = await axios.post(
        `${import.meta.env.VITE_API}/country/world`,
        {
          year: year.toString(),
        }
      );
      const arrayResult = result.data.data;
      const resultAfterRegion = addRegion(arrayResult);
      setTotal(total.data.data.population);

      // สร้างกราฟ
      const ctx = document.getElementById("chartId").getContext("2d");
      if (chartState) {
        chartState.destroy();
      }

      const newChartState = new Chart(ctx, {
        type: "bar",
        data: {
          labels: resultAfterRegion.map((row) => row.countryname),
          datasets: [
            {
              label: "Population",
              data: resultAfterRegion.map((row) => row.population),
              backgroundColor: resultAfterRegion.map((row) =>
                bgColor(row.region)
              ),
              borderColor: resultAfterRegion.map((row) =>
                borderColor(row.region)
              ),
              borderWidth: 1,
              datalabels: { anchor: "end", align: "right" },
            },
          ],
        },
        plugins: [ChartDataLabels],
        options: {
          plugins: {
            datalabels: {
              formatter: function (value, context) {
                const population =
                  context.chart.data.datasets[0].data[context.dataIndex];
                const result = convertToNumberFormat(population);
                return result;
              },
            },
            legend: false,
          },
          indexAxis: "y",
          animation: false,
          x: {
            beginAtZero: true,
            stepSize: 200000000,
            position: "top",
            callback: function (value) {
              return value.toLocaleString();
            },
          },
        },
      });
      setChartState(newChartState);
    } catch (error) {
      //   console.log("error from fetching:", error);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    getData();
  }, [year]);

  const handleClickPlay = () => {
    if (yearInterval) {
      clearInterval(yearInterval);
    }

    const newYearInterval = setInterval(() => {
      setYear((prevYear) => {
        if (prevYear < 2021) {
          return prevYear + 1;
        } else {
          clearInterval(newYearInterval);
          setPlay(false);
          return prevYear;
        }
      });
    }, 300);

    setYearInterval(newYearInterval);
    setPlay(true);
  };

  return (
    <article className="w-full">
      <div className="flex gap-3">
        <p className="text-lg font-bold">Region:</p>
        {regionLabel.map((item, index) => (
          <div key={index} className="flex items-center justify-center gap-1">
            <div
              className="w-4 h-4"
              style={{
                backgroundColor: bgColor(item),
                border: `2px solid ${borderColor(item)}`,
              }}
            ></div>
            <p>{item}</p>
          </div>
        ))}
      </div>

      <div className="relative">
        <canvas
          id="chartId"
          aria-label="chart"
          className="w-full max-w-4xl h-96"
        ></canvas>
        <div className="absolute flex flex-col items-end p-4 bottom-8 right-9">
          <p className="text-5xl font-bold text-red-200">{year}</p>
          <p className="text-xl">Total: {convertToNumberFormat(total)} </p>
        </div>
      </div>

      <div className="flex items-center justify-center gap-6 mt-10">
        <button
          disabled={play}
          onClick={() => {
            if (year !== 1950) {
              setPlay(true);
              setYear(1950);
              handleClickPlay();
            } else {
              handleClickPlay();
              setPlay(true);
            }
          }}
        >
          {play ? (
            <FaRegPauseCircle className="p-2 text-black rounded-full bg-slate-300 w-9 h-9" />
          ) : (
            <FaPlay className="p-2 text-black rounded-full bg-slate-300 w-9 h-9" />
          )}
        </button>

        <div>
          <Box sx={{ width: 700 }}>
            <Slider
              aria-label="Always visible"
              min={1950}
              max={2021}
              value={year}
              getAriaValueText={(value) => value.toString()}
              valueLabelDisplay="on"
              marks={arrayMark(1950, 2021)}
            />
          </Box>
        </div>
      </div>
    </article>
  );
}

export default GraphCountry;
