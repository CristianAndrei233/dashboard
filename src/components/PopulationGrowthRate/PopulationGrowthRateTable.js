import React, { useEffect, useState } from "react";
import { csv } from "d3-fetch";
import { useTable, useSortBy, useGlobalFilter } from "react-table";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import styled from "styled-components";

const csvUrl = "/data/population-growth-rate-with-and-without-migration.csv";
const TableContainer = styled.div`
  width: 80%;
  max-width: 1200px;
  margin: 20px auto;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h1`
  font-size: 1.5em;
  margin-bottom: 20px;
  text-align: center;
`;

const ScrollableTable = styled.div`
  max-height: 400px;
  overflow-y: auto;
`;

const TableStyled = styled.table`
  width: 100%;
  border-collapse: collapse;

  th, td {
    padding: 8px 12px;
    border: 1px solid #ddd;
    text-align: right;
  }

  th {
    background-color: #f4f4f4;
    cursor: pointer;
  }

  th:first-child, td:first-child {
    text-align: left;
  }
`;

const SliderContainer = styled.div`
  margin-top: 20px;
  text-align: center;
`;

const Button = styled.button`
  margin-right: 10px;
  padding: 5px 10px;
  background-color: #004aad;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background-color: #003b8e;
  }
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 8px;
  margin-bottom: 20px;
  border: 1px solid #ddd;
  border-radius: 4px;
`;

const PopulationGrowthTable = () => {
  const [data, setData] = useState([]);
  const [year, setYear] = useState(1950);
  const [playing, setPlaying] = useState(false);
  const minYear = 1950;
  const maxYear = 2015;

  useEffect(() => {
    csv(csvUrl)
      .then(csvData => {
        const formattedData = csvData.reduce((acc, d) => {
          if (!acc[d.Entity]) {
            acc[d.Entity] = { country: d.Entity, code: d.Code };
          }
          const year = +d.Year;
          if (year <= 2015) {
            acc[d.Entity][year] = {
              growthRate: +d["Growth rate - Sex: all - Age: all - Variant: estimates"],
              naturalGrowthRate: +d["Natural growth rate - Sex: all - Age: all - Variant: estimates"]
            };
          }
          return acc;
        }, {});
        setData(Object.values(formattedData));
      })
      .catch(error => {
        console.error("Error loading the CSV data:", error);
      });
  }, []);

  useEffect(() => {
    if (playing) {
      const interval = setInterval(() => {
        setYear(prevYear => {
          if (prevYear >= maxYear) {
            clearInterval(interval);
            setPlaying(false);
            return maxYear;
          }
          return prevYear + 1;
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [playing]);

  const handlePlayPause = () => {
    setPlaying(!playing);
  };

  const calculateChange = (row) => {
    const baseYear = 1950;
    const baseValue = row[baseYear]?.growthRate || 0;
    const currentValue = row[year]?.growthRate || 0;
    const absoluteChange = currentValue - baseValue;
    const relativeChange = baseValue !== 0 ? (absoluteChange / baseValue) * 100 : 0;
    return { absoluteChange, relativeChange };
  };

  const calculateNaturalChange = (row) => {
    const baseYear = 1950;
    const baseValue = row[baseYear]?.naturalGrowthRate || 0;
    const currentValue = row[year]?.naturalGrowthRate || 0;
    const absoluteChange = currentValue - baseValue;
    return { absoluteChange };
  };

  const columns = React.useMemo(() => [
    { Header: "Country/Area", accessor: "country" },
    { Header: `${year} With migration`, accessor: `${year}.growthRate` },
    { Header: "Absolute Change", accessor: (row) => calculateChange(row).absoluteChange, Cell: ({ value }) => `${value.toFixed(2)} pp` },
    { Header: "Relative Change", accessor: (row) => calculateChange(row).relativeChange, Cell: ({ value }) => `${value.toFixed(2)}%` },
    { Header: `${year} Without migration`, accessor: `${year}.naturalGrowthRate` },
    { Header: "Absolute Change (Natural)", accessor: (row) => calculateNaturalChange(row).absoluteChange, Cell: ({ value }) => `${value.toFixed(2)} pp` },
  ], [year]);

  const tableInstance = useTable({ columns, data }, useGlobalFilter, useSortBy);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    setGlobalFilter
  } = tableInstance;

  return (
    <TableContainer>
      <Title>Population Growth Rate with and without Migration</Title>
      <SearchInput
        type="text"
        placeholder="Search for a country..."
        onChange={e => setGlobalFilter(e.target.value)}
      />
      <ScrollableTable>
        <TableStyled {...getTableProps()}>
          <thead>
            {headerGroups.map(headerGroup => (
              <tr key={headerGroup.id} {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map(column => (
                  <th key={column.id} {...column.getHeaderProps(column.getSortByToggleProps())}>
                    {column.render("Header")}
                    <span>
                      {column.isSorted ? (column.isSortedDesc ? " 🔽" : " 🔼") : ""}
                    </span>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {rows.map(row => {
              prepareRow(row);
              return (
                <tr key={row.id} {...row.getRowProps()}>
                  {row.cells.map(cell => (
                    <td key={cell.id} {...cell.getCellProps()}>{cell.render("Cell")}</td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </TableStyled>
      </ScrollableTable>
      <SliderContainer>
        <Button onClick={handlePlayPause}>{playing ? "Pause" : "Play"}</Button>
        <Slider
          min={minYear}
          max={maxYear}
          step={1}
          value={year}
          onChange={newYear => setYear(newYear)}
          marks={{ 1950: '1950', 2015: '2015' }}
          trackStyle={{ backgroundColor: '#004aad' }}
          handleStyle={{ borderColor: '#004aad' }}
        />
      </SliderContainer>
    </TableContainer>
  );
};

export default PopulationGrowthTable;
