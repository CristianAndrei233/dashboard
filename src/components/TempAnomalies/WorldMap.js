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

const csvUrl = "/data/annual-temperature-anomalies.csv";

const colorScale = scaleLinear()
  .domain([-2, -1.5, -1, -0.5, 0, 0.5, 1, 1.5, 2])
  .range(["#0571b0", "#92c5de", "#d1e5f0", "#f7f7f7", "#f4a582", "#ca0020"]);

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
  const [data, setData] = useState({});
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
        const aggregatedData = csvData.reduce((acc, curr) => {
          const countryCode = curr.Code;
          const year = +curr.Year;
          const tempAnomaly = +curr["Temperature anomaly"] || 0;

          if (!acc[countryCode]) {
            acc[countryCode] = [];
          }

          acc[countryCode].push({ year, tempAnomaly });
          return acc;
        }, {});
        setData(aggregatedData);
      })
      .catch((error) => {
        console.error("Error loading the CSV data:", error);
      });
  }, []);

  const handleMouseEnter = (geo) => {
    const countryCode = countryNameOverrides[geo.properties.name] || iso.whereCountry(geo.properties.name)?.alpha3;
    const countryData = data[countryCode];
    if (countryData) {
      const year2015Data = countryData.find(d => d.year === 2015);
      if (year2015Data) {
        setTooltipContent({
          title: geo.properties.name,
          info: `${year2015Data.tempAnomaly.toFixed(2)}°C`,
        });
      } else {
        setTooltipContent({
          title: geo.properties.name,
          info: "No data for 2015",
        });
      }
    } else {
      setTooltipContent({
        title: geo.properties.name,
        info: "No data",
      });
    }
  };

  const handleMouseLeave = () => {
    setTooltipContent("");
  };

  const handleGeographyClick = (geo) => {
    const countryCode = countryNameOverrides[geo.properties.name] || iso.whereCountry(geo.properties.name)?.alpha3;
    const countryData = data[countryCode];
    setSelectedCountry({
      name: geo.properties.name,
      data: countryData || [],
    });
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setSelectedCountry(null);
  };

  return (
    <Container>
      <Title>Annual Temperature Anomalies, 2015</Title>
      <MapContainer>
        <ComposableMapStyled data-tooltip-id="country-tooltip">
          <Geographies geography={worldMap}>
            {({ geographies }) =>
              geographies.map((geo) => {
                const countryCode = countryNameOverrides[geo.properties.name] || iso.whereCountry(geo.properties.name)?.alpha3;
                const countryData = data[countryCode];
                let color = "#EEE";

                if (countryData) {
                  const year2015Data = countryData.find(d => d.year === 2015);
                  if (year2015Data) {
                    color = colorScale(year2015Data.tempAnomaly);
                  }
                }

                return (
                  <GeographyStyled
                    key={geo.rsmKey}
                    geography={geo}
                    style={{
                      default: { fill: color, outline: "none" },
                      hover: { fill: "#FFD700", outline: "none" },
                      pressed: { fill: "#FF4500", outline: "none" },
                    }}
                    onMouseEnter={() => handleMouseEnter(geo)}
                    onMouseLeave={handleMouseLeave}
                    onClick={() => handleGeographyClick(geo)}
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
              <TooltipSubtitle>Temperature anomaly, 2015</TooltipSubtitle>
              <TooltipInfo>{tooltipContent.info}</TooltipInfo>
            </TooltipContainer>
          </ReactTooltip>
        )}
      </MapContainer>
      <LegendContainer>
        <LegendItem>
          <LegendColor color="#0571b0" />
          <LegendLabel>-2°C</LegendLabel>
        </LegendItem>
        <LegendItem>
          <LegendColor color="#92c5de" />
          <LegendLabel>-1.5°C</LegendLabel>
        </LegendItem>
        <LegendItem>
          <LegendColor color="#d1e5f0" />
          <LegendLabel>-1°C</LegendLabel>
        </LegendItem>
        <LegendItem>
          <LegendColor color="#f7f7f7" />
          <LegendLabel>0°C</LegendLabel>
        </LegendItem>
        <LegendItem>
          <LegendColor color="#f4a582" />
          <LegendLabel>1°C</LegendLabel>
        </LegendItem>
        <LegendItem>
          <LegendColor color="#ca0020" />
          <LegendLabel>2°C</LegendLabel>
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
                <Line type="monotone" dataKey="tempAnomaly" stroke="#82ca9d" />
              </LineChart>
            </ResponsiveContainer>
          </ModalContent>
        )}
      </Modal>
    </Container>
  );
};

export default WorldMap;
