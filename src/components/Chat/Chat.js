import React, { useState, useEffect } from "react";
import { ChatEngine, getOrCreateChat } from "react-chat-engine";
import { useAuth } from "context/AuthContext.js";
import ChatCard from "./ChatList/ChatCard";
import ChatHeader from "./ChatFeed/ChatHeader";
import IsTyping from "./ChatFeed/IsTyping";
import ChatSettingsBox from "./ChatSettings/ChatSettingsBox";
import PhotosSettings from "./ChatSettings/PhotosSettings";
import axios from "axios";
import NewChatForm from './ChatList/NewChatForm'
import NewMessageForm from './ChatFeed/NewMessageForm/NewMessageForm'
import ChatList from './ChatList/ChatList'

export const Chat = () => {
  const { userObject, convertedName } = useAuth();
  const [username, setUsername] = useState("");
  const [newChatError, setNewChatError] = useState("");
  const [newAccountStatus, setNewAccountStatus] = useState(false);

  function lowerLetters(str) {
    return str.toLowerCase();
  }



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
        addDefaultChat(encodeURIComponent("test account"));
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

  function createDirectChat(creds, otherPerson) {
    const newName = otherPerson
      ? otherPerson
      : encodeURIComponent(lowerLetters(username));

    if (newName == convertedName) {
      setNewChatError("This is your own nickname!");
      setTimeout(() => setNewChatError(""), 5000);
    } else {
      var myHeaders = new Headers();
      myHeaders.append("PRIVATE-KEY", process.env.REACT_APP_CHAT_ENGINE_PRIVATE_KEY);

      var requestOptions = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow",
      };

      fetch("https://api.chatengine.io/users/", requestOptions)
        .then((response) => response.json())
        .then((data) => {
          if (data.some((x) => x.username == newName)) {
            getOrCreateChat(
              creds,
              { is_direct_chat: true, usernames: [newName] },
              () => {
                setUsername("");
                setNewChatError("");
              }
            );
          } else {
            setNewChatError("There is no such user");
            setTimeout(() => setNewChatError(""), 5000);
          }
        });
    }
  }

  function renderChatForm(creds) {
    return (
      <div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            createDirectChat(creds);
          }}
        >
          <input
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <button type="submit" value="Send">
            Create
          </button>
        </form>
        <div className="newChatError">{newChatError}</div>
      </div>
    );
  }

  return (
    <div className="chat-container">
      {convertedName && userObject && newAccountStatus ? (
        <ChatEngine
          offset={2}
          projectID={process.env.REACT_APP_PROJECT_ID}
          userName={convertedName}
          userSecret={userObject.uid}
          height="70vh"
          renderChatList={(chatAppState) => { return <ChatList chatAppState={chatAppState}  />}}
          renderChatCard={(chat, index) => { return <ChatCard chat={chat} index={index} /> }}
          renderNewChatForm={(creds) => { return <NewChatForm creds={creds} /> }}
         
          renderChatHeader={(creds) => { return <ChatHeader creds={creds} /> }}
        
          renderIsTyping={(typers) => {return <IsTyping typers={typers} />}}
          renderPhotosSettings={(chat) => { return (<PhotosSettings chat={chat} name={convertedName} secret={userObject.uid} />); }}
 renderChatSettings={() => { return <ChatSettingsBox  />
     

          }}
          renderNewMessageForm={(creds, chatId) => {return <NewMessageForm  creds={creds} chatId={chatId} />}}
        />
      ) : (
        ""
      )}

      
    </div>
  );
};
