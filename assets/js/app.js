// Init firebase
initFirebase();

// Global declarations
const db = firebase.firestore();
const deviceRef = db.collection('devices');
const sensorsRef = db.collection('sensors');
const devices = ['lights', 'outlets', 'front-door', 'back-door'];
const sensors = ['temperature', 'humidity'];

const init = () => {
    console.log('Initializing app..');
    feather.replace();
    renderGreeting();
    initDevices();
    initSensors();
}

const generateGrid = (count) => {
    const grid = document.querySelector('.grid');

    for(let rows = 0; rows < count; rows++) {
        for(let columns = 0; columns < count; columns++) {
            const cell = document.createElement('div');
            cell.className = "cell";
            grid.appendChild(cell);
        }
    }
}

const initSensors = () => {
    // Iterate through sensor array and update values
    sensors.forEach(sensor => {
        updateSensor(sensor);
    })
}

const updateSensor = (sensor) => {
    const sensorNode = document.querySelector(`#${sensor}`); 
    
    // Retrieve and set sensor data from Firestore
    sensorsRef.doc(sensor).get()
        .then(doc => {
            const { value, unit } = doc.data();
            sensorNode.innerHTML = `${value}${unit}`;
        })
}

const initDevices = () => {
    devices.forEach(device => {
        const elementNode = document.querySelector(`#${device}Toggle`);
        
        elementNode.addEventListener('click', (e) => {
            pushDeviceState(device);
        })

        updateDevice(device);
    })
}

const updateDevice = (device) => {
    deviceRef.doc(device).onSnapshot(doc => {
        const { isActive } = doc.data();

        updateDeviceClass(device, isActive);
        updateDeviceLabel(device, isActive);
    })
}

const updateDeviceLabel = (device, isActive) => {
    const labelNode = document.querySelector(`#${device}Toggle .device-card__status`);
    let status;  

    isActive ? status = 'ON' : status = 'OFF';
    
    labelNode.innerHTML = status;
}

const updateDeviceClass = (device, isActive) => {
    const elementNode = document.querySelector(`#${device}Toggle`);

    if(isActive) {
        elementNode.classList.add('active');
    } else {
        elementNode.classList.remove('active');
    }
}

const pushDeviceState = (device) => {
    let status;

    deviceRef.doc(device).get()
        .then(doc => {
            const { isActive } = doc.data();
            status = isActive;

            deviceRef.doc(device).update({
                isActive: !status
            })
        })
}

const renderGreeting = (name) => {
    const element = document.querySelector('.greeting');
    const currentTime = getUserLocalTime();
    let greeting;

    if (currentTime < 12) {
        greeting = `Goedemorgen ${name}`;
    } else if (currentTime >= 12 && currentTime <= 17) {
        greeting = `Goedemiddag ${name}`;
    } else {
        greeting = `Goedenavond ${name}`;
    }
    
    element.innerHTML = greeting;
}

const playAlarm = () => {
    const alarm = new Audio('./assets/audio/alarm.mp3');
    alarm.volume = 0.3;
    alarm.play();

    deviceRef.doc("lights").set({
        isActive: true
    })

    deviceRef.doc("front-door").set({
        isActive: true
    })

    deviceRef.doc("back-door").set({
        isActive: true
    })
}

/*
 Auth
*/
const onLogin = async () => { 
    const email = document.querySelector('#email');
    const password = document.querySelector('#password');

    await firebase.auth().signInWithEmailAndPassword(email.value, password.value)
        .then(res => {
            // Set Unique User ID in LocalStorage
            setLocalStorageItem('cKP3X3Qg1kWEzwLYPuQD4dntQTn2', res.user.uid);
            // Redirect to Home after succesful login
            redirectToRoute('/shome');
        })
        .catch(err => {
            console.log(err);
        });
}

const onLogOut = () => {
    removeLocalStorageItem('cKP3X3Qg1kWEzwLYPuQD4dntQTn2');
    redirectToRoute('/shome/login.html');
}


firebase.auth().onAuthStateChanged(user => {
    if(user) {
        renderGreeting(user.displayName);

        const token = getLocalStorageItem('cKP3X3Qg1kWEzwLYPuQD4dntQTn2');
        console.log(token);
        if(!token) {
            redirectToRoute('/shome/login.html')
        }
    } else {
        redirectToRoute('/shome/login.html')
    }
})
  
const loginBtn = document.querySelector('#loginBtn');
const logOutBtn = document.querySelector('#logOutBtn');
const alarmBtn = document.querySelector('#alarmBtn');

if(loginBtn) {
    console.log(loginBtn);
    loginBtn.addEventListener('click', onLogin);
}

if(logOutBtn) {
    logOutBtn.addEventListener('click', onLogOut);
}

if(alarmBtn) {
    alarmBtn.addEventListener('click', playAlarm);
}

/*video authentification */
var video = document.querySelector("#videoElement");

if (navigator.mediaDevices.getUserMedia) {
  navigator.mediaDevices.getUserMedia({ video: true })
    .then(function (stream) {
      video.srcObject = stream;
    })
    .catch(function (err0r) {
      console.log("Something went wrong!");
    });
}

init();
