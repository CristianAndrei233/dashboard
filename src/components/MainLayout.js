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
          <PageHeader title="Migration Data" subtitle="Explore various data points and visualizations related to migration." />
          <Outlet />
        </Content>
      </MainContent>
      <Footer />
    </Container>
  );
};

export default MainLayout;
