class Administrator(object):
    def isLoggedIn(self, conn, userID=None):
        """
        -------------------------------------------------------
        Checks login status of a user
        Use: loggedIn = Administrator.isLoggedIn(conn, userID)
        -------------------------------------------------------
        Parameters:
            conn - a database connection (Connect)
            userId - a user ID number (int)
        Returns:
            loggedIn - the login status of the user (boolean)
        -------------------------------------------------------
        """
        loggedIn = None
        if userID is not None:
            sql = "SELECT loginStatus FROM administrator WHERE userID = %s AND itemCode = %s ORDER BY searchedDate DESC"
            conn.cursor.execute(sql, (userID,))
            loggedIn = conn.cursor.fetchall()[0] == 1
        return loggedIn
    
    
    def updateSettings(self, conn, userID=None, newEmail=None, newPassword=None, newName=None):
        """
        -------------------------------------------------------
        Updates a user's settings
        Use: Administrator.updateSettings(conn, userID, newName, newEmail, newPassword)
        -------------------------------------------------------
        Parameters:
            conn - a database connection (Connect)
            userId - a user ID number (int)
            newName - the name that the user's name should be changed to (string)
            newEmail - the email that the user's email should be changed to (string)
            newPassword - the password that the user's password should be changed to (string)    
        -------------------------------------------------------
        """
        if userID is not None:
            if newName is not None:
                if newEmail is not None:
                    if newPassword is not None:
                        sql = "UPDATE administrator SET name = %s, email = %s, password = %s WHERE userID = %s"
                        conn.cursor.execute(sql, (newName, newEmail, newPassword, userID,))
                    else:
                        sql = "UPDATE administrator SET name = %s, email = %s WHERE userID = %s"
                        conn.cursor.execute(sql, (newName, newEmail, userID,))
                else:
                    if newPassword is not None:
                        sql = "UPDATE administrator SET name = %s, password = %s WHERE userID = %s"
                        conn.cursor.execute(sql, (newName, newPassword, userID,))
                    else:
                        sql = "UPDATE administrator SET name = %s WHERE userID = %s"
                        conn.cursor.execute(sql, (newName, userID,))
            else:
                if newEmail is not None:
                    if newPassword is not None:
                        sql = "UPDATE administrator SET email = %s, password = %s WHERE userID = %s"
                        conn.cursor.execute(sql, (newEmail, newPassword, userID,))
                    else:
                        sql = "UPDATE administrator SET email = %s WHERE userID = %s"
                        conn.cursor.execute(sql, (newEmail, userID,))
                else:
                    if newPassword is not None:
                        sql = "UPDATE administrator SET password = %s WHERE userID = %s"
                        conn.cursor.execute(sql, (newPassword, userID,))
    
    
    def removeItemFromDB(self, conn, userID=None):
        """
        -------------------------------------------------------
        Removes a user from the database if they delete their account 
        Use: Administrator.removeItemFromDB(conn, userID)
        -------------------------------------------------------
        Parameters:
            conn - a database connection (Connect)
            userId - a user ID number (int)
        -------------------------------------------------------
        """
        if userID is not None:
            sql = "DELETE FROM administrator WHERE userID = %s"
            conn.cursor.execute(sql, (userID,))


    def addItemToDB(self, conn, email, password, name=None):
        """
        -------------------------------------------------------
        Adds a user to the database when they register their account
        Use: Administrator.addItemToDB(conn, name, email, password)
        -------------------------------------------------------
        Parameters:
            conn - a database connection (Connect)
            name - the user's name (string) 
            email - the user's email (string)
            password - the user's password (string)
        -------------------------------------------------------
        """
        if name is not None:
            sql = "INSERT INTO administrator (name, email, password) VALUES (%s, %s, %s)"
            conn.cursor.execute(sql, (name, email, password,))
        else:
            sql = "INSERT INTO administrator (email, password) VALUES (%s, %s)"
            conn.cursor.execute(sql, (email, password,))