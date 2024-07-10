import React, { useEffect, useState } from "react";
import { csv } from "d3-fetch";
import { useTable, useSortBy, useGlobalFilter } from "react-table";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import Modal from "react-modal";
import styled from "styled-components";

const csvUrl = "/data/annual-temperature-anomalies.csv";

const TableContainer = styled.div`
  width: 80%;
  max-width: 800px;
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

const ModalContent = styled.div`
  padding: 20px;
  background-color: white;
  border-radius: 8px;
  max-width: 500px;
  margin: 0 auto;
`;

const TempAnomaliesTable = () => {
  const [data, setData] = useState([]);
  const [year, setYear] = useState(1960);
  const [playing, setPlaying] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const minYear = 1960;
  const maxYear = 2015;

  useEffect(() => {
    csv(csvUrl)
      .then(csvData => {
        const formattedData = csvData.reduce((acc, d) => {
          if (!acc[d.Entity]) {
            acc[d.Entity] = { country: d.Entity, code: d.Code };
          }
          if (d.Year <= maxYear) {
            acc[d.Entity][d.Year] = +d["Temperature anomaly"];
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
          return prevYear + 5;
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [playing]);

  const handlePlayPause = () => {
    setPlaying(!playing);
  };

  const handleRowClick = (row) => {
    setSelectedCountry(row.original);
  };

  const closeModal = () => {
    setSelectedCountry(null);
  };

  const calculateChange = (row) => {
    const baseYear = 1960;
    const baseValue = row[baseYear] || 0;
    const currentValue = row[year] || 0;
    const absoluteChange = currentValue - baseValue;
    const relativeChange = baseValue !== 0 ? (absoluteChange / baseValue) * 100 : 0;
    return { absoluteChange, relativeChange };
  };

  const columns = React.useMemo(() => [
    { Header: "Country/Area", accessor: "country" },
    { Header: year.toString(), accessor: year.toString() },
    {
      Header: "Absolute Change",
      accessor: (row) => calculateChange(row).absoluteChange,
      Cell: ({ value }) => value.toLocaleString()
    },
    {
      Header: "Relative Change",
      accessor: (row) => calculateChange(row).relativeChange,
      Cell: ({ value }) => `${value.toFixed(2)}%`
    }
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
      <Title>Annual Temperature Anomalies, 1960 to 2015</Title>
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
                <tr key={row.id} {...row.getRowProps()} onClick={() => handleRowClick(row)}>
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
          marks={{ 1960: '1960', 2015: '2015' }}
          trackStyle={{ backgroundColor: '#004aad' }}
          handleStyle={{ borderColor: '#004aad' }}
        />
      </SliderContainer>
      {selectedCountry && (
        <Modal
          isOpen={!!selectedCountry}
          onRequestClose={closeModal}
          contentLabel="Country Details"
        >
          <ModalContent>
            <h2>{selectedCountry.country}</h2>
            <p>Code: {selectedCountry.code}</p>
            <p>Year: {year}</p>
            <p>Temperature Anomaly: {selectedCountry[year].toLocaleString()} °C</p>
            <p>Absolute Change: {calculateChange(selectedCountry).absoluteChange.toLocaleString()} °C</p>
            <p>Relative Change: {calculateChange(selectedCountry).relativeChange.toFixed(2)}%</p>
            <Button onClick={closeModal}>Close</Button>
          </ModalContent>
        </Modal>
      )}
    </TableContainer>
  );
};

export default TempAnomaliesTable;
