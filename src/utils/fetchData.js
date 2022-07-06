// prettier-ignore
import { collection, doc, getDoc, getDocs, orderBy, query } from "firebase/firestore";

// fetch all docs from firbase

const getAllFeeds = async (firestoreDb) => {
    const feeds = await getDocs(
        query(collection(firestoreDb, "videos"), orderBy("id", "desc"))
    );

    return feeds.docs.map((doc) => doc.data());
}

// fetch the user inforamtion user userId

const getUserInfo = async (firestoreDb, userId) => {
    const userRef = doc(firestoreDb, "users", userId);

    const userSnap = await getDoc(userRef);
    if (userSnap.exists()) {
        return userSnap.data();
    } else {
        return "No Such Document";
    }
}

// fetch the user information user userId

const getSpecificVideo = async (firestoreDb, videoId) => {
    const videoRef = doc(firestoreDb, "videos", videoId);

    const videoSpan = await getDoc(videoRef);
    if (videoSpan.exists()) {
        return videoSpan.data();
    } else {
        return "No Such Document";
    }
} 

export {getAllFeeds, getUserInfo, getSpecificVideo}