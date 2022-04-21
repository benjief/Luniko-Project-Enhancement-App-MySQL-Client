import Axios from "axios";
import { initializeApp } from "firebase/app";
import {
    GoogleAuthProvider,
    getAuth,
    signInWithPopup,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    sendPasswordResetEmail,
    deleteUser,
    signOut,
} from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyAQPWZwAjHAaT-9cSvGpyYexkiZ0NSPP70",
    authDomain: "luniko-enhancement-mysql.firebaseapp.com",
    projectId: "luniko-enhancement-mysql",
    storageBucket: "luniko-enhancement-mysql.appspot.com",
    messagingSenderId: "597214047017",
    appId: "1:597214047017:web:4c445b1f855b3b53c4a538",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const getPersonnelWithUID = async (personnelList, uid) => {
    try {
        await Axios.get(`https://luniko-pe.herokuapp.com/get-personnel-with-id/${uid}`, {
        }).then((response) => {
            personnelList.push(response.data);
        });
    } catch (err) {
        throw new Error("personnelError");
    }
}

const writePersonnelToDB = async (uid, firstName, lastName, email) => {
    // Add the new user to the MySQL DB
    try {
        await Axios.post("https://luniko-pe.herokuapp.com/create-personnel", {
            uid: uid,
            firstName: firstName,
            lastName: lastName,
            email: email
        });
    } catch (err) {
        throw new Error("personnelError");
    }
};

// Google authentication
const googleProvider = new GoogleAuthProvider();
const loginWithGoogle = async () => {
    // try {
    const res = await signInWithPopup(auth, googleProvider);
    const user = res.user;

    // let uidList = [];
    // uidList = await getUIDs(user).then(() => {
    //     console.log(uidList);
    // })

    let personnelList = [];
    await getPersonnelWithUID(personnelList, user.uid)
        .then(async () => {
            if (personnelList[0].length === 0) {
                await writePersonnelToDB(user.uid, user.displayName.split(" ")[0],
                    user.displayName.split(" ").slice(1), user.email).then(() => {
                    });
            }
        });


    // const q = query(collection(db, "users"), where("uid", "==", user.uid));
    // const docs = await getDocs(q);

    // await addDoc(collection(db, "users"), {
    //     uid: user.uid,
    //     name: user.displayName,
    //     authProvider: "google",
    //     email: user.email,
    // });

    // } catch (err) {
    //     console.log("Mees");
    // console.error(err);
    //     console.log(err.message);
    //     alert(err.message);
    // }
};

// Standard Authentication
const loginWithEmailAndPassword = async (email, password) => {
    // try {
    await signInWithEmailAndPassword(auth, email, password);
    // } catch (err) {
    //     console.error(err);
    //     alert(err.message);
    // }
};

// Register with email and password
const registerWithEmailAndPassword = async (firstName, lastName, email, password) => {
    // try {

    const res = await createUserWithEmailAndPassword(auth, email, password);
    const user = res.user;

    // Add the new user to the MySQL DB
    await writePersonnelToDB(user.uid, firstName, lastName, email = user.email).then(() => {
        console.log("Personnel written to DB!")
    });

    //   await addDoc(collection(db, "users"), {
    //     uid: user.uid,
    //     name,
    //     authProvider: "local",
    //     email,
    //   });
    // } catch (err) {
    // console.error(err);
    // throw err;
    // alert(err.message);
    // } 
};

// Send a password reset link to an email address
const sendPasswordReset = async (email) => {
    try {
        await sendPasswordResetEmail(auth, email);
        // alert("Password reset link sent!");
    } catch (err) {
        console.error(err);
        // alert(err.message);
    }
};

// Logout
const logout = (delay = 0) => {
    setTimeout(() => {
        signOut(auth);
    }, delay);
};

export {
    auth,
    loginWithGoogle,
    loginWithEmailAndPassword,
    registerWithEmailAndPassword,
    sendPasswordReset,
    logout,
    deleteUser
};