import React, { useContext, useRef, useState, useEffect } from 'react'

import { ChatEngineContext } from 'react-chat-engine'

const IsTyping = () => {
    const didMountRef = useRef(false)
    const [currentTime, setCurrentTime] = useState(Date.now())
    const { conn, activeChat, typingCounter } = useContext(ChatEngineContext)
    const typers = typingCounter && typingCounter[activeChat] ? typingCounter[activeChat] : []

    useEffect(() => {
        if (!didMountRef.current) {
            didMountRef.current = true
            setInterval(() => {
                setCurrentTime(Date.now())
            }, 1000) // Check time every second
        }
    })

    if (!conn || conn === null) return <div />

    return (
        <div>
            {
                Object.keys(typers).map((username, index) => {
                    if (conn.userName !== username && currentTime < typers[username] + 2000) {
                        return (
                            <div 
                                key={`typer_${index}`} 
                                style={{
                                     color: 'var(--paperclip-color)',
                                      paddingLeft: '10px', 
                                      position: 'relative'
                                      
                                     
                                     
                                     
                                     }}
                            >
                                {`${username} is typing...`}
                            </div>
                        )

                    } else {
                        return <div key={`typer_${index}`} />
                    }
                })
            }
        </div>
    )
}

export default IsTyping