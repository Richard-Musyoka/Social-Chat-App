import ChatHeader from './components/chat-header/index';
import MessageBar from './components/message-bar/index';
import MessageContainer from './components/message-container';

const ChatContainer = () => {
  return (
    <div className="h-screen w-screen bg-[#1c1d25] flex flex-col overflow-hidden">
      <ChatHeader />
      <div className="flex-1 overflow-y-auto">
        <MessageContainer />
      </div>
      <MessageBar />
    </div>
  );
};

export default ChatContainer;
