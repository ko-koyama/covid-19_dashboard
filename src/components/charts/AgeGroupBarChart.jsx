import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { format } from 'date-fns';

function AgeGroupBarChart({ data }) {
  const chartData = data.slice(-7).map(item => ({
    date: format(item.date, 'MM/dd'),
    '10歳未満': item.under10,
    '10代': item.teens,
    '20代': item.twenties,
    '30代': item.thirties,
    '40代': item.forties,
    '50代': item.fifties,
    '60代': item.sixties,
    '70代': item.seventies,
    '80代': item.eighties,
    '90歳以上': item.nineties,
  }));

  const ageGroups = [
    { key: '10歳未満', color: '#ff6b6b' },
    { key: '10代', color: '#4ecdc4' },
    { key: '20代', color: '#45b7d1' },
    { key: '30代', color: '#96ceb4' },
    { key: '40代', color: '#ffeaa7' },
    { key: '50代', color: '#dda0dd' },
    { key: '60代', color: '#98d8c8' },
    { key: '70代', color: '#f7dc6f' },
    { key: '80代', color: '#bb8fce' },
    { key: '90歳以上', color: '#85c1e9' },
  ];

  return (
    <div style={{ width: '100%', height: '400px' }}>
      <ResponsiveContainer>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" tick={{ fontSize: 12 }} />
          <YAxis tick={{ fontSize: 12 }} />
          <Tooltip />
          {ageGroups.map((group) => (
            <Bar 
              key={group.key}
              dataKey={group.key} 
              stackId="age"
              fill={group.color}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default AgeGroupBarChart;