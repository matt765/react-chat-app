import React, { useState, useContext } from "react";
import { getOrCreateChat } from "react-chat-engine";
import { useAuth } from "context/AuthContext.js";
import { ChatEngineContext } from "react-chat-engine";
import { newChat } from "react-chat-engine";
import { PlusOutlined } from "@ant-design/icons";

const NewChatForm = (props) => {

  const { conn } = useContext(ChatEngineContext);
  const [value, setValue] = useState("");
  const [selected, setSelected] = useState(false);
  const [username, setUsername] = useState("");
  const [newChatError, setNewChatError] = useState("");
  const { userObject, convertedName } = useAuth();

  function lowerLetters(str) {
    return str.toLowerCase();
  }
  function capitalize(str) {
    if (/\s/.test(str)) {
      return str.replace(/\b\w/g, (l) => l.toUpperCase());
    } else return str;
  }
  function handleSubmit(event) {
    event.preventDefault();

    if (value.trim().length > 0) {
      newChat(conn, { title: value }, () => setSelected(false));
    }

    setValue("");
  }

  function createDirectChat(creds, otherPerson) {
    if (creds) {
      const newName = otherPerson
        ? otherPerson
        : encodeURIComponent(lowerLetters(username));

      if (newName == convertedName) {
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
            if (data.some((x) => x.username == newName)) {
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
          createDirectChat(props.creds);
        }}
      >
        <input
          placeholder="Add new chat"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        
      <PlusOutlined  onClick={() => {
          createDirectChat(props.creds);
      }}/>

       
      </form>
      <div className="newChatError">{newChatError}</div>
    </div>
  );
};

export default NewChatForm;

const styles = {
  newChatContainer: {
    padding: "16px 14px",
    backgroundColor: "white",
  },
};
