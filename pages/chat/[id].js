import React, { useEffect, useRef } from "react";
import styled from "styled-components";
import Head from "next/head";
import Sidebar from "../../components/Sidebar";
import ChatScreen from "../../components/ChatScreen";
import {
  doc,
  collection,
  query,
  orderBy,
  getDocs,
  getDoc,
} from "firebase/firestore";
import { auth, db } from "../../firebase";
import getRecipientEmail from "../../utils/getRecipientEmail";
import { useAuthState } from "react-firebase-hooks/auth";

export default function Chat({ chat, messages }) {
  const [user] = useAuthState(auth);
  const recipient = getRecipientEmail(chat.users, user);

  return (
    <Container>
      <Head>
        <title>Chat with {recipient}!</title>
      </Head>
      <Sidebar />
      <ChatContainer>
        <ChatScreen chat={chat} messages={messages} />
      </ChatContainer>
    </Container>
  );
}

export async function getServerSideProps(context) {
  const chatRef = doc(db, `chats/${context.query.id}`);
  const snapRef = collection(db, `chats/${context.query.id}/messages`);
  const messageData = query(snapRef, orderBy("timestamp", "asc"));
  const messageRes = await getDocs(messageData);
  const messages = messageRes.docs
    .map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }))
    .map((messages) => ({
      ...messages,
      timestamp: messages.timestamp.toDate().getTime(),
    }));

  const chatRes = await getDoc(chatRef);

  const chat = {
    id: chatRes.id,
    ...chatRes.data(),
  };

  return {
    props: {
      messages: JSON.stringify(messages),
      chat: chat,
    },
  };
}

const Container = styled.div`
  display: flex;
`;

const ChatContainer = styled.div`
  flex: 1;
  overflow: scroll;
  height: 100vh;

  ::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;
  scrollbar-width: none;
`;
