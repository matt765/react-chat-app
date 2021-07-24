import React, { useState, useEffect } from "react";
import { ChatEngine } from "react-chat-engine";
import { useAuth } from "context/AuthContext.js";
import ChatCard from "./ChatList/ChatCard";
import ChatHeader from "./ChatFeed/ChatHeader";
import IsTyping from "./ChatFeed/IsTyping";
import ChatSettingsBox from "./ChatSettings/ChatSettingsBox";
import axios from "axios";
import NewChatForm from './ChatList/NewChatForm'
import NewMessageForm from './ChatFeed/NewMessageForm/NewMessageForm'
import MessageBubble from './ChatFeed/Bubble/MessageBubble'
import loadingAnimation from "../../images/loading.svg";
import ChatList from './ChatList/ChatList'

export const Chat = () => {
  const { userObject, convertedName } = useAuth();
  const [newAccountStatus, setNewAccountStatus] = useState(false);
  const [chatHeight, setChatHeight] = useState("630px");

  useEffect(() => {
    if (window.screen.width < 1150) {
      setChatHeight("100vh")
    }
  }, [])

  useEffect(() => {
    // This hook creates new Chat Engine account if there is none
    const data = {
      username: convertedName,
      secret: userObject.uid,
    };
    const config = {
      method: "post",
      url: "https://api.chatengine.io/users/",
      headers: {
        "PRIVATE-KEY": process.env.REACT_APP_CHAT_ENGINE_PRIVATE_KEY,
      },
      data: data,
    };

    axios(config)
      .then(() => {
        // This function adds sample conversation for a new account
        addDefaultChat(encodeURIComponent("sample account"));
        setNewAccountStatus(true);
      })
      .catch(() => {
        console.log("This account is already created");
        setNewAccountStatus(true);
      });
  }, []);

  function addDefaultChat(otherName) {
    var myHeaders = new Headers();
    myHeaders.append("Project-ID", process.env.REACT_APP_PROJECT_ID);
    myHeaders.append("User-Name", convertedName);
    myHeaders.append("User-Secret", userObject.uid);
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
      is_direct_chat: true,
      usernames: [convertedName, otherName],
    });

    var requestOptions = {
      method: "PUT",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
      contentType: "application/json; charset=utf-8",
    };

    fetch("https://api.chatengine.io/chats/", requestOptions)
      .then((response) => response.text())
      .catch((error) => console.log("error", error));
  }

  return (
    <div className="chat-container">
      {convertedName && userObject && newAccountStatus ? (
        <ChatEngine
          offset={2}
          projectID={process.env.REACT_APP_PROJECT_ID}
          userName={convertedName}
          userSecret={userObject.uid}
          height={chatHeight}
          renderChatList={(chatAppState) => { return <ChatList chatAppState={chatAppState} /> }}
          renderChatCard={(chat, index) => { return <ChatCard chat={chat} index={index} /> }}
          renderNewChatForm={(creds) => { return <NewChatForm creds={creds} /> }}
          renderChatHeader={(creds) => { return <ChatHeader creds={creds} /> }}
          renderIsTyping={(typers) => { return <IsTyping typers={typers} /> }}
          renderChatSettings={() => { return <ChatSettingsBox /> }}
          renderNewMessageForm={(creds, chatId) => { return <NewMessageForm creds={creds} chatId={chatId} /> }}
          renderMessageBubble={(creds, chat, lastMessage, message, nextMessage) => { return <MessageBubble creds={creds} chat={chat} lastMessage={lastMessage} message={message} nextMessage={nextMessage} /> }}
        />
      ) : (
        <div className="loading-image main-loader"><img src={loadingAnimation} alt="" /></div>
      )}
    </div>
  );
};
