import { SendOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

const ChatInput = ({ onSendMessage }) => {
  const [message, setMessage] = useState('');
  const t = useTranslations('webLabel');

  const handleChange = (e) => {
    setMessage(e.target.value);
  };

  const handleSend = () => {
    if (message.trim()) {
      onSendMessage(message);
      setMessage('');
    }
  };

  return (
    <div className="flex items-center gap-1">
      <TextArea
        value={message}
        onChange={handleChange}
        placeholder={t('placeHolderTypeYourMessage')}
      />
      <Button icon={<SendOutlined />} type="primary" onClick={handleSend} />
    </div>
  );
};

export default ChatInput;
