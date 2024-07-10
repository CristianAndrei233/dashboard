import React from 'react';
import styled from 'styled-components';

const HeaderContainer = styled.div`
  margin-bottom: 20px;
`;

const Title = styled.h1`
  font-size: 2em;
  margin-bottom: 10px;
  color: #2c3e50;
  text-align: center;
`;

const Subtitle = styled.p`
  font-size: 1.2em;
  color: #7f8c8d;
  text-align: center;
`;

const PageHeader = ({ title, subtitle }) => {
  return (
    <HeaderContainer>
      <Title>{title}</Title>
      <Subtitle>{subtitle}</Subtitle>
    </HeaderContainer>
  );
};

export default PageHeader;
