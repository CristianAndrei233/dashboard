import React, { useEffect, useState } from "react";
import { csv } from "d3-fetch";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import styled from "styled-components";
import iso from "iso-3166-1";

const csvUrl = "/data/migration-flows.csv";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 90%;
  max-width: 1200px;
  margin: 20px auto;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const SelectContainer = styled.div`
  width: 50%;
  margin: 20px 0;
`;

const Title = styled.h1`
  font-size: 1.5em;
  margin-bottom: 20px;
  text-align: center;
`;

const ChartContainer = styled.div`
  width: 90%;
  padding: 20px;
`;

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
  "Syria": "SYR",
  "Palestine": "PSE",
  "Kosovo": "XKX",
  "South Sudan": "SSD",
  "Macedonia": "MKD",
  "Somaliland": "SOL",
  "Bosnia and Herz.": "BIH",
  "Micronesia (country)": "FSM",
  "Saint Martin (French part)": "MAF",
  "Sint Maarten (Dutch part)": "SXM",
  "Cote d'Ivoire": "CIV",
  "Czechia": "CZE",
  "Democratic Republic of Congo": "COD",
  // Add more overrides as needed
};

const MigrantFlowStockChart = () => {
  const [data, setData] = useState({});
  const [filteredData, setFilteredData] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState("");
  
  useEffect(() => {
    csv(csvUrl)
      .then(csvData => {
        const formattedData = csvData.reduce((acc, row) => {
          const year = row.Year;
          if (year !== "2015") return acc; // Only process the year 2015
          acc[year] = acc[year] || {};

          Object.keys(row).forEach(key => {
            if (key.startsWith('Emigrants from')) {
              const countryName = key.replace('Emigrants from ', '');
              const alpha3CountryCode = countryNameOverrides[countryName] || iso.whereCountry(countryName)?.alpha3;
              if (alpha3CountryCode) {
                acc[year][alpha3CountryCode] = acc[year][alpha3CountryCode] || {};
                const destinationCountryName = row.Country;
                const destinationAlpha3CountryCode = countryNameOverrides[destinationCountryName] || iso.whereCountry(destinationCountryName)?.alpha3;
                if (destinationAlpha3CountryCode) {
                  acc[year][alpha3CountryCode][destinationAlpha3CountryCode] = +row[key];
                }
              }
            }
          });

          return acc;
        }, {});
        setData(formattedData);
        setFilteredData(Object.keys(formattedData["2015"] || {}).map(alpha3 => ({
          country: alpha3,
          countryName: iso.whereAlpha3(alpha3)?.country || alpha3,
        })));
      })
      .catch(error => {
        console.error("Error loading the CSV data:", error);
      });
  }, []);

  const handleCountrySelect = (event) => {
    setSelectedCountry(event.target.value);
  };

  const getEmigrantData = (country) => {
    if (data["2015"] && data["2015"][country]) {
      return Object.keys(data["2015"][country]).map(destinationCountry => ({
        country: iso.whereAlpha3(destinationCountry)?.country || destinationCountry,
        count: data["2015"][country][destinationCountry],
      }));
    }
    return [];
  };

  const emigrantData = selectedCountry ? getEmigrantData(selectedCountry) : [];

  return (
    <Container>
      <Title>Emigrants from Selected Country (2015)</Title>
      <SelectContainer>
        <select onChange={handleCountrySelect}>
          <option value="">Select a country</option>
          {filteredData.map((country, index) => (
            <option key={index} value={country.country}>
              {country.countryName}
            </option>
          ))}
        </select>
      </SelectContainer>
      <ChartContainer>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={emigrantData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="country" />
            <YAxis />
            <Tooltip />
            <Legend />
            {selectedCountry && (
              <Bar
                dataKey="count"
                name={iso.whereAlpha3(selectedCountry)?.country || selectedCountry}
                fill="#8884d8"
              />
            )}
          </BarChart>
        </ResponsiveContainer>
      </ChartContainer>
    </Container>
  );
};

export default MigrantFlowStockChart;
