exports.getReports = (req, res) => {
  // Simple static data
  const reports = [
    { id: 1, title: 'Report 1', content: 'Static data 1' },
    { id: 2, title: 'Report 2', content: 'Static data 2' },
  ];
  res.json(reports);
};