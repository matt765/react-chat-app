import React, { useContext } from "react";
import { ChatEngineContext } from "react-chat-engine";
import _ from "lodash";
import empty from "../../../images/empty.png";
import { Avatar } from 'react-chat-engine'

export const ChatCard = (props) => {
    const { conn, activeChat, setActiveChat } = useContext(ChatEngineContext);
    const { chat } = props;

    const capitalize = (str, lower = true) => {
        return (lower ? str.toLowerCase() : str).replace(
            /(?:^|\s|["'([{])+\S/g,
            (match) => match.toUpperCase()
        );
    };

    if (!conn || conn === null) return <div />;
    if (!chat) return <div />;

    // This function allows blue dot to appear when new message comes

    function readLastMessage(chat) {
        let readLastMessage = true;
        chat.people.map((chat_person) => {
            if (conn.userName === chat_person.person.username) {
                readLastMessage = chat.last_message.id === chat_person.last_read;
            }
            return ""
        });
        return readLastMessage;
    }

    const extraStyle = activeChat === chat.id ? styles.activeChat : {};
    const otherPerson = chat.people.find(
        (person) => person.person.username !== conn.userName
    );
    const convertedUsername = otherPerson ? otherPerson.person.username : "";
    const title = otherPerson
        ? capitalize(decodeURIComponent(convertedUsername))
        : "";

    let lastMessage = chat.last_message.text;
    if (!lastMessage) {
        lastMessage =
            chat.last_message.attachments.length > 0
                ? `${chat.last_message.attachments.length} image${chat.last_message.attachments.length > 1 ? "s" : ""
                }`
                : "Say hello!";
    }
    const isToday = (someDate) => {
        const today = new Date()
        return someDate.getDate() === today.getDate() &&
            someDate.getMonth() === today.getMonth() &&
            someDate.getFullYear() === today.getFullYear()
    }
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
        let offset = (-(d.getTimezoneOffset()) / 60)
        d.setHours(d.getHours() + offset)
        return d
    }
    function timeSinceDate(date) {
        if (!date) return ''
        let convertedDate = getDateTime(date)
        let sent = convertedDate.toString()
        const dayStr = sent.substr(3, 7)
        const timeStr = sent.substr(15, 6)
        if (isToday(convertedDate)) {
            return timeStr
        } else {
            return dayStr
        }


    }

    return (
        <div
            onClick={() => setActiveChat(chat.id)}
            style={{ ...styles.chatContainer, ...extraStyle }}
            className={`ce-chat-card ${activeChat === chat.id && "ce-active-chat-card"
                }`}
        >
            {otherPerson && otherPerson.person.avatar ? (
                <div className="avatar-online">

                    <Avatar
                        avatar={otherPerson.person.avatar ? otherPerson.person.avatar : ""}
                        username={otherPerson.person.username}
                        is_online={otherPerson.person.is_online}
                    />
                </div>
            ) : (
                <div className="avatar-online">
                    <div
                        className='ce-avatar-status'
                        style={{
                            ...styles.status,
                            ...{ backgroundColor: otherPerson && otherPerson.person.is_online ? '#52c41a' : '#f5222d' }
                        }}
                    />
                    <img
                        src={empty}
                        className="chat-card-avatar"
                        style={{ borderRadius: "50%", width: "40px" }}
                        alt=""
                    />

                </div>

            )}

            <div className="chat-card-info">
                <div
                    style={styles.titleText}
                    className="ce-chat-title-text"
                    id={`ce-chat-card-title-${title}`}
                >
                    {title}
                </div>

                <div style={{ width: "100%" }} className="ce-chat-subtitle">
                    <div
                        style={styles.messageText}
                        className="ce-chat-subtitle-text ce-chat-subtitle-message"
                    >
                        {/*lastMessage*/}
                        sample message
                    </div>


                </div>
            </div>
            <div className="chat-card-activity">
                <div className="chat-card-activity-time">
                    {
                        chat.last_message.created && chat.last_message.created.length > 0 ?
                            `${timeSinceDate(chat.last_message.created)}` :
                            ''
                    }

                </div>
                {!readLastMessage(chat) && (
                    <div
                        className="ce-chat-unread-dot"
                        style={{
                            width: "12px",
                            height: "12px",
                            borderRadius: "6px",
                            backgroundColor: "var(--own-msg-color)",
                            display: "inline-block",
                            marginTop: '15px',
                            marginLeft: '10px'
                        }}
                    />
                )}

            </div>
        </div>
    );
};

const styles = {
    chatContainer: {
        padding: "16px",
        paddingBottom: "12px",
        cursor: "pointer",
    },
    titleText: {
        fontWeight: "500",
        paddingBottom: "4px",
        whiteSpace: "nowrap",
        overflow: "hidden",
    },
    status: {
        width: '8px',
        height: '8px',
        borderRadius: '100%',
        border: '2px solid #d3d8e4de',
        position: 'absolute',
        top: '35px'
    },
    messageText: {
        width: "100%",
        color: "var(--gray-text)",
        fontSize: "13px",
        whiteSpace: "nowrap",
        overflow: "hidden",
        display: "inline-block",
    },
    activeChat: {
        backgroundColor: "#d9d9d9",
        border: "4px solid white",
        borderRadius: "12px",
    },
};

export default ChatCard;
