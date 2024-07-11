import React from "react";
import styled from "styled-components";

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
  padding: 20px;
`;

const Title = styled.h1`
  font-size: 2em;
  margin-bottom: 20px;
  text-align: center;
`;

const Description = styled.p`
  font-size: 1.2em;
  margin-bottom: 20px;
  text-align: center;
  line-height: 1.6;
`;

const Credits = styled.p`
  font-size: 1em;
  margin-top: 40px;
  text-align: center;
  font-style: italic;
`;

const Footer = styled.footer`
  width: 100%;
  padding: 20px;
  background-color: #004aad;
  color: white;
  text-align: center;
  position: fixed;
  bottom: 0;
`;

const GlobalChangesAwareness = () => {
  return (
    <>
      <Container>
        <Title>Global Changes Awareness</Title>
        <Description>
          Welcome to the Global Changes Awareness application. This platform
          provides a comprehensive overview of various data points and
          visualizations related to global changes over the years. Explore
          different aspects such as sea level rise, ocean acidification, and
          other crucial environmental indicators to understand the impact of
          climate change and other global phenomena.
        </Description>
        <Credits>
          This application was developed by Eric Costerousse, Marlon Valencia, and
          Cristian Dinca.
        </Credits>
      </Container>
    </>
  );
};

export default GlobalChangesAwareness;
