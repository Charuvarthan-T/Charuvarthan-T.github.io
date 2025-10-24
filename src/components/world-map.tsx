"use client";

import { useState, useEffect, useMemo } from "react";
import BlurFade from "./magicui/blur-fade";
import { ComposableMap, Geographies, Geography, ZoomableGroup } from "react-simple-maps";
import geoData from "../../public/world-countries.json";

// List of countries you've visited (ISO 3166-1 alpha-3 codes)
const visitedCountries = [
  "IND", // India (Home)
];

// FAANG and major tech company locations where you want to work
const targetWorkCountries = [
  "USA", // United States - Silicon Valley, Seattle, New York
  "GBR", // United Kingdom - London
  "IRL", // Ireland - Dublin (European HQs)
  "CHE", // Switzerland - Zurich
  "DEU", // Germany - Munich, Berlin
  "CAN", // Canada - Toronto, Vancouver
  "AUS", // Australia - Sydney
  "SGP", // Singapore
  "JPN", // Japan - Tokyo
  "KOR", // South Korea - Seoul
  "ISR", // Israel - Tel Aviv
  "SWE", // Sweden - Stockholm
  "NLD", // Netherlands - Amsterdam
];

// Map of country codes to full names and categories for the word list
const countryData: { [key: string]: { name: string; category: string; companies?: string[] } } = {
  "IND": { name: "India", category: "Home" },
  "USA": { 
    name: "United States", 
    category: "FAANG Hub", 
    companies: ["Meta", "Apple", "Amazon", "Netflix", "Google", "Microsoft"] 
  },
  "GBR": { 
    name: "United Kingdom", 
    category: "Europe", 
    companies: ["Google", "Meta", "Amazon", "Microsoft"] 
  },
  "IRL": { 
    name: "Ireland", 
    category: "Europe", 
    companies: ["Google", "Meta", "Apple", "Microsoft"] 
  },
  "CHE": { 
    name: "Switzerland", 
    category: "Europe", 
    companies: ["Google", "Microsoft"] 
  },
  "DEU": { 
    name: "Germany", 
    category: "Europe", 
    companies: ["Google", "Amazon", "Microsoft"] 
  },
  "CAN": { 
    name: "Canada", 
    category: "North America", 
    companies: ["Google", "Microsoft", "Amazon", "Meta"] 
  },
  "AUS": { 
    name: "Australia", 
    category: "Asia-Pacific", 
    companies: ["Google", "Microsoft", "Amazon"] 
  },
  "SGP": { 
    name: "Singapore", 
    category: "Asia-Pacific", 
    companies: ["Google", "Meta", "Amazon", "Apple"] 
  },
  "JPN": { 
    name: "Japan", 
    category: "Asia-Pacific", 
    companies: ["Google", "Apple", "Amazon", "Microsoft"] 
  },
  "KOR": { 
    name: "South Korea", 
    category: "Asia-Pacific", 
    companies: ["Google", "Microsoft"] 
  },
  "ISR": { 
    name: "Israel", 
    category: "Middle East", 
    companies: ["Google", "Meta", "Apple", "Microsoft"] 
  },
  "SWE": { 
    name: "Sweden", 
    category: "Europe", 
    companies: ["Google", "Microsoft"] 
  },
  "NLD": { 
    name: "Netherlands", 
    category: "Europe", 
    companies: ["Google", "Netflix", "Microsoft"] 
  },
};

interface WorldMapProps {
  delay?: number;
}

export const WorldMap = ({ delay }: WorldMapProps) => {
  const [isClient, setIsClient] = useState(false);
  const [hoveredCountry, setHoveredCountry] = useState<string | null>(null);
  const [position, setPosition] = useState({ coordinates: [0, 20], zoom: 1.5 });

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Helper to get country name from feature
  const getCountryName = (feature: any) => {
    return feature.properties.name;
  };

  // Helper to get country code from feature
  const getCountryCode = (feature: any) => {
    return feature.id;
  };

  // Memoize visited and target work sets for fast lookup
  const visitedSet = useMemo(() => new Set(visitedCountries), []);
  const targetWorkSet = useMemo(() => new Set(targetWorkCountries), []);

  if (!isClient) {
    return (
      <BlurFade delay={delay}>
        <div className="flex justify-center">
          <div className="bg-card border rounded-lg p-6 w-full max-w-4xl">
            <div className="h-96 flex items-center justify-center">
              Loading World Map...
            </div>
          </div>
        </div>
      </BlurFade>
    );
  }

  return (
    <BlurFade delay={delay}>
      <div className="flex justify-center">
        <div className="bg-card border rounded-lg p-6 w-full max-w-4xl">
          <div className="flex flex-col items-center space-y-6">
            <div className="relative w-full max-w-2xl">
              <ComposableMap
                projection="geoMercator"
                projectionConfig={{
                  rotate: [-10, 0, 0],
                  scale: 150,
                }}
                width={800}
                height={400}
                style={{ width: "100%", height: "auto", maxHeight: 400 }}
              >
                <ZoomableGroup
                  zoom={position.zoom}
                  center={position.coordinates as [number, number]}
                  onMoveEnd={({ coordinates, zoom }) => setPosition({ coordinates, zoom })}
                >
                  <Geographies geography={geoData}>
                    {({ geographies }) =>
                      geographies.map((geo) => {
                        const code = getCountryCode(geo);
                        const isVisited = visitedSet.has(code);
                        const isTargetWork = targetWorkSet.has(code);
                        
                        let fillColor = "#e5e7eb"; // Default gray
                        if (isVisited) {
                          fillColor = "#10B981"; // Green for visited (home)
                        } else if (isTargetWork) {
                          fillColor = "#F59E0B"; // Orange for target work countries
                        }
                        
                        return (
                          <Geography
                            key={geo.rsmKey}
                            geography={geo}
                            onMouseEnter={() => setHoveredCountry(getCountryName(geo))}
                            onMouseLeave={() => setHoveredCountry(null)}
                            style={{
                              default: {
                                fill: fillColor,
                                stroke: "#ffffff",
                                strokeWidth: 0.75,
                                outline: "none",
                                transition: "fill 0.2s",
                                cursor: "pointer",
                              },
                              hover: {
                                fill: "#3b82f6",
                                stroke: "#ffffff",
                                strokeWidth: 1,
                                outline: "none",
                                cursor: "pointer",
                              },
                              pressed: {
                                fill: fillColor,
                                stroke: "#ffffff",
                                strokeWidth: 1,
                                outline: "none",
                                cursor: "pointer",
                              },
                            }}
                          />
                        );
                      })
                    }
                  </Geographies>
                </ZoomableGroup>
              </ComposableMap>
              {/* Tooltip for hovered country */}
              {hoveredCountry && (
                <div className="absolute left-1/2 top-2 transform -translate-x-1/2 bg-white bg-opacity-90 text-blue-700 px-4 py-2 rounded-lg shadow text-center pointer-events-none z-10">
                  <span className="font-semibold text-base">{hoveredCountry}</span>
                </div>
              )}
            </div>
            {/* Legend */}
            <div className="flex items-center justify-center space-x-6 text-sm flex-wrap gap-2">
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 rounded" style={{ backgroundColor: '#10B981' }}></div>
                <span>Home</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 rounded" style={{ backgroundColor: '#F59E0B' }}></div>
                <span>Want to Work (FAANG)</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-gray-300 rounded"></div>
                <span>Other Countries</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 rounded" style={{ backgroundColor: '#3b82f6' }}></div>
                <span>Hover</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </BlurFade>
  );
}; 