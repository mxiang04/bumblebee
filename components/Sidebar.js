import React, { useEffect, useState } from "react";
import styled from "styled-components";
import MoreVertSharpIcon from "@mui/icons-material/MoreVertSharp";
import ChatSharpIcon from "@mui/icons-material/ChatSharp";
import { Avatar, IconButton, Button } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import * as EmailValidator from "email-validator";
import { getAuth, signOut } from "firebase/auth";
import { auth, db } from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { collection, addDoc, query, where, getDocs } from "firebase/firestore";
import Chat from "./Chat";
import { useRouter } from "next/router";

export default function Sidebar() {
  const [chats, setChats] = useState([]);
  const [user] = useAuthState(auth);
  const router = useRouter();

  useEffect(() => {
    const getChats = async function () {
      const userChatRef = query(
        collection(db, "chats"),
        where("users", "array-contains", user.email)
      );
      const chatSnap = await getDocs(userChatRef);
      setChats(chatSnap);
    };
    getChats();
  }, []);

  const createChat = async function () {
    const input = prompt(
      "Please enter the email address for the user that you wish to chat with!"
    );
    if (!input) return null;

    if (EmailValidator.validate(input) && input !== user.email) {
      const doesChatExist = await chatAlreadyExists(input);
      if (!doesChatExist) {
        await addDoc(collection(db, "chats"), {
          users: [user.email, input],
        });
      }
    }
  };

  const chatAlreadyExists = async function (recipientEmail) {
    let doesExist = false;

    // seems inefficient since forEach doesn't allow us to break out the for loop when a hit is found. I tried using the array.some() function but that didn't work

    const userChatRef = query(
      collection(db, "chats"),
      where("users", "array-contains", user.email)
    );

    const chatSnap = await getDocs(userChatRef);
    setChats(chatSnap);
    chatSnap?.forEach((chat) => {
      const users = chat.data().users.find((user) => user === recipientEmail);
      if (users) {
        doesExist = true;
      }
    });
    return doesExist;
  };

  const logOut = function () {
    router.push("/");
    const auth = getAuth();
    signOut(auth)
      .then(() => {
        console.log("Signout successful.");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <Container>
      <Header>
        <UserAvatar
          src={user?.photoURL}
          onClick={logOut}
          referrerPolicy="no-referrer"
        />
        <IconsContainer>
          <IconButton>
            <MoreVertSharpIcon />
          </IconButton>
          <IconButton>
            <ChatSharpIcon />
          </IconButton>
        </IconsContainer>
      </Header>

      <Search>
        <SearchIcon />
        <SearchInput placeholder="Search for chats..." />
      </Search>

      <SidebarButton onClick={createChat}>Start a new chat!</SidebarButton>
      {chats?.docs?.map((chat) => (
        <Chat key={chat.id} id={chat.id} users={chat.data().users} />
      ))}
    </Container>
  );
}

const Container = styled.div`
  flex: 0.45;
  border-right: 1px solid whitesmoke;
  height: 100vh;
  min-width: 300px;
  max-width: 350px;
  overflow-y: scroll;

  ::-webkit-scrollbar {
    display: none;
  }

  -ms-overflow-style: none;
  scrollbar-width: none;
`;

const SidebarButton = styled(Button)`
  width: 100%;
  color: black;
  &&& {
    border-top: 1px solid whitesmoke;
    border-bottom: 1px solid whitesmoke;
  }
`;

const Search = styled.div`
  display: flex;
  align-items: center;
  padding: 20px;
  border-radius: 2px;
`;

const SearchInput = styled.input`
  outline-width: 0;
  border: none;
  flex: 1;
`;

const Header = styled.div`
  display: flex;
  position: sticky;
  top: 0;
  background-color: white;
  z-index: 1;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  height: 80px;
  border-bottom: 1px solid whitesmoke;
`;

const UserAvatar = styled(Avatar)`
  cursor: pointer;
  :hover {
    opacity: 0.8;
  }
`;

const IconsContainer = styled.div``;
