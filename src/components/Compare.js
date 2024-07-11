import React, { useState } from 'react';
import styled from 'styled-components';
import WorldMapMigration from '../components/Migration/WorldMap';
import MigrantStockTable from '../components/Migration/MigrantStockTable';
import MigrantStockChart from '../components/Migration/MigrantStockChart';
import WorldMapPoliciesMigration from '../components/PoliciesMigration/WorldMap';
import PoliciesMigrantStockTable from '../components/PoliciesMigration/PoliciesMigrationStockTable';
import WorldMapCo2Emissions from '../components/CO2Emissions/WorldMap';
import CO2StockTable from '../components/CO2Emissions/CO2StockTable';
import CO2EmissionsChart from '../components/CO2Emissions/CO2StockChart';
import WorldMapCo2AviationEmissions from '../components/CO2AviationEmissions/WorldMap';
import CO2AviationChart from '../components/CO2AviationEmissions/CO2AviationStockChart';
import CO2AviationTable from '../components/CO2AviationEmissions/CO2AviationStockTable';
import WorldMapTemeratureAnomalies from '../components/TempAnomalies/WorldMap';
import TempAnomaliesChart from '../components/TempAnomalies/TempAnomaliesStockChart';
import TempAnomaliesTable from '../components/TempAnomalies/TempAnomaliesStockTable';
import PopulationGrowthChart from '../components/PopulationGrowthRate/PopulationGrowthRate';
import PopulationGrowthTable from '../components/PopulationGrowthRate/PopulationGrowthRateTable';
import MigrantFlowStockChart from './MigrationFlows/MigrationFlowsStockChart';
import MigrantFlowStockTable from './MigrationFlows/MigrationFlowsStockTable';
import WorldMapMigrationFlow from './MigrationFlows/WorldMap';
import OceanPHChart from './SeawaterPH/SeawaterPH';

const ComparisonContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
`;

const SelectContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
`;

const Select = styled.select`
  margin: 0 10px;
  padding: 10px;
  font-size: 1em;
  border-radius: 5px;
  border: 1px solid #ccc;
  background-color: #f9f9f9;
  color: #333;
  cursor: pointer;
  &:focus {
    outline: none;
    border-color: #3498db;
  }
`;

const ComponentsContainer = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
`;

const ComponentWrapper = styled.div`
  width: 50%;
  padding: 20px;
`;

const components = {
  PopulationGrowthTable,
  TempAnomaliesChart,
  CO2StockTable,
  CO2EmissionsChart,
  CO2AviationChart,
  CO2AviationTable,
  TempAnomaliesTable,
  PopulationGrowthChart,
  WorldMapMigration,
  MigrantStockTable,
  MigrantStockChart,
  WorldMapPoliciesMigration,
  PoliciesMigrantStockTable,
  WorldMapCo2Emissions,
  WorldMapCo2AviationEmissions,
  WorldMapTemeratureAnomalies,
  MigrantFlowStockChart,
  WorldMapMigrationFlow,
  MigrantFlowStockTable,
  OceanPHChart
};

const componentNames = {
  PopulationGrowthTable: 'Population Growth Table',
  TempAnomaliesChart: 'Temperature Anomalies Chart',
  CO2StockTable: 'CO2 Stock Table',
  CO2EmissionsChart: 'CO2 Emissions Chart',
  CO2AviationChart: 'CO2 Aviation Chart',
  CO2AviationTable: 'CO2 Aviation Table',
  TempAnomaliesTable: 'Temperature Anomalies Table',
  PopulationGrowthChart: 'Population Growth Chart',
  WorldMapMigration: 'World Map Migration',
  MigrantStockTable: 'Migrant Stock Table',
  MigrantStockChart: 'Migrant Stock Chart',
  WorldMapPoliciesMigration: 'World Map Policies Migration',
  PoliciesMigrantStockTable: 'Policies Migrant Stock Table',
  WorldMapCo2Emissions: 'World Map CO2 Emissions',
  WorldMapCo2AviationEmissions: 'World Map CO2 Aviation Emissions',
  WorldMapTemeratureAnomalies: 'World Map Temperature Anomalies',
  WorldMapMigrationFlow : 'World Map Migration Flow',
  MigrantFlowStockChart : 'Migration Flow Stock Chart',
  MigrantFlowStockTable : 'Migration Flow Stock Table', 
  OceanPHChart : 'Ocean PH Chart'

};

const ComparisonPage = () => {
  const [leftComponent, setLeftComponent] = useState('WorldMapPoliciesMigration');
  const [rightComponent, setRightComponent] = useState('WorldMapMigration');

  const LeftComponent = components[leftComponent];
  const RightComponent = components[rightComponent];

  return (
    <ComparisonContainer>
      <SelectContainer>
        <Select value={leftComponent} onChange={(e) => setLeftComponent(e.target.value)}>
          {Object.keys(components).map((key) => (
            <option value={key} key={key}>
              {componentNames[key]}
            </option>
          ))}
        </Select>
        <Select value={rightComponent} onChange={(e) => setRightComponent(e.target.value)}>
          {Object.keys(components).map((key) => (
            <option value={key} key={key}>
              {componentNames[key]}
            </option>
          ))}
        </Select>
      </SelectContainer>
      <ComponentsContainer>
        <ComponentWrapper>
          <LeftComponent />
        </ComponentWrapper>
        <ComponentWrapper>
          <RightComponent />
        </ComponentWrapper>
      </ComponentsContainer>
    </ComparisonContainer>
  );
};

export default ComparisonPage;
