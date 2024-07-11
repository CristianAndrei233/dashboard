import React, { useEffect, useState } from "react";
import { csv } from "d3-fetch";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import styled from "styled-components";

const csvUrl = "/data/sea-level.csv";

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

const SeaLevelChart = () => {
  const [data, setData] = useState([]);
  const minYear = 1880;
  const maxYear = 2015;

  useEffect(() => {
    csv(csvUrl)
      .then((csvData) => {
        const filteredData = csvData.filter((d) => {
          const date = new Date(d.Day);
          return date.getFullYear() <= maxYear;
        });

        const formattedData = filteredData.map((d) => ({
          date: d.Day,
          churchWhite: d["Global sea level according to Church and White (2011)"] ? parseFloat(d["Global sea level according to Church and White (2011)"]) : null,
          uhslc: d["Global sea level according to UHSLC"] ? parseFloat(d["Global sea level according to UHSLC"]) : null,
          average: d["Global sea level as an average of Church and White (2011) and UHSLC data"] ? parseFloat(d["Global sea level as an average of Church and White (2011) and UHSLC data"]) : null,
        }));

        setData(formattedData);
      })
      .catch((error) => {
        console.error("Error loading the CSV data:", error);
      });
  }, []);

  return (
    <Container>
      <Title>Global Sea Level Rise</Title>
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
              dataKey="churchWhite"
              name="Church and White (2011)"
              stroke="#FF6347"
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="uhslc"
              name="UHSLC"
              stroke="#4682B4"
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="average"
              name="Average of Church and White (2011) and UHSLC"
              stroke="#82ca9d"
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </ChartContainer>
    </Container>
  );
};

export default SeaLevelChart;
