import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './components/MainLayout';
import WorldMap1 from './components/Migration/WorldMap';
import MigrantStockTable from './components/Migration/MigrantStockTable';
import MigrantStockChart from './components/Migration/MigrantStockChart';
import WorldMap2 from './components/PoliciesMigration/WorldMap';
import PoliciesMigrantStockTable from './components/PoliciesMigration/PoliciesMigrationStockTable';
import WorldMap3 from './components/CO2Emissions/WorldMap';
import CO2StockTable from './components/CO2Emissions/CO2StockTable';
import CO2EmissionsChart from './components/CO2Emissions/CO2StockChart'; 
import WorldMap4 from './components/CO2AviationEmissions/WorldMap';
import CO2AviationChart from './components/CO2AviationEmissions/CO2AviationStockChart';
import CO2AviationTable from './components/CO2AviationEmissions/CO2AviationStockTable';
import WorldMap5 from './components/TempAnomalies/WorldMap';
import TempAnomaliesChart from './components/TempAnomalies/TempAnomaliesStockChart';
import TempAnomaliesTable from './components/TempAnomalies/TempAnomaliesStockTable';
import PopulationGrowthChart from './components/PopulationGrowthRate/PopulationGrowthRate'; 
import PopulationGrowthTable from './components/PopulationGrowthRate/PopulationGrowthRateTable';
import ComparisonPage from './components/Compare'; 
import WorldMap6 from './components/MigrationFlows/WorldMap'
import MigrantFlowStockChart from './components/MigrationFlows/MigrationFlowsStockChart';
import MigrantFlowStockTable from './components/MigrationFlows/MigrationFlowsStockTable'; 
import AssistanceChart from './components/Assistance/AssistanceChart';
import OceanPHChart from './components/SeawaterPH/SeawaterPH';
import SeaLevelChart from './components/SeaLevel/SeaLevelRise';
// import GlobalChangesAwareness from './components/Home';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route path="/world-map" element={<WorldMap1 />} />
          <Route path="/table" element={<MigrantStockTable />} />
          <Route path="/chart" element={<MigrantStockChart />} />
          <Route path="/responsible-world-map" element={<WorldMap2 />} />
          <Route path="/co2-emissions" element={<WorldMap3 />} />
          <Route path="/co2-emissions-table" element={<CO2StockTable />} />
          <Route path="/co2-emissions-chart" element={<CO2EmissionsChart />} />
          <Route path="/responsible-table" element={<PoliciesMigrantStockTable />} />
          <Route path="/co2-aviation-emissions" element={<WorldMap4/>} />
          <Route path="/co2-aviation-chart" element={<CO2AviationChart />} />
          <Route path="/co2-aviation-table" element={<CO2AviationTable />} />
          <Route path="/temp-anomalies" element={<WorldMap5 />} />
          <Route path="/temp-anomalies-chart" element={<TempAnomaliesChart />} />
          <Route path="/temp-anomalies-table" element={<TempAnomaliesTable />} />
          <Route path="/population-growth-chart" element={<PopulationGrowthChart />} />
          <Route path="/population-growth-table" element={<PopulationGrowthTable />} />
          <Route path="/comparison" element={<ComparisonPage/>} />
          <Route path="/migration-flow" element={<WorldMap6/>} />
          <Route path="/migration-flow-chart" element={<MigrantFlowStockChart/>} />
          <Route path="/migration-flow-table" element={<MigrantFlowStockTable/>} />
          <Route path="/assistance-chart" element={<AssistanceChart />} />
          <Route path='/seawaterPH-chart' element={<OceanPHChart />} />
          <Route path='/sealevelrise-chart' elementment={<SeaLevelChart/>} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
