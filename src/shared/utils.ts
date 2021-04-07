export const getUrl = (path: string) =>
  process.env.NODE_ENV === 'development'
    ? `http://localhost:2048/api/v4/patient_hub/${path}`
    : `${window.location.protocol}//${window.location.host}/api/v4/patient_hub/${path}`;
