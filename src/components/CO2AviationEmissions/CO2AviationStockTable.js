import React, { useEffect, useState } from "react";
import { csv } from "d3-fetch";
import { useTable, useSortBy, useGlobalFilter } from "react-table";
import styled from "styled-components";

const csvUrl = "/data/co2-emissions-aviation.csv";

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

const SearchInput = styled.input`
  width: 100%;
  padding: 8px;
  margin-bottom: 20px;
  border: 1px solid #ddd;
  border-radius: 4px;
`;

const CO2AviationTable = () => {
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    csv(csvUrl)
      .then(csvData => {
        console.log("CSV Data:", csvData); // Log the raw CSV data
        const formattedData = csvData.map(d => ({
          country: d.Entity,
          year: +d.Year,
          emissions: +d["Total aviation CO2 (Mt)"]
        })).filter(d => d.year === 2018);
        console.log("Formatted Data:", formattedData); // Log the formatted data
        setData(formattedData);
      })
      .catch(error => {
        console.error("Error loading the CSV data:", error);
      });
  }, []);

  const columns = React.useMemo(() => [
    { Header: "Country/Area", accessor: "country" },
    { Header: "2018", accessor: "emissions" },
  ], []);

  const tableInstance = useTable({ columns, data }, useGlobalFilter, useSortBy);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    setGlobalFilter
  } = tableInstance;

  useEffect(() => {
    setGlobalFilter(searchTerm);
  }, [searchTerm, setGlobalFilter]);

  return (
    <TableContainer>
      <Title>CO₂ emissions from aviation, 2018</Title>
      <SearchInput
        type="text"
        placeholder="Search for a country..."
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
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
    </TableContainer>
  );
};

export default CO2AviationTable;
