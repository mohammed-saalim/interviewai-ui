import ConversationPage from "./ConversationsPage";
import InputForm from "./InputCom";
import Navbar from "./NavBar";

export default function ChatPage() {

    return (
        <div className="fade-in height px-8 flex flex-col justify-between">
           <Navbar />
           <ConversationPage />
           <InputForm />
        </div>
    )
}
