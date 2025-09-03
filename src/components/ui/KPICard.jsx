import '../../styles.css';

function KPICard({ title, value, subtitle, trend }) {
  return (
    <div className="kpi-card">
      <h3 className="kpi-title">{title}</h3>
      <div className="kpi-value">{value?.toLocaleString() || 0}</div>
      {subtitle && <div className="kpi-subtitle">{subtitle}</div>}
      {trend && (
        <div className={`kpi-trend ${trend.type}`}>
          {trend.value}
        </div>
      )}
    </div>
  );
}

export default KPICard;