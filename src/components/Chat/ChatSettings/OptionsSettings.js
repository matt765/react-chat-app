import React, { useState } from "react";
import { Button } from "react-chat-engine";
import { LeftOutlined, DownOutlined, UserOutlined, DeleteOutlined, LogoutOutlined } from "@ant-design/icons";
import { fb } from "service";

const OptionsSettings = (props) => {
    const [state, setState] = useState({
        collapsed: true,
        hovered: false,
        description: ""
    });
    const { chat, name, secret } = props;

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

    return (
        <div style={{ borderTop: "1px solid #f0f0f0", marginBottom: "5px" }}>
            <div
                id="ce-options-drop-down"
                onMouseEnter={() => setState({ ...state, hovered: true })}
                onMouseLeave={() => setState({ ...state, hovered: false })}
                onClick={() => setState({ ...state, collapsed: !state.collapsed })}
                style={
                    state.hovered ? {

                        cursor: "pointer",
                        borderWidth: "1px"
                     
                        ///* Barlow Condensed, Indie Flower, Montserrat, Oswald, Raleway, Open Sans Condensed, Heebo */
                    } : {}
                }
            >
                <div style={{
                    fontSize: "16px",
                    padding: "12px 0 12px 0",
                    fontWeight: "400",
                    fontFamily: "Quicksand",
                   
                    color: "rgba(255, 255, 255, 0.7",
                    letterSpacing: "1px",
                    fontWeight: "400",
                   borderColor: "var(--border-color)",
                borderStyle: "solid",
                borderWidth: "0 0 1px 0"
                   }}>
                Options
            </div>

            {state.collapsed ? (
                <LeftOutlined style={styles.collapseIcon} />
            ) : (
                <DownOutlined style={styles.collapseIcon} />
            )}
        </div>

            {
        !state.collapsed && (
            <div className="options-icons-container">




                <div className="options-icons">

                    <DeleteOutlined onClick={() => deleteActiveChat(chat.id)} />
                    <LogoutOutlined onClick={() => fb.auth.signOut().then(console.log("logged out"))} />
                </div>
                <div className="options-description">Delete Chat&nbsp;&nbsp;&nbsp; &nbsp;&nbsp; Logout </div>
            </div>
        )
    }
        </div >
    );
};

export default OptionsSettings;

const styles = {
    collapseIcon: {
        float: "right",
        position: "relative",
        bottom: "30px",
        right: "12px",
    },
};
