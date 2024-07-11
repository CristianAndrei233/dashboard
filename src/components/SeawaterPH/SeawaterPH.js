import React, { useEffect, useState } from "react";
import { csv } from "d3-fetch";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import styled from "styled-components";

const csvUrl = "/data/seawater-ph.csv"; // Update this URL to the correct path if necessary

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

const Title = styled.h1`
  font-size: 1.5em;
  margin-bottom: 20px;
  text-align: center;
`;

const ChartContainer = styled.div`
  width: 100%;
  padding: 20px;
`;

const OceanPHChart = () => {
  const [data, setData] = useState([]);
  const [year, setYear] = useState(1988);
  const minYear = 1988;
  const maxYear = 2015;

  useEffect(() => {
    csv(csvUrl)
      .then(csvData => {
        const filteredData = csvData.filter(d => {
          const date = new Date(d.Day);
          return date.getFullYear() <= maxYear;
        });
        
        const formattedData = filteredData.map(d => ({
          date: d.Day,
          pH: parseFloat(d["Monthly measurement of ocean pH levels"]),
          averagePH: d["Rolling yearly average of ocean pH levels"] ? parseFloat(d["Rolling yearly average of ocean pH levels"]) : null
        }));
        
        setData(formattedData);
      })
      .catch(error => {
        console.error("Error loading the CSV data:", error);
      });
  }, []);

  return (
    <Container>
      <Title>Ocean Acidification: Mean Seawater pH, Hawaii</Title>
      <ChartContainer>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="pH"
              name="Monthly average"
              stroke="#FF6347"
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="averagePH"
              name="Annual average"
              stroke="#4682B4"
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </ChartContainer>
    </Container>
  );
};

export default OceanPHChart;
