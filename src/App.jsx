import { useState, useRef, useEffect } from 'react'
import './App.css'
import {FaComment} from 'react-icons/fa'
import useWebSocket, { ReadyState } from 'react-use-websocket';
import { v4 as uuidv4 } from 'uuid';

const DEBUG = false;
const UNIQUE_SESSION = uuidv4().split('-')[1]
const WS_URL = DEBUG ? `ws://localhost:8000/ws/chatbot/${UNIQUE_SESSION}/` : `ws://172.104.44.207/ws/chatbot/${UNIQUE_SESSION}/`
console.log(WS_URL)
export function App() {
  const [messages, setMessages] = useState([]);
  const [disabled, setDisabled] = useState(false);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const chatmessageRef = useRef(null);
  const [isAppHidden, setIsAppHidden] = useState(false);
  const {
    sendJsonMessage,
    lastJsonMessage,
    readyState
  } = useWebSocket(
    WS_URL
  )
  const connectionStatus = {
    [ReadyState.CONNECTING]: 1,
    [ReadyState.OPEN]: 2,
    [ReadyState.CLOSING]: 3,
    [ReadyState.CLOSED]: 4,
    [ReadyState.UNINSTANTIATED]: 5,
  }[readyState];

  useEffect(()=>{
    if (connectionStatus > 3 && !disabled){
      setDisabled(true)
    }
  }, [connectionStatus])

  //Adjust the scroll bar
  useEffect(() => {
    const chatMsgContainer = chatmessageRef.current;
    if(isAppHidden) return
    chatMsgContainer.scrollTop = chatMsgContainer.scrollHeight + 100;
  }, [chatmessageRef, messages, isAppHidden]);

  useEffect(()=>{
    if(lastJsonMessage && 'fulfillment_text' in lastJsonMessage)
      setMessages(prevMessages => [...prevMessages, { text: lastJsonMessage['fulfillment_text'], isUser: false }])
    setTyping(false)
  }, [lastJsonMessage])

  const handleSendMessage = () => {
    if (input == '') 
      return
    
    try{
      sendJsonMessage({
        'message': input
      })
      setMessages(prevMessages => [...prevMessages, {text:input, isUser: true}])
    }catch(e){
      e //An error occured add an alert element
    }
    finally{
      setTyping(true)
      setInput('')
    }
  };


  const toggleApp = () => {
    setIsAppHidden(!isAppHidden);
  };

  return (
    <div style={{position:"relative"}}>
      <button className="ButtonToggle" onClick={toggleApp}>
      <FaComment /> 
      </button>
     
      {isAppHidden ? null : (
        <div className="chat-container">
          
            {
              disabled && (
                <div className='disable-focus'>
                  <p>Chatbot is not available at the moment<br/>Try to reload the page</p>
                </div>
              )
            } 
          
          <div className="chat-header">ChatBrahmy</div>
          <div style={{position:'relative'}} ref={chatmessageRef} className="chat-messages">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`chat-message ${message.isUser ? 'user-message' : 'bot-message'}`}
              >
                {message.text}
              </div>
            ))}
           
          </div>
          <div>
            {
              typing && (<div style={{display:'flex', justifyContent: 'center', padding: '0.2rem', alignItems: 'center'}}>{'ChatBrahmmy...'}</div>)
            }
          </div>
            
          <div className="chat-input">
            <input
              value={input}
              onChange={({ target }) => setInput(target.value)}
              placeholder='Enter a message...'
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleSendMessage();
                }
              }}
            />
            <button 
              disabled={readyState !== ReadyState.OPEN}
              className="send-button"
              onClick={handleSendMessage}>Send</button>
            
          </div>
        </div>
      )}
    </div>
  )
}

// export default App;
