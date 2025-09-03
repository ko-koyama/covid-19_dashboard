import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

function AgeGroupBarChartMonthly({ data }) {
  // データを30日間で集計（まず元の年代別で集計）
  const totals = {
    under10: data.reduce((sum, day) => sum + (day.under10 || 0), 0),
    teens: data.reduce((sum, day) => sum + (day.teens || 0), 0),
    twenties: data.reduce((sum, day) => sum + (day.twenties || 0), 0),
    thirties: data.reduce((sum, day) => sum + (day.thirties || 0), 0),
    forties: data.reduce((sum, day) => sum + (day.forties || 0), 0),
    fifties: data.reduce((sum, day) => sum + (day.fifties || 0), 0),
    sixties: data.reduce((sum, day) => sum + (day.sixties || 0), 0),
    seventies: data.reduce((sum, day) => sum + (day.seventies || 0), 0),
    eighties: data.reduce((sum, day) => sum + (day.eighties || 0), 0),
    nineties: data.reduce((sum, day) => sum + (day.nineties || 0), 0),
  };

  // 年代をまとめてチャート用データに変換
  const chartData = [
    {
      name: '10代以下',
      value: totals.under10 + totals.teens,
      fill: '#ff6b6b'
    },
    {
      name: '20代',
      value: totals.twenties,
      fill: '#ff6b6b'
    },
    {
      name: '30代',
      value: totals.thirties,
      fill: '#ff6b6b'
    },
    {
      name: '40代',
      value: totals.forties,
      fill: '#ff6b6b'
    },
    {
      name: '50代',
      value: totals.fifties,
      fill: '#ff6b6b'
    },
    {
      name: '60代',
      value: totals.sixties,
      fill: '#ff6b6b'
    },
    {
      name: '70代以上',
      value: totals.seventies + totals.eighties + totals.nineties,
      fill: '#ff6b6b'
    }
  ];

  return (
    <div style={{ width: '100%', height: '400px' }}>
      <ResponsiveContainer>
        <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#404040" />
          <XAxis 
            dataKey="name" 
            tick={{ fontSize: 12, fill: '#b0b0b0' }}
            height={50}
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
                return (
                  <div style={{
                    backgroundColor: '#2a2a2a',
                    border: '1px solid #404040',
                    borderRadius: '8px',
                    color: '#e0e0e0',
                    padding: '10px',
                    boxShadow: '0 2px 10px rgba(0,0,0,0.3)'
                  }}>
                    <p style={{ margin: '0 0 5px 0', color: '#e0e0e0' }}>{label}</p>
                    <p style={{ margin: 0, color: '#ff6b6b' }}>
                      新規感染者数：<span style={{ color: '#ff6b6b' }}>{payload[0].value.toLocaleString()}人</span>
                    </p>
                  </div>
                );
              }
              return null;
            }}
          />
          <Bar dataKey="value" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default AgeGroupBarChartMonthly;