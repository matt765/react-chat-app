import AvatarEditor from "react-avatar-editor";
import { Image } from "semantic-ui-react";
import { useEffect, useRef, useState } from "react";
import { ChatEngineContext } from "react-chat-engine";
import React, { useContext } from "react";

export const EditProfile = ({ username, userstatus, close, onSubmit }) => {

  const [newUsername, setNewUsername] = useState(username);
  const [newStatus, setNewStatus] = useState(userstatus);

return (

    <div className="edit-profile">
      
   
    <div className="edit-name-input">
  <input
          placeholder="New status"
          value={newStatus}
   onChange={(e) => setNewStatus(e.target.value)}

        />
     </div>


    
      <div className="image-upload-actions">
       
        <button
          className="submit"
          onClick={() => {
            if (true) {
                onSubmit( newUsername, newStatus);
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

    </div>
  );
};
