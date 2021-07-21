import React, { useContext } from "react";
import { ChatEngineContext } from "react-chat-engine";
import ChatListDrawer from "./ChatListDrawer";
import { Row, Col } from "react-grid-system";
import { setConfiguration } from "react-grid-system";
import empty from "../../../images/empty.png";
import { MenuOutlined, CloseOutlined } from "@ant-design/icons";

setConfiguration({ maxScreenClass: "xl", gutterWidth: 0 });

export const ChatHeader = (props) => {
    const { conn, chats, activeChat } = useContext(ChatEngineContext);

    const capitalize = (str, lower = true) => {
        return (lower ? str.toLowerCase() : str).replace(
            /(?:^|\s|["'([{])+\S/g,
            (match) => match.toUpperCase()
        );
    };

    if (!chats || !activeChat || !chats[activeChat]) {
        return <div />;
    }

    if (!conn || conn === null) {
        return <div />;
    }

    const chat = chats[activeChat];
    const otherPerson = chat.people.find(
        (person) => person.person.username !== conn.userName
    );

    const userStatus = (otherPerson) ? otherPerson.person.first_name : ""

    const title = otherPerson
        ? capitalize(decodeURIComponent(otherPerson.person.username))
        : "";

    function getDateTime(date) {
        if (!date) return ''

        date = date.replace(' ', 'T')


        const year = date.substr(0, 4)
        const month = date.substr(5, 2)
        const day = date.substr(8, 2)
        const hour = date.substr(11, 2)
        const minute = date.substr(14, 2)
        const second = date.substr(17, 2)

        var d = new Date(`${year}-${month}-${day}T${hour}:${minute}:${second}`)
        console.log(d)
        let offset = (-(d.getTimezoneOffset()) / 60)
        console.log(offset)

        d.setHours(d.getHours() + offset)
        return d
    }

    function timeSinceDate(date) {
        if (!date) return ''


        let convertedDate = getDateTime(date)







        let sent = convertedDate.toString()

        const dayStr = sent.substr(0, 10)
        const timeStr = sent.substr(15, 6)
        return `${dayStr} at ${timeStr}`
    }


    return (
        <Row className="ce-chat-title" style={styles.titleSection}>

            <div className="mobile-toggler">
                <MenuOutlined 
                onClick={() => {
    document.querySelector(".chat-container").children[0].children[1].children[0].style.display = "block";
    document.querySelector(".chat-container").children[0].children[1].children[1].style.display = "none";
                }}
                 />
            </div>

            <Col
                xs={8}
                sm={12}
                style={styles.titleContainer}
                className="ce-chat-title-container"
            >

                {otherPerson && otherPerson.person.avatar ? (
                    <img
                        src={otherPerson.person.avatar}
                        style={{ borderRadius: "50%", width: "40px" }}
                    />
                ) : (
                    <img
                        src={empty}
                        className="chat-card-avatar"
                        style={{ borderRadius: "50%", width: "40px" }}
                    />
                )}
                <div className="ce-chat-header-container">
                    <div
                        style={styles.titleText}
                        className="ce-chat-title-text"
                        id={`ce-chat-feed-title-${title}`}
                    >
                        {title}
                    </div>

                    <div style={styles.subtitleText} className="ce-chat-subtitle-text">

                        {userStatus ? userStatus : (
                            chat.last_message.created && chat.last_message.created.length > 0 ?
                                `Active ${timeSinceDate(chat.last_message.created)}` :
                                'Say hello!'
                        )}
                    </div>
                </div>
            </Col>
        </Row>
    );
};

export default ChatHeader;

const styles = {
    titleSection: {
        position: "absolute",
        top: "0px",
        width: "100%",
        zIndex: "1",
        backgroundColor: "rgb(256, 256, 256, 0.92)",
        fontFamily: "Avenir",
    },
    mobileOptiom: {
        width: "100%",
        top: "32px",
        textAlign: "center",
        color: "rgb(24, 144, 255)",
        overflow: "hidden",
    },
    titleContainer: {
        width: "100%",
        padding: "18px 0px",
        textAlign: "left",
        color: "rgb(24, 144, 255)",
    },
    titleText: {
        fontSize: "24px",
        fontWeight: "600",
    },
    subtitleText: {
        fontSize: "12px",
    },
};
