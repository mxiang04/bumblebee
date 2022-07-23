import React, { useState, useEffect, useRef } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../firebase";
import { useRouter } from "next/router";
import styled from "styled-components";
import { Avatar, IconButton } from "@mui/material";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import InsertEmoticonIcon from "@mui/icons-material/InsertEmoticon";
import MicIcon from "@mui/icons-material/Mic";
import {
  doc,
  collection,
  query,
  orderBy,
  getDocs,
  setDoc,
  addDoc,
  where,
  limit,
} from "firebase/firestore";
import Message from "./Message";
import { serverTimestamp } from "firebase/firestore";
import getRecipientEmail from "../utils/getRecipientEmail";
import TimeAgo from "timeago-react";

export default function ChatScreen({ chat, messages }) {
  const [user] = useAuthState(auth);
  const [input, setInput] = useState("");
  const [recs, setRecs] = useState([]);
  const [snapshot, setSnapshot] = useState([]);
  const [mes, setMes] = useState([]);
  const router = useRouter();

  const recipientEmail = getRecipientEmail(chat.users, user);

  const endOfMessageRef = useRef(null);

  const scrollToBottom = function () {
    endOfMessageRef.current.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  useEffect(() => {
    scrollToBottom();
  });

  useEffect(() => {
    const getRecs = async function () {
      const usersRef = collection(db, "users");
      const docRef = query(usersRef, where("email", "==", recipientEmail));
      const rec = await getDocs(docRef);
      setSnapshot(rec);
      const recipient = rec?.docs?.[0]?.data();
      setRecs(recipient);
    };
    getRecs();
  }, [messages]);

  useEffect(() => {
    const showMessages = async function () {
      const messagesJSON = JSON.parse(messages);
      setMes(messagesJSON);
      return JSON.parse(messages).map((message) => (
        <Message key={message.id} user={message.user} message={message} />
      ));
    };
    showMessages();
  }, [messages]);

  const sendMessage = async function (e) {
    e.preventDefault();
    const userRef = doc(db, "users", user.uid);
    await setDoc(userRef, { lastSeen: serverTimestamp() }, { merge: true });

    const messageRef = collection(db, `chats/${router.query.id}/messages`);
    await addDoc(messageRef, {
      timestamp: serverTimestamp(),
      message: input,
      user: user.email,
      photoURL: user.photoURL,
    });

    const q = query(messageRef, orderBy("timestamp", "desc"), limit(1));
    const newMessage = await getDocs(q);
    const actualNewMessage = newMessage.docs[0].data();
    setMes((prevMessages) => [...prevMessages, actualNewMessage]);

    setInput("");
    scrollToBottom();
  };

  return (
    <Container>
      <Header>
        {recs ? (
          <UserAvatar src={recs?.photoURL} referrerPolicy="no-referrer" />
        ) : (
          <UserAvatar>{recipientEmail[0]}</UserAvatar>
        )}

        <HeaderInformation>
          <h3>{recipientEmail}</h3>
          {snapshot ? (
            <p>
              Last active:{" "}
              {recs ? (
                <TimeAgo datetime={recs?.lastSeen?.toDate()} />
              ) : (
                "Unavailable"
              )}
            </p>
          ) : (
            <p>Loading Last Active...</p>
          )}
        </HeaderInformation>
        <HeaderIcons>
          <IconButton>
            <AttachFileIcon />
          </IconButton>
          <IconButton>
            <MoreVertIcon />
          </IconButton>
        </HeaderIcons>
      </Header>

      <MessageContainer>
        {mes?.map((message) => (
          <Message key={message.id} user={message.user} message={message} />
        ))}
        <EndOfMessage ref={endOfMessageRef}></EndOfMessage>
      </MessageContainer>
      <InputContainer>
        <InsertEmoticonIcon />
        <Input value={input} onChange={(e) => setInput(e.target.value)} />
        <button hidden disabled={!input} type="submit" onClick={sendMessage}>
          Send Message
        </button>
        <MicIcon />
      </InputContainer>
    </Container>
  );
}

const Container = styled.div``;
const Header = styled.div`
  position: sticky;
  background-color: white;
  z-index: 100;
  top: 0;
  display: flex;
  padding: 11px;
  height: 80px;
  align-items: center;
  border-bottom: 1px solid whitesmoke;
`;

const HeaderInformation = styled.div`
  margin-left: 15px;
  flex: 1;

  > h3 {
    margin-bottom: 3px;
  }
  > p {
    font-size: 14px;
    color: gray;
  }
`;
const HeaderIcons = styled.div``;
const MessageContainer = styled.div`
  padding: 30px;
  background-color: #e5e5e5;
  min-height: 90vh;
`;
const EndOfMessage = styled.div`
  position: relative;
  top: -175px;
`;
const InputContainer = styled.form`
  display: flex;
  align-items: center;
  padding: 10px;
  position: sticky;
  bottom: 0;
  background-color: white;
  z-index: 100;
`;
const Input = styled.input`
  flex: 1;
  align-items: center;
  padding: 10px;
  position: sticky;
  bottom: 0;
  background-color: whitesmoke;
  padding: 20px;
  margin: 0 15px;
`;

const UserAvatar = styled(Avatar)``;
