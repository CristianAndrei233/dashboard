import React, { useEffect, useState } from "react";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import { scaleLinear } from "d3-scale";
import { csv } from "d3-fetch";
import styled from "styled-components";
import worldMap from "../TopoJSON/world.json";
import { Tooltip as ReactTooltip } from "react-tooltip";
import iso from "iso-3166-1";

const csvUrl = "/data/migrant-stock-total.csv";

const colorScale = scaleLinear()
  .domain([0, 100000, 1000000, 5000000, 10000000, 50000000])
  .range(["#e5f5f9", "#99d8c9", "#2ca25f", "#006d2c", "#00441b"]);

const Navbar = styled.div`
  background-color: #004aad;
  color: white;
  padding: 10px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Title = styled.h1`
  font-size: 1.5em;
  margin: 0;
`;

const MapContainer = styled.div`
  width: 90%;
  max-width: 800px;
  margin: 20px auto;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const ComposableMapStyled = styled(ComposableMap)`
  width: 100%;
  height: auto;
`;

const GeographyStyled = styled(Geography)`
  cursor: pointer;
`;

const LegendContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 20px;
`;

const LegendItem = styled.div`
  display: flex;
  align-items: center;
  margin-right: 10px;
`;

const LegendColor = styled.div`
  width: 20px;
  height: 20px;
  background-color: ${(props) => props.color};
  margin-right: 5px;
`;

const LegendLabel = styled.span`
  font-size: 0.9em;
`;

const TooltipContainer = styled.div`
  background-color: white;
  padding: 10px;
  border-radius: 5px;
`;

const TooltipTitle = styled.h3`
  font-size: 1.1em;
  margin-bottom: 5px;
  color: #004aad;
`;

const TooltipSubtitle = styled.p`
  font-size: 0.9em;
  margin-bottom: 10px;
  color: #666;
`;

const TooltipInfo = styled.p`
  font-size: 0.9em;
  margin-bottom: 5px;
  color: #000;
`;

const WorldMap = () => {
  const [data, setData] = useState([]);
  const [tooltipContent, setTooltipContent] = useState("");

  // Manual override for country names that might not match ISO names
  const countryNameOverrides = {
    "Russia": "RUS",
    "United States of America": "USA",
    "South Korea": "KOR",
    "North Korea": "PRK",
    "Vietnam": "VNM",
    "Ivory Coast": "CIV",
    "Democratic Republic of the Congo": "COD",
    "Czech Republic": "CZE",
    "Slovakia": "SVK",
    "United Kingdom": "GBR", // Added override for United Kingdom
  };

  useEffect(() => {
    csv(csvUrl)
      .then((csvData) => {
        const countryData = csvData.reduce((acc, curr) => {
          const countryCode = curr.Code;
          const migrantStock =
            +curr["International migrant stock, total"] || 0;
          if (!acc[countryCode]) {
            acc[countryCode] = 0;
          }
          acc[countryCode] += migrantStock;
          return acc;
        }, {});

        const aggregatedData = Object.entries(countryData).map(
          ([code, totalMigrantStock]) => ({
            code,
            totalMigrantStock,
          })
        );

        setData(aggregatedData);
      })
      .catch((error) => {
        console.error("Error loading the CSV data:", error);
      });
  }, []);

  const handleMouseEnter = (geo, current) => {
    setTooltipContent({
      title: geo.properties.name,
      info: current
        ? `${current.totalMigrantStock.toLocaleString()} migrants`
        : "No data",
    });
  };

  const handleMouseLeave = () => {
    setTooltipContent("");
  };

  return (
    <div>
      <Navbar>
        <Title>Total number of international immigrants, 2015</Title>
      </Navbar>
      <MapContainer>
        <ComposableMapStyled data-tooltip-id="country-tooltip">
          <Geographies geography={worldMap}>
            {({ geographies }) =>
              geographies.map((geo) => {
                const countryName = geo.properties.name;
                const alpha3CountryCode = 
                  countryNameOverrides[countryName] || iso.whereCountry(countryName)?.alpha3;
                const current = data.find((d) => d.code === alpha3CountryCode);
                const color = current
                  ? colorScale(current.totalMigrantStock)
                  : "#EEE";

                return (
                  <GeographyStyled
                    key={geo.rsmKey}
                    geography={geo}
                    style={{
                      default: { fill: color, outline: "none" },
                      hover: { fill: "#FFD700", outline: "none" },
                      pressed: { fill: "#FF4500", outline: "none" },
                    }}
                    onMouseEnter={() => handleMouseEnter(geo, current)}
                    onMouseLeave={handleMouseLeave}
                  />
                );
              })
            }
          </Geographies>
        </ComposableMapStyled>
        {tooltipContent && (
          <ReactTooltip
            id="country-tooltip"
            place="right"
            type="dark"
            effect="float"
          >
            <TooltipContainer>
              <TooltipTitle>{tooltipContent.title}</TooltipTitle>
              <TooltipSubtitle>
                Total number of international immigrants, 2015
              </TooltipSubtitle>
              <TooltipInfo>{tooltipContent.info}</TooltipInfo>
            </TooltipContainer>
          </ReactTooltip>
        )}
        <LegendContainer>
          <LegendItem>
            <LegendColor color="#e5f5f9" />
            <LegendLabel>0 - 100,000</LegendLabel>
          </LegendItem>
          <LegendItem>
            <LegendColor color="#99d8c9" />
            <LegendLabel>100,000 - 1,000,000</LegendLabel>
          </LegendItem>
          <LegendItem>
            <LegendColor color="#2ca25f" />
            <LegendLabel>1,000,000 - 5,000,000</LegendLabel>
          </LegendItem>
          <LegendItem>
            <LegendColor color="#006d2c" />
            <LegendLabel>5,000,000 - 10,000,000</LegendLabel>
          </LegendItem>
          <LegendItem>
            <LegendColor color="#00441b" />
            <LegendLabel>10,000,000 - 50,000,000</LegendLabel>
          </LegendItem>
        </LegendContainer>
      </MapContainer>
    </div>
  );
};

export default WorldMap;
