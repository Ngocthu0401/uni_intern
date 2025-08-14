import { PlusOutlined } from '@ant-design/icons';
import { Button, Typography } from 'antd';

const { Title, Text } = Typography;

const MentorHeader = ({ onAdd }) => {
  return (
    <div className="flex items-center justify-between">
      <div>
        <Title level={3} className="!mb-0">Quản lý Mentor</Title>
        <Text type="secondary">Quản lý thông tin và tài khoản mentor doanh nghiệp</Text>
      </div>
      <Button type="primary" icon={<PlusOutlined />} onClick={onAdd}>
        Thêm Mentor
      </Button>
    </div>
  );
};

export default MentorHeader;

// import React from 'react';
// import { Button, Space, Typography } from 'antd';
// import { PlusOutlined } from '@ant-design/icons';

// const { Title, Text } = Typography;

// const MentorHeader = ({ onCreate }) => (
//   <div className="!mb-6">
//     <Title level={2} className="!mb-1">Quản lý Mentor</Title>
//     <Text type="secondary">Quản lý thông tin và tài khoản mentor doanh nghiệp</Text>
//     <div className="!mt-3">
//       <Space>
//         <Button type="primary" icon={<PlusOutlined />} onClick={onCreate}>Thêm Mentor</Button>
//       </Space>
//     </div>
//   </div>
// );

// export default MentorHeader;


