import { Modal, Form, Input, DatePicker, Select, InputNumber } from 'antd';
import dayjs from 'dayjs';

const CreateTaskModal = ({ open, onClose, onSubmit, newTask, setNewTask }) => {
    return (
        <Modal title="Tạo Nhiệm vụ mới" open={open} onCancel={onClose} okText="Tạo" onOk={onSubmit}>
            <Form layout="vertical">
                <Form.Item label="Tiêu đề nhiệm vụ" required>
                    <Input value={newTask.title} onChange={(e) => setNewTask(prev => ({ ...prev, title: e.target.value }))} placeholder="Nhập tiêu đề nhiệm vụ..." />
                </Form.Item>
                <Form.Item label="Mô tả">
                    <Input.TextArea rows={3} value={newTask.description} onChange={(e) => setNewTask(prev => ({ ...prev, description: e.target.value }))} placeholder="Mô tả chi tiết nhiệm vụ..." />
                </Form.Item>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Form.Item label="Hạn chót">
                        <DatePicker
                            className="w-full"
                            value={newTask.dueDate ? dayjs(newTask.dueDate) : null}
                            onChange={(d) => setNewTask(prev => ({ ...prev, dueDate: d ? d.format('YYYY-MM-DD') : '' }))}
                        />
                    </Form.Item>
                    <Form.Item label="Độ ưu tiên">
                        <Select
                            value={newTask.priority}
                            onChange={(v) => setNewTask(prev => ({ ...prev, priority: v }))}
                            options={[
                                { value: 'LOW', label: 'Thấp' },
                                { value: 'MEDIUM', label: 'Trung bình' },
                                { value: 'HIGH', label: 'Cao' }
                            ]}
                        />
                    </Form.Item>
                    <Form.Item label="Thời gian (giờ)">
                        <InputNumber min={0} className="w-full" value={newTask.estimatedHours} onChange={(v) => setNewTask(prev => ({ ...prev, estimatedHours: v || 0 }))} />
                    </Form.Item>
                </div>
            </Form>
        </Modal>
    );
};

export default CreateTaskModal;


