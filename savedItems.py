

#This module will run the 'saved item' portion of PriceAid
#Daniel Austin, Summer of 2020

import os
import mysql.connector

#Connect to database
print("Connecting...")
connection = mysql.connector.connect(host='localhost',
                                         database='saveditems',
                                         user='root',
                                         password='')
cursor = connection.cursor()
print("Connected")


def addNewItem(item, url, price): 
    #Adds a saved item
    sql = 'INSERT INTO saved_table (Name, URL, Price) VALUES (%s, %s, %s)'
    val = (item, url, price)
    try:
        cursor.execute(sql, val)
    except mysql.connector.errors.IntegrityError:
        return "Item already saved"
    connection.commit()
    return "Item inserted"

def removeItem(item):
    #Removes a saved item
    cursor.execute("DELETE FROM saved_table WHERE Name = '{}'".format(item))
    count = cursor.rowcount
    if (count == 0):
        return "Item not in cart"
    connection.commit()
    return "Item deleted successfully"


def cleanCart():
    #Emptys all saved items
    cursor.execute("DELETE FROM saved_table")
    connection.commit()
    return "Saved items cleaned"

def displayData():
    #Displays all data in the saved items table, used for debugging.
    cursor.execute("SELECT * FROM saved_table")
    for x in cursor:
        print(x)
