interface NotificationProps {
  message: string;
}

const Notification = ({ message }: NotificationProps) => {
  if (!message) {
    return null;
  }
  return <div style={{ color: 'red' }}>{message}</div>;
};

export default Notification;
