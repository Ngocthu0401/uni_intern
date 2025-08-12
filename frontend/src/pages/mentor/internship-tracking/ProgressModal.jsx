import { Modal, Form, InputNumber, Slider } from 'antd';

const ProgressModal = ({ open, onCancel, onSave, progressData, setProgressData }) => {
    return (
        <Modal title="Cập nhật tiến độ" open={open} onCancel={onCancel} okText="Lưu" onOk={onSave}>
            <Form layout="vertical">
                <Form.Item label="Tuần hiện tại">
                    <InputNumber min={1} className="w-full" value={progressData.currentWeek} onChange={(v) => setProgressData(prev => ({ ...prev, currentWeek: v || 1 }))} />
                </Form.Item>
                <Form.Item label="Tổng số tuần">
                    <InputNumber min={1} className="w-full" value={progressData.totalWeeks} onChange={(v) => setProgressData(prev => ({ ...prev, totalWeeks: v || 12 }))} />
                </Form.Item>
                <Form.Item label="Tiến độ tổng thể (%)">
                    <Slider value={progressData.overallProgress} onChange={(v) => setProgressData(prev => ({ ...prev, overallProgress: v }))} />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default ProgressModal;


