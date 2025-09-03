import { useState, useEffect } from 'react';
import { useCovidData } from '../../hooks/useCovidData';
import KPICard from '../ui/KPICard';
import DateSlider from '../ui/DateSlider';
import InfectionTrendChart from '../charts/InfectionTrendChart';
import AgeGroupBarChartMonthly from '../charts/AgeGroupBarChartMonthly';
import { 
  getDataByDateIndex, 
  getDataRangeByDateIndex, 
  getCumulativeDataByDateIndex,
  getAgeGroupDataByDateIndex 
} from '../../utils/dataParser';
import { format } from 'date-fns';
import '../../styles.css';

function Dashboard() {
  const { infectionTrend, ageGroup, deaths, latest, ageGroupTotals, loading, error } = useCovidData();
  const [selectedDateIndex, setSelectedDateIndex] = useState(0);

  // Initialize to latest data
  useEffect(() => {
    if (infectionTrend.length > 0) {
          setSelectedDateIndex(infectionTrend.length - 1);
    }
  }, [infectionTrend]);

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner"></div>
        <p>データを読み込み中...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-error">
        <h2>エラーが発生しました</h2>
        <p>{error}</p>
      </div>
    );
  }

  // Get data for selected date
  const selectedInfectionData = getCumulativeDataByDateIndex(infectionTrend, selectedDateIndex);
  const selectedDeathData = getCumulativeDataByDateIndex(deaths, selectedDateIndex);
  const selectedAgeData = getDataByDateIndex(ageGroup, selectedDateIndex);
  const trendData = getDataRangeByDateIndex(infectionTrend, selectedDateIndex, 30);
  const ageGroupMonthlyData = getDataRangeByDateIndex(ageGroup, selectedDateIndex, 30);

  const dates = infectionTrend.map(item => item.date);
  const selectedDate = selectedInfectionData?.dateString || '';
  const currentCases = selectedInfectionData?.newCases || 0;
  const cumulativeCases = selectedInfectionData?.cumulativeCases || 0;
  const cumulativeDeaths = selectedDeathData?.cumulativeDeaths || 0;
  const weeklyAverage = selectedInfectionData?.weeklyAverage || 0;

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>COVID-19 ダッシュボード</h1>
      </header>

      <DateSlider
        dates={dates}
        selectedIndex={selectedDateIndex}
        onChange={setSelectedDateIndex}
      />

      <div className="kpi-grid-three">
        <KPICard
          title="累計感染者数"
          value={cumulativeCases}
        />
        <KPICard
          title="当日新規感染者数"
          value={currentCases}
        />
        <KPICard
          title="累計死亡者数"
          value={cumulativeDeaths}
        />
      </div>

      <div className="trend-chart-container">
        <h2>新規感染者数推移（直近30日間）</h2>
        <InfectionTrendChart data={trendData} />
      </div>

      <div className="age-chart-container">
        <h2>年代別合計感染者数（直近30日間）</h2>
        <AgeGroupBarChartMonthly data={ageGroupMonthlyData} />
      </div>
    </div>
  );
}

export default Dashboard;