import { format } from 'date-fns';
import '../../styles.css';

function DateSlider({ dates, selectedIndex, onChange }) {
  const handleSliderChange = (event) => {
    onChange(parseInt(event.target.value));
  };


  return (
    <div className="date-slider">
      <div className="date-slider-header">
        <h3>日付選択（2020年1月16日〜2023年5月8日）</h3>
      </div>
      
      <div className="current-date">
        {dates[selectedIndex] ? format(dates[selectedIndex], 'yyyy年MM月dd日') : ''}
      </div>
      
      <div className="slider-container">
        <input
          type="range"
          min="0"
          max={Math.max(0, dates.length - 1)}
          value={Math.max(0, Math.min(selectedIndex, dates.length - 1))}
          onChange={handleSliderChange}
          className="date-range-slider"
          disabled={dates.length === 0}
        />
        <div className="slider-labels">
          <span>{dates.length > 0 ? format(dates[0], 'yyyy/MM') : 'データなし'}</span>
          <span>{dates.length > 0 ? format(dates[dates.length - 1], 'yyyy/MM') : 'データなし'}</span>
        </div>
      </div>
    </div>
  );
}

export default DateSlider;