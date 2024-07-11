import React, { useState } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGlobe, faTable, faChartBar, faExchange } from '@fortawesome/free-solid-svg-icons';
import { library } from '@fortawesome/fontawesome-svg-core';

library.add(faGlobe, faTable, faChartBar, faExchange);

const SidebarContainer = styled.div`
  width: 250px;
  height: 100vh;
  background-color: #2c3e50;
  padding: 20px 10px;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

const Title = styled.h1`
  font-size: 1.2em;
  color: #ecf0f1;
  text-align: left;
  width: 100%;
  padding: 10px 0;
  border-bottom: 1px solid #34495e;
  margin-bottom: 20px;
`;

const NavItem = styled.div`
  margin-bottom: 10px;
  cursor: pointer;
  font-size: 1em;
  color: #ecf0f1;
  transition: color 0.3s ease;
  display: flex;
  align-items: center; /* Center the content vertically */

  &:hover {
    color: #3498db;
  }

  svg {
    margin-right: 10px;
  }
`;

const SubNav = styled.div`
  padding-left: 20px;
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const SubNavItem = styled.div`
  margin-bottom: 8px;

  a {
    text-decoration: none;
    color: #bdc3c7;
    font-size: 0.9em;
    display: flex;
    align-items: center; /* Center the content vertically */
    transition: color 0.3s ease;

    &:hover {
      color: #3498db;
    }

    svg {
      margin-right: 8px;
    }
  }
`;

