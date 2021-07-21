import AvatarEditor from "react-avatar-editor";
import { Image } from "semantic-ui-react";
import { useEffect, useRef, useState } from "react";
import { ChatEngineContext } from "react-chat-engine";
import React, { useContext } from "react";

export const EditProfile = ({ userstatus, close, onSubmit }) => {


  const [newStatus, setNewStatus] = useState(userstatus);

  return (

    <div className="edit-profile">

<form>
      <div className="edit-name-input">
        <input
          placeholder="New status"
          value={newStatus}
          onChange={(e) => setNewStatus(e.target.value)}
          maxLength="20"
        />
      </div>



      <div className="image-upload-actions">

        <button
          className="submit"
          onClick={() => {
            if (true) {
              onSubmit(newStatus);
            } else {
              onSubmit();
            }
          }}
        >
          Upload
        </button>
        <button className="cancel" onClick={close}>
          Cancel
        </button>
      </div>
</form>
    </div>
  );
};
