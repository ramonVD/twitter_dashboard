import {useEffect} from "react"
import Router from "next/router"

/*This probably wont work like that*/
export function useAuthSession() {
    const { data: user } =  fetch("api/authenticate").then(res => res).then(data => data);
    useEffect(() => {
      if (!user) Router.push("/users/login");
    }, [user]);
    return user;
  }
  