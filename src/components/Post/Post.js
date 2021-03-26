import PostHeader from "./PostHeader/PostHeader";
import PostImage from "./PostImage/PostImage";
import PostContent from "./PostContent/PostContent";
import PostCommentsSection from "./PostCommentsSection/PostCommentsSection";
import PostAddComment from "./PostAddComment/PostAddComment";
import {useContext, useEffect, useState} from "react";
import {db} from "../../firebase";
import AppCtx from "../../context/AppCtx";

const Post = ({post, postID}) => {
    const [comments, setComments] = useState([]);
    const currentUser = useContext(AppCtx);

    useEffect(() => {
       if (postID) {
           db.collection('posts')
               .doc(postID)
               .collection('comments')
               .orderBy('timestamp', 'asc')
               .onSnapshot((snapshot => {
                   setComments(snapshot.docs.map(doc => ({
                       id: doc.id,
                       comment: doc.data()
                   })));
               }));
       }

    }, [postID]);
    return (
        <section className="post-container">
            <PostHeader postedBy={post.username} profilePic={post.profilePic}/>

            <PostImage imageURL={post.imageURL}/>

            <PostContent postedBy={post.username} caption={post.caption}/>

            <PostCommentsSection comments={comments} />

            {
                currentUser && (<PostAddComment username={currentUser.displayName} postID={postID} />)
            }

            <style jsx>{`
              .post-container {
                background: white;
                max-width: 600px;
                margin: 0 auto 40px auto;
                border: 1px solid lightgrey;
                box-shadow: 0 0 5px 0.5px #0000003b;
              }
            `}
            </style>
        </section>
    );
}

export default Post;