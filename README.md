

todo: 


mobilne
avatar mmój(?)
BLEDY



blokada usuwania na test
6. Testy(?)
1. Readme
7. Licencja GH
8. Lista dependencji
9. Video
- logowanie z fb


bugi:

- no leave chat call in api docs
- api docs - uploading avatar
- getOrCreateChat returns 404 if there's no header: "Content-Type", "application/json"
- conn object should include link to avatar, because if developer wants to show user avatar without any chats open, he has no chat object to find avatar in
- in direct conversations, when message read, there should be only avatar icon of another person, not user's too
- app should not allow sending empty messages
- there should be info that you need to type "npm i react-chat-engine --legacy-peer-deps" to install app
- gallery could use something like Lightbox
- There should  be more classnames in divs. I know you can copy CSS selector in browser, but some divs appear
dynamically and sometimes it's difficult to get them. Example is color of "user is typing" or message time when hover on message bubble


:root {
--micz: #272d3b;
--bg-color: #6E7489;
--app-bg-color: #252A38;
--own-msg-color: #726DFE;
--paperclip-color: #9a97fc;
--their-msg-color: #454D61; 
--scrollbar-color: #3A4052; 
--border-color: #454D61;
--gray-text: rgba(255, 255, 255, 0.568);
--add-chat-icon: rgba(197, 190, 190, 0.616);
--bg-input: #383d4e;
--title-font: Quicksand;
--title-color: rgba(255, 255, 255, 0.925);
--message-text-color: rgba(255, 255, 255, 0.877);
}