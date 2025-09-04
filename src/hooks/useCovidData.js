import { useState, useEffect } from 'react';
import { 
  loadInfectionTrendData, 
  loadDeathData,
  loadCumulativeCasesData,
  getLatestData
} from '../utils/dataParser';

export function useCovidData() {
  const [data, setData] = useState({
    infectionTrend: [],
    deaths: [],
    cumulativeCases: [],
    loading: true,
    error: null
  });

  useEffect(() => {
    async function fetchData() {
      try {
        setData(prev => ({ ...prev, loading: true }));
        
        const [infectionTrend, deaths, cumulativeCases] = await Promise.all([
          loadInfectionTrendData(),
          loadDeathData(),
          loadCumulativeCasesData()
        ]);

        setData({
          infectionTrend,
          deaths,
          cumulativeCases,
          loading: false,
          error: null
        });
      } catch (error) {
        console.error('Failed to fetch COVID data:', error);
        setData(prev => ({
          ...prev,
          loading: false,
          error: error.message
        }));
      }
    }

    fetchData();
  }, []);

  const latest = {
    infections: getLatestData(data.infectionTrend),
    deaths: getLatestData(data.deaths)
  };

  return {
    ...data,
    latest
  };
}