import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Select, 
  DatePicker, 
  Button, 
  Table, 
  Tag, 
  Row, 
  Col, 
  Statistic, 
  Space, 
  Spin,
  Empty,
  Typography
} from 'antd';
import { ShoppingCartOutlined, VideoCameraOutlined, LikeOutlined, StarOutlined, ShareAltOutlined } from '@ant-design/icons';
import { creatorAPI, categoryAPI } from '../services/api';
import moment from 'moment';
import 'moment/locale/zh-cn';

moment.locale('zh-cn');

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

const CreatorProductAnalysis = () => {
  const [creators, setCreators] = useState([]);
  const [selectedCreator, setSelectedCreator] = useState(null);
  const [dateRange, setDateRange] = useState([moment().subtract(7, 'days'), moment()]);
  const [sortBy, setSortBy] = useState('digg');
  const [category, setCategory] = useState('');
  const [categories, setCategories] = useState([]);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [tableLoading, setTableLoading] = useState(false);

  // 获取达人列表和分类数据
  useEffect(() => {
    const fetchInitialData = async () => {
      setLoading(true);
      try {
        const [creatorsRes, categoriesRes] = await Promise.all([
          creatorAPI.getCreators(),
          categoryAPI.getCategories()
        ]);
        setCreators(creatorsRes.data || []);
        setCategories(categoriesRes.data || []);
      } catch (error) {
        console.error('获取初始数据失败:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  // 查询达人商品数据
  const handleSearch = async () => {
    if (!selectedCreator) {
      return;
    }
    
    setTableLoading(true);
    try {
      const params = {
        start_date: dateRange[0].format('YYYY-MM-DD'),
        end_date: dateRange[1].format('YYYY-MM-DD'),
        sort_by: sortBy,
        category: category || undefined
      };
      
      const response = await creatorAPI.getCreatorProducts(selectedCreator, params);
      setData(response.data || []);
    } catch (error) {
      console.error('获取达人商品数据失败:', error);
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
      title: '商品信息',
      dataIndex: 'productTitle',
      key: 'productTitle',
      width: 200,
      render: (text, record) => (
        <div>
          <Text strong>{text}</Text>
          <br />
          <Text type="secondary" style={{ fontSize: '12px' }}>
            ID: {record.productId}
          </Text>
        </div>
      )
    },
    {
      title: '分类',
      dataIndex: 'category',
      key: 'category',
      width: 120,
      render: (text, record) => (
        <Space direction="vertical" size={0}>
          <Tag color="blue">{text}</Tag>
          <Tag color="green">{record.category2}</Tag>
        </Space>
      )
    },
    {
      title: '视频数量',
      dataIndex: 'videoCount',
      key: 'videoCount',
      width: 100,
      align: 'center',
      render: (text) => (
        <Statistic 
          value={text} 
          prefix={<VideoCameraOutlined />}
          valueStyle={{ fontSize: '16px' }}
        />
      )
    },
    {
      title: '平均数据',
      key: 'avgData',
      children: [
        {
          title: '点赞',
          dataIndex: 'avgDiggCount',
          key: 'avgDiggCount',
          width: 100,
          align: 'center',
          render: (text) => (
            <Statistic 
              value={text} 
              prefix={<LikeOutlined />}
              valueStyle={{ fontSize: '14px', color: '#1890ff' }}
            />
          )
        },
        {
          title: '收藏',
          dataIndex: 'avgCollectCount',
          key: 'avgCollectCount',
          width: 100,
          align: 'center',
          render: (text) => (
            <Statistic 
              value={text} 
              prefix={<StarOutlined />}
              valueStyle={{ fontSize: '14px', color: '#faad14' }}
            />
          )
        },
        {
          title: '转发',
          dataIndex: 'avgShareCount',
          key: 'avgShareCount',
          width: 100,
          align: 'center',
          render: (text) => (
            <Statistic 
              value={text} 
              prefix={<ShareAltOutlined />}
              valueStyle={{ fontSize: '14px', color: '#52c41a' }}
            />
          )
        }
      ]
    },
    {
      title: '总数据',
      key: 'totalData',
      children: [
        {
          title: '点赞',
          dataIndex: 'totalDiggCount',
          key: 'totalDiggCount',
          width: 100,
          align: 'center',
          render: (text) => (
            <Statistic 
              value={text} 
              valueStyle={{ fontSize: '14px', color: '#1890ff' }}
            />
          )
        },
        {
          title: '收藏',
          dataIndex: 'totalCollectCount',
          key: 'totalCollectCount',
          width: 100,
          align: 'center',
          render: (text) => (
            <Statistic 
              value={text} 
              valueStyle={{ fontSize: '14px', color: '#faad14' }}
            />
          )
        },
        {
          title: '转发',
          dataIndex: 'totalShareCount',
          key: 'totalShareCount',
          width: 100,
          align: 'center',
          render: (text) => (
            <Statistic 
              value={text} 
              valueStyle={{ fontSize: '14px', color: '#52c41a' }}
            />
          )
        }
      ]
    }
  ];

  return (
    <div style={{ padding: '24px' }}>
      <Card>
        <Title level={2} style={{ marginBottom: 24 }}>
          <ShoppingCartOutlined /> 达人商品分析
        </Title>
        
        <Spin spinning={loading}>
          <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
            <Col xs={24} sm={12} md={8} lg={6}>
              <div style={{ marginBottom: 8 }}>
                <Text strong>选择达人</Text>
              </div>
              <Select
                style={{ width: '100%' }}
                placeholder="请选择达人"
                value={selectedCreator}
                onChange={setSelectedCreator}
                options={creators.map(creator => ({
                  label: creator.nickname,
                  value: creator.id
                }))}
                showSearch
                filterOption={(input, option) =>
                  option.label.toLowerCase().includes(input.toLowerCase())
                }
              />
            </Col>
            
            <Col xs={24} sm={12} md={8} lg={6}>
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
            
            <Col xs={24} sm={12} md={8} lg={6}>
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
            
            <Col xs={24} sm={12} md={8} lg={6}>
              <div style={{ marginBottom: 8 }}>
                <Text strong>一级分类</Text>
              </div>
              <Select
                style={{ width: '100%' }}
                placeholder="全部分类"
                value={category}
                onChange={setCategory}
                options={categories.map(cat => ({
                  label: cat,
                  value: cat
                }))}
                allowClear
              />
            </Col>
          </Row>
          
          <Row style={{ marginBottom: 24 }}>
            <Col>
              <Button 
                type="primary" 
                size="large"
                onClick={handleSearch}
                disabled={!selectedCreator}
                loading={tableLoading}
              >
                查询分析
              </Button>
            </Col>
          </Row>
          
          <Card title="分析结果" style={{ marginTop: 24 }}>
            <Table
              columns={columns}
              dataSource={data}
              rowKey="productId"
              loading={tableLoading}
              scroll={{ x: 1200 }}
              pagination={{
                pageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total, range) => 
                  `第 ${range[0]}-${range[1]} 条/共 ${total} 条`
              }}
              locale={{
                emptyText: <Empty description="暂无数据，请选择达人并点击查询" />
              }}
            />
          </Card>
        </Spin>
      </Card>
    </div>
  );
};

export default CreatorProductAnalysis;