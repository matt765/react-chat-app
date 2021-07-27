import React, { useContext, useState } from 'react'

import { ChatEngineContext } from 'react-chat-engine'

import { sendMessage, isTyping } from 'react-chat-engine'
import sendIcon from "../../../../images/send.png";
import FileRow from './FileRow'
import ImagesInput from './ImagesInput'
import MessageInput from './MessageInput'

const NewMessageForm = () => {
  const { conn, activeChat, sendingMessages, setSendingMessages } = useContext(ChatEngineContext)
  const [state, setState] = useState({
    trigger: 0,
    mod: 3,
    value: '',
    attachments: []
  })

  if (!conn || conn === null) return <div />

  function onRemove(index) {
    let { attachments } = state
    attachments.splice(index, 1)
    setState({ ...state, attachments })
  }

  function handleChange(event) {
    setState({
      ...state,
      value: event.target.value,
      trigger: (state.trigger + 1) % state.mod
    });

    if (state.trigger === 1) {
      isTyping(conn, activeChat)
    }
  }

  function handleSubmit(event) {
    event.preventDefault();

    const { attachments } = state
    const text = state.value.trim()
    const custom_json = { sender_id: Date.now().toString() }
    const sender_username = conn.userName ? conn.userName : conn.senderUsername
    const data = { text, attachments, custom_json, sender_username, chat: activeChat }

    if (text.length > 0 || attachments.length > 0) {
      sendMessage(conn, activeChat, data, (data) => { })
    }

    setState({ ...state, value: '', attachments: [] })

    // TODO: Should be in Text Area Input
    var textarea = document.getElementById("msg-textarea")
    textarea.style.height = "24px"

    let newSendingMessages = { ...sendingMessages }
    newSendingMessages[data.custom_json.sender_id] = data
    setSendingMessages(newSendingMessages)
  }

  return (
    <div
      id='msg-form-container'
      style={styles.NewMessageFormContainer}
      className='ce-message-form-container'
    >
      <FileRow files={state.attachments} onRemove={(i) => onRemove(i)} />



      <form  onSubmit={
      
              (e) => {
                e.preventDefault();
                if (conn.userName === "john%20doe") {
                  alert("Sending messages is disabled on sample account, sorry!");
                  return
                }
                else {
                 
                  handleSubmit.bind(this)
                }
              }


            } className='ce-message-form'>
        <div style={styles.inputContainer} className='ce-message-input-form'>
          <ImagesInput onSelectFiles={(attachments) => setState({ ...state, attachments })} />
          <MessageInput
            value={state.value}
            label='Send a message...'
            handleChange={handleChange.bind(this)}
            onSubmit={
              () => {
                if (conn.userName === "john%20doe") {
                  alert("Sending messages is disabled on sample account, sorry!");
                  return
                }
                else {
                 
                  handleSubmit.bind(this)
                }
              }


            }
          />


        </div>
        <button
          icon='send'
          type="submit"
          id='ce-send-message-button'
          style={{}}
        >
          <img src={sendIcon} className="send-icon" alt="" />
        </button>
      </form>
    </div>
  );
}

export default NewMessageForm

const styles = {
  NewMessageFormContainer: {
    position: 'absolute',
    bottom: '0px',
    width: '100%',
    backgroundColor: 'white',
  },
  inputContainer: {
    minHeight: '36px',
    paddingTop: '10px',
    paddingBottom: '6px',
  },
}