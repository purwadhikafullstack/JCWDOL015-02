import React, { useState } from 'react';
import ReportFilter from '../components/ReportFilter'; // Komponen untuk filter laporan
import ReportTable from '../components/ReportTable'; // Komponen untuk menampilkan tabel laporan

const ReportsPage: React.FC = () => {
  const [selectedOutlet, setSelectedOutlet] = useState<string | null>(null);
  const [selectedDateRange, setSelectedDateRange] = useState<
    [Date, Date] | null
  >(null);

  return (
    <div>
      <h1>Laporan & Analisis</h1>
      <ReportFilter
        onOutletChange={setSelectedOutlet}
        onDateRangeChange={setSelectedDateRange}
      />
      <ReportTable outlet={selectedOutlet} dateRange={selectedDateRange} />
    </div>
  );
};

export default ReportsPage;
