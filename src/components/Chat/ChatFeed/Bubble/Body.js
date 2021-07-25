import React from 'react'

const Body = props => {
    let text = props.text ? props.text : ''
    text = text.replaceAll("<p>", "<div>").replaceAll("</p>", "</div>")
    text = text.replaceAll("<a ", `<a style="color: ${ props.myMessage ? 'white' : '#1890ff' };" `)

    // Will make some array loop here soon
    text = text.replaceAll(/fuck/ig, "****")
    text = text.replaceAll(/nigger/ig, "****")
    text = text.replaceAll(/nigga/ig, "****")
    text = text.replaceAll(/niga/ig, "****")
    text = text.replaceAll(/trump/ig, "****")
    text = text.replaceAll(/butthole/ig, "****")
    text = text.replaceAll(/asshole/ig, "****")
    text = text.replaceAll(/cock/ig, "****")
    text = text.replaceAll(/trump/ig, "****")
    text = text.replaceAll(/shit/ig, "****")
    text = text.replaceAll(/pee/ig, "****")
    text = text.replaceAll(/kill/ig, "****")
    text = text.replaceAll(/epstein/ig, "****")
    text = text.replaceAll(/butt/ig, "****")
    text = text.replaceAll(/cum/ig, "****")
    text = text.replaceAll(/suck/ig, "****")
    text = text.replaceAll(/pussy/ig, "****")
    text = text.replaceAll(/vagina/ig, "****")
    text = text.replaceAll(/dick/ig, "****")
    text = text.replaceAll(/ass/ig, "****")
    text = text.replaceAll(/anus/ig, "****")
    text = text.replaceAll(/boobs/ig, "****")
    text = text.replaceAll(/ass/ig, "****")
    text = text.replaceAll(/slut/ig, "****")
    text = text.replaceAll(/suck/ig, "****")
    text = text.replaceAll(/bitch/ig, "****")
    text = text.replaceAll(/penis/ig, "****")
    text = text.replaceAll(/hanime/ig, "****")
    text = text.replaceAll(/cunt/ig, "****")
    text = text.replaceAll(/dump/ig, "****")

    return (
        <div className='ce_message' dangerouslySetInnerHTML={{ __html: text }} />
    ) 
}

export default Body