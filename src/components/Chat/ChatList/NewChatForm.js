import React, { useState, useContext } from "react";
import { getOrCreateChat } from "react-chat-engine";
import { useAuth } from "context/AuthContext.js";
import { ChatEngineContext } from "react-chat-engine";
import { PlusOutlined } from "@ant-design/icons";

const NewChatForm = (props) => {

  const { conn } = useContext(ChatEngineContext);
   const [username, setUsername] = useState("");
  const [newChatError, setNewChatError] = useState("");
  const { convertedName } = useAuth();

  function lowerLetters(str) {
    return str.toLowerCase();
  }
 
  function createDirectChat(creds, otherPerson) {
    if (creds) {
      const newName = otherPerson
        ? otherPerson
        : encodeURIComponent(lowerLetters(username));

      if (newName === convertedName) {
        setNewChatError("This is your own nickname!");
        setTimeout(() => setNewChatError(""), 5000);
      } else {
        var myHeaders = new Headers();
        myHeaders.append("PRIVATE-KEY", "c4d418e8-fa2d-4adc-be73-2f0dc8bf19ac");

        var requestOptions = {
          method: "GET",
          headers: myHeaders,
          redirect: "follow",
        };

        fetch("https://api.chatengine.io/users/", requestOptions)
          .then((response) => response.json())
          .then((data) => {
            if (data.some((x) => x.username === newName)) {
              getOrCreateChat(
                conn,
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
  }
  return (
    <div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (conn.userName === "john%20doe") {
            alert("Adding conversations is disabled on sample account, sorry!");
            return
          }
          else if (username === "john%20doe") {
            alert("Adding conversations with sample account is disabled, sorry!");
          }
          createDirectChat(props.creds);
        }}
      >
        <input
          placeholder="Add new chat"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />

        <PlusOutlined onClick={() => {
           if (conn.userName === "john%20doe") {
            alert("Adding conversations is disabled on sample account, sorry!");
            return
          }
          else if (username === "john%20doe") {
            alert("Adding conversations with sample account is disabled, sorry!");
          }
          createDirectChat(props.creds);
        }} />

      </form>
      <div className="newChatError">{newChatError}</div>
    </div>
  );
};

export default NewChatForm;


