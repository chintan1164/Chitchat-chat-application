import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setMessages } from "../redux/messageSlice";

const useGetRealTimeMessage = () => {
    const { socket } = useSelector(store => store.socket);
    const { messages } = useSelector(store => store.message);
    const dispatch = useDispatch();
    useEffect(() => {
        const handleNewMessage = (newMessage) => {
            dispatch(setMessages([...messages, newMessage]));
        };

        const handleMessageDeleted = (messageId) => {
            dispatch(setMessages(messages.filter(message => message._id !== messageId)));
        };

        socket?.on("newMessage", handleNewMessage);
        socket?.on("messageDeleted", handleMessageDeleted);

        return () => {
            socket?.off("newMessage", handleNewMessage);
            socket?.off("messageDeleted", handleMessageDeleted);
        };
    }, [dispatch, messages, socket]);

    return null;
};
export default useGetRealTimeMessage;