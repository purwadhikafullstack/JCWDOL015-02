import React from 'react';

interface ReportTableProps {
  outlet: string | null;
  dateRange: [Date, Date] | null;
}

const ReportTable: React.FC<ReportTableProps> = ({ outlet, dateRange }) => {
  return (
    <div>
      <h2>Tabel Laporan</h2>
      {/* Tampilkan data laporan di sini */}
    </div>
  );
};

export default ReportTable;
