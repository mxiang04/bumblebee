import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Avatar } from "@mui/material";
import getRecipientEmail from "../utils/getRecipientEmail";
import { auth, db } from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { collection, where, query, getDocs } from "firebase/firestore";
import { useRouter } from "next/router";

export default function Chat({ id, users }) {
  const [user] = useAuthState(auth);
  const recipientEmail = getRecipientEmail(users, user);
  const [recs, setRecs] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const getRecs = async function () {
      const docRef = query(
        collection(db, "users"),
        where("email", "==", recipientEmail)
      );
      const rec = await getDocs(docRef);
      const recipient = rec?.docs?.[0]?.data();
      setRecs(recipient);
    };
    getRecs();
  }, []);

  const enterChat = function () {
    router.push(`/chat/${id}`);
  };

  return (
    <Container onClick={enterChat}>
      {recs ? (
        <UserAvatar src={recs?.photoURL} referrerPolicy="no-referrer" />
      ) : (
        <UserAvatar>{recipientEmail[0]}</UserAvatar>
      )}
      <p>{recipientEmail}</p>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 15px;
  word-break: break-word;

  :hover {
    background-color: #e9eaeb;
  }
`;

const UserAvatar = styled(Avatar)`
  margin: 5px;
  margin-right: 15px;
`;
