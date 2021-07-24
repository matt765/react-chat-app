
import { useState } from "react";
import React from "react";

export const EditProfile = ({ userstatus, onSubmit }) => {


  const [newStatus, setNewStatus] = useState(userstatus);

  return (

    <div className="edit-profile">

<form
 onSubmit={(e) => {
          e.preventDefault();
          onSubmit(newStatus);
        }}
>
      <div className="edit-name-input">
        <input
          placeholder="New status"
          value={newStatus}
          onChange={(e) => setNewStatus(e.target.value)}
          maxLength="20"
        />
      </div>



    
</form>
    </div>
  );
};
