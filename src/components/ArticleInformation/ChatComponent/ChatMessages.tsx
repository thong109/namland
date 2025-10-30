import AvatarDefault from '@/assets/images/avarta-default.svg';
import { fileCommentIcon } from '@/libs/appComponents';
import { renderDateTime } from '@/libs/appconst';
import { useAuthStore } from '@/stores/useAuthStore';
import { Avatar, List, Modal } from 'antd';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import './style.scss';
const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'];

const ChatMessages = ({ messages }) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const { userInfo } = useAuthStore();
  const scrollToBottom = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
    }
  };
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div
      ref={scrollContainerRef}
      className="scrollbar-hidden message-box flex h-96 flex-col overflow-auto rounded-lg bg-portal-gray-1 p-2"
    >
      <List
        itemLayout="horizontal"
        dataSource={[...messages].reverse()}
        bordered={false}
        renderItem={(item: any) => {
          const isCurrentUser = userInfo?.id === item?.user?.id;
          return (
            <List.Item
              className={`flex gap-1 ${isCurrentUser ? '!justify-end !text-right' : '!justify-start !text-left'}`}
            >
              {!isCurrentUser && <Avatar src={item?.user?.avatarUrl ?? AvatarDefault?.src} />}
              <div
                className={`max-w-[80%] rounded-lg px-3 py-2 text-black ${isCurrentUser ? 'bg-white' : 'bg-white'} `}
              >
                <span className="whitespace-pre-line">{item?.content}</span>
                {item?.files?.length > 0 &&
                  item?.files?.map((file) => {
                    const fileExtension = file?.url?.split('.').pop()?.toLowerCase();
                    const isImage = fileExtension && imageExtensions.includes(fileExtension);

                    return isImage ? (
                      <div key={file?.id} className="mt-1 flex w-full justify-end">
                        <Image
                          src={file?.url}
                          alt={file?.name}
                          width={100}
                          height={100}
                          className="rounded-lg"
                          onClick={() => setPreviewImage(file?.url)}
                        />
                      </div>
                    ) : (
                      <Link
                        key={file?.id}
                        target="_blank"
                        className="mt-1 flex w-full justify-end"
                        href={file?.url}
                      >
                        <span className="mr-2 h-3 w-3">{fileCommentIcon}</span>
                        <span className="text-portal-gray-5">{file?.name}</span>
                      </Link>
                    );
                  })}
                <div className="text-[11px] opacity-60">{renderDateTime(item?.createdAt)}</div>
              </div>
              {isCurrentUser && <Avatar src={item?.user?.avatarUrl ?? AvatarDefault?.src} />}
            </List.Item>
          );
        }}
      />

      {/* Modal hiển thị ảnh lớn */}
      <Modal
        open={!!previewImage}
        footer={null}
        onCancel={() => setPreviewImage(null)}
        centered
        closable={false}
      >
        {previewImage && (
          <Image
            src={previewImage}
            alt="Preview Image"
            width={500}
            height={500}
            className="rounded-lg"
          />
        )}
      </Modal>
    </div>
  );
};

export default ChatMessages;
