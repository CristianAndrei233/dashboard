import React, { useEffect, useState } from "react";
import { csv } from "d3-fetch";
import { useTable, useSortBy } from "react-table";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import Modal from "react-modal";
import styled from "styled-components";

const csvUrl = "/data/migration-flows.csv";

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

const SelectContainer = styled.div`
  width: 50%;
  margin: 20px auto;
`;

const ModalContent = styled.div`
  padding: 20px;
  background-color: white;
  border-radius: 8px;
  max-width: 500px;
  margin: 0 auto;
`;

const MigrantFlowStockTable = () => {
  const [data, setData] = useState({});
  const [year, setYear] = useState(2015);
  const [playing, setPlaying] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [emigrantData, setEmigrantData] = useState([]);
  const minYear = 1990;
  const maxYear = 2020;

  useEffect(() => {
    csv(csvUrl)
      .then(csvData => {
        const formattedData = csvData.reduce((acc, d) => {
          const year = +d.Year;
          const country = d.Country;

          Object.keys(d).forEach(key => {
            if (key.startsWith('Emigrants from')) {
              const originCountry = key.replace('Emigrants from ', '');
              if (!acc[originCountry]) {
                acc[originCountry] = {};
              }
              if (!acc[originCountry][year]) {
                acc[originCountry][year] = [];
              }
              acc[originCountry][year].push({
                country,
                count: +d[key] || 0,
              });
            }
          });
          return acc;
        }, {});
        setData(formattedData);
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
          return prevYear + 5;
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [playing]);

  useEffect(() => {
    if (selectedCountry && data[selectedCountry]) {
      setEmigrantData(data[selectedCountry][year] || []);
    }
  }, [selectedCountry, year, data]);

  const handlePlayPause = () => {
    setPlaying(!playing);
  };

  const handleCountrySelect = (event) => {
    setSelectedCountry(event.target.value);
  };

  const columns = React.useMemo(() => [
    { Header: "Country/Area", accessor: "country" },
    { Header: year.toString(), accessor: "count", Cell: ({ value }) => value.toLocaleString() },
  ], [year]);

  const tableInstance = useTable({ columns, data: emigrantData }, useSortBy);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow
  } = tableInstance;

  return (
    <TableContainer>
      <Title>Emigrants from Selected Country</Title>
      <SelectContainer>
        <select onChange={handleCountrySelect}>
          <option value="">Select a country</option>
          {Object.keys(data).map((country, index) => (
            <option key={index} value={country}>
              {country}
            </option>
          ))}
        </select>
      </SelectContainer>
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
          step={5}
          value={year}
          onChange={newYear => setYear(newYear)}
          marks={{ 1990: '1990', 2020: '2020' }}
          trackStyle={{ backgroundColor: '#004aad' }}
          handleStyle={{ borderColor: '#004aad' }}
        />
      </SliderContainer>
      {selectedCountry && (
        <Modal
          isOpen={!!selectedCountry}
          onRequestClose={() => setSelectedCountry(null)}
          contentLabel="Country Details"
        >
          <ModalContent>
            <h2>{selectedCountry}</h2>
            <p>Year: {year}</p>
            <Button onClick={() => setSelectedCountry(null)}>Close</Button>
          </ModalContent>
        </Modal>
      )}
    </TableContainer>
  );
};

export default MigrantFlowStockTable;
