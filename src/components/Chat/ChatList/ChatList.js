import React, { useContext, useEffect, useRef, useState } from 'react'

import { ChatEngineContext, getLatestChats, getChatsBefore } from 'react-chat-engine'
import { ChatProfile } from "./ChatProfile";
import { CloseOutlined, BgColorsOutlined, CommentOutlined, LeftOutlined, DownOutlined, UserOutlined, DeleteOutlined, LogoutOutlined, EditOutlined } from "@ant-design/icons";
import { fb } from "service";
import _ from 'lodash'
import loadingAnimation from "../../../images/loading.svg";
import chatLogo from "../../../images/chatlogo.png";
import chatLogoWhite from "../../../images/chatlogowhite.png";
import ChatLoader from '../ChatLoader'
import NewChatForm from './NewChatForm'
import ChatCard from './ChatCard'


let count = 50
const interval = 75

const ChatList = props => {
    const didMountRef = useRef(false)
    const [loadChats, setLoadChats] = useState(false)
    const [hasMoreChats, setHasMoreChats] = useState(true)
    const [editingProfile, setEditingProfile] = useState(false)
    const [logoSource, setLogoSource] = useState(chatLogo);
    const { conn, chats, setChats, setActiveChat, activeChat } = useContext(ChatEngineContext)
    const chat = chats && chats[activeChat];

    const [chatsHeight, setChatsHeight] = useState("440px")

    const name = props.chatAppState.userName
    const secret = props.chatAppState.userSecret

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
    function getDateTime(date, offset) {
        if (!date) return ''

        date = date.replace(' ', 'T')
        offset = offset ? offset : 0

        const year = date.substr(0, 4)
        const month = date.substr(5, 2)
        const day = date.substr(8, 2)
        const hour = date.substr(11, 2)
        const minute = date.substr(14, 2)
        const second = date.substr(17, 2)

        var d = new Date(`${year}-${month}-${day}T${hour}:${minute}:${second}`)
        d.setHours(d.getHours() + offset)
        return d
    }

    function renderChats(chats) {
        return chats.map((chat, index) => {
            if (!chat) {
                return <div key={`chat_${index}`} />

            } else if (props.chatAppState.renderChatCard) {
                return <div key={`chat_${index}`}>{props.chatAppState.renderChatCard(chat, index)}</div>

            } else {
                return (""
                )
            }
        })
    }

    function sortChats(chats) {
        return chats.sort((a, b) => {
            const aDate = a.last_message && a.last_message.created ? getDateTime(a.last_message.created, props.chatAppState.offset) : getDateTime(a.created, props.chatAppState.offset)
            const bDate = b.last_message && b.last_message.created ? getDateTime(b.last_message.created, props.chatAppState.offset) : getDateTime(b.created, props.chatAppState.offset)
            return new Date(bDate) - new Date(aDate);
        })
    }

    function onGetChats(chatList) {
        const oldChats = chats !== null ? chats : {}
        const newChats = _.mapKeys({ ...chatList }, 'id')
        const allChats = { ...oldChats, ...newChats }
        setChats(allChats);
        (count && count > Object.keys(allChats).length) && setHasMoreChats(false);
    }

    useEffect(() => {
        if (!didMountRef.current) {
            didMountRef.current = true

            getLatestChats(
                props,
                count,
                (chats) => {
                    onGetChats(chats)
                    const chatList = sortChats(chats)
                    chatList.length > 0 && setActiveChat(chatList[0].id)
                }
            )
        }
    })


    useEffect(() => {
        if (!activeChat) {
            activeConversation()
        }
    }, [chats])



    const chatList = sortChats(
        chats ?
            Object.values(chats) :
            [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}]
    )
    function activeConversation() {
        if (chatList[0]) {
            setActiveChat(chatList[0].id)
        }

    }
    if (chats == null) return <div />;
    return (
        <div className="chat-left-wing">
            <div className="chat-bar">
                <div className="chat-bar-logo">
                    {(window.screen.availWidth > 700) ?
                        <img src={logoSource} alt="" /> :
                        <div className="mobile-toggler">
                        <CloseOutlined
                            onClick={() => {
                                document.querySelector(".chat-container").children[0].children[1].children[0].style.display = "none";
                                document.querySelector(".chat-container").children[0].children[1].children[1].style.display = "block";
                            }}
                        />
                        </div>
                    }

                </div>
                <div className="chat-bar-options">
                    <div className="chat-bar-option">
                        <UserOutlined
                            onClick={
                                () => {
                                    if (editingProfile && (window.screen.availWidth > 1150)) {
                                        console.log("11")
                                        setEditingProfile(!editingProfile)
                                        document.querySelector(".ce-chats-container").style.height = "530px"
                                    }
                                    else if (!editingProfile && (window.screen.availWidth > 1150)) {
                                        console.log("2221")
                                        setEditingProfile(!editingProfile)
                                        document.querySelector(".ce-chats-container").style.height = "425px"
                                    }
                                    else if (editingProfile && (window.screen.availWidth <= 1150)) {
                                        console.log("3331")
                                        setEditingProfile(!editingProfile)
                                        document.querySelector(".ce-chats-container").style.height = "calc(100vh - 76px)"
                                    } else {
                                        console.log("4441")
                                        setEditingProfile(!editingProfile)
                                        document.querySelector(".ce-chats-container").style.height = "calc(100vh - 166px)"
                                    }

                                }
                            }


                        />
                    </div>
                    <div className="chat-bar-option">
                        <BgColorsOutlined onClick={() => {
                            document.querySelector(".app").classList.toggle("light");
                            (logoSource == chatLogo) ? setLogoSource(chatLogoWhite) : setLogoSource(chatLogo)
                      
                        }} />
                    </div>
                    <div className="chat-bar-option">
                        <DeleteOutlined onClick={() => {
                            if (window.confirm("Press OK if you want to delete active chat. Conversation with this person will be lost")) {
                                deleteActiveChat(activeChat)

                            }



                        }} />
                    </div>
                    <div className="chat-bar-option"> <LogoutOutlined onClick={() => {
                        if (window.confirm("Press OK if you want to logout")) {
                            fb.auth.signOut().then(console.log("logged out"))
                            document.querySelector(".app").classList.toggle("light");

                        }



                    }} /></div>

                </div>

            </div>
            <div className="chat-left-wing-list">
                {editingProfile ?
                    <ChatProfile
                        chat={chat}
                        conn={conn}
                        name={props.chatAppState.userName}
                        secret={props.chatAppState.userSecret}
                    /> : ""}
                <div style={styles.chatListContainer} className='ce-chat-list'>
                    {
                        props.chatAppState.renderNewChatForm ?
                            props.chatAppState.renderNewChatForm(conn) :
                            <NewChatForm onClose={props.chatAppState.onClose ? () => props.chatAppState.onClose() : undefined} />
                    }
                    <div style={styles.chatsContainer} className='ce-chats-container'>


                        {renderChats(chatList)}


                        {
                            hasMoreChats && chatList.length > 0 &&
                            <div>
                                <ChatLoader onVisible={() => setLoadChats(true)} />
                                <div style={{ height: '8px' }} />
                            </div>
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}

const styles = {
    chatListContainer: {
        maxHeight: '100vh',
        overflow: 'scroll',
        overflowX: 'hidden',
        backgroundColor: 'white',
        fontFamily: 'Avenir'
    },
    chatsContainer: {
        width: '100%',
        borderRadius: '0px 0px 24px 24px'

    },
}

export default ChatList;