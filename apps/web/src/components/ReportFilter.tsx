import React from 'react';

interface ReportFilterProps {
  onOutletChange: (outlet: string | null) => void;
  onDateRangeChange: (dateRange: [Date, Date] | null) => void;
}

const ReportFilter: React.FC<ReportFilterProps> = ({
  onOutletChange,
  onDateRangeChange,
}) => {
  const handleOutletChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    onOutletChange(event.target.value || null);
  };

  const handleDateRangeChange = (startDate: string, endDate: string) => {
    onDateRangeChange([new Date(startDate), new Date(endDate)]);
  };

  return (
    <div>
      <label>
        Pilih Outlet:
        <select onChange={handleOutletChange}>
          <option value="">Semua Outlet</option>
          {/* Tambahkan opsi outlet di sini */}
        </select>
      </label>
      <label>
        Pilih Rentang Tanggal:
        <input
          type="date"
          onChange={(e) => handleDateRangeChange(e.target.value, '')}
        />
        <input
          type="date"
          onChange={(e) => handleDateRangeChange('', e.target.value)}
        />
      </label>
    </div>
  );
};

export default ReportFilter;