const Sidebar = () => {
  const [expandMigration, setExpandMigration] = useState(false);
  const [expandResponsible, setExpandResponsible] = useState(false);
  const [expandCO2, setExpandCO2] = useState(false);
  const [expandAviationCO2, setExpandAvioationCO2] = useState(false);
  const [expandTempAnomalies, setExpandTempAnomalies] = useState(false);
  const [expandPopulationGrowth, setEexpandPopulationGrowth] = useState(false);
  const [expandMigrationFlows, setExpandMigrationFlows] = useState(false);


  return (
    <SidebarContainer>
      <Title>Global Changes Awareness</Title>
      <NavItem onClick={() => setExpandMigration(!expandMigration)}>
        <FontAwesomeIcon icon="globe" style={{marginTop: '1px'}}/>
        Migration Data
      </NavItem>
      {expandMigration && (
        <SubNav>
          <SubNavItem>
            <Link to="/world-map">
              <FontAwesomeIcon icon="globe" />
              World Map
            </Link>
          </SubNavItem>
          <SubNavItem>
            <Link to="/table">
              <FontAwesomeIcon icon="table" />
              Table
            </Link>
          </SubNavItem>
          <SubNavItem>
            <Link to="/chart">
              <FontAwesomeIcon icon="chart-bar" />
              Chart
            </Link>
          </SubNavItem>
        </SubNav>
      )}
      <NavItem onClick={() => setExpandResponsible(!expandResponsible)}>
        <FontAwesomeIcon icon="globe" style={{marginTop: '1px'}}/>
        Responsible Migration
      </NavItem>
      {expandResponsible && (
        <SubNav>
          <SubNavItem>
            <Link to="/responsible-world-map">
              <FontAwesomeIcon icon="globe" />
              World Map
            </Link>
          </SubNavItem>
          <SubNavItem>
            <Link to="/responsible-table">
              <FontAwesomeIcon icon="table" />
              Table
            </Link>
          </SubNavItem>
        </SubNav>
      )}
      <NavItem onClick={() => setExpandCO2(!expandCO2)}>
        <FontAwesomeIcon icon="globe" style={{marginTop: '1px'}}/>
        Per capita CO₂ emissions
      </NavItem>
      {expandCO2 && (
        <SubNav>
          <SubNavItem>
            <Link to="/co2-emissions">
              <FontAwesomeIcon icon="globe" />
              World Map
            </Link>
          </SubNavItem>
          <SubNavItem>
            <Link to="/co2-emissions-table">
              <FontAwesomeIcon icon="table" />
              Table
            </Link>
          </SubNavItem>
          <SubNavItem>
            <Link to="/co2-emissions-chart">
              <FontAwesomeIcon icon="table" />
              Chart
            </Link>
          </SubNavItem>
        </SubNav>
      )}
      <NavItem onClick={() => setExpandAvioationCO2(!expandAviationCO2)}>
        <FontAwesomeIcon icon="globe" style={{marginTop: '1px'}}/>
        CO₂ emissions from aviation
      </NavItem>
      {expandAviationCO2 && (
        <SubNav>
          <SubNavItem>
            <Link to="/co2-aviation-emissions">
              <FontAwesomeIcon icon="globe" />
              World Map
            </Link>
          </SubNavItem>
          <SubNavItem>
            <Link to="/co2-aviation-table">
              <FontAwesomeIcon icon="table" />
              Table
            </Link>
          </SubNavItem>
          <SubNavItem>
            <Link to="/co2-aviation-chart">
              <FontAwesomeIcon icon="table" />
              Chart
            </Link>
          </SubNavItem>
        </SubNav>
      )}
      <NavItem onClick={() => setExpandTempAnomalies(!expandTempAnomalies)}>
        <FontAwesomeIcon icon="globe" style={{marginTop: '1px'}}/>
        Annual temperature anomalies
      </NavItem>
      {expandTempAnomalies && (
        <SubNav>
          <SubNavItem>
            <Link to="/temp-anomalies">
              <FontAwesomeIcon icon="globe" />
              World Map
            </Link>
          </SubNavItem>
          <SubNavItem>
            <Link to="/temp-anomalies-table">
              <FontAwesomeIcon icon="table" />
              Table
            </Link>
          </SubNavItem>
          <SubNavItem>
            <Link to="/temp-anomalies-chart">
              <FontAwesomeIcon icon="table" />
              Chart
            </Link>
          </SubNavItem>
        </SubNav>
      )}
      <NavItem onClick={() => setEexpandPopulationGrowth(!expandPopulationGrowth)}>
        <FontAwesomeIcon icon="globe" style={{marginTop: '1px'}}/>
        Population Growth Rate with and without Migration
      </NavItem>
      {expandPopulationGrowth && (
        <SubNav>
          <SubNavItem>
            <Link to="/population-growth-table">
              <FontAwesomeIcon icon="table" />
              Table
            </Link>
          </SubNavItem>
          <SubNavItem>
            <Link to="/population-growth-chart">
              <FontAwesomeIcon icon="table" />
              Chart
            </Link>
          </SubNavItem>
        </SubNav>
      )}
      <NavItem onClick={() => setExpandMigrationFlows(!expandMigrationFlows)}>
        <FontAwesomeIcon icon="globe" style={{marginTop: '1px'}}/>
        Migration Flows
      </NavItem>
      {expandMigrationFlows && (
        <SubNav>
          <SubNavItem>
            <Link to="/migration-flow">
              <FontAwesomeIcon icon="globe" />
              World Map
            </Link>
          </SubNavItem>
          <SubNavItem>
            <Link to="/migration-flow-table">
              <FontAwesomeIcon icon="table" />
              Table
            </Link>
          </SubNavItem>
          <SubNavItem>
            <Link to="/migration-flow-chart">
              <FontAwesomeIcon icon="table" />
              Chart
            </Link>
          </SubNavItem>
        </SubNav>
      )}
      <NavItem>
        <Link to="/comparison" style={{textDecoration: 'none', color: "#ecf0f1"}}>
          <FontAwesomeIcon icon="exchange" style={{ marginTop: '1px' }} />
          Comparison Page
        </Link>
      </NavItem>
      <NavItem>
        <Link to="/assistance-chart" style={{textDecoration: 'none', color: "#ecf0f1"}}>
          <FontAwesomeIcon icon="table" style={{ marginTop: '1px' }} />
          Assistance
        </Link>
      </NavItem>
      <NavItem>
        <Link to="/seawaterPH-chart" style={{textDecoration: 'none', color: "#ecf0f1"}}>
          <FontAwesomeIcon icon="table" style={{ marginTop: '1px' }} />
          Seawater PH
        </Link>
      </NavItem>
      <NavItem>
        <Link to="/sealevelrise-chart" style={{textDecoration: 'none', color: "#ecf0f1"}}>
          <FontAwesomeIcon icon="table" style={{ marginTop: '1px' }} />
          Sealevel Rise
        </Link>
      </NavItem>
    </SidebarContainer>
  );
};

export default Sidebar;
