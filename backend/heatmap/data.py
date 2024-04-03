"""
First need to install the 'gpxpy' library in the command line/terminal, using the command:
pip install gpxpy

or if you are using python3.xx (you can find out by typing "python --version" in the command line), use the command:
pip3 install gpxpy
"""


import utm as utm
import os
import django
import gpxpy
import gpxpy.gpx
import xml.etree.ElementTree as ET
import pandas as pd



def parse_gpx(gpxFile):
    gpx = gpxpy.parse(gpxFile)
    data_points = []
    total_distance = None
    average_speed = None

    for track in gpx.tracks:
        for segment in track.segments:
            for point in segment.points:
                data_dictionary = {
                    'SessionDate': point.time.strftime('%Y-%m-%d'),
                    'Timestamp': point.time.strftime('%H:%M:%S'),
                    'Latitude': point.latitude,
                    'Longitude': point.longitude
                }
                extension_data = parse_extensions(point.extensions)
                for key, value in extension_data.items():
                    data_dictionary[key] = value
                data_points.append(data_dictionary)

    # Parse the exercise info directly using ElementTree to avoid namespace issues
    root = ET.fromstring(gpxFile)
    ns = {'ns': 'http://www.topografix.com/GPX/1/1'}
    exerciseInfo = root.find('.//ns:exerciseinfo', namespaces=ns)
    if exerciseInfo is not None:
        distance_elem = exerciseInfo.find('.//ns:distance', namespaces=ns)
        avgspeed_elem = exerciseInfo.find('.//ns:avgspeed', namespaces=ns)
        if distance_elem is not None:
            total_distance = float(distance_elem.text)
        if avgspeed_elem is not None:
            average_speed = float(avgspeed_elem.text)

    df = pd.DataFrame(data_points)

    # return data_points, average_speed, total_distance, df
    return df


def parse_extensions(extensions):
    extension_dictionary = {}
    if len(extensions) == 0:
        return extension_dictionary
    for node in extensions[0].iter():
        # If use of gpx track point extensions increases, add here
        if 'hr' in node.tag:
            extension_dictionary['Heart Rate'] = node.text
    return extension_dictionary

"""
This function parses a .GPX file to extract the relevant data points: 
SessionDate (yyyy-mm-dd), Timestamp (hh-mm-ss), Latitude, and Longitude

:param gpx_file_path: Path to the GPX file to be parsed.
:return: A list of dictionaries, each containing the extracted information for each point.
"""

"""
def parse_gpx_data(gpxFile):
    with open(gpxFile, 'r') as gpx_file:
        gpx_data = gpx_file.read()
        gpx = gpxpy.parse(gpx_data)

    data_points = []
    total_distance = None
    average_speed = None

    for track in gpx.tracks:
        for segment in track.segments:
            for point in segment.points:
                data_dictionary = {
                    'SessionDate': point.time.strftime('%Y-%m-%d'),
                    'Timestamp': point.time.strftime('%H:%M:%S'),
                    'Latitude': point.latitude,
                    'Longitude': point.longitude
                }
                extension_data = parseExtensions(point.extensions)
                for key, value in extension_data.items():
                    data_dictionary[key] = value
                data_points.append(data_dictionary)

    # Parse the exercise info directly using ElementTree to avoid namespace issues
    root = ET.fromstring(gpx_data)
    ns = {'ns': 'http://www.topografix.com/GPX/1/1'}
    exerciseInfo = root.find('.//ns:exerciseinfo', namespaces=ns)
    if exerciseInfo is not None:
        distance_elem = exerciseInfo.find('.//ns:distance', namespaces=ns)
        avgspeed_elem = exerciseInfo.find('.//ns:avgspeed', namespaces=ns)
        if distance_elem is not None:
            total_distance = float(distance_elem.text)
        if avgspeed_elem is not None:
            average_speed = float(avgspeed_elem.text)

    df = pd.DataFrame(data_points)

    return data_points, average_speed, total_distance, df


def parseExtensions(extensions):
    extensionDictionary = {}
    if len(extensions) == 0:
        return extensionDictionary
    for node in extensions[0].iter():
        # If use of gpx track point extensions increases, add here
        if 'hr' in node.tag:
            extensionDictionary['Heart Rate'] = node.text
    return extensionDictionary


gpx_file_path = '../sample_data/data1.gpx'
dataPoints, averageSpeed, distance, df = parse_gpx_data(gpx_file_path)

##print(f"Data Points: {dataPoints}")
##print(f"Average Speed: {averageSpeed} m/s")  # Assuming the speed is in meters per second
##print(f"Distance: {distance} meters")  # Assuming the distance is in meters

print(df)

df1 = df
print(df1)

def lat_lon_adjust(df):


    for index, row in df.iterrows():



            lat, lon,zone,character = utm.from_latlon(df.at[index, 'Latitude'],df.at[index, 'Longitude'])
            df.at[index, 'Latitude']=lat
            df.at[index, 'Longitude']=lon

    latmin = df['Latitude'].min()


    lonmin = df['Longitude'].min()


    for index, row in df.iterrows():
        df.at[index, 'Latitude'] =  df.at[index, 'Latitude']-latmin
        df.at[index, 'Longitude'] = df.at[index, 'Longitude']-lonmin





    return df


lat_lon_adjust(df1)
print(df1)
# looping through the df and for each row, creating a new PlayerMovement instance with the data from that row
player_movements = [
    PlayerMovement(
        session_date=row['SessionDate'],
        timestamp=row['Timestamp'],
        latitude=row['Latitude'],
        longitude=row['Longitude'],
        heart_rate=row['Heart Rate'] if not pd.isna(row['Heart Rate']) else None
    )
    for index, row in df.iterrows()
]

# using Django's 'bulk_create' to insert data efficiently
with transaction.atomic():  # using a transaction to ensure data integrity
    PlayerMovement.objects.bulk_create(player_movements)


# # printing the database to make sure the data went thru
# movements = PlayerMovement.objects.all() # add '[:10]' at the end of this line to just see the first 10 entries
# print(movements)


"""
