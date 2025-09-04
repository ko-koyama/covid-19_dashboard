import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { format } from 'date-fns';

function InfectionTrendChart({ data }) {
  const chartData = data.map(item => ({
    date: format(item.date, 'yyyy/MM/dd'),
    cases: item.newCases,
    average: Math.round(item.weeklyAverage || 0)
  }));

  // データ数に応じて適切な間隔を計算
  const getTickInterval = (dataLength) => {
    if (dataLength <= 7) return 0; // 7日以下なら全て表示
    if (dataLength <= 30) return Math.floor(dataLength / 7); // 30日以下なら約7つの目盛り
    if (dataLength <= 365) return Math.floor(dataLength / 12); // 1年以下なら約12個の目盛り
    return Math.floor(dataLength / 15); // それ以上なら約15個の目盛り
  };

  return (
    <div style={{ width: '100%', height: '300px' }}>
      <ResponsiveContainer>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#404040" />
          <XAxis 
            dataKey="date" 
            tick={{ fontSize: 12, fill: '#b0b0b0' }}
            interval={getTickInterval(chartData.length)}
            angle={-45}
            textAnchor="end"
            height={60}
            axisLine={{ stroke: '#404040' }}
            tickLine={{ stroke: '#404040' }}
          />
          <YAxis 
            tick={{ fontSize: 12, fill: '#b0b0b0' }}
            axisLine={{ stroke: '#404040' }}
            tickLine={{ stroke: '#404040' }}
          />
          <Tooltip
            content={({ active, payload, label }) => {
              if (active && payload && payload.length) {
                const casesData = payload.find(p => p.dataKey === 'cases');
                const averageData = payload.find(p => p.dataKey === 'average');
                
                return (
                  <div style={{
                    backgroundColor: '#2a2a2a',
                    border: '1px solid #404040',
                    borderRadius: '8px',
                    color: '#e0e0e0',
                    padding: '10px',
                    boxShadow: '0 2px 10px rgba(0,0,0,0.3)'
                  }}>
                    <p style={{ margin: '0 0 5px 0', color: '#e0e0e0' }}>日付：{label}</p>
                    {casesData && (
                      <p style={{ margin: '0 0 5px 0', color: '#ff6b6b' }}>新規感染者数：{casesData.value.toLocaleString()}人</p>
                    )}
                    {averageData && (
                      <p style={{ margin: 0, color: '#4ecdc4' }}>30日間平均：{averageData.value.toLocaleString()}人</p>
                    )}
                  </div>
                );
              }
              return null;
            }}
          />
          <Line 
            type="monotone" 
            dataKey="cases" 
            stroke="#ff6b6b" 
            strokeWidth={2}
            dot={false}
          />
          <Line 
            type="monotone" 
            dataKey="average" 
            stroke="#4ecdc4" 
            strokeWidth={2}
            strokeDasharray="5 5"
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default InfectionTrendChart;