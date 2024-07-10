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

const csvUrl = "/data/migrant-stock-total.csv";

const colorScale = scaleLinear()
  .domain([0, 100000, 1000000, 5000000, 10000000, 50000000, 700000000])
  .range(["#e5f5f9", "#99d8c9", "#2ca25f", "#006d2c", "#00441b", "#004AAD"]);

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
  };

  useEffect(() => {
    csv(csvUrl)
      .then((csvData) => {
        const countryData = csvData.reduce((acc, curr) => {
          const countryCode = curr.Code;
          const migrantStock = +curr["International migrant stock, total"] || 0;
          if (!acc[countryCode]) {
            acc[countryCode] = [];
          }
          acc[countryCode].push({ year: curr.Year, totalMigrantStock: migrantStock });
          return acc;
        }, {});

        const aggregatedData = Object.entries(countryData).map(([code, stockData]) => ({
          code,
          stockData,
        }));
        setData(aggregatedData);
      })
      .catch((error) => {
        console.error("Error loading the CSV data:", error);
      });
  }, []);

  const getStockDataForYear = (data, year) => {
    return data.find(item => item.year === year);
  };
  
  const handleMouseEnter = (geo, current) => {
    if (current && current.stockData) {
      const stockData2015 = getStockDataForYear(current.stockData, "2015");
      if (stockData2015) {
        setTooltipContent({
          title: geo.properties.name,
          info: `${stockData2015.totalMigrantStock.toLocaleString()} migrants`,
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
  };

  const handleMouseLeave = () => {
    setTooltipContent("");
  };

  const handleGeographyClick = (geo, current) => {
    setSelectedCountry({
      name: geo.properties.name,
      data: current ? current.stockData : [],
    });
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setSelectedCountry(null);
  };

  return (
    <Container>
      <Title>World Map</Title>
      <MapContainer>
        <ComposableMapStyled data-tooltip-id="country-tooltip">
          <Geographies geography={worldMap}>
            {({ geographies }) =>
              geographies.map((geo) => {
                const countryName = geo.properties.name;
                const alpha3CountryCode = countryNameOverrides[countryName] || iso.whereCountry(countryName)?.alpha3;
                const current = data.find((d) => d.code === alpha3CountryCode);
                const color = current ? colorScale(current.stockData.reduce((acc, item) => acc + item.totalMigrantStock, 0)) : "#EEE";

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
              <TooltipSubtitle>Total number of international immigrants, 2015</TooltipSubtitle>
              <TooltipInfo>{tooltipContent.info}</TooltipInfo>
            </TooltipContainer>
          </ReactTooltip>
        )}
      </MapContainer>
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
                <YAxis style={{ marginLeft: '20px' }} />
                <Tooltip />
                <Line type="monotone" dataKey="totalMigrantStock" stroke="#82ca9d" />
              </LineChart>
            </ResponsiveContainer>
          </ModalContent>
        )}
      </Modal>
    </Container>
  );
};

export default WorldMap;
