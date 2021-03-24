import './App.css';
import Header from "./components/Header/Header";
import Newsfeed from "./components/NewsFeed/NewsFeed";
import {useEffect, useState} from "react";
import {db} from "./firebase";
import SignUpModal from "./components/Modals/SignUpModal/SignUpModal";

function App() {
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        db.collection('posts').onSnapshot(snapshot => {
            setPosts(snapshot.docs.map(doc => ({
                id: doc.id,
                post: doc.data()
            })));
        })
    }, [])

    return (
        <div className="app-wrapper">

            <SignUpModal />

            <Header/>

            <Newsfeed posts={posts}/>

        </div>
    );
}

export default App;
