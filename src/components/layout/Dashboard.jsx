import { useState, useEffect } from 'react';
import { useCovidData } from '../../hooks/useCovidData';
import KPICard from '../ui/KPICard';
import DateSlider from '../ui/DateSlider';
import InfectionTrendChart from '../charts/InfectionTrendChart';
import JapanMapFixed from '../charts/JapanMapFixed';
import PrefectureRanking from '../charts/PrefectureRanking';
import { 
  getDataByDateIndex, 
  getPrefectureDataByDateIndex
} from '../../utils/dataParser';
import '../../styles.css';

function Dashboard() {
  const { infectionTrend, deaths, cumulativeCases, loading, error } = useCovidData();
  const [selectedDateIndex, setSelectedDateIndex] = useState(null);

  // Initialize to 2022/04/01
  useEffect(() => {
    if (infectionTrend.length > 0 && selectedDateIndex === null) {
      const targetDate = '2022/4/1';
      const targetIndex = infectionTrend.findIndex(item => item.dateString === targetDate);
      if (targetIndex !== -1) {
        setSelectedDateIndex(targetIndex);
      } else {
        setSelectedDateIndex(infectionTrend.length - 1);
      }
    }
  }, [infectionTrend, selectedDateIndex]);

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

  // Wait for data initialization
  if (selectedDateIndex === null) {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner"></div>
        <p>データを読み込み中...</p>
      </div>
    );
  }

  // Get data for selected date
  const selectedInfectionData = getDataByDateIndex(infectionTrend, selectedDateIndex);
  const selectedDeathData = getDataByDateIndex(deaths, selectedDateIndex);
  const trendData = infectionTrend.slice(0, selectedDateIndex + 1);
  const prefectureData = getPrefectureDataByDateIndex(infectionTrend, selectedDateIndex);

  const selectedDateStr = selectedInfectionData?.dateString;
  const selectedCumulativeCasesData = cumulativeCases.find(item => item.dateString === selectedDateStr);

  const dates = infectionTrend.map(item => item.date);
  
  const currentCases = selectedInfectionData?.newCases || 0;
  const totalCumulativeCases = selectedCumulativeCasesData?.cumulativeCases || 0;
  const cumulativeDeaths = selectedDeathData?.deaths || 0;


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
          title="新規感染者数"
          value={currentCases}
        />
        <KPICard
          title="累計感染者数"
          value={totalCumulativeCases}
        />
        <KPICard
          title="累計死亡者数"
          value={cumulativeDeaths}
        />
      </div>

      <div className="trend-chart-container">
        <h2>新規感染者数推移</h2>
        <InfectionTrendChart data={trendData} />
      </div>

      <div className="prefecture-section">
        <div className="prefecture-section-card">
          <h2>都道府県別新規感染者数</h2>
          <div className="prefecture-container">
            <div className="prefecture-heatmap-container">
              <JapanMapFixed data={prefectureData} />
            </div>
            
            <div className="prefecture-ranking-container">
              <PrefectureRanking data={prefectureData} />
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}

export default Dashboard;