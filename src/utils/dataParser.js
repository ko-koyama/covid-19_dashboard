import { csvParse } from 'd3-dsv';
import { parseISO } from 'date-fns';

export async function loadInfectionTrendData() {
  try {
    const response = await fetch(`${import.meta.env.BASE_URL}data/newly_confirmed_cases_daily.csv`);
    let text = await response.text();
    
    // BOMを除去
    if (text.charCodeAt(0) === 0xFEFF) {
      text = text.slice(1);
    }
    
    const data = csvParse(text);
    
    
    const parsedData = data.map(row => {
      const dateStr = row['Date'];
      
      // 日付フォーマットを修正: YYYY/M/D -> YYYY-MM-DD
      const parts = dateStr.split('/');
      if (parts.length === 3) {
        const year = parts[0];
        const month = parts[1].padStart(2, '0');
        const day = parts[2].padStart(2, '0');
        const formattedDate = `${year}-${month}-${day}`;
        
        const parsedDate = parseISO(formattedDate);
        const newCases = parseInt((row['ALL'] || '').trim()) || 0;
        
        // 都道府県別データも含める
        const prefectureData = {};
        const prefectures = [
          'Hokkaido', 'Aomori', 'Iwate', 'Miyagi', 'Akita', 'Yamagata', 'Fukushima',
          'Ibaraki', 'Tochigi', 'Gunma', 'Saitama', 'Chiba', 'Tokyo', 'Kanagawa',
          'Niigata', 'Toyama', 'Ishikawa', 'Fukui', 'Yamanashi', 'Nagano', 'Gifu',
          'Shizuoka', 'Aichi', 'Mie', 'Shiga', 'Kyoto', 'Osaka', 'Hyogo', 'Nara',
          'Wakayama', 'Tottori', 'Shimane', 'Okayama', 'Hiroshima', 'Yamaguchi',
          'Tokushima', 'Kagawa', 'Ehime', 'Kochi', 'Fukuoka', 'Saga', 'Nagasaki',
          'Kumamoto', 'Oita', 'Miyazaki', 'Kagoshima', 'Okinawa'
        ];
        
        prefectures.forEach(pref => {
          const rawValue = row[pref];
          const cleanValue = (rawValue || '').toString().trim();
          prefectureData[pref] = parseInt(cleanValue) || 0;
        });
        
        return {
          date: parsedDate,
          dateString: dateStr,
          newCases: newCases,
          per100k: 0,
          weeklyAverage: 0,
          ...prefectureData
        };
      }
      
      return null;
    }).filter(row => row && !isNaN(row.date.getTime()));
    
    const sortedData = parsedData.sort((a, b) => a.date.getTime() - b.date.getTime());
    
    // 30日間移動平均を計算
    sortedData.forEach((item, index) => {
      const startIndex = Math.max(0, index - 29);
      const monthlyData = sortedData.slice(startIndex, index + 1);
      const average = monthlyData.reduce((sum, day) => sum + day.newCases, 0) / monthlyData.length;
      item.weeklyAverage = Math.round(average * 100) / 100;
    });
    
    return sortedData;
  } catch (error) {
    console.error('Failed to load infection trend data:', error);
    return [];
  }
}


export async function loadDeathData() {
  try {
    const response = await fetch(`${import.meta.env.BASE_URL}data/deaths_cumulative_daily.csv`);
    let text = await response.text();
    
    // BOMを除去
    if (text.charCodeAt(0) === 0xFEFF) {
      text = text.slice(1);
    }
    
    const data = csvParse(text);
    
    const parsedData = data.map(row => {
      const dateStr = row['Date'];
      
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
          deaths: parseInt((row['ALL'] || '').trim()) || 0,
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

export async function loadCumulativeCasesData() {
  try {
    const response = await fetch(`${import.meta.env.BASE_URL}data/confirmed_cases_cumulative_daily.csv`);
    let text = await response.text();
    
    if (text.charCodeAt(0) === 0xFEFF) {
      text = text.slice(1);
    }
    
    const data = csvParse(text);
    
    const parsedData = data.map(row => {
      const dateStr = row['Date'];
      
      const parts = dateStr.split('/');
      if (parts.length === 3) {
        const year = parts[0];
        const month = parts[1].padStart(2, '0');
        const day = parts[2].padStart(2, '0');
        const formattedDate = `${year}-${month}-${day}`;
        
        return {
          date: parseISO(formattedDate),
          dateString: dateStr,
          cumulativeCases: parseInt((row['ALL'] || '').trim()) || 0,
        };
      }
      
      return null;
    }).filter(row => row && !isNaN(row.date.getTime()));
    
    return parsedData.sort((a, b) => a.date.getTime() - b.date.getTime());
  } catch (error) {
    console.error('Failed to load cumulative cases data:', error);
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
    // deaths_cumulative_daily.csvの場合、既に累積値が格納されているため、そのまま使用
    return { ...data[dateIndex], cumulativeDeaths: data[dateIndex].deaths };
  }
  
  return data[dateIndex];
}

export function getPrefectureDataByDateIndex(infectionTrend, dateIndex) {
  if (!infectionTrend.length || dateIndex < 0 || dateIndex >= infectionTrend.length) return [];
  
  const selectedData = infectionTrend[dateIndex];
  if (!selectedData) return [];

  // 都道府県リスト
  const prefectures = [
    'Hokkaido', 'Aomori', 'Iwate', 'Miyagi', 'Akita', 'Yamagata', 'Fukushima',
    'Ibaraki', 'Tochigi', 'Gunma', 'Saitama', 'Chiba', 'Tokyo', 'Kanagawa',
    'Niigata', 'Toyama', 'Ishikawa', 'Fukui', 'Yamanashi', 'Nagano', 'Gifu',
    'Shizuoka', 'Aichi', 'Mie', 'Shiga', 'Kyoto', 'Osaka', 'Hyogo', 'Nara',
    'Wakayama', 'Tottori', 'Shimane', 'Okayama', 'Hiroshima', 'Yamaguchi',
    'Tokushima', 'Kagawa', 'Ehime', 'Kochi', 'Fukuoka', 'Saga', 'Nagasaki',
    'Kumamoto', 'Oita', 'Miyazaki', 'Kagoshima', 'Okinawa'
  ];

  // 都道府県名マッピング
  const prefectureNames = {
    'Hokkaido': '北海道', 'Aomori': '青森県', 'Iwate': '岩手県', 'Miyagi': '宮城県',
    'Akita': '秋田県', 'Yamagata': '山形県', 'Fukushima': '福島県', 'Ibaraki': '茨城県',
    'Tochigi': '栃木県', 'Gunma': '群馬県', 'Saitama': '埼玉県', 'Chiba': '千葉県',
    'Tokyo': '東京都', 'Kanagawa': '神奈川県', 'Niigata': '新潟県', 'Toyama': '富山県',
    'Ishikawa': '石川県', 'Fukui': '福井県', 'Yamanashi': '山梨県', 'Nagano': '長野県',
    'Gifu': '岐阜県', 'Shizuoka': '静岡県', 'Aichi': '愛知県', 'Mie': '三重県',
    'Shiga': '滋賀県', 'Kyoto': '京都府', 'Osaka': '大阪府', 'Hyogo': '兵庫県',
    'Nara': '奈良県', 'Wakayama': '和歌山県', 'Tottori': '鳥取県', 'Shimane': '島根県',
    'Okayama': '岡山県', 'Hiroshima': '広島県', 'Yamaguchi': '山口県', 'Tokushima': '徳島県',
    'Kagawa': '香川県', 'Ehime': '愛媛県', 'Kochi': '高知県', 'Fukuoka': '福岡県',
    'Saga': '佐賀県', 'Nagasaki': '長崎県', 'Kumamoto': '熊本県', 'Oita': '大分県',
    'Miyazaki': '宮崎県', 'Kagoshima': '鹿児島県', 'Okinawa': '沖縄県'
  };

  return prefectures.map(prefCode => {
    const value = parseInt((selectedData[prefCode] || '').toString().trim()) || 0;
    return {
      prefCode,
      prefName: prefectureNames[prefCode],
      value
    };
  });
}

