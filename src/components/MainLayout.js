import React from 'react';
import styled from 'styled-components';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Footer from './Footer';
import PageHeader from './PageHeader';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  max-height: 100vh;
`;

const MainContent = styled.div`
  display: flex;
  flex: 1;
  overflow: hidden;
`;

const Content = styled.div`
  width: 80%;
  padding: 20px;
  overflow-y: auto;
`;

const MainLayout = () => {
  return (
    <Container>
      <MainContent>
        <Sidebar />
        <Content>
          <PageHeader title="Global Changes Awarness" subtitle="Welcome to the Global Changes Awareness application. This platform provides a comprehensive overview of various data points and visualizations related to global changes over the years. Explore different aspects such as sea level rise, ocean acidification, and other crucial environmental indicators to understand the impact of climate change and other global phenomena. This application was developed by Eric Costerousse, Marlon Valencia, and Cristian Dinca." />
          <Outlet />
        </Content>
      </MainContent>
      <Footer />
    </Container>
  );
};

export default MainLayout;
