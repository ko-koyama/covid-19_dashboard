import React from 'react';

function PrefectureRanking({ data }) {
  if (!data || data.length === 0) {
    return (
      <div style={{ 
        backgroundColor: '#1a1a1a', 
        padding: '20px', 
        borderRadius: '8px',
        color: '#e0e0e0',
        textAlign: 'center'
      }}>
        データがありません
      </div>
    );
  }

  const maxValue = Math.max(...data.map(item => item.value));

  return (
    <div style={{ 
      backgroundColor: '#1a1a1a', 
      padding: '20px', 
      borderRadius: '8px',
      color: '#e0e0e0',
      height: '100%',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <h4 style={{ 
        margin: '0 0 20px 0', 
        color: '#e0e0e0',
        fontSize: '16px',
        fontWeight: 'normal',
        textAlign: 'left'
      }}>
        上位10都道府県
      </h4>
      
      <div style={{ 
        height: '400px', 
        overflowY: 'auto',
        scrollbarWidth: 'thin',
        scrollbarColor: '#555 #2f2f2f',
        paddingRight: '8px'
      }}>
        {data
          .filter(item => item.value > 0)
          .sort((a, b) => b.value - a.value)
          .slice(0, 10)
          .map((item, index) => {
            const ratio = Math.log(item.value + 1) / Math.log(maxValue + 1);
            const intensity = Math.min(ratio, 1);
            const barWidth = intensity * 100;
            const color = `rgba(255, 107, 107, ${0.3 + intensity * 0.7})`;
            
            return (
              <div
                key={item.prefCode}
                style={{
                  marginBottom: '15px',
                  padding: '12px',
                  backgroundColor: '#2f2f2f',
                  borderRadius: '6px'
                }}
              >
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '8px',
                  fontSize: '14px'
                }}>
                  <span style={{ color: '#e0e0e0', fontWeight: 'bold' }}>
                    {index + 1}. {item.prefName}
                  </span>
                  <span style={{ color: '#b0b0b0', fontSize: '12px' }}>
                    {item.value.toLocaleString()}人
                  </span>
                </div>
                <div style={{ 
                  width: '100%', 
                  height: '10px', 
                  backgroundColor: '#404040',
                  borderRadius: '5px',
                  overflow: 'hidden'
                }}>
                  <div style={{ 
                    width: `${barWidth}%`, 
                    height: '100%', 
                    backgroundColor: color,
                    transition: 'width 0.3s ease',
                    borderRadius: '5px'
                  }} />
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
}

export default PrefectureRanking;