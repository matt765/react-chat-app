import { EditProfile } from "./EditProfile";
import { useState, useEffect, useContext } from "react";
import { useAuth } from "context/AuthContext.js";
import { EditOutlined, CloseOutlined } from "@ant-design/icons";
import { ChatEngineContext } from "react-chat-engine";

export const UserStatus = (props) => {
const { conn } = useContext(ChatEngineContext);
  const [userStatusAvailable, setUserStatusAvailable] = useState(false);
  const [editing, setEditing] = useState(false);
  const { userObject, convertedName } = useAuth();
  const [currentStatus, setCurrentStatus] = useState(props.userStatus)

  useEffect(() => {
    setUserStatusAvailable(true);
  }, [editing])

  const updateProfile = (newStatus) => {
    const myHeaders = new Headers();
    myHeaders.append("Project-ID", process.env.REACT_APP_PROJECT_ID);
    myHeaders.append("User-Name", convertedName);
    myHeaders.append("User-Secret", userObject.uid);

    const formdata = new FormData();
    formdata.append("first_name", newStatus);

    const requestOptions = {
      method: "PATCH",
      headers: myHeaders,
      body: formdata,
      redirect: "follow",
    };

    fetch("https://api.chatengine.io/users/me/", requestOptions).then(() => {
      setCurrentStatus(newStatus)
    });
  };

  return (
    <div className="chat-list-user-status">
      {editing ?
        <EditProfile
          userstatus={currentStatus}
          close={() => {
            setEditing(false)
          }}
          onSubmit={(newStatus) => {
            updateProfile(newStatus)
            setEditing(false)
          }}
        />
        :
        <>
          <div className="user-status">
            {/* Anti-spam to make demo account possible
            currentStatus ? currentStatus : "" */}
             {(conn.userName === "john%20doe") ? "sample status" : <>{currentStatus ? currentStatus : ""}</>   }  
             </div>
        </>}
      {!editing ?
        <EditOutlined onClick={() => setEditing(true)} /> :
        <CloseOutlined onClick={() => setEditing(false)} />
      }
    </div>
  )
}