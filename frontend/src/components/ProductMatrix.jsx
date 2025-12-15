import React, { useState, useEffect } from 'react';
import { Card, Select, Button, Table, Tag, Row, Col, Statistic, Space, Spin, Empty, Typography, DatePicker, Tabs, Tooltip } from 'antd';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, CartesianGrid, XAxis, YAxis, Tooltip as RechartsTooltip, Legend, ResponsiveContainer } from 'recharts';
import { BarChartOutlined, LineChartOutlined, PieChartOutlined, SyncOutlined, CalendarOutlined, DatabaseOutlined, SearchOutlined, RiseOutlined, FallOutlined } from '@ant-design/icons';
import { productAPI } from '../services/api';
import './ProductMatrix.css';
import moment from 'moment';
import 'moment/locale/zh-cn';

moment.locale('zh-cn');

const { Title } = Typography;
const { RangePicker } = DatePicker;
const { TabPane } = Tabs;

const ProductMatrix = () => {
  const [dateRange, setDateRange] = useState([moment().subtract(30, 'days'), moment()]);
  const [metric, setMetric] = useState('total_gmv');
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [chartData, setChartData] = useState([]);
  const [activeTab, setActiveTab] = useState('table');

  // 查询商品矩阵数据
  const handleSearch = async () => {
    setLoading(true);
    try {
      const params = {
        start_date: dateRange[0].format('YYYY-MM-DD'),
        end_date: dateRange[1].format('YYYY-MM-DD'),
        metric: metric
      };
      
      const response = await productAPI.getProductMatrix(params);
      const matrixData = response.data || [];
      setData(matrixData);
      
      // 准备图表数据
      const chartData = matrixData.slice(0, 10).map(item => ({
        name: item.product_title,
        value: item[metric] || 0,
        product_id: item.product_id,
        category: item.category
      }));
      setChartData(chartData);
      
    } catch (error) {
      console.error('获取商品矩阵数据失败:', error);
      setData([]);
      setChartData([]);
    } finally {
      setLoading(false);
    }
  };

  // 快速时间选择
  const handleQuickDateSelect = (days) => {
    setDateRange([moment().subtract(days, 'days'), moment()]);
  };

  // 指标变化处理
  const handleMetricChange = (newMetric) => {
    setMetric(newMetric);
  };

  // 获取指标标签和颜色
  const getMetricConfig = (metricKey) => {
    const configs = {
      total_gmv: { label: 'GMV', color: '#1890ff', unit: '元' },
      total_orders: { label: '订单数', color: '#52c41a', unit: '单' },
      avg_price: { label: '客单价', color: '#faad14', unit: '元' },
      conversion_rate: { label: '转化率', color: '#f5222d', unit: '%' },
      creator_count: { label: '达人数量', color: '#722ed1', unit: '人' },
      video_count: { label: '视频数量', color: '#13c2c2', unit: '个' }
    };
    return configs[metricKey] || { label: metricKey, color: '#8c8c8c', unit: '' };
  };

  // 表格列配置
  const columns = [
    {
      title: '商品信息',
      key: 'productInfo',
      width: 300,
      fixed: 'left',
      render: (text, record) => (
        <div>
          <Text strong style={{ fontSize: '14px' }}>{record.product_title}</Text>
          <br />
          <Text type="secondary" style={{ fontSize: '12px' }}>
            ID: {record.product_id}
          </Text>
          <br />
          <Space size="small" style={{ marginTop: 4 }}>
            <Tag color="blue">{record.category}</Tag>
            {record.brand && <Tag color="green">{record.brand}</Tag>}
          </Space>
        </div>
      )
    },
    {
      title: '核心指标',
      key: 'coreMetrics',
      children: [
        {
          title: 'GMV',
          dataIndex: 'total_gmv',
          key: 'total_gmv',
          width: 120,
          align: 'center',
          sorter: (a, b) => (a.total_gmv || 0) - (b.total_gmv || 0),
          render: (text) => (
            <Statistic 
              value={text || 0} 
              valueStyle={{ fontSize: '16px', color: '#1890ff' }}
              formatter={(value) => `¥${(value / 10000).toFixed(1)}万`}
            />
          )
        },
        {
          title: '订单数',
          dataIndex: 'total_orders',
          key: 'total_orders',
          width: 120,
          align: 'center',
          sorter: (a, b) => (a.total_orders || 0) - (b.total_orders || 0),
          render: (text) => (
            <Statistic 
              value={text || 0} 
              valueStyle={{ fontSize: '16px', color: '#52c41a' }}
              formatter={(value) => value.toLocaleString()}
            />
          )
        },
        {
          title: '客单价',
          dataIndex: 'avg_price',
          key: 'avg_price',
          width: 120,
          align: 'center',
          sorter: (a, b) => (a.avg_price || 0) - (b.avg_price || 0),
          render: (text) => (
            <Statistic 
              value={text || 0} 
              valueStyle={{ fontSize: '16px', color: '#faad14' }}
              formatter={(value) => `¥${value}`}
            />
          )
        },
        {
          title: '转化率',
          dataIndex: 'conversion_rate',
          key: 'conversion_rate',
          width: 120,
          align: 'center',
          sorter: (a, b) => (a.conversion_rate || 0) - (b.conversion_rate || 0),
          render: (text) => (
            <Statistic 
              value={text || 0} 
              valueStyle={{ fontSize: '16px', color: '#f5222d' }}
              formatter={(value) => `${(value * 100).toFixed(2)}%`}
            />
          )
        }
      ]
    },
    {
      title: '内容表现',
      key: 'contentMetrics',
      children: [
        {
          title: '达人数量',
          dataIndex: 'creator_count',
          key: 'creator_count',
          width: 120,
          align: 'center',
          sorter: (a, b) => (a.creator_count || 0) - (b.creator_count || 0),
          render: (text) => (
            <Statistic 
              value={text || 0} 
              valueStyle={{ fontSize: '16px', color: '#722ed1' }}
            />
          )
        },
        {
          title: '视频数量',
          dataIndex: 'video_count',
          key: 'video_count',
          width: 120,
          align: 'center',
          sorter: (a, b) => (a.video_count || 0) - (b.video_count || 0),
          render: (text) => (
            <Statistic 
              value={text || 0} 
              valueStyle={{ fontSize: '16px', color: '#13c2c2' }}
            />
          )
        }
      ]
    },
    {
      title: '综合评分',
      key: 'score',
      width: 150,
      fixed: 'right',
      align: 'center',
      render: (text, record) => {
        const gmvScore = (record.total_gmv || 0) / 100000; // 10万GMV = 1分
        const orderScore = (record.total_orders || 0) / 1000; // 1000订单 = 1分
        const conversionScore = (record.conversion_rate || 0) * 100; // 转化率直接作为分数
        const totalScore = Math.min(100, (gmvScore + orderScore + conversionScore) / 3);
        
        const getScoreColor = (score) => {
          if (score >= 80) return { color: 'gold', text: '优秀' };
          if (score >= 60) return { color: 'green', text: '良好' };
          if (score >= 40) return { color: 'blue', text: '一般' };
          return { color: 'default', text: '待提升' };
        };
        
        const scoreInfo = getScoreColor(totalScore);
        
        return (
          <div>
            <Tooltip title={`GMV得分: ${gmvScore.toFixed(1)}, 订单得分: ${orderScore.toFixed(1)}, 转化得分: ${conversionScore.toFixed(1)}`}>
              <Tag color={scoreInfo.color} style={{ fontSize: '14px', padding: '4px 8px' }}>
                {scoreInfo.text}
              </Tag>
            </Tooltip>
            <div style={{ marginTop: 8 }}>
              <Text type="secondary" style={{ fontSize: '12px' }}>
                评分: {totalScore.toFixed(1)}
              </Text>
            </div>
          </div>
        );
      }
    }
  ];

  // 图表配置
  const chartConfig = getMetricConfig(metric);

  const renderLineChart = () => (
    <Line
      data={chartData}
      width={800}
      height={400}
      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
    >
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
      <YAxis />
      <Tooltip formatter={(value) => [`${value}${chartConfig.unit}`, chartConfig.label]} />
      <Legend />
      <Line 
        type="monotone" 
        dataKey="value" 
        stroke={chartConfig.color} 
        strokeWidth={3}
        dot={{ fill: chartConfig.color, strokeWidth: 2, r: 4 }}
        name={chartConfig.label}
      />
    </Line>
  );

  const renderBarChart = () => (
    <Bar
      data={chartData}
      width={800}
      height={400}
      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
    >
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
      <YAxis />
      <Tooltip formatter={(value) => [`${value}${chartConfig.unit}`, chartConfig.label]} />
      <Legend />
      <Bar 
        dataKey="value" 
        fill={chartConfig.color}
        name={chartConfig.label}
      />
    </Bar>
  );

  const renderPieChart = () => (
    <Pie
      data={chartData}
      width={800}
      height={400}
      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
    >
      <Pie
        dataKey="value"
        cx={400}
        cy={200}
        outerRadius={120}
        fill="#8884d8"
        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
      >
        {chartData.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={`hsl(${index * 30}, 70%, 60%)`} />
        ))}
      </Pie>
      <Tooltip formatter={(value) => [`${value}${chartConfig.unit}`, chartConfig.label]} />
      <Legend />
    </Pie>
  );

  return (
    <div style={{ padding: '24px' }}>
      <Card>
        <Title level={2} style={{ marginBottom: 24 }}>
          <BarChartOutlined /> 商品矩阵分析
        </Title>
        
        <Spin spinning={loading}>
          <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
            <Col xs={24} sm={12} md={8} lg={8}>
              <div style={{ marginBottom: 8 }}>
                <Text strong>时间范围</Text>
              </div>
              <Space direction="vertical" style={{ width: '100%' }}>
                <RangePicker
                  style={{ width: '100%' }}
                  value={dateRange}
                  onChange={setDateRange}
                  format="YYYY-MM-DD"
                />
                <Space>
                  <Button size="small" onClick={() => handleQuickDateSelect(7)}>7天</Button>
                  <Button size="small" onClick={() => handleQuickDateSelect(15)}>15天</Button>
                  <Button size="small" onClick={() => handleQuickDateSelect(30)}>30天</Button>
                  <Button size="small" onClick={() => handleQuickDateSelect(90)}>90天</Button>
                </Space>
              </Space>
            </Col>
            
            <Col xs={24} sm={12} md={8} lg={8}>
              <div style={{ marginBottom: 8 }}>
                <Text strong>分析指标</Text>
              </div>
              <Select
                style={{ width: '100%' }}
                value={metric}
                onChange={handleMetricChange}
                options={[
                  { label: 'GMV', value: 'total_gmv' },
                  { label: '订单数', value: 'total_orders' },
                  { label: '客单价', value: 'avg_price' },
                  { label: '转化率', value: 'conversion_rate' },
                  { label: '达人数量', value: 'creator_count' },
                  { label: '视频数量', value: 'video_count' }
                ]}
              />
            </Col>
            
            <Col xs={24} sm={12} md={8} lg={8}>
              <div style={{ marginBottom: 8 }}>
                <Text strong>&nbsp;</Text>
              </div>
              <Button 
                type="primary" 
                size="large"
                onClick={handleSearch}
                loading={loading}
                icon={<SearchOutlined />}
                style={{ width: '100%' }}
              >
                分析数据
              </Button>
            </Col>
          </Row>
          
          <Tabs 
            activeKey={activeTab} 
            onChange={setActiveTab}
            type="card"
            style={{ marginBottom: 24 }}
          >
            <TabPane 
              tab={
                <Space>
                  <BarChartOutlined />
                  数据表格
                </Space>
              } 
              key="table"
            >
              <Card 
                title={
                  <Space>
                    <Text strong>商品矩阵数据</Text>
                    {data.length > 0 && (
                      <Tag color="blue">共 {data.length} 个商品</Tag>
                    )}
                  </Space>
                }
              >
                <Table
                  columns={columns}
                  dataSource={data}
                  rowKey="product_id"
                  loading={loading}
                  scroll={{ x: 1200 }}
                  pagination={{
                    pageSize: 20,
                    showSizeChanger: true,
                    showQuickJumper: true,
                    showTotal: (total, range) => 
                      `第 ${range[0]}-${range[1]} 条/共 ${total} 条`
                  }}
                  locale={{
                    emptyText: <Empty description="暂无数据，请设置查询条件并点击分析" />
                  }}
                />
              </Card>
            </TabPane>
            
            <TabPane 
              tab={
                <Space>
                  <LineChartOutlined />
                  趋势分析
                </Space>
              } 
              key="trend"
            >
              <Card title={`${chartConfig.label}趋势图`}>
                {chartData.length > 0 ? (
                  <div style={{ textAlign: 'center' }}>
                    {renderLineChart()}
                  </div>
                ) : (
                  <Empty description="暂无图表数据" />
                )}
              </Card>
            </TabPane>
            
            <TabPane 
              tab={
                <Space>
                  <BarChartOutlined />
                  对比分析
                </Space>
              } 
              key="compare"
            >
              <Card title={`${chartConfig.label}对比图`}>
                {chartData.length > 0 ? (
                  <div style={{ textAlign: 'center' }}>
                    {renderBarChart()}
                  </div>
                ) : (
                  <Empty description="暂无图表数据" />
                )}
              </Card>
            </TabPane>
            
            <TabPane 
              tab={
                <Space>
                  <PieChartOutlined />
                  占比分析
                </Space>
              } 
              key="ratio"
            >
              <Card title={`${chartConfig.label}占比图`}>
                {chartData.length > 0 ? (
                  <div style={{ textAlign: 'center' }}>
                    {renderPieChart()}
                  </div>
                ) : (
                  <Empty description="暂无图表数据" />
                )}
              </Card>
            </TabPane>
          </Tabs>
        </Spin>
      </Card>
    </div>
  );
};

export default ProductMatrix;