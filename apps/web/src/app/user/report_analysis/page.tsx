'use client';

import React, { useEffect, useState } from 'react';
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Select,
  message,
} from 'some-ui-library';

const WorkerJobHistory = () => {
  const [jobHistories, setJobHistories] = useState([]);
  const [selectedJob, setSelectedJob] = useState<{ id: string } | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [reportData, setReportData] = useState([]); // State untuk data Report Analysis
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const apiUrl = process.env.NEXT_PUBLIC_BASE_API_URL;

  // Fetch job histories and report analysis data
  useEffect(() => {
    fetchJobHistories();
    fetchReportData(); // Fetch Report Analysis data
  }, []);

  const fetchJobHistories = async () => {
    try {
      const response = await fetch(`${apiUrl}/worker-job-history`);
      if (!response.ok) throw new Error('Failed to fetch job histories');

      const data = await response.json();
      setJobHistories(data);
    } catch (error) {
      console.error('Failed to fetch job histories', error);
      message.error('Failed to fetch job histories');
    }
  };

  // Fetch Report Analysis data
  const fetchReportData = async () => {
    try {
      const response = await fetch(`${apiUrl}/report-analysis`);
      if (!response.ok) throw new Error('Failed to fetch report data');

      const data = await response.json();
      setReportData(data);
    } catch (error) {
      console.error('Failed to fetch report data', error);
      message.error('Failed to fetch report data');
    }
  };

  const handleEdit = (job: { id: string }) => {
    setSelectedJob(job);
    setIsEditMode(true);
    setIsModalOpen(true);
  };

  const handleDelete = async (jobId: any) => {
    try {
      const response = await fetch(`${apiUrl}/worker-job-history/${jobId}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete job history');

      message.success('Job history deleted successfully');
      fetchJobHistories();
    } catch (error) {
      console.error('Failed to delete job history', error);
      message.error('Failed to delete job history');
    }
  };

  const handleFormSubmit = async (values: any) => {
    try {
      const method = isEditMode ? 'PUT' : 'POST';
      let url = `${apiUrl}/worker-job-history`;
      if (isEditMode && selectedJob?.id) {
        url = `${apiUrl}/worker-job-history/${selectedJob.id}`;
      }

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) throw new Error('Failed to save job history');

      message.success(
        isEditMode
          ? 'Job history updated successfully'
          : 'Job history created successfully',
      );
      fetchJobHistories();
      setIsModalOpen(false);
    } catch (error) {
      console.error('Failed to save job history', error);
      message.error('Failed to save job history');
    }
  };

  const columns = [
    { title: 'Worker ID', dataIndex: ['worker', 'id'], key: 'workerId' },
    { title: 'Order ID', dataIndex: ['order', 'id'], key: 'orderId' },
    { title: 'Station', dataIndex: 'station', key: 'station' },
    {
      title: 'Pickup Delivery',
      dataIndex: 'pickupDelivery',
      key: 'pickupDelivery',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: { id: string }) => (
        <span>
          <Button onClick={() => handleEdit(record)}>Edit</Button>
          <Button danger onClick={() => handleDelete(record.id)}>
            Delete
          </Button>
        </span>
      ),
    },
  ];

  const reportColumns = [
    { title: 'Report ID', dataIndex: 'reportId', key: 'reportId' },
    {
      title: 'Worker Performance',
      dataIndex: 'workerPerformance',
      key: 'workerPerformance',
    },
    { title: 'Outlet Sales', dataIndex: 'outletSales', key: 'outletSales' },
    { title: 'Date', dataIndex: 'date', key: 'date' },
  ];

  return (
    <div className="worker-job-history-page">
      <h2>Worker Job History</h2>
      <Button
        type="primary"
        onClick={() => {
          setIsModalOpen(true);
          setIsEditMode(false);
        }}
      >
        Add Job History
      </Button>

      <Table columns={columns} dataSource={jobHistories} rowKey="id" />

      <Button type="secondary" onClick={() => setIsReportModalOpen(true)}>
        View Report Analysis
      </Button>

      {/* Modal untuk Job History */}
      <Modal
        title={isEditMode ? 'Edit Job History' : 'Add Job History'}
        visible={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
      >
        <Form
          initialValues={
            isEditMode
              ? selectedJob
              : { workerId: '', orderId: '', station: '', pickupDelivery: '' }
          }
          onFinish={handleFormSubmit}
        >
          <Form.Item
            name="workerId"
            label="Worker ID"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="orderId"
            label="Order ID"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="station"
            label="Station"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="pickupDelivery"
            label="Pickup Delivery"
            rules={[{ required: true }]}
          >
            <Select>
              <Select.Option value="Pickup">Pickup</Select.Option>
              <Select.Option value="Delivery">Delivery</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              {isEditMode ? 'Update' : 'Add'}
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      {/* Modal untuk Report Analysis */}
      <Modal
        title="Report Analysis"
        visible={isReportModalOpen}
        onCancel={() => setIsReportModalOpen(false)}
        footer={[
          <Button key="close" onClick={() => setIsReportModalOpen(false)}>
            Close
          </Button>,
        ]}
      >
        <Table
          columns={reportColumns}
          dataSource={reportData}
          rowKey="reportId"
        />
      </Modal>
    </div>
  );
};

export default WorkerJobHistory;
