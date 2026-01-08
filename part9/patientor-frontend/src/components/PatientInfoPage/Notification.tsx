import Alert from '@mui/material/Alert';

const Notification = ({ message }: { message: string }) => {
  if (!message) return null;
  return (
    <Alert severity="error" sx={{ mb: 2 }}>
      {message}
    </Alert>
  );
};

export default Notification;
