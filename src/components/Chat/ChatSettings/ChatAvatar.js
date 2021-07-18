import AvatarEditor from "react-avatar-editor";
import { Image } from "semantic-ui-react";
import { useEffect, useRef, useState } from "react";
import { ChatEngineContext } from "react-chat-engine";
import React, { useContext } from "react";

export const ChatAvatar = ({ file, close, onSubmit, crop = false, username, userstatus }) => {

  const { conn } = useContext(ChatEngineContext);
  const [imageSrc, setImageSrc] = useState("");
  const cropRef = useRef();
  const [newUsername, setNewUsername] = useState(username);
  const [newStatus, setNewStatus] = useState(userstatus);

  
console.log(username, userstatus)

  useEffect(() => {
    const fr = new FileReader();
    fr.onload = () => setImageSrc(fr.result);
    fr.readAsDataURL(file);
  }, [file]);

  return (
    <div className="chat-new-avatar">
      {crop ? (
        <AvatarEditor
          ref={cropRef}
          width={100}
          height={100}
          border={40}
          borderRadius={50}
          image={imageSrc}
        />
      ) : (
        <Image size="medium" src={imageSrc} alt="preview" />
      )}
      
        
      <div className="image-upload-actions">
        <button className="cancel" onClick={close}>
          Cancel
        </button>
        <button
          className="submit"
          onClick={() => {
            if (crop && cropRef) {
              const canvas = cropRef.current
                .getImageScaledToCanvas()
                .toDataURL();
              fetch(canvas)
                .then((res) => res.blob())
                .then((blob) => onSubmit(blob, newUsername, newStatus));
            } else {
              onSubmit();
            }
          }}
        >
          Upload
        </button>
      </div>
    </div>
  );
};
