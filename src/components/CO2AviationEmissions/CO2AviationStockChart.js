import React, { useEffect, useState } from "react";
import { csv } from "d3-fetch";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import styled from "styled-components";

const csvUrl = "/data/co2-emissions-aviation.csv";

const Container = styled.div`
  display: flex;
  width: 90%;
  max-width: 1200px;
  margin: 20px auto;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const Sidebar = styled.div`
  width: 25%;
  padding: 20px;
  border-right: 1px solid #ddd;
  overflow-y: auto;
  max-height: 500px;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 8px;
  margin-bottom: 20px;
  border: 1px solid #ddd;
  border-radius: 4px;
`;

const CountryList = styled.div`
  width: 100%;
  overflow-y: auto;
`;

const CountryItem = styled.div`
  padding: 8px;
  cursor: pointer;
  &:hover {
    background-color: #ddd;
  }
`;

const ChartContainer = styled.div`
  width: 75%;
  padding: 20px;
`;

const Title = styled.h1`
  font-size: 1.5em;
  margin-bottom: 20px;
  text-align: center;
`;

const CO2AviationChart = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    csv(csvUrl)
      .then(csvData => {
        const formattedData = csvData.map(d => ({
          country: d.Entity,
          code: d.Code,
          year: d.Year,
          co2Emissions: +d["Total aviation CO2 (Mt)"]
        }));
        setData(formattedData);
        setFilteredData(formattedData);
      })
      .catch(error => {
        console.error("Error loading the CSV data:", error);
      });
  }, []);

  useEffect(() => {
    setFilteredData(
      data.filter(country =>
        country.country.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm, data]);

  const handleCountryClick = (country) => {
    setSelectedCountry(country);
  };

  const chartData = selectedCountry ? [selectedCountry] : [];

  return (
    <Container>
      <Sidebar>
        <SearchInput
          type="text"
          placeholder="Search for a country..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
        <CountryList>
          {filteredData.map((country, index) => (
            <CountryItem key={index} onClick={() => handleCountryClick(country)}>
              {country.country}
            </CountryItem>
          ))}
        </CountryList>
      </Sidebar>
      <ChartContainer>
        <Title>CO₂ emissions from aviation, 2018</Title>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={chartData} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" />
            <YAxis type="category" dataKey="country" />
            <Tooltip />
            <Bar dataKey="co2Emissions" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </ChartContainer>
    </Container>
  );
};

export default CO2AviationChart;
