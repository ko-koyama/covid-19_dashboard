import { csvParse } from 'd3-dsv';
import { parseISO, format } from 'date-fns';

export async function loadInfectionTrendData() {
  try {
    const response = await fetch('/data/01_kansensyasuu_suii.csv');
    const text = await response.text();
    const data = csvParse(text);
    
    const parsedData = data.map(row => {
      const dateStr = row['記者発表日'];
      
      // 日付フォーマットを修正: YYYY/M/D -> YYYY-MM-DD
      const parts = dateStr.split('/');
      if (parts.length === 3) {
        const year = parts[0];
        const month = parts[1].padStart(2, '0');
        const day = parts[2].padStart(2, '0');
        const formattedDate = `${year}-${month}-${day}`;
        
        const parsedDate = parseISO(formattedDate);
        
        return {
          date: parsedDate,
          dateString: dateStr,
          newCases: parseInt(row['新規感染者数(A)+(B)+(C)+(D)']) || 0,
          per100k: parseFloat(row['新規感染者数の推移（人口10万人当たり・週合計）']) || 0,
          weeklyAverage: parseFloat(row['新規感染者数（過去1週間の平均）']) || 0,
        };
      }
      
      return null;
    }).filter(row => row && !isNaN(row.date.getTime()));
    
    // 日付順でソートを確実に行う
    return parsedData.sort((a, b) => a.date.getTime() - b.date.getTime());
  } catch (error) {
    console.error('Failed to load infection trend data:', error);
    return [];
  }
}

export async function loadAgeGroupData() {
  try {
    const response = await fetch('/data/02_kansensyasuu_nendaibetsu.csv');
    const text = await response.text();
    const data = csvParse(text);
    
    const parsedData = data.map(row => {
      const dateStr = row['記者発表日'];
      
      // 日付フォーマットを修正: YYYY/M/D -> YYYY-MM-DD
      const parts = dateStr.split('/');
      if (parts.length === 3) {
        const year = parts[0];
        const month = parts[1].padStart(2, '0');
        const day = parts[2].padStart(2, '0');
        const formattedDate = `${year}-${month}-${day}`;
        
        return {
          date: parseISO(formattedDate),
          dateString: dateStr,
          under10: parseInt(row['【年代別】新規感染者数_10歳未満']) || 0,
          teens: parseInt(row['【年代別】新規感染者数_10代']) || 0,
          twenties: parseInt(row['【年代別】新規感染者数_20代']) || 0,
          thirties: parseInt(row['【年代別】新規感染者数_30代']) || 0,
          forties: parseInt(row['【年代別】新規感染者数_40代']) || 0,
          fifties: parseInt(row['【年代別】新規感染者数_50代']) || 0,
          sixties: parseInt(row['【年代別】新規感染者数_60代']) || 0,
          seventies: parseInt(row['【年代別】新規感染者数_70代']) || 0,
          eighties: parseInt(row['【年代別】新規感染者数_80代']) || 0,
          nineties: parseInt(row['【年代別】新規感染者数_90歳以上']) || 0,
        };
      }
      
      return null;
    }).filter(row => row && !isNaN(row.date.getTime()));
    
    // 日付順でソートを確実に行う
    return parsedData.sort((a, b) => a.date.getTime() - b.date.getTime());
  } catch (error) {
    console.error('Failed to load age group data:', error);
    return [];
  }
}

export async function loadDeathData() {
  try {
    const response = await fetch('/data/07_shibousyasuu.csv');
    const text = await response.text();
    const data = csvParse(text);
    
    const parsedData = data.map(row => {
      const dateStr = row['記者発表日'];
      
      // 日付フォーマットを修正: YYYY/M/D -> YYYY-MM-DD
      const parts = dateStr.split('/');
      if (parts.length === 3) {
        const year = parts[0];
        const month = parts[1].padStart(2, '0');
        const day = parts[2].padStart(2, '0');
        const formattedDate = `${year}-${month}-${day}`;
        
        return {
          date: parseISO(formattedDate),
          dateString: dateStr,
          deaths: parseInt(row['死亡者数']) || 0,
        };
      }
      
      return null;
    }).filter(row => row && !isNaN(row.date.getTime()));
    
    // 日付順でソートを確実に行う
    return parsedData.sort((a, b) => a.date.getTime() - b.date.getTime());
  } catch (error) {
    console.error('Failed to load death data:', error);
    return [];
  }
}

export function getLatestData(data) {
  if (!data.length) return null;
  return data[data.length - 1];
}

export function getDataByDateIndex(data, dateIndex) {
  if (!data.length || dateIndex < 0 || dateIndex >= data.length) return null;
  return data[dateIndex];
}

export function getDataRangeByDateIndex(data, dateIndex, range = 7) {
  if (!data.length || dateIndex < 0 || dateIndex >= data.length) return [];
  
  // 選択された日付より前のデータのみを取得
  const availableData = data.slice(0, dateIndex + 1);
  const startIndex = Math.max(0, availableData.length - range);
  
  return availableData.slice(startIndex);
}

export function getCumulativeDataByDateIndex(data, dateIndex) {
  if (!data.length || dateIndex < 0 || dateIndex >= data.length) return null;
  
  const upToDateData = data.slice(0, dateIndex + 1);
  
  if (data[0].newCases !== undefined) {
    const totalCases = upToDateData.reduce((sum, day) => sum + day.newCases, 0);
    return { ...data[dateIndex], cumulativeCases: totalCases };
  }
  
  if (data[0].deaths !== undefined) {
    const totalDeaths = upToDateData.reduce((sum, day) => sum + day.deaths, 0);
    return { ...data[dateIndex], cumulativeDeaths: totalDeaths };
  }
  
  return data[dateIndex];
}

export function getAgeGroupDataByDateIndex(ageGroupData, dateIndex, range = 7) {
  if (!ageGroupData.length || dateIndex < 0 || dateIndex >= ageGroupData.length) return [];
  
  // 選択された日付より前のデータのみを取得
  const availableData = ageGroupData.slice(0, dateIndex + 1);
  const startIndex = Math.max(0, availableData.length - range);
  const rangeData = availableData.slice(startIndex);
  
  const totals = {
    under10: 0, teens: 0, twenties: 0, thirties: 0, forties: 0,
    fifties: 0, sixties: 0, seventies: 0, eighties: 0, nineties: 0
  };
  
  rangeData.forEach(day => {
    Object.keys(totals).forEach(key => {
      totals[key] += day[key];
    });
  });
  
  return Object.entries(totals).map(([key, value]) => ({
    name: getAgeGroupLabel(key),
    value,
    key
  }));
}

export function calculateTotalsByAgeGroup(ageGroupData) {
  const totals = {
    under10: 0, teens: 0, twenties: 0, thirties: 0, forties: 0,
    fifties: 0, sixties: 0, seventies: 0, eighties: 0, nineties: 0
  };
  
  ageGroupData.forEach(day => {
    Object.keys(totals).forEach(key => {
      totals[key] += day[key];
    });
  });
  
  return Object.entries(totals).map(([key, value]) => ({
    name: getAgeGroupLabel(key),
    value,
    key
  }));
}

function getAgeGroupLabel(key) {
  const labels = {
    under10: '10歳未満',
    teens: '10代',
    twenties: '20代',
    thirties: '30代',
    forties: '40代',
    fifties: '50代',
    sixties: '60代',
    seventies: '70代',
    eighties: '80代',
    nineties: '90歳以上'
  };
  return labels[key] || key;
}