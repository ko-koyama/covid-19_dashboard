import { useState, useEffect } from 'react';
import { 
  loadInfectionTrendData, 
  loadAgeGroupData, 
  loadDeathData,
  getLatestData,
  calculateTotalsByAgeGroup
} from '../utils/dataParser';

export function useCovidData() {
  const [data, setData] = useState({
    infectionTrend: [],
    ageGroup: [],
    deaths: [],
    loading: true,
    error: null
  });

  useEffect(() => {
    async function fetchData() {
      try {
        setData(prev => ({ ...prev, loading: true }));
        
        const [infectionTrend, ageGroup, deaths] = await Promise.all([
          loadInfectionTrendData(),
          loadAgeGroupData(),
          loadDeathData()
        ]);

        setData({
          infectionTrend,
          ageGroup,
          deaths,
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
    ageGroup: getLatestData(data.ageGroup),
    deaths: getLatestData(data.deaths)
  };

  const ageGroupTotals = calculateTotalsByAgeGroup(data.ageGroup);

  return {
    ...data,
    latest,
    ageGroupTotals
  };
}