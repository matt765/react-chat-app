import { useRef, useState, useEffect } from "react";
import { useAuth } from "context/AuthContext.js";
import { Icon, IconGroup, Loader } from "semantic-ui-react";
import { ChatAvatar } from "./ChatAvatar";
import { UserStatus } from "./UserStatus";
import empty from "../../../images/empty.png";
import loadingAnimation from "../../../images/loading.svg";

export const ChatProfile = (props) => {
  const { userObject, convertedName } = useAuth();
  const [avatarURL, setAvatarURL] = useState();
  const [userStatus, setUserStatus] = useState();
  const inputRef = useRef(null);
  const [image, setImage] = useState();
  const [avatarState, setAvatarState] = useState(false);
  const [statusState, setStatusState] = useState(false);
  const [avatarVisibility, setAvatarVisibility] = useState(true);

  const capitalize = (str, lower = true) => {
    return (lower ? str.toLowerCase() : str).replace(
      /(?:^|\s|["'([{])+\S/g,
      (match) => match.toUpperCase()
    );
  };

  const onFileAttach = (file) => {
    setImage(file);
  };

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
        setUserStatus(result.first_name)
        setAvatarURL(result.avatar);
        setAvatarState(true);
        setStatusState(true)

      });
  }, [avatarState]);

  return (
    <div className="chat-profile-container">
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
                    /*   Anti-spam to make demo account possible */
                    /*src={avatarURL}*/
                    src={empty}
                    style={{ borderRadius: "50%", width: "120px" }}
                    alt=""
                  />
                ) : (
                  <img
                    src={empty}
                    style={{ borderRadius: "50%", width: "120px" }}
                    alt=""
                  />
                )}
              </>
            ) : (
              <img src={loadingAnimation} alt="" />
            )}

            <Icon corner name="camera" inverted circular />
          </IconGroup>


        </div>
      ) : (
        <div className="user-loading">
          <Loader active size="small" />
        </div>
      )}

      {!image ?
        <div className="chat-profile-info">
          <div className="current-username">
            <div className="username-border">
              {capitalize(decodeURIComponent(convertedName))}
            </div>

          </div>

          {statusState ?
            <UserStatus userStatus={userStatus} /> : ""}

        </div>
        : ""}

    </div>
  );
};
