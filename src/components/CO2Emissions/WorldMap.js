import React, { useEffect, useState } from "react";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import { scaleLinear } from "d3-scale";
import { csv } from "d3-fetch";
import styled from "styled-components";
import worldMap from "../../TopoJSON/world.json";
import { Tooltip as ReactTooltip } from "react-tooltip";
import iso from "iso-3166-1";
import Modal from "react-modal";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

const csvUrl = "/data/co-emissions-per-capita.csv";

const colorScale = scaleLinear()
  .domain([0, 0.1, 0.5, 1, 2, 5, 10, 20])
  .range(["#ffffcc", "#ffeda0", "#fed976", "#feb24c", "#fd8d3c", "#fc4e2a", "#e31a1c", "#b10026"]);

const Container = styled.div`
  width: 80%;
  max-width: 800px;
  margin: 20px auto;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 20px;
`;

const Title = styled.h1`
  font-size: 1.5em;
  margin-bottom: 20px;
  text-align: center;
`;

const MapContainer = styled.div`
  width: 100%;
  height: auto;
  margin-bottom: 20px;
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

const ModalContent = styled.div`
  padding: 20px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`;

const ModalTitle = styled.h2`
  font-size: 1.5em;
  margin-bottom: 15px;
  color: #333;
  text-align: center;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: #aaa;
  font-size: 1.5em;
  position: absolute;
  top: 10px;
  right: 10px;
  cursor: pointer;

  &:hover {
    color: #000;
  }
`;

const WorldMap = () => {
  const [data, setData] = useState([]);
  const [tooltipContent, setTooltipContent] = useState("");
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState(null);

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
    "United Kingdom": "GBR",
    "S. Sudan": "SSD",
    "Tanzania": "TZA",
    "W. Sahara": "ESH",
    "Dem. Rep. Congo": "COD",
    "Dominican Rep.": "DOM",
    "Falkland Is.": "FLK",
    "Fr. S. Antarctic Lands": "ATF",
    "Venezuela": "VEN",
    "Puerto Rico": "PRI",
    "Central African Rep.": "CAF",
    "Eq. Guinea": "GNQ",
    "eSwatini": "SWZ",
    "Palestine": "PSE",
    "Laos": "LAO",
    "Iran": "IRN",
    "Syria": "SYR",
    "Moldova": "MDA",
    "Solomon Is.": "SLB",
    "Taiwan": "TWN",
    "Brunei": "BRN",
    "Czechia": "CZE",
    "N. Cyprus": "CYP",
    "Somaliland": "SOM",
    "Bosnia and Herz.": "BIH",
    "Kosovo": "XKX",
  };

  useEffect(() => {
    csv(csvUrl)
      .then((csvData) => {
        const countryData = csvData.reduce((acc, curr) => {
          const countryCode = curr.Code;
          const co2Emissions = +curr["Annual CO₂ emissions (per capita)"] || 0;
          if (!acc[countryCode]) {
            acc[countryCode] = [];
          }
          if (curr.Year <= 2015) {
            acc[countryCode].push({ year: curr.Year, co2Emissions });
          }
          return acc;
        }, {});

        const aggregatedData = Object.entries(countryData).map(([code, emissionsData]) => ({
          code,
          emissionsData,
        }));
        setData(aggregatedData);
      })
      .catch((error) => {
        console.error("Error loading the CSV data:", error);
      });
  }, []);

  const getEmissionsDataForYear = (data, year) => {
    return data.find(item => item.year === year);
  };

  const handleMouseEnter = (geo, current) => {
    if (current && current.emissionsData) {
      const emissionsData2015 = getEmissionsDataForYear(current.emissionsData, 2015);
      if (emissionsData2015) {
        setTooltipContent({
          title: geo.properties.name,
          info: `${emissionsData2015.co2Emissions.toFixed(2)} tonnes per capita`,
        });
      } else {
        setTooltipContent({
          title: geo.properties.name,
          info: "No data",
        });
      }
    } else {
      setTooltipContent({
        title: geo.properties.name,
        info: "No data",
      });
    }
    console.log(`Geo: ${geo.properties.name}, Current: ${current ? JSON.stringify(current) : 'No current data'}`);
  };

  const handleMouseLeave = () => {
    setTooltipContent("");
  };

  const handleGeographyClick = (geo, current) => {
    setSelectedCountry({
      name: geo.properties.name,
      data: current ? current.emissionsData : [],
    });
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setSelectedCountry(null);
  };

  return (
    <Container>
      <Title>Per capita CO₂ emissions, up to 2015</Title>
      <MapContainer>
        <ComposableMapStyled data-tooltip-id="country-tooltip">
          <Geographies geography={worldMap}>
            {({ geographies }) =>
              geographies.map((geo) => {
                const countryName = geo.properties.name;
                const alpha3CountryCode = countryNameOverrides[countryName] || iso.whereCountry(countryName)?.alpha3;
                const current = data.find((d) => d.code === alpha3CountryCode);
                if (!current) {
                  console.log(`No data for ${countryName} (${alpha3CountryCode})`);
                }
                const color = current ? colorScale(current.emissionsData.reduce((acc, item) => acc + item.co2Emissions, 0) / current.emissionsData.length) : "#EEE";

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
                    onClick={() => handleGeographyClick(geo, current)}
                  />
                );
              })
            }
          </Geographies>
        </ComposableMapStyled>
        {tooltipContent && (
          <ReactTooltip id="country-tooltip" place="right" type="dark" effect="float">
            <TooltipContainer>
              <TooltipTitle>{tooltipContent.title}</TooltipTitle>
              <TooltipSubtitle>CO₂ emissions per capita, 2015</TooltipSubtitle>
              <TooltipInfo>{tooltipContent.info}</TooltipInfo>
            </TooltipContainer>
          </ReactTooltip>
        )}
      </MapContainer>
      <LegendContainer>
        <LegendItem>
          <LegendColor color="#ffffcc" />
          <LegendLabel>0 t</LegendLabel>
        </LegendItem>
        <LegendItem>
          <LegendColor color="#ffeda0" />
          <LegendLabel>0.1 t</LegendLabel>
        </LegendItem>
        <LegendItem>
          <LegendColor color="#fed976" />
          <LegendLabel>0.5 t</LegendLabel>
        </LegendItem>
        <LegendItem>
          <LegendColor color="#feb24c" />
          <LegendLabel>1 t</LegendLabel>
        </LegendItem>
        <LegendItem>
          <LegendColor color="#fd8d3c" />
          <LegendLabel>2 t</LegendLabel>
        </LegendItem>
        <LegendItem>
          <LegendColor color="#fc4e2a" />
          <LegendLabel>5 t</LegendLabel>
        </LegendItem>
        <LegendItem>
          <LegendColor color="#e31a1c" />
          <LegendLabel>10 t</LegendLabel>
        </LegendItem>
        <LegendItem>
          <LegendColor color="#b10026" />
          <LegendLabel>20 t</LegendLabel>
        </LegendItem>
      </LegendContainer>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Country Data Modal"
        style={{
          content: {
            top: '50%',
            left: '55%',
            right: 'auto',
            bottom: 'auto',
            marginRight: '-50%',
            transform: 'translate(-50%, -50%)',
            width: '600px',
            padding: '0', 
            border: 'none',
            borderRadius: '8px', 
            boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)', 
          },
          overlay: {
            backgroundColor: 'rgba(0, 0, 0, 0.5)', 
          }
        }}
      >
        {selectedCountry && (
          <ModalContent>
            <CloseButton onClick={closeModal}>&times;</CloseButton>
            <ModalTitle>{selectedCountry.name}</ModalTitle>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={selectedCountry.data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="co2Emissions" stroke="#82ca9d" />
              </LineChart>
            </ResponsiveContainer>
          </ModalContent>
        )}
      </Modal>
    </Container>
  );
};

export default WorldMap;
