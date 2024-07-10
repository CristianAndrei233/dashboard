import React from 'react';
import styled from 'styled-components';

const FooterContainer = styled.footer`
  width: 100%;
  background-color: #2c3e50;
  color: #ecf0f1;
  text-align: center;
  padding: 10px 0;
  position: fixed;
  bottom: 0;
`;

const FooterText = styled.p`
  margin: 0;
  font-size: 0.9em;
`;

const Footer = () => {
  return (
    <FooterContainer>
      <FooterText>&copy; 2024 Global Changes Awareness. All rights reserved.</FooterText>
    </FooterContainer>
  );
};

export default Footer;
