import React, { useEffect, useState } from "react";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import { scaleLinear } from "d3-scale";
import { csv } from "d3-fetch";
import styled from "styled-components";
import worldMap from "../../TopoJSON/world.json";
import { Tooltip as ReactTooltip } from "react-tooltip";
import iso from "iso-3166-1";

const csvUrl = "/data/migration-flows.csv";

const colorScale = scaleLinear()
  .domain([0, 1000, 10000, 100000, 1000000])
  .range(["#f7fbff", "#deebf7", "#9ecae1", "#3182bd", "#08519c"]);

const Container = styled.div`
  width: 80%;
  max-width: 800px;
  margin: 20px auto;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 20px;
`;

const Title = styled.h1`
  font-size: 1.5em;
  margin-bottom: 20px;
  text-align: center;
`;

const MapContainer = styled.div`
  width: 100%;
  height: auto;
  margin-bottom: 20px;
`;

const ComposableMapStyled = styled(ComposableMap)`
  width: 100%;
  height: auto;
`;

const GeographyStyled = styled(Geography)`
  cursor: pointer;
`;

const LegendContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 20px;
`;

const LegendItem = styled.div`
  display: flex;
  align-items: center;
  margin-right: 10px;
`;

const LegendColor = styled.div`
  width: 20px;
  height: 20px;
  background-color: ${(props) => props.color};
  margin-right: 5px;
`;

const LegendLabel = styled.span`
  font-size: 0.9em;
`;

const TooltipContainer = styled.div`
  background-color: white;
  padding: 10px;
  border-radius: 5px;
`;

const TooltipTitle = styled.h3`
  font-size: 1.1em;
  margin-bottom: 5px;
  color: #004aad;
`;

const TooltipInfo = styled.p`
  font-size: 0.9em;
  margin-bottom: 5px;
  color: #000;
