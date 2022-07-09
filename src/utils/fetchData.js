// prettier-ignore
import { collection, deleteDoc, doc, getDoc, getDocs, orderBy, query, where } from "firebase/firestore";

// fetch all docs from firbase

const getAllFeeds = async (firestoreDb) => {
    const feeds = await getDocs(
        query(collection(firestoreDb, "videos"), orderBy("id", "desc"))
    );

    return feeds.docs.map((doc) => doc.data());
}

// CategoryWIse Feeds

const categoryFeeds = async (firestoreDb, categoryId) => {
    const feeds = await getDocs(
        query(
            collection(firestoreDb, "videos"),
            where("category", "==", categoryId),
            orderBy("id", "desc")
        )
    );

    return feeds.docs.map((doc) => doc.data());
}

//Get Recommended feeds

const recommendedFeed = async (firestoreDb, categoryId, videoId) => {
    const feeds = await getDocs(
        query(
            collection(firestoreDb, "videos"), 
            where("category", "==", categoryId),
            where("id", "!=", videoId),
            orderBy("id", "desc")
        )
    );

    return feeds.docs.map((doc) => doc.data());
}

// user uploaded videos

const userUploadedVideos = async (firestoreDb, userId) => {
    const feeds = await getDocs(
        query(
            collection(firestoreDb, "videos"),
            where("userId", "==", userId),
            orderBy("id", "desc")
        )
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

const deleteVideo = async (firestoreDb, videoId) => {
    await deleteDoc(doc(firestoreDb, "videos", videoId))
}

export {getAllFeeds, categoryFeeds, recommendedFeed, userUploadedVideos, getUserInfo, getSpecificVideo, deleteVideo}