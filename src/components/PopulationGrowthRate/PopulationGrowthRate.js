import React, { useEffect, useState } from "react";
import { csv } from "d3-fetch";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import styled from "styled-components";

const csvUrl = "/data/population-growth-rate-with-and-without-migration.csv";

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

const PopulationGrowthChart = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const years = Array.from({ length: 66 }, (_, i) => 1950 + i); // from 1950 to 2015

  useEffect(() => {
    csv(csvUrl)
      .then(csvData => {
        const formattedData = csvData.reduce((acc, d) => {
          if (!acc[d.Entity]) {
            acc[d.Entity] = { country: d.Entity, code: d.Code };
            years.forEach(year => {
              acc[d.Entity][year] = { growthRate: null, naturalGrowthRate: null };
            });
          }
          const year = +d.Year;
          if (year <= 2015) {
            acc[d.Entity][year] = { growthRate: +d["Growth rate - Sex: all - Age: all - Variant: estimates"], naturalGrowthRate: +d["Natural growth rate - Sex: all - Age: all - Variant: estimates"] };
          }
          return acc;
        }, {});
        const dataArray = Object.values(formattedData);
        setData(dataArray);
        setFilteredData(dataArray);
        setSelectedCountry(dataArray[0]);
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
    growthRate: selectedCountry[year]?.growthRate,
    naturalGrowthRate: selectedCountry[year]?.naturalGrowthRate,
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
        <Title>Population Growth Rate with and without Migration</Title>
        {selectedCountry && (
          <>
            <h2>{selectedCountry.country}</h2>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="growthRate" name="With migration" stroke="#8884d8" />
                <Line type="monotone" dataKey="naturalGrowthRate" name="Without migration" stroke="#82ca9d" />
              </LineChart>
            </ResponsiveContainer>
          </>
        )}
      </ChartContainer>
    </Container>
  );
};

export default PopulationGrowthChart;