`;

const WorldMap = () => {
  const [migrationData, setMigrationData] = useState({});
  const [selectedCountry, setSelectedCountry] = useState("");
  const [tooltipContent, setTooltipContent] = useState("");

  const countryNameOverrides = {
    "Russia": "RUS",
    "United States of America": "USA",
    "South Korea": "KOR",
    "North Korea": "PRK",
    "Vietnam": "VNM",
    "Ivory Coast": "CIV",
    "Democratic Republic of the Congo": "COD",
    "Czech Republic": "CZE",
    "Slovakia": "SVK",
    "United Kingdom": "GBR",
    "Syria": "SYR",
    "Palestine": "PSE",
    "Kosovo": "XKX",
    "South Sudan": "SSD",
    "Macedonia": "MKD",
    "Somaliland": "SOL",
    "Bosnia and Herz.": "BIH",
    // Add more overrides as needed
  };

  const CountryNames = {
    ABW: 'Aruba',
    AFG: 'Afghanistan',
    AGO: 'Angola',
    AIA: 'Anguilla',
    ALB: 'Albania',
    AND: 'Andorra',
    ARE: 'United Arab Emirates',
    ARG: 'Argentina',
    ARM: 'Armenia',
    ASM: 'American Samoa',
    ATG: 'Antigua and Barbuda',
    AUS: 'Australia',
    AUT: 'Austria',
    AZE: 'Azerbaijan',
    BDI: 'Burundi',
    BEL: 'Belgium',
    BEN: 'Benin',
    BFA: 'Burkina Faso',
    BGD: 'Bangladesh',
    BGR: 'Bulgaria',
    BHR: 'Bahrain',
    BHS: 'Bahamas',
    BIH: 'Bosnia and Herzegovina',
    BLR: 'Belarus',
    BLZ: 'Belize',
    BMU: 'Bermuda',
    BOL: 'Bolivia',
    BRA: 'Brazil',
    BRB: 'Barbados',
    BTN: 'Bhutan',
    BWA: 'Botswana',
    CAF: 'Central African Republic',
    CAN: 'Canada',
    CHE: 'Switzerland',
    CHL: 'Chile',
    CHN: 'China',
    CMR: 'Cameroon',
    COG: 'Congo',
    COK: 'Cook Islands',
    COL: 'Colombia',
    COM: 'Comoros',
    CRI: 'Costa Rica',
    CUB: 'Cuba',
    CYM: 'Cayman Islands',
    CYP: 'Cyprus',
    DEU: 'Germany',
    DJI: 'Djibouti',
    DMA: 'Dominica',
    DNK: 'Denmark',
    DOM: 'Dominican Republic',
    DZA: 'Algeria',
    ECU: 'Ecuador',
    EGY: 'Egypt',
    ERI: 'Eritrea',
    ESH: 'Western Sahara',
    ESP: 'Spain',
    EST: 'Estonia',
    ETH: 'Ethiopia',
    FIN: 'Finland',
    FJI: 'Fiji',
    FLK: 'Falkland Islands',
    FRA: 'France',
    GAB: 'Gabon',
    GBR: 'United Kingdom',
    GEO: 'Georgia',
    GHA: 'Ghana',
    GIB: 'Gibraltar',
    GIN: 'Guinea',
    GLP: 'Guadeloupe',
    GMB: 'Gambia',
    GNB: 'Guinea-Bissau',
    GNQ: 'Equatorial Guinea',
    GRC: 'Greece',
    GRD: 'Grenada',
    GRL: 'Greenland',
    GTM: 'Guatemala',
    GUF: 'French Guiana',
    GUM: 'Guam',
    GUY: 'Guyana',
    HKG: 'Hong Kong',
    HND: 'Honduras',
    HRV: 'Croatia',
    HTI: 'Haiti',
    HUN: 'Hungary',
    IDN: 'Indonesia',
    IMN: 'Isle of Man',
    IND: 'India',
    IRL: 'Ireland',
    IRQ: 'Iraq',
    ISL: 'Iceland',
    ISR: 'Israel',
    ITA: 'Italy',
    JAM: 'Jamaica',
    JOR: 'Jordan',
    JPN: 'Japan',
    KAZ: 'Kazakhstan',
    KEN: 'Kenya',
    KGZ: 'Kyrgyzstan',
    KHM: 'Cambodia',
    KIR: 'Kiribati',
    KNA: 'Saint Kitts and Nevis',
    KOR: 'South Korea',
    KWT: 'Kuwait',
    LBN: 'Lebanon',
    LBR: 'Liberia',
    LBY: 'Libya',
    LCA: 'Saint Lucia',
    LIE: 'Liechtenstein',
    LKA: 'Sri Lanka',
    LSO: 'Lesotho',
    LTU: 'Lithuania',
    LUX: 'Luxembourg',
    LVA: 'Latvia',
    MAC: 'Macau',
    MAR: 'Morocco',
    MCO: 'Monaco',
    MDG: 'Madagascar',
    MDV: 'Maldives',
    MEX: 'Mexico',
    MHL: 'Marshall Islands',
    MLI: 'Mali',
    MLT: 'Malta',
    MMR: 'Myanmar',
    MNE: 'Montenegro',
    MNG: 'Mongolia',
    MNP: 'Northern Mariana Islands',
    MOZ: 'Mozambique',
    MRT: 'Mauritania',
    MSR: 'Montserrat',
    MTQ: 'Martinique',
    MUS: 'Mauritius',
    MWI: 'Malawi',
    MYS: 'Malaysia',
    MYT: 'Mayotte',
    NAM: 'Namibia',
    NCL: 'New Caledonia',
    NER: 'Niger',
    NGA: 'Nigeria',
    NIC: 'Nicaragua',
    NIU: 'Niue',
    NLD: 'Netherlands',
    NOR: 'Norway',
    NPL: 'Nepal',
    NRU: 'Nauru',
    NZL: 'New Zealand',
    OMN: 'Oman',
    PAK: 'Pakistan',
    PAN: 'Panama',
    PER: 'Peru',
    PHL: 'Philippines',
    PLW: 'Palau',
    PNG: 'Papua New Guinea',
    POL: 'Poland',
    PRI: 'Puerto Rico',
    PRK: 'North Korea',
    PRT: 'Portugal',
    PRY: 'Paraguay',
    PSE: 'Palestine',
    PYF: 'French Polynesia',
    QAT: 'Qatar',
    ROU: 'Romania',
    RUS: 'Russia',
    RWA: 'Rwanda',
    SAU: 'Saudi Arabia',
    SDN: 'Sudan',
    SEN: 'Senegal',
    SGP: 'Singapore',
    SLB: 'Solomon Islands',
    SLE: 'Sierra Leone',
    SLV: 'El Salvador',
    SMR: 'San Marino',
    SOM: 'Somalia',
    SPM: 'Saint Pierre and Miquelon',
    SRB: 'Serbia',
    SSD: 'South Sudan',
    STP: 'Sao Tome and Principe',
    SUR: 'Suriname',
    SVK: 'Slovakia',
    SVN: 'Slovenia',
    SWE: 'Sweden',
    SYC: 'Seychelles',
    SYR: 'Syria',
    TCA: 'Turks and Caicos Islands',
    TCD: 'Chad',
    TGO: 'Togo',
    THA: 'Thailand',
    TJK: 'Tajikistan',
    TKL: 'Tokelau',
    TKM: 'Turkmenistan',
    TLS: 'Timor-Leste',
    TON: 'Tonga',
    TTO: 'Trinidad and Tobago',
    TUN: 'Tunisia',
    TUR: 'Turkey',
    TUV: 'Tuvalu',
    UGA: 'Uganda',
    UKR: 'Ukraine',
    URY: 'Uruguay',
    UZB: 'Uzbekistan',
    VCT: 'Saint Vincent and the Grenadines',
    VNM: 'Vietnam',
    VUT: 'Vanuatu',
    WLF: 'Wallis and Futuna',
    WSM: 'Samoa',
    YEM: 'Yemen',
    ZAF: 'South Africa',
    ZMB: 'Zambia',
    ZWE: 'Zimbabwe'
  };
  
  useEffect(() => {
    csv(csvUrl)
      .then((csvData) => {
        const parsedData = csvData.reduce((acc, row) => {
          const year = row.Year;
          if (year !== "2015") return acc; // Only process the year 2015
          acc[year] = acc[year] || {};

          Object.keys(row).forEach((key) => {
            if (key.startsWith('Emigrants from')) {
              const countryName = key.replace('Emigrants from ', '');
              const alpha3CountryCode = countryNameOverrides[countryName] || iso.whereCountry(countryName)?.alpha3;
              if (alpha3CountryCode) {
                acc[year][alpha3CountryCode] = acc[year][alpha3CountryCode] || {};
                const destinationCountryName = row.Country;
                const destinationAlpha3CountryCode = countryNameOverrides[destinationCountryName] || iso.whereCountry(destinationCountryName)?.alpha3;
                if (destinationAlpha3CountryCode) {
                  acc[year][alpha3CountryCode][destinationAlpha3CountryCode] = +row[key];
                }
              }
            }
          });

          return acc;
        }, {});
        setMigrationData(parsedData);
      })
      .catch((error) => {
        console.error("Error loading the CSV data:", error);
      });
  }, []);

  const handleCountrySelect = (event) => {
    setSelectedCountry(event.target.value);
  };

  const getEmigrantData = (country) => {
    if (migrationData["2015"] && migrationData["2015"][country]) {
      return migrationData["2015"][country];
    }
    return {};
  };

  const handleMouseEnter = (geo, emigrantData) => {
    const countryName = geo.properties.name;
    const alpha3CountryCode = countryNameOverrides[countryName] || iso.whereCountry(countryName)?.alpha3;
    const emigrantDataForCountry = getEmigrantData(selectedCountry);
    const value = emigrantDataForCountry[alpha3CountryCode] || 0;
    const color = value > 0 ? colorScale(value) : "#EEE";
    setTooltipContent({
      title: countryName,
      info: `Emigrants: ${value.toLocaleString()}`,
    });
  };

  const handleMouseLeave = () => {
    setTooltipContent("");
  };


  return (
    <Container>
      <Title>Emigrants from Selected Country (2015)</Title>
      <select onChange={handleCountrySelect}>
        <option value="">Select a country</option>
        {Object.keys(migrationData["2015"] || {}).map((country) => (
          <option key={country} value={country}>
            {CountryNames[country] || country}
          </option>
        ))}
      </select>
      <MapContainer>
        <ComposableMapStyled data-tooltip-id="country-tooltip">
          <Geographies geography={worldMap}>
            {({ geographies }) =>
              geographies.map((geo) => {
                const countryName = geo.properties.name;
                const alpha3CountryCode = countryNameOverrides[countryName] || iso.whereCountry(countryName)?.alpha3;
                console.log(alpha3CountryCode, 'COUNTRY ALPHA');
                console.log("Country Name: ", countryName);
                console.log("Alpha-3 Country Code: ", alpha3CountryCode);

                const emigrantData = getEmigrantData(selectedCountry);
                console.log(`Emigrant Data for ${selectedCountry}: `, emigrantData); // Debugging line to check emigrant data

                const value = emigrantData[alpha3CountryCode] || 0;
                console.log(value, 'VALUEEEEEEEEEEEEEE');
                const color = value > 0 ? colorScale(value) : "#EEE";
                console.log(`Color for ${countryName} (${alpha3CountryCode}): `, color); // Debugging line to check color

                return (
                  <GeographyStyled
                    key={geo.rsmKey}
                    geography={geo}
                    style={{
                      default: { fill: color, outline: "none" },
                      hover: { fill: "#FFD700", outline: "none" },
                      pressed: { fill: "#FF4500", outline: "none" },
                    }}
                    onMouseEnter={() => handleMouseEnter(geo, emigrantData)}
                    onMouseLeave={handleMouseLeave}
                  />
                );
              })
            }
          </Geographies>
        </ComposableMapStyled>
        {tooltipContent && (
          <ReactTooltip id="country-tooltip" place="right" type="dark" effect="float">
            <TooltipContainer>
              <TooltipTitle>{tooltipContent.title}</TooltipTitle>
              <TooltipInfo>{tooltipContent.info}</TooltipInfo>
            </TooltipContainer>
          </ReactTooltip>
        )}
      </MapContainer>
      <LegendContainer>
        <LegendItem>
          <LegendColor color="#f7fbff" />
          <LegendLabel>No data</LegendLabel>
        </LegendItem>
        <LegendItem>
          <LegendColor color="#deebf7" />
          <LegendLabel>0-1,000</LegendLabel>
        </LegendItem>
        <LegendItem>
          <LegendColor color="#9ecae1" />
          <LegendLabel>1,001-10,000</LegendLabel>
        </LegendItem>
        <LegendItem>
          <LegendColor color="#3182bd" />
          <LegendLabel>10,001-100,000</LegendLabel>
        </LegendItem>
        <LegendItem>
          <LegendColor color="#08519c" />
          <LegendLabel>100,001+</LegendLabel>
        </LegendItem>
      </LegendContainer>
    </Container>
  );
};

export default WorldMap;
