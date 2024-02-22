# Import Libraries
import firebase_admin
from firebase_admin import credentials, firestore
#from sense_hat import SenseHat
import time 

# Create instance of SenseHat
#sense = SenseHa

# Get credentials from JSON 
cred = credentials.Certificate('./firebase-credentials.json')

# Initialize the app with given credentials
firebase_admin.initialize_app(cred)

# Create instance of Firestore
db = firestore.client()

# Define devices from DB
devices = ['lights', 'outlets', 'front-door', 'back-door']

def get_temperature(vlue,uniter):
    return{vlue,uniter}
    
def get_humidity(vlue,uniter):
    return{vlue,uniter}

# Update sensor data to DB
def update_sensors():
    sensors = {u'temperature': get_temperature(12,'C'), u'humidity': get_humidity(50,'H')}

    for sensor in sensors:
        try: 
            db.collection(u'sensors').document(sensor).update({
                u'value': round(sensors[sensor])
            })
        except:
            print(u'Could not retrieve and update sensor data..')

# Return color according to device type and status
def get_color_by_device(device, status):
    if device == 'lights':
        on = (255, 255, 0)
        off = (55, 55, 0)

        if status:
            return on
        else:
            return off
    
    elif device == 'outlets':
        on = (0, 255, 255)
        off = (0, 0, 55)
        
        if status:
            return on
        else:
            return off

    else: 
        on = (0, 255, 0)
        off = (255, 0, 0)
        
        if status:
            return on
        else:
            return off

# Populate pixels on LED matrix
def populate_pixels(arr, color = [0, 0, 0]):
    for pos in arr:
        sense.set_pixel(pos[0], pos[1], color)

# Update Lights LED matrix 
def update_lights_matrix(doc):
    lightsPos = [(2, 0), (5, 0), (2, 4), (5, 4)]
    populate_pixels(lightsPos, get_color_by_device('lights', doc['isActive']))

# Update Outlets LED matrix 
def update_outlets_matrix(doc):
    outletsPos = [(0, 3), (7, 3), (3, 7), (4, 7)]
    populate_pixels(outletsPos, get_color_by_device('outlets', doc['isActive']))

# Update Doors LED matrix 
def update_doors_matrix(doc):
    fDoorPos = [(0, 5), (0, 6), (0, 7)]
    bDoorPos = [(7, 5), (7, 6), (7, 7)]
    populate_pixels(fDoorPos,  get_color_by_device('fDoor', doc['isActive']))   
    populate_pixels(bDoorPos,  get_color_by_device('bDoor', doc['isActive']))

# Data listener
def watch_device_data(device):
    doc = db.collection('devices').document(device).get().to_dict()
    
    if device == 'lights':
        update_lights_matrix(doc)
    elif device == 'outlets':
        update_outlets_matrix(doc)
    else:
        update_doors_matrix(doc)

while True:
    update_sensors()
    
    for device in devices:
        watch_device_data(device)        

    time.sleep(2)