const initFirebase = () => {
    const firebaseConfig = {
        apiKey: "AIzaSyAOaVAVNZF8JytUhH-WrtIaU_-7-pkhhd0",
        authDomain: "smart-home-abcaf.firebaseapp.com",
        databaseURL: "https://smart-home-abcaf-default-rtdb.europe-west1.firebasedatabase.app",
        projectId: "smart-home-abcaf",
        storageBucket: "smart-home-abcaf.appspot.com",
        messagingSenderId: "974110486855",
        appId: "1:974110486855:web:38ccd7871d0b341f4e9c62",
        measurementId: "G-J40DXKXQXD"
    };
    
    firebase.initializeApp(firebaseConfig);
}

`const redirectToRoute = (route) => {
    window.location.href = route;
}`

const setLocalStorageItem = (key, data) => {
    window.localStorage.setItem(key, data);
} 

const getLocalStorageItem = (key) => {
    return window.localStorage.getItem(key);
}

const removeLocalStorageItem = (key) => {
    window.localStorage.removeItem(key);
}

const getUserLocalTime = () => {
    const now = new Date();
    const time = now.getHours();

    return time;
}