import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

function JapanMapFixed({ data }) {
  const svgRef = useRef();

  useEffect(() => {
    if (!data || data.length === 0) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove(); // 既存の要素をクリア

    const width = 500;
    const height = 400;
    const centerPos = [137.0, 38.2];
    const scale = 1000;

    // 地図設定
    const projection = d3
      .geoMercator()
      .center(centerPos)
      .translate([width / 2, height / 2])
      .scale(scale);

    const path = d3.geoPath().projection(projection);

    // データの最大値を取得
    const maxValue = Math.max(...data.map(item => item.value));

    // 都道府県名から値を取得する関数
    const getValue = (prefName) => {
      const target = data.find(item => item.prefName === prefName);
      return target ? target.value : 0;
    };

    // 色を取得する関数（新規感染者数推移グラフと統一）
    const getColor = (value) => {
      if (value === 0) return '#2a2a2a';
      const ratio = Math.log(value + 1) / Math.log(maxValue + 1);
      const intensity = Math.min(ratio, 1);
      // 感染者数推移と同じ色調（赤系）
      return `rgba(255, 107, 107, ${0.3 + intensity * 0.7})`;
    };

    // GeoJSONを読み込んで地図を描画
    d3.json(`${import.meta.env.BASE_URL}data/japan.geojson`)
      .then(geoJson => {
        console.log('GeoJSON loaded:', geoJson);

        svg
          .selectAll('path')
          .data(geoJson.features)
          .enter()
          .append('path')
          .attr('d', path)
          .attr('stroke', '#f0f0f0')
          .attr('stroke-width', 0.2)
          .attr('fill', d => {
            const prefName = d.properties.nam_ja;
            const value = getValue(prefName);
            return getColor(value);
          })
          .attr('opacity', d => {
            const prefName = d.properties.nam_ja;
            const value = getValue(prefName);
            if (value === 0) return 0.3;
            const ratio = Math.log(value + 1) / Math.log(maxValue + 1);
            return Math.max(0.4, Math.min(1, ratio));
          })
          .on('mouseover', function(event, d) {
            const prefName = d.properties.nam_ja;
            const value = getValue(prefName);
            
            // ツールチップを作成
            const tooltip = d3.select('body')
              .append('div')
              .attr('class', 'tooltip')
              .style('position', 'absolute')
              .style('background', '#333')
              .style('color', '#fff')
              .style('padding', '5px 10px')
              .style('border-radius', '3px')
              .style('font-size', '12px')
              .style('pointer-events', 'none')
              .style('opacity', 0);

            tooltip.transition().duration(200).style('opacity', 0.9);
            tooltip.html(`${prefName}<br/>${value.toLocaleString()}人`)
              .style('left', (event.pageX + 10) + 'px')
              .style('top', (event.pageY - 28) + 'px');

            // ハイライト効果
            d3.select(this)
              .attr('stroke', '#fff')
              .attr('stroke-width', 2);
          })
          .on('mousemove', function(event) {
            d3.select('.tooltip')
              .style('left', (event.pageX + 10) + 'px')
              .style('top', (event.pageY - 28) + 'px');
          })
          .on('mouseout', function() {
            // ツールチップを削除
            d3.select('.tooltip').remove();
            
            // ハイライト効果を解除
            d3.select(this)
              .attr('stroke', '#f0f0f0')
              .attr('stroke-width', 0.2);
          });
      })
      .catch(error => {
        console.error('Error loading GeoJSON:', error);
        
        // エラー時にメッセージを表示
        svg.append('text')
          .attr('x', width / 2)
          .attr('y', height / 2)
          .attr('text-anchor', 'middle')
          .attr('fill', '#666')
          .text('地図データの読み込みに失敗しました');
      });

  }, [data]);

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
      <div style={{ marginBottom: '15px', fontSize: '12px', color: '#b0b0b0' }}>
        感染者数: 0人
        <span style={{
          display: 'inline-block',
          width: '200px',
          height: '10px',
          background: 'linear-gradient(to right, #2a2a2a 0%, rgba(255, 107, 107, 0.5) 50%, rgba(255, 107, 107, 1) 100%)',
          margin: '0 10px',
          verticalAlign: 'middle',
          border: '1px solid #404040'
        }}></span>
        {maxValue.toLocaleString()}人+
      </div>

      <div style={{ 
        display: 'flex', 
        justifyContent: 'center',
        backgroundColor: '#2a2a2a',
        borderRadius: '8px',
        padding: '10px'
      }}>
        <svg
          ref={svgRef}
          width="500"
          height="400"
          viewBox="0 0 500 400"
          style={{ maxWidth: '100%', height: 'auto' }}
        />
      </div>

    </div>
  );
}

export default JapanMapFixed;