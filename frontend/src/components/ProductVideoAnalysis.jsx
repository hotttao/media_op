import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Input, 
  Select, 
  Button, 
  Table, 
  Tag, 
  Row, 
  Col, 
  Statistic, 
  Space, 
  Spin,
  Empty,
  Typography,
  AutoComplete,
  DatePicker
} from 'antd';
import { SearchOutlined, VideoCameraOutlined, LikeOutlined, StarOutlined, ShareAltOutlined, CalendarOutlined } from '@ant-design/icons';
import { productAPI } from '../services/api';
import moment from 'moment';
import 'moment/locale/zh-cn';

moment.locale('zh-cn');

const { Title, Text } = Typography;
const { Search } = Input;

const ProductVideoAnalysis = () => {
  const [productKeyword, setProductKeyword] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [dateRange, setDateRange] = useState([moment().subtract(7, 'days'), moment()]);
  const [sortBy, setSortBy] = useState('digg');
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [productOptions, setProductOptions] = useState([]);
  const [tableLoading, setTableLoading] = useState(false);

  // 搜索商品
  const handleProductSearch = async (value) => {
    if (!value || value.length < 2) {
      setProductOptions([]);
      return;
    }
    
    setSearchLoading(true);
    try {
      const response = await productAPI.searchProducts(value);
      const options = (response.data || []).map(product => ({
        label: `${product.title} (${product.productId})`,
        value: product.productId,
        product: product
      }));
      setProductOptions(options);
    } catch (error) {
      console.error('搜索商品失败:', error);
      setProductOptions([]);
    } finally {
      setSearchLoading(false);
    }
  };

  // 选择商品
  const handleProductSelect = (value, option) => {
    setSelectedProduct(option.product);
    setProductKeyword(option.product.title);
  };

  // 查询商品视频数据
  const handleSearch = async () => {
    if (!selectedProduct) {
      return;
    }
    
    setTableLoading(true);
    try {
      const params = {
        start_date: dateRange[0].format('YYYY-MM-DD'),
        end_date: dateRange[1].format('YYYY-MM-DD'),
        sort_by: sortBy
      };
      
      const response = await productAPI.getProductVideos(selectedProduct.productId, params);
      setData(response.data || []);
    } catch (error) {
      console.error('获取商品视频数据失败:', error);
      setData([]);
    } finally {
      setTableLoading(false);
    }
  };

  // 快速时间选择
  const handleQuickDateSelect = (days) => {
    setDateRange([moment().subtract(days, 'days'), moment()]);
  };

  // 表格列配置
  const columns = [
    {
      title: '视频信息',
      key: 'videoInfo',
      width: 300,
      render: (text, record) => (
        <div>
          <Text strong style={{ fontSize: '14px' }}>{record.title}</Text>
          <br />
          <Text type="secondary" style={{ fontSize: '12px' }}>
            ID: {record.awemeId}
          </Text>
          <br />
          <Space size="small">
            <Tag color="blue">{record.nickname}</Tag>
            <Tag icon={<CalendarOutlined />}>
              {moment(record.createTime).format('YYYY-MM-DD')}
            </Tag>
          </Space>
        </div>
      )
    },
    {
      title: '互动数据',
      key: 'interactionData',
      children: [
        {
          title: '点赞',
          dataIndex: 'diggCount',
          key: 'diggCount',
          width: 120,
          align: 'center',
          sorter: (a, b) => a.diggCount - b.diggCount,
          render: (text) => (
            <Statistic 
              value={text} 
              prefix={<LikeOutlined />}
              valueStyle={{ fontSize: '16px', color: '#1890ff' }}
            />
          )
        },
        {
          title: '收藏',
          dataIndex: 'collectCount',
          key: 'collectCount',
          width: 120,
          align: 'center',
          sorter: (a, b) => a.collectCount - b.collectCount,
          render: (text) => (
            <Statistic 
              value={text} 
              prefix={<StarOutlined />}
              valueStyle={{ fontSize: '16px', color: '#faad14' }}
            />
          )
        },
        {
          title: '转发',
          dataIndex: 'shareCount',
          key: 'shareCount',
          width: 120,
          align: 'center',
          sorter: (a, b) => a.shareCount - b.shareCount,
          render: (text) => (
            <Statistic 
              value={text} 
              prefix={<ShareAltOutlined />}
              valueStyle={{ fontSize: '16px', color: '#52c41a' }}
            />
          )
        }
      ]
    },
    {
      title: '表现评分',
      key: 'performance',
      width: 150,
      align: 'center',
      render: (text, record) => {
        const total = record.diggCount + record.collectCount + record.shareCount;
        const score = total > 10000 ? '优秀' : total > 5000 ? '良好' : total > 1000 ? '一般' : '待提升';
        const color = total > 10000 ? 'gold' : total > 5000 ? 'green' : total > 1000 ? 'blue' : 'default';
        return (
          <div>
            <Tag color={color} style={{ fontSize: '14px', padding: '4px 8px' }}>
              {score}
            </Tag>
            <div style={{ marginTop: 8 }}>
              <Text type="secondary" style={{ fontSize: '12px' }}>
                总计: {total.toLocaleString()}
              </Text>
            </div>
          </div>
        );
      }
    }
  ];

  return (
    <div style={{ padding: '24px' }}>
      <Card>
        <Title level={2} style={{ marginBottom: 24 }}>
          <VideoCameraOutlined /> 商品视频分析
        </Title>
        
        <Spin spinning={loading}>
          <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
            <Col xs={24} sm={12} md={8} lg={8}>
              <div style={{ marginBottom: 8 }}>
                <Text strong>搜索商品</Text>
              </div>
              <AutoComplete
                style={{ width: '100%' }}
                placeholder="输入商品名称或ID进行搜索"
                value={productKeyword}
                onChange={setProductKeyword}
                onSearch={handleProductSearch}
                onSelect={handleProductSelect}
                options={productOptions}
                allowClear
              >
                <Search 
                  loading={searchLoading}
                  enterButton={<SearchOutlined />}
                />
              </AutoComplete>
            </Col>
            
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
                  <Button size="small" onClick={() => handleQuickDateSelect(3)}>3天</Button>
                  <Button size="small" onClick={() => handleQuickDateSelect(7)}>7天</Button>
                  <Button size="small" onClick={() => handleQuickDateSelect(15)}>15天</Button>
                  <Button size="small" onClick={() => handleQuickDateSelect(30)}>30天</Button>
                </Space>
              </Space>
            </Col>
            
            <Col xs={24} sm={12} md={8} lg={8}>
              <div style={{ marginBottom: 8 }}>
                <Text strong>排序字段</Text>
              </div>
              <Select
                style={{ width: '100%' }}
                value={sortBy}
                onChange={setSortBy}
                options={[
                  { label: '点赞数', value: 'digg' },
                  { label: '收藏数', value: 'collect' },
                  { label: '转发数', value: 'share' }
                ]}
              />
            </Col>
          </Row>
          
          <Row style={{ marginBottom: 24 }}>
            <Col>
              <Button 
                type="primary" 
                size="large"
                onClick={handleSearch}
                disabled={!selectedProduct}
                loading={tableLoading}
                icon={<SearchOutlined />}
              >
                查询分析
              </Button>
            </Col>
          </Row>
          
          {selectedProduct && (
            <Card 
              title={
                <Space>
                  <Text strong>商品信息: {selectedProduct.title}</Text>
                  <Tag color="blue">ID: {selectedProduct.productId}</Tag>
                  {selectedProduct.category && (
                    <Tag color="green">{selectedProduct.category}</Tag>
                  )}
                </Space>
              }
              style={{ marginBottom: 24 }}
            >
              <Row gutter={16}>
                <Col span={8}>
                  <Statistic 
                    title="一级分类" 
                    value={selectedProduct.category || '-'} 
                  />
                </Col>
                <Col span={8}>
                  <Statistic 
                    title="二级分类" 
                    value={selectedProduct.category2 || '-'} 
                  />
                </Col>
                <Col span={8}>
                  <Statistic 
                    title="品牌" 
                    value={selectedProduct.brand || '-'} 
                  />
                </Col>
              </Row>
            </Card>
          )}
          
          <Card 
            title={
              <Space>
                <VideoCameraOutlined />
                <Text strong>相关视频数据</Text>
                {data.length > 0 && (
                  <Tag color="blue">共 {data.length} 个视频</Tag>
                )}
              </Space>
            }
          >
            <Table
              columns={columns}
              dataSource={data}
              rowKey="awemeId"
              loading={tableLoading}
              scroll={{ x: 800 }}
              pagination={{
                pageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total, range) => 
                  `第 ${range[0]}-${range[1]} 条/共 ${total} 条`
              }}
              locale={{
                emptyText: <Empty description="暂无数据，请选择商品并点击查询" />
              }}
            />
          </Card>
        </Spin>
      </Card>
    </div>
  );
};

export default ProductVideoAnalysis;