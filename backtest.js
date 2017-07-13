let lowPrices = [1987.45, 1991.01, 1996.13, 2002.53, 2003.69, 2003.88, 2013.65, 2015.08, 2016.06, 2016.34, 2016.35, 2016.35, 2016.37, 2016.71, 2007.02, 2004.4, 2003.38, 2008.3, 2005.53, 2005.54, 2007.17, 2008.12, 2012.26, 2012.16, 2012.4, 2013, 2014.29, 2016.29, 2016.34, 2015.98, 2015.19, 2016.22, 2014.62, 2016.06, 2016.59, 2016.6, 2018.47, 2013.1, 2014.54, 2015.3, 2015.69, 2014.54, 2016.38, 2022.74, 2023.63, 2021.99, 2023.81, 2019.48, 2017.44, 2020.11, 2018.86, 2022.35, 2026.67, 2029.25, 2033.05, 2034.01, 2034.23, 2034.25, 2033.5, 2034.98, 2037.49, 2038.93, 2041.01, 2042.76, 2045.5, 2048.28, 2049.13, 2051.39, 2052.19, 2053.38, 2051.61, 2051.61, 2053, 2051.6, 2051.6, 2051.6, 2040, 2040, 2041.17, 2043.9, 2048.05, 2050.79, 2053.32, 2047.88, 2047.42, 2047.34, 2053.06, 2055.51, 2055.5, 2057.41, 2057.53, 2058.99, 2059.5, 2060.23, 2060.81, 2061.75, 2059.78, 2061.91, 2062.97, 2062.98, 2064.28, 2064.77, 2066.24, 2065.75, 2062.88, 2053.19, 2055.09, 2058.05, 2058.72, 2055.85, 2060.1, 2060.07, 2059.61, 2060.24, 2060.54, 2062.59, 2057.14, 2050.04, 2046.43, 2045.11, 2047.73, 2051.68, 2053.58, 2055.1, 2059.92, 2063.35, 2064.63, 2066.75, 2066.4, 2066.33, 2066.17, 2065.64, 2066.49, 2067.42, 2068.71, 2070.29, 2074.25, 2075.02, 2076.11, 2080.68, 2082.22, 2085.29, 2080.31, 2080.86, 2085.01, 2090.38, 2092.97, 2093.07, 2093.24, 2093.21, 2094.74, 2094.72, 2094.73, 2096.97, 2098.24, 2098.8, 2102.55, 2107.57, 2109.15, 2115, 2111.12, 2104.07, 2110.92, 2110, 2106.61, 2095.87, 2106.39, 2108.76, 2108.2, 2108.01, 2109.91, 2110, 2110.01, 2108.85, 2108, 2107.01, 2107.15, 2109.33, 2105.29, 2106.83, 2111.2, 2112.03, 2113.28, 2112.57, 2112.18, 2110.57, 2110.84, 2109.84, 2110.01, 2110.01, 2110.65, 2107.85, 2108.9, 2108.91, 2108.85, 2107.86, 2109.19, 2107.85, 2100.01, 2084.12, 2087.43, 2093.32, 2092.14, 2092.82, 2091.86, 2084.8, 2077.77, 2078.47, 2073.39, 2079.37, 2088.19, 2086.01, 2078.38, 2078.94, 2079.32, 2079.37, 2086.06, 2092.7, 2093.11, 2091.83, 2087.32, 2081.57, 2087.79, 2084.55, 2087.01, 2087.8, 2087.86, 2085.56, 2085.63, 2083.11, 2085.61, 2089.22, 2082.59, 2083.4, 2085.03, 2088.04, 2092.13, 2093.8, 2099.92, 2100.9, 2104.32, 2104.65, 2103.11, 2098.66, 2100.05, 2101, 2103.24, 2107.02, 2107.29, 2106.52, 2102.1, 2096.73, 2096.04, 2098.17, 2101, 2099.89, 2102, 2102, 2102, 2102, 2102.01, 2102.03, 2102, 2101.99, 2102.03, 2102.5, 2110.59, 2110.46, 2111, 2111, 2110.92, 2111, 2111, 2110.99, 2111, 2114.99, 2116.09, 2117.48, 2118.5, 2118.49, 2116.39, 2115.94, 2116.11, 2115.98, 2118.03, 2118.8, 2117.14, 2114.71, 2114.7, 2113.46, 2113.46, 2113.46, 2111.14, 2110.78, 2110.77, 2107.56, 2107.53, 2105.17, 2103.65, 2102.2, 2102.19, 2101.19, 2098.24, 2086.01, 2082.84, 2085.02, 2091.39, 2097.55, 2097.98, 2097.9, 2094.16, 2093.57, 2093.56, 2095.84, 2097.35, 2100.01, 2098.98, 2096.54, 2098.26, 2097.83, 2095.82, 2096.35, 2092.97, 2094.46, 2093.06, 2093.01, 2085.01, 2084.87, 2085.86, 2087.63, 2084.55, 2083.58, 2074.71, 2083.17, 2083.93, 2087.32, 2092.44, 2079.86, 2079.99, 2079.99, 2092.5, 2094.98, 2095.02, 2095.7, 2097.57, 2097.91, 2097.91, 2096.51, 2095.79, 2097.47, 2095.91, 2098.44, 2098.34, 2096.03, 2092.84, 2090.62, 2091.76, 2090.44, 2091.16, 2092.28, 2088.4, 2090.18, 2090.81, 2090.95, 2092.13, 2096.96, 2096.92, 2092, 2098.37, 2097.08, 2097.17, 2098.61, 2097.01, 2098, 2103.56, 2102.22, 2103.49, 2103.32, 2105.02, 2100.95, 2095.39, 2098.03, 2098.71, 2099.94, 2101.06, 2101.01, 2095.47, 2095.01, 2096.98, 2092.83, 2091.29, 2090.01, 2087.26, 2085.2, 2082, 2083, 2083];
let highPrices = [1994.45, 2001.67, 2003.31, 2003.86, 2003.88, 2011.78, 2015.12, 2016.07, 2016.35, 2016.35, 2016.36, 2016.37, 2016.72, 2016.75, 2016.74, 2008.91, 2012.66, 2012.43, 2005.75, 2012.97, 2012.97, 2012.5, 2013.84, 2013.51, 2014.54, 2016.12, 2017.13, 2016.74, 2016.6, 2016.6, 2016.6, 2016.6, 2016.6, 2016.6, 2016.6, 2020.05, 2020.07, 2020.06, 2019.37, 2020.54, 2020.59, 2025.48, 2025.48, 2025.47, 2025.35, 2025.23, 2025.25, 2025.25, 2021.6, 2022.73, 2024.62, 2027.48, 2030.91, 2033.05, 2034.01, 2037.05, 2037.17, 2037.12, 2037.17, 2037.75, 2039.08, 2041.01, 2043, 2047.71, 2049.71, 2050.35, 2051.39, 2052.65, 2053.38, 2054.13, 2054.13, 2054.13, 2054.76, 2054, 2052.71, 2051.63, 2051.63, 2045.85, 2045.85, 2047.99, 2054, 2054, 2054, 2053.98, 2051.05, 2054, 2056, 2057.11, 2057.43, 2057.53, 2058.99, 2059.5, 2060.23, 2060.82, 2062.45, 2062.45, 2062.45, 2062.98, 2062.98, 2064.28, 2064.77, 2068.22, 2068.22, 2068.22, 2067.27, 2062.59, 2061.77, 2060.67, 2061.78, 2067.72, 2067.82, 2066.82, 2066.82, 2072.4, 2065, 2065, 2064.82, 2057.57, 2055.2, 2050, 2055.17, 2055.2, 2055.2, 2063.73, 2064.8, 2064.8, 2066.76, 2066.76, 2066.76, 2066.76, 2070.22, 2067.89, 2068.76, 2070.77, 2072, 2075.04, 2075.04, 2076.11, 2080.69, 2082.22, 2086.28, 2087.31, 2087.31, 2087.1, 2091.31, 2092.97, 2093.27, 2094.74, 2094.74, 2094.74, 2094.75, 2094.75, 2096.97, 2098.24, 2098.8, 2102.55, 2109.31, 2110.19, 2115.97, 2122.14, 2116.21, 2111, 2111, 2111, 2110.24, 2109.31, 2114.59, 2116.01, 2110, 2110, 2117.99, 2116.95, 2113.06, 2114.09, 2110.72, 2108.14, 2113.96, 2114.98, 2114.75, 2112.95, 2117.5, 2118.77, 2116.5, 2115.77, 2116.35, 2115.33, 2115, 2116.35, 2117.5, 2113.68, 2113.26, 2110.78, 2110, 2110, 2114.88, 2111.72, 2111.29, 2110.93, 2108.73, 2100.02, 2100.48, 2100.52, 2096.24, 2096.48, 2095.3, 2090.73, 2087.29, 2087.77, 2081.41, 2088.38, 2095.14, 2089.35, 2086, 2088.63, 2081.38, 2089.43, 2096.55, 2098.14, 2098.77, 2096.92, 2092.3, 2089.66, 2089.38, 2090, 2089.98, 2087.87, 2088.93, 2088.47, 2085.64, 2085.64, 2094.65, 2093.54, 2093.27, 2084.12, 2088.04, 2096, 2099.95, 2103.49, 2108.11, 2104.95, 2106.42, 2106.37, 2108.66, 2101.69, 2101, 2108.17, 2107.55, 2107.04, 2111, 2108.26, 2105.95, 2107.77, 2098.43, 2104.4, 2102.21, 2099.89, 2102, 2102.01, 2102.01, 2102.01, 2102.03, 2102.03, 2102.03, 2102.03, 2102.5, 2110.91, 2110.59, 2111, 2111, 2111, 2110.93, 2111, 2111, 2111, 2115, 2116.84, 2117.99, 2120, 2120, 2118.54, 2116.39, 2116.71, 2125, 2119.58, 2119.81, 2119.06, 2118.83, 2118.64, 2114.71, 2114.71, 2114.69, 2113.46, 2113.46, 2110.78, 2110.78, 2111.01, 2107.56, 2107.54, 2110.78, 2103.65, 2102.2, 2102.2, 2098.25, 2098.23, 2089.43, 2091.81, 2097.68, 2103.35, 2098.97, 2100.95, 2099.41, 2097.17, 2103.29, 2103.31, 2102.99, 2101.98, 2101.38, 2102.34, 2102.98, 2102.46, 2099.72, 2100.99, 2100.2, 2097, 2097, 2096.97, 2093.4, 2088.16, 2091.93, 2090.43, 2090.42, 2087.79, 2085.57, 2088.47, 2091.9, 2097, 2097, 2097, 2080, 2097.06, 2096.21, 2097.55, 2098, 2100, 2100.59, 2102.2, 2101.38, 2100, 2101.39, 2101.39, 2101.38, 2099.99, 2101.37, 2101.25, 2099.52, 2097.43, 2096.54, 2095.02, 2096.81, 2095.51, 2092.9, 2096.63, 2097.16, 2097, 2098.53, 2099.88, 2100.04, 2099.25, 2100.04, 2100.08, 2100.08, 2100.08, 2103.34, 2105.39, 2108.74, 2108.74, 2110.87, 2113.71, 2111.42, 2110.93, 2110.45, 2102.05, 2103.6, 2104.95, 2101.53, 2101.22, 2101.14, 2098.64, 2097.35, 2097, 2096.99, 2095.54, 2092.79, 2088.84, 2085.74, 2083.99, 2083.01];
let openPrices = [1987.76, 1991.01, 2001.66, 2003.31, 2003.69, 2003.88, 2013.66, 2015.12, 2016.07, 2016.35, 2016.35, 2016.36, 2016.37, 2016.72, 2016.74, 2006.04, 2006.3, 2012.43, 2005.75, 2005.74, 2009.66, 2008.75, 2012.5, 2013.51, 2012.4, 2013, 2016.11, 2016.29, 2016.59, 2016.59, 2015.51, 2016.6, 2016.59, 2016.57, 2016.6, 2016.6, 2019.35, 2020.05, 2014.54, 2016.61, 2015.69, 2020.53, 2018.17, 2024.78, 2025.35, 2024.19, 2025.24, 2025.25, 2020.52, 2021.45, 2021.38, 2023.65, 2027.48, 2029.25, 2033.05, 2034.01, 2037.02, 2034.25, 2035.49, 2035.37, 2037.5, 2039.08, 2041.01, 2043, 2045.5, 2049.71, 2050.15, 2051.39, 2052.65, 2053.38, 2052.99, 2053.75, 2053.01, 2053.82, 2051.6, 2051.63, 2051.62, 2040.37, 2043.91, 2045.85, 2049.92, 2050.88, 2053.97, 2053.38, 2051.05, 2047.34, 2053.06, 2056, 2057.11, 2057.42, 2057.53, 2058.99, 2059.5, 2060.23, 2060.81, 2062.43, 2062.45, 2061.92, 2062.98, 2062.98, 2064.28, 2064.77, 2067.89, 2068.21, 2067.27, 2062.56, 2055.09, 2058.39, 2060.66, 2061.66, 2062.61, 2065.09, 2066.79, 2063.01, 2060.93, 2064.96, 2063.85, 2057.57, 2052.77, 2049.32, 2049.99, 2054.92, 2054.71, 2055.18, 2063.7, 2064.12, 2064.63, 2066.75, 2066.76, 2066.76, 2066.74, 2067.88, 2067.77, 2068.75, 2068.74, 2070.29, 2075.04, 2075.03, 2076.11, 2080.68, 2082.22, 2086.26, 2086.33, 2083.8, 2087.3, 2090.44, 2092.97, 2093.08, 2094.74, 2093.22, 2094.74, 2094.75, 2094.75, 2096.97, 2098.24, 2098.8, 2102.55, 2109.27, 2109.17, 2117.11, 2115, 2111, 2110.92, 2111, 2110.21, 2109.31, 2106.4, 2113.3, 2109.98, 2108.84, 2109.91, 2110.78, 2111.04, 2110.3, 2110.4, 2108.14, 2107.22, 2113.95, 2114.75, 2109.63, 2111.23, 2114.53, 2115.39, 2113.4, 2112.64, 2112.15, 2110.85, 2114.11, 2110.37, 2113.68, 2110.68, 2110.77, 2109.91, 2109.87, 2109.98, 2110.66, 2110.87, 2110.62, 2108.73, 2100.01, 2087.44, 2099.17, 2096.24, 2094.99, 2093.09, 2090.73, 2084.8, 2080.02, 2081.41, 2079.42, 2088.27, 2087.3, 2086, 2078.94, 2081.38, 2079.37, 2086.06, 2092.75, 2096.42, 2096.92, 2092.3, 2089.04, 2089.37, 2087.37, 2089.95, 2087.85, 2087.87, 2087.86, 2085.64, 2085.63, 2085.62, 2093.54, 2093.27, 2084.12, 2085.04, 2088.04, 2093.77, 2096.93, 2103.44, 2101.91, 2104.32, 2106.36, 2105.23, 2101.5, 2100.05, 2101, 2103.24, 2107.02, 2107.97, 2106.52, 2105.79, 2105.5, 2096.04, 2098.25, 2102.21, 2099.89, 2102, 2102, 2102, 2102.01, 2102.01, 2102.03, 2102, 2102.03, 2102.03, 2102.5, 2110.59, 2110.64, 2111, 2111, 2110.92, 2111, 2111, 2110.99, 2111, 2114.99, 2116.09, 2117.98, 2118.5, 2118.54, 2116.39, 2116.7, 2116.32, 2115.98, 2118.03, 2119.06, 2118.83, 2117.15, 2114.71, 2114.7, 2113.46, 2113.46, 2113.46, 2110.78, 2110.77, 2110.77, 2107.56, 2107.54, 2105.17, 2103.65, 2102.2, 2102.19, 2098.24, 2098.23, 2089.43, 2088.5, 2091.58, 2097.55, 2098.89, 2098.71, 2098.92, 2097.17, 2093.63, 2103.18, 2097.38, 2101.98, 2101.37, 2098.98, 2098.41, 2102.33, 2096.53, 2099.26, 2097.96, 2094.91, 2094.84, 2095.41, 2093.01, 2085.02, 2086.83, 2090.23, 2090.42, 2087.79, 2084.5, 2085, 2084.19, 2089.03, 2093.29, 2092.15, 2079.99, 2080, 2093.64, 2096.21, 2095.31, 2097.98, 2098.77, 2098.07, 2100.63, 2099.9, 2096.51, 2101.38, 2100, 2099.84, 2098.4, 2096.04, 2095.96, 2097.43, 2091.76, 2095.02, 2093.47, 2092.28, 2092.9, 2090.18, 2091.94, 2090.95, 2092.13, 2098.53, 2099.88, 2099.25, 2098.56, 2099.05, 2097.64, 2100.07, 2098.61, 2100.61, 2103.56, 2108.73, 2108.56, 2103.32, 2109.98, 2110.45, 2109.96, 2099.56, 2098.72, 2100.11, 2101.52, 2101.22, 2101.14, 2098.63, 2097.35, 2096.98, 2096.98, 2095.54, 2090.51, 2088.83, 2085.74, 2083.99, 2083.01];
let closePrices = [1990, 1994.39, 2003.3, 2003.69, 2003.88, 2011.78, 2015.11, 2016.07, 2016.35, 2016.35, 2016.35, 2016.37, 2016.72, 2016.74, 2009.41, 2004.4, 2011.9, 2008.3, 2005.53, 2012.88, 2008.75, 2012.5, 2013.62, 2012.41, 2012.41, 2016.11, 2016.29, 2016.57, 2016.59, 2016.57, 2016.6, 2016.6, 2016.58, 2016.6, 2016.6, 2019.35, 2020.06, 2014.54, 2019.33, 2020.52, 2020.56, 2015.88, 2025.14, 2025.37, 2024.18, 2025.23, 2025.25, 2023.37, 2021.54, 2021.38, 2021.78, 2027.48, 2030.91, 2033.05, 2034.01, 2037.03, 2034.25, 2037.12, 2033.92, 2037.75, 2039.08, 2041.01, 2043, 2047.71, 2049.71, 2050.18, 2051.39, 2052.65, 2053.38, 2054.1, 2054.11, 2054.13, 2053.02, 2051.6, 2052.65, 2051.62, 2040.53, 2043.95, 2045.85, 2047.99, 2054, 2053.76, 2053.89, 2051.09, 2049.03, 2050.39, 2056, 2057.11, 2057.43, 2057.53, 2058.99, 2059.5, 2060.23, 2060.82, 2062.43, 2062.45, 2061.92, 2062.97, 2062.98, 2064.28, 2064.77, 2068.22, 2068.21, 2067.39, 2066, 2053.19, 2058.39, 2060.67, 2061.66, 2060.96, 2065.09, 2066.79, 2061.96, 2060.93, 2063.24, 2065, 2060.84, 2053.08, 2046.43, 2049.99, 2054.47, 2052.57, 2054.2, 2063.73, 2064.34, 2064.79, 2066.76, 2066.76, 2066.4, 2066.75, 2070.22, 2067.89, 2068.36, 2068.08, 2070.29, 2075.04, 2075.03, 2076.11, 2080.69, 2082.22, 2086.27, 2086.55, 2083.84, 2086.62, 2091.31, 2092.97, 2093.27, 2094.74, 2094.74, 2094.74, 2094.75, 2094.72, 2096.97, 2098.24, 2098.8, 2102.55, 2107.13, 2110.19, 2115.92, 2115, 2111.12, 2104.07, 2111, 2110.55, 2109.31, 2105.2, 2113.3, 2108.76, 2108.84, 2109.93, 2110.81, 2112.25, 2110.32, 2110.52, 2108.31, 2107.01, 2113.96, 2114.75, 2109.52, 2111.31, 2115.17, 2115.46, 2115.19, 2112.57, 2112.18, 2112.13, 2111.94, 2110.37, 2114, 2110.38, 2111.98, 2109.08, 2109.87, 2109.69, 2110.66, 2111.02, 2109.19, 2108.8, 2100.02, 2087.43, 2100.29, 2096.74, 2095, 2093.41, 2092.62, 2084.8, 2077.77, 2079.73, 2079, 2087.22, 2090.49, 2086.01, 2079.09, 2081.37, 2079.37, 2087.06, 2093.82, 2094.83, 2097.8, 2093.18, 2089.08, 2089.41, 2087.8, 2088.03, 2087.01, 2087.87, 2088.51, 2085.66, 2085.64, 2085.62, 2093.55, 2089.22, 2086.47, 2083.4, 2088.04, 2092.01, 2099.95, 2098.91, 2103.54, 2104.95, 2104.69, 2106.36, 2103.11, 2100.12, 2101, 2108.17, 2105.47, 2107.04, 2110.14, 2108.26, 2105.87, 2099.5, 2098.43, 2104.4, 2101, 2099.89, 2102, 2102.01, 2102.01, 2102, 2102.03, 2102.03, 2102.03, 2101.99, 2102.5, 2109.17, 2110.59, 2111, 2111, 2111, 2110.93, 2111, 2111, 2111, 2115, 2116.84, 2117.99, 2117.88, 2120, 2118.49, 2116.39, 2115.94, 2125, 2116.94, 2119.81, 2118.8, 2117.15, 2114.71, 2114.7, 2113.46, 2113.47, 2113.46, 2112.22, 2110.78, 2110.77, 2107.56, 2107.53, 2106.04, 2103.65, 2102.2, 2102.19, 2101.19, 2098.24, 2086.01, 2088.5, 2091.78, 2097.66, 2099.87, 2098.07, 2097.9, 2097.14, 2093.58, 2096.42, 2097.38, 2102.89, 2100.01, 2098.98, 2102.3, 2102.39, 2097.83, 2099.72, 2096.35, 2096.87, 2097, 2096.82, 2093.02, 2085.02, 2088.13, 2087.33, 2090.42, 2087.79, 2085.59, 2085.05, 2084.19, 2085.12, 2097, 2097, 2079.99, 2080, 2097.06, 2095.05, 2095.19, 2097.98, 2100, 2100.59, 2100.64, 2099.98, 2098, 2097.13, 2099.72, 2099.81, 2098.44, 2100.14, 2096.3, 2097.46, 2091.76, 2095.04, 2093.5, 2093.09, 2093.08, 2090.92, 2096.6, 2096.43, 2096.76, 2098.53, 2097.26, 2099.25, 2096.95, 2099.89, 2100, 2100.08, 2098.61, 2100.62, 2100.08, 2108.74, 2108.74, 2109.94, 2104.57, 2110.41, 2101.06, 2100.1, 2100.99, 2100.11, 2101.53, 2101.22, 2101.2, 2098.65, 2095.12, 2097, 2096.99, 2095.6, 2093.34, 2088.89, 2085.74, 2083.99, 2083.9, 2083];
let volumes = [0.9600000000000003, 4.66310374, 0.8899999999999999, 0.56263551, 0.50830541, 1.6670997499999998, 5.74429201, 3.88456347, 1.286, 0.6005, 0.85900829, 1.1235999999999997, 0.38999999999999996, 1.1210344700000001, 6.109905579999999, 10.545917689999996, 24.64180048999998, 0.16, 3.8975111999999994, 4.636947610000001, 5.355013489999999, 1.9045375300000003, 3.00038147, 0.6000000000000001, 4.9799999999999995, 7.6974617499999995, 5.33862382, 4.942710999999992, 1.6400000000000001, 4.148609629999998, 2.819999999999999, 2.96, 3.589999999999999, 2.3899999999999997, 2.2700000000000005, 7.409610949999996, 4.214106039999999, 2.2799999999999994, 11.502974689999995, 2.5618611999999987, 2.5900000000000007, 12.370775249999996, 5.445763649999998, 1.57165169, 4.851579639999999, 16.841626549999994, 1.0400000000000003, 8.114255799999995, 3.692082459999999, 3.822860559999999, 6.819999999999997, 15.262272930000002, 12.679999999999993, 13.87385082, 3.5376964799999997, 10.92383039, 1.9500000000000006, 4.487052509999998, 5.829921149999999, 12.709999999999997, 13.37, 9.33479437, 6.775984699999998, 19.45, 8.258212539999997, 6.61656404, 9.159999999999998, 6.5600000000000005, 3.7535500600000002, 11.269788, 1.7860307700000004, 2.9199999999999986, 3.5085384399999993, 5.026886389999996, 5.6299498099999985, 4.50617882, 10.209305869999994, 2.3002437799999997, 2.1487632600000004, 1.6900000000000004, 3.535253969999998, 5.4101991999999965, 6.749999999999998, 7.9599999999999955, 1.31832571, 8.54234155, 16.612593239999992, 6.309933059999999, 6.510705269999998, 5.094942499999999, 5.733710499999999, 4.92, 9.406444089999995, 3.2338427399999996, 9.503288079999997, 5.789999999999995, 6.074281149999997, 5.934177629999997, 3.0799999999999996, 6.299999999999998, 1.45, 7.959999999999997, 3.4667707399999985, 3.36421154, 0.9925622200000003, 3.5303879, 4.506768549999998, 0.27242302, 5.36674519, 15.849999999999996, 1.4400000000000002, 3.1999999999999997, 3.5799999999999996, 22.099884319999997, 4.170156029999999, 1.5600000000000003, 11.744009789999987, 15.519999999999998, 15.969332729999989, 6.48269026, 4.241777689999998, 7.370904749999997, 6.149084519999995, 9.243807769999998, 5.354405519999996, 3.8181779600000008, 9.469999999999997, 5.9227127799999995, 8.991324919999998, 3.3997081799999997, 12.15056434, 7.170917279999998, 4.8, 3.0737044, 4.88015113, 8.49631463, 5.689999999999998, 3.10322446, 7.445512319999999, 14.037287430000001, 6.3818669, 6.0222371199999944, 6.868376829999998, 7.789999999999998, 4.179999999999998, 3.6938397199999993, 0.8000047600000001, 4.480000000000001, 3.31972392, 6.839999999999995, 2.96146253, 6.508432599999997, 6.5073689299999975, 3.7572253499999997, 6.962233619999998, 13.837483959999997, 11.58417939, 6.306054690000002, 4.194429339999997, 8.855850739999996, 5.988436059999998, 22.268119309999992, 1.7400000000000002, 12.797252779999999, 3.4899999999999998, 6.014587639999998, 8.829999999999997, 14.172330129999992, 5.040406249999998, 1.7400000000000002, 6.515692109999998, 4.719999999999999, 3.915424979999999, 6.510612579999995, 2.18, 1.2100000000000002, 3.839999999999999, 7.209999999999997, 6.129999999999998, 11.56435482999999, 9.93949228, 14.494744229999991, 4.27896828, 5.83826044, 4.739999999999998, 5.73614485, 2.11944156, 6.119999999999996, 8.374517769999995, 3.589999999999998, 4.283965519999999, 3.5862765699999994, 3.999406789999999, 5.800465329999999, 7.974682099999997, 5.011260419999998, 2.4472093799999994, 3.669999999999999, 5.367949169999993, 13.243337689999995, 12.993840939999995, 3.9575742399999987, 4.683630549999998, 2.10062342, 2.61027656, 1.3523132100000002, 24.862681750000007, 12.330114949999997, 1.6440344100000002, 6.59242171, 6.02363897, 1.5724499999999997, 2.3983280899999992, 3.6091630799999996, 1.1, 2.2200000000000006, 3.520130149999999, 1.6400000000000001, 4.420000000000001, 0.81, 1.1539732600000001, 3.0448414000000006, 1.6300000000000001, 1.23, 0.8400000000000002, 0.7500000000000001, 4.01915392, 0.7900000000000001, 1.9417903500000002, 2.405, 5.29, 2.67959782, 4.477588759999999, 0.56, 0.71194309, 3.8499999999999996, 1.2400000000000002, 2.5999943899999995, 6.498412059999997, 1.3500000000000003, 0.5048, 1.4300000000000002, 2.7913171500000002, 1.7200000000000002, 0.3, 0.29000000000000004, 0.3663, 0.06999999999999999, 0.43027749000000004, 0.08, 0.9428204900000001, 4.6330102, 0.09000000000000001, 1.37, 0.12, 0.19, 0.19, 0.38, 0.15148501, 0.47, 0.07, 0.16999999999999998, 0.09878334, 0.18, 0.16000000000000003, 0.89788779, 0.0247, 0.8262, 0.09, 0.05, 0.16, 0.242, 0.04, 0.18411277, 1.05, 0.04, 0.53691044, 6.386306009999999, 0.94, 0.48000000000000004, 0.02, 0.27, 4.71425947, 0.32, 0.21, 1.2820717400000001, 1.10704457, 2.6628999999999996, 0.11, 2.61878876, 0.46328631, 0.01, 0.6946653199999999, 0.15, 0.42549564, 2.3799602200000005, 1.4301000000000004, 1.13492975, 4.113436599999999, 0.14600000000000002, 0.32999999999999996, 1.811361140000001, 0.09, 1.61589089, 4.137646179999998, 0.55, 2.03999059, 1.8637637200000003, 1.6462568800000001, 1.2800000000000005, 3.33, 1.2400000000000002, 5.765536099999999, 4.674813060000001, 4.869999999999999, 1.76, 3.090000000000001, 6.749999999999996, 3.6831789799999983, 1.25, 1.81842937, 1.8700000000000003, 2.56, 2.76, 4.4049128600000005, 0.9100000000000001, 4.897846879999998, 5.395846860000001, 1.7300000000000004, 7.080057259999999, 9.579999999999993, 3.549999999999999, 9.309999999999999, 4.599999999999997, 8.195710189999998, 7.984200879999997, 4.26, 17.31005154, 5.748713829999999, 87.97572647999999, 2.5600706399999997, 2.27, 2.66, 2.9750938699999994, 1.81, 4.05, 5.130023729999999, 2.46, 6.303931089999998, 0.7000000000000001, 2.760999999999999, 0.19000000000000003, 0.6300000000000001, 3.4924218700000003, 1.4000000000000004, 8.999999999999995, 2.6057095599999998, 0.8600000000000002, 6.76, 0.66, 7.2799999999999985, 5.650000000000001, 4.2299999999999995, 7.7706572499999975, 5.913311099999997, 4.196369780000001, 7.880000000000001, 6.36139472, 2.76327316, 5.37652782, 12.437493299999998, 1.78, 2.1899999999999995, 4.329999999999999, 1.90697703, 1.4083094300000003, 2.4399999999999995, 5.0848041099999985, 0.7323656900000001, 19.00573250999999, 40.74929642000002, 7.310429229999999, 7.089036039999998, 2.3489986000000003, 4.642367179999998, 5.409392659999998, 1.1674745200000003, 5.1521289999999995, 2.479999999999999, 4.069999999999999, 9.191863, 3.6362377799999996, 4.0263779699999995, 13.531619389999996, 3.558800459999999, 3.36, 0.13];
