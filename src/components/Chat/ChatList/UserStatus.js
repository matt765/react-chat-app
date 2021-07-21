import { EditProfile } from "./EditProfile";
import { useState, useEffect } from "react";
import { useAuth } from "context/AuthContext.js";
import { EditOutlined } from "@ant-design/icons";

export const UserStatus = (props) => {

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
                  {currentStatus ? currentStatus : ""} </div>

              



              </>}
               {!editing ?
              <EditOutlined onClick={() => setEditing(true)} /> : ""}
        </div>
    )
}