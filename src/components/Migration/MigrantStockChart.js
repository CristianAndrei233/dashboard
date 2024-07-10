import React, { useEffect, useState } from "react";
import { csv } from "d3-fetch";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import styled from "styled-components";

const csvUrl = "/data/migrant-stock-total.csv";

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

const MigrantStockChart = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const minYear = 1960;
  const maxYear = 2015;
  const years = Array.from({ length: (maxYear - minYear) / 5 + 1 }, (_, i) => minYear + i * 5);

  useEffect(() => {
    csv(csvUrl)
      .then(csvData => {
        const formattedData = csvData.reduce((acc, d) => {
          if (!acc[d.Entity]) {
            acc[d.Entity] = { country: d.Entity, code: d.Code };
            years.forEach(year => {
              acc[d.Entity][year] = null;
            });
          }
          acc[d.Entity][d.Year] = +d["International migrant stock, total"];
          return acc;
        }, {});
        const dataArray = Object.values(formattedData);
        setData(dataArray);
        setFilteredData(dataArray);
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

  const chartData = selectedCountry ? years.map(year => ({
    year: year,
    count: selectedCountry[year],
    country: selectedCountry.country,
  })) : [];

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
        <Title>International Migrant Stock by Year</Title>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="year" />
            <YAxis />
            <Tooltip />
            <Legend />
            {selectedCountry && (
              <Line
                type="monotone"
                dataKey="count"
                data={chartData}
                name={selectedCountry.country}
                stroke="#8884d8"
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      </ChartContainer>
    </Container>
  );
};

export default MigrantStockChart;
