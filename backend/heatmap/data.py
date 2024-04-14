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
import math



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

def lat_lon_adjust(df, latmin=0, lonmin=0):
  # lat_min and lon_min need to be coordinates from the field parameters
  for index, row in df.iterrows():
    lat, lon, _zn, _zl = utm.from_latlon(df.at[index, 'Latitude'],df.at[index, 'Longitude'])
    df.at[index, 'Latitude']=lat
    df.at[index, 'Longitude']=lon
  latmin, lonmin, _zn, _zl = utm.from_latlon(latmin, lonmin)

  for index, row in df.iterrows():
    df.at[index, 'Latitude'] =  df.at[index, 'Latitude']-latmin
    df.at[index, 'Longitude'] = df.at[index, 'Longitude']-lonmin

  return df

def degrees_to_radians(degrees):
    return degrees * math.pi / 180

def rotate_cartesian(x, y, angle_degrees):
    # Convert angle from degrees to radians
    angle_radians = math.radians(angle_degrees)

    # Perform rotation
    x_rotated = x * math.cos(angle_radians) - y * math.sin(angle_radians)
    y_rotated = x * math.sin(angle_radians) + y * math.cos(angle_radians)

    return x_rotated, y_rotated

def rotate_df(df, angle):
  for index, row in df.iterrows():
    xr,yr=rotate_cartesian( df.at[index, 'Longitude'],df.at[index, 'Latitude'], -angle)
    df.at[index, 'Latitude'] =  xr
    df.at[index, 'Longitude'] = yr
  return df

def distance(lat1, lon1, lat2, lon2):
    """
    Calculate the great circle distance between two points
    on the Earth's surface using the Haversine formula.

    Parameters:
        lat1 (float): Latitude of the first point in degrees.
        lon1 (float): Longitude of the first point in degrees.
        lat2 (float): Latitude of the second point in degrees.
        lon2 (float): Longitude of the second point in degrees.

    Returns:
        float: The distance between the two points in kilometers.
    """
    # Convert latitude and longitude from degrees to radians
    lat1_rad = math.radians(lat1)
    lon1_rad = math.radians(lon1)
    lat2_rad = math.radians(lat2)
    lon2_rad = math.radians(lon2)

    # Haversine formula
    dlon = lon2_rad - lon1_rad
    dlat = lat2_rad - lat1_rad
    a = math.sin(dlat/2)**2 + math.cos(lat1_rad) * math.cos(lat2_rad) * math.sin(dlon/2)**2
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1-a))
    earth_radius_km = 6371000  # Radius of the Earth in kilometers
    distance = earth_radius_km * c

    return distance

def calculate_azimuth(lat1, lon1, lat2, lon2):
  # https://www.omnicalculator.com/other/azimuth
  lat1 = math.radians(lat1)
  lon1 = math.radians(lon1)
  lat2 = math.radians(lat2)
  lon2 = math.radians(lon2)
  delta_lat = lat2 - lat1
  delta_lon = lon2 - lon1
  atan_part1 = math.sin(delta_lon) * math.cos(lat2)
  atan_part2a = math.cos(lat1) * math.sin(lat2)
  atan_part2b = math.sin(lat1) * math.cos(lat2) * math.cos(delta_lon)
  azimuth = math.atan2(atan_part1, atan_part2a - atan_part2b)
  degrees = math.degrees(azimuth)
  if degrees < 0:
    degrees += 360
  return degrees

def side_selector(field):
  """
  Finds the index (field corner) containing the minimum longitude, aka "target"
  Compares length of each side connected to that corner
  Returns indexes of the target and index of the corner that it shares the shorter side with
  """
  min = 999
  min_index = -1
  for index, row in field.iterrows():
    if row.Longitude < min:
      min = row.Longitude
      min_index = index
  prev_index = min_index - 1 if min_index - 1 >= 0 else 3
  next_index = min_index + 1 if min_index + 1 <= 3 else 0
  distance_to_prev = distance(field.at[min_index, 'Latitude'], field.at[min_index, 'Longitude'], field.at[prev_index, 'Latitude'], field.at[prev_index, 'Longitude'])
  distance_to_next = distance(field.at[min_index, 'Latitude'], field.at[min_index, 'Longitude'], field.at[next_index, 'Latitude'], field.at[next_index, 'Longitude'])
  if min_index == -1:
    # some sort of error, I don't know
    return min_index, min_index
  if (distance_to_prev > distance_to_next):
    return min_index, next_index
  else:
    return min_index, prev_index

def drop_outside_bounds(gpx, field):
  # Drops gpx coordinates above max or below min (0)
  gpx.drop(gpx[(gpx.Longitude > field.Longitude.max()) | (gpx.Longitude < 0)].index, inplace=True)
  gpx.drop(gpx[(gpx.Latitude > field.Latitude.max()) | (gpx.Latitude < 0)].index, inplace=True)

def scale_gpx(gpx, field):
  """
  Scales gpx coordinates according to ratio of regular field size to given field
  regular field size: 105 x 68 meters
  """
  lon_scale = 105 / field.Longitude.max()
  lat_scale = 68 / field.Latitude.max()
  for index, row in gpx.iterrows():
    gpx.at[index, 'Latitude'] = gpx.at[index,'Latitude'] * lat_scale
    gpx.at[index, 'Longitude'] = gpx.at[index,'Longitude'] * lon_scale

def align_to_positive(gpx, field, origin_index):
  """
  Makes field and gpx points positive if values are negative
  """
  prev_index = origin_index - 1 if origin_index - 1 >= 0 else 3
  next_index = origin_index + 1 if origin_index + 1 <= 3 else 0
  # lat
  origin_lat = field.at[origin_index, 'Latitude']
  prev_lat = field.at[prev_index, 'Latitude']
  next_lat = field.at[next_index, 'Latitude']
  prev_length = prev_lat - origin_lat
  next_length = next_lat - origin_lat
  flip = False
  if (abs(prev_length) > abs(next_length)):
    if prev_length < 0: flip = True
  else:
    if next_length < 0: flip = True
  if flip:
    for index, row in gpx.iterrows():
      gpx.at[index, 'Latitude'] = gpx.at[index,'Latitude'] * -1
    for index, row in field.iterrows():
      field.at[index, 'Latitude'] = field.at[index, 'Latitude'] * -1
  # lon
  origin_lon = field.at[origin_index, 'Longitude']
  prev_lon = field.at[prev_index, 'Longitude']
  next_lon = field.at[next_index, 'Longitude']
  prev_length = prev_lon - origin_lon
  next_length = next_lon - origin_lon
  flip = False
  if (abs(prev_length) > abs(next_length)):
    if prev_length < 0: flip = True
  else:
    if next_length < 0: flip = True
  if flip:
    for index, row in gpx.iterrows():
      gpx.at[index, 'Longitude'] = gpx.at[index,'Longitude'] * -1
    for index, row in field.iterrows():
      field.at[index, 'Longitude'] = field.at[index, 'Longitude'] * -1

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
