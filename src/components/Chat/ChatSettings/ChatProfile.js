import { useRef, useState, useEffect } from "react";
import { useAuth } from "context/AuthContext.js";
import { Icon, IconGroup, Loader } from "semantic-ui-react";
import { ChatAvatar } from "./ChatAvatar";
import { EditProfile } from "./EditProfile";
import empty from "../../../images/empty.png";
import { LeftOutlined, DownOutlined, UserOutlined, DeleteOutlined, LogoutOutlined, EditOutlined } from "@ant-design/icons";
import { fb } from "service";

export const ChatProfile = (props) => {
  const { userObject, convertedName } = useAuth();
  const [avatarURL, setAvatarURL] = useState();
  const [userStatus, setUserStatus] = useState("New User");
  const inputRef = useRef(null);
  const [image, setImage] = useState();
  const [avatarState, setAvatarState] = useState(false);
  const [avatarVisibility, setAvatarVisibility] = useState(true);
  const [editing, setEditing] = useState(false);

  const { chat, name, secret } = props;

  const capitalize = (str, lower = true) => {
    return (lower ? str.toLowerCase() : str).replace(
      /(?:^|\s|["'([{])+\S/g,
      (match) => match.toUpperCase()
    );
  };

  const onFileAttach = (file) => {
    setImage(file);
  };

  function deleteActiveChat(chatID) {
    var myHeaders = new Headers();

    let otherPerson = chat.people.find(
      (person) => person.person.username !== name
    )
      ? chat.people.find((person) => person.person.username !== name)
      : chat.people.find((person) => person.person.username == name);

    myHeaders.append("Project-ID", process.env.REACT_APP_PROJECT_ID);
    myHeaders.append("User-Name", name);
    myHeaders.append("User-Secret", secret);

    var raw = `{\n    \"username\": \"${name}\"\n}`;
    var raw2 = `{\n    \"username\": \"${otherPerson.person.username}\"\n}`;

    var firstUser = {
      method: "DELETE",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };
    var secondUser = {
      method: "DELETE",
      headers: myHeaders,
      body: raw2,
      redirect: "follow",
    };

    fetch(`https://api.chatengine.io/chats/${chatID}/people/`, firstUser)
      .then((response) => response.text())
      .then((result) => console.log(result))
      .catch((error) => console.log("error", error));

    fetch(`https://api.chatengine.io/chats/${chatID}/people/`, secondUser)
      .then((response) => response.text())
      .then((result) => console.log(result))
      .catch((error) => console.log("error", error));
  }


  const updateAv = () => {
    const myHeaders = new Headers();
    myHeaders.append("Project-ID", process.env.REACT_APP_PROJECT_ID);
    myHeaders.append("User-Name", convertedName);
    myHeaders.append("User-Secret", userObject.uid);

    const formdata = new FormData();
    formdata.append("avatar", image, image.name);

    const requestOptions = {
      method: "PATCH",
      headers: myHeaders,
      body: formdata,
      redirect: "follow",
    };

    fetch("https://api.chatengine.io/users/me/", requestOptions)
      .then(() => {
        setAvatarState(false)
        setAvatarURL()
      }
      )
  };

  const updateProfile = (newUsername, newStatus) => {
    const myHeaders = new Headers();
    myHeaders.append("Project-ID", process.env.REACT_APP_PROJECT_ID);
    myHeaders.append("User-Name", convertedName);
    myHeaders.append("User-Secret", userObject.uid);

    const formdata = new FormData();
    formdata.append("name", newUsername);
    formdata.append("first_name", newStatus);

    const requestOptions = {
      method: "PATCH",
      headers: myHeaders,
      body: formdata,
      redirect: "follow",
    };

    fetch("https://api.chatengine.io/users/me/", requestOptions).then(() => {
      setAvatarState(false);

    });
  };
  useEffect(() => {
    var myHeaders = new Headers();
    myHeaders.append("Project-ID", process.env.REACT_APP_PROJECT_ID);
    myHeaders.append("User-Name", props.conn.userName);
    myHeaders.append("User-Secret", props.conn.userSecret);

    var requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };

    fetch("https://api.chatengine.io/users/me/", requestOptions)
      .then((response) => response.json())
      .then((result) => {

        setAvatarURL(result.avatar);
        setAvatarState(true);
        setUserStatus(result.first_name)
      });
  }, [avatarState]);

  return (
    <div className="left-rail-header">
      <input
        type="file"
        ref={inputRef}
        className="image-input"
        accept="image/jpeg,image/png"
        onChange={(e) => {
          const file = e.target?.files?.[0];
          if (file) {
            onFileAttach(file);
            setAvatarVisibility(false);
          }
        }}
      />

      {!!image && (
        <ChatAvatar
          crop
          file={image}
          header="Set Your Avatar"
          mode="message"
          username={props.conn.userName}
          userstatus={userStatus}
          onSubmit={(croppedImage) => {
            setImage(croppedImage);
            updateAv();
            setImage(null);
            setAvatarVisibility(true);
          }}
          close={() => {
            setImage(null)
            setAvatarVisibility(true);
          }}
        />
      )}


      {userObject.uid && avatarVisibility ? (
        <div className="current-user-info">
          <IconGroup
            onClick={() => {
              const input = inputRef.current;
              if (input) {
                input.value = "";
                input.click();
              }
            }}
            className="user-avatar"
            size="large"
          >
            {avatarState ? (
              <>
                {avatarURL ? (
                  <img
                    src={avatarURL}
                    style={{ borderRadius: "50%", width: "120px" }}
                  />
                ) : (
                  <img
                    src={empty}
                    style={{ borderRadius: "50%", width: "120px" }}
                  />
                )}
              </>
            ) : (
              ""
            )}

            <Icon corner name="camera" inverted circular />
          </IconGroup>


        </div>
      ) : (
        <div className="user-loading">
          <Loader active size="small" />
        </div>
      )}
      <div className="current-username">
        <div className="username-border">
          {capitalize(decodeURIComponent(convertedName))}
        </div>

      </div>

      <div className="options-icons-container">

        {editing ?
          <EditProfile
            username={props.conn.userName}
            userstatus={userStatus}
            close={() => {
              setEditing(false)

            }}
            onSubmit={(newUsername, newStatus) => {
              updateProfile(newUsername, newStatus)
              setEditing(false)
            }}
          />
          :
          <>
            {userStatus ?
              <div className="user-status">
                {userStatus} </div>

              : <div className="user-status">
                --- </div>



            }</>}

        <div className="options-icons">
          <EditOutlined onClick={() => setEditing(true)} />
          <DeleteOutlined onClick={() => {
            if (window.confirm("Press OK if you want to delete active chat. Conversation with this person will be lost")) {
              deleteActiveChat(chat.id)

            }



          }} />
          <LogoutOutlined onClick={() => {
            if (window.confirm("Press OK if you want to logout")) {
              fb.auth.signOut().then(console.log("logged out"))

            }



          }} />
        </div>

      </div>
    </div>
  );
};
