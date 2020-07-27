
class Customer (object):
    # - is priv, + is public
    def __init__(self, name, email):
        self.__name = name  # private attribute 
        self.__email = email # private attribute

    def history(self, conn, itemCode=None, userID=None):
        """
        -------------------------------------------------------
        Checks history status of a user
        Use: history = Customer.history(conn, itemCode, userID)
        -------------------------------------------------------
        Parameters:
            conn - a database connection (Connect)
            itemCode - item's code (int)
            userId - a user ID number (int)
        Returns:
            history - the history status of the user (boolean)
        -------------------------------------------------------
        """
        history = None
        if userID is not None and itemCode is not None:
            sql = "SELECT itemName FROM history WHERE userID = %s AND itemCode = %s ORDER BY searchedDate DESC"
            conn.cursor.execute(sql, (userID, itemCode,))
            history = conn.cursor.fetchall()
        return history
    
    def updateHistory(self, conn, itemCode=None, userID=None):
        """
        -------------------------------------------------------
        Updates history of a user
        Use: updatedHistory = Customer.updateHistory(conn, itemCode, userID)
        -------------------------------------------------------
        Parameters:
            conn - a database connection (Connect)
            itemCode - item's code (int)
            userId - a user ID number (int)
        Returns:
            updatedHistory - user's new history (boolean)
        -------------------------------------------------------
        """
        updatedHistory = None
        if userID is not None and itemCode is not None:
            sql = "INSERT INTO history (userID, itemCode, itemName) VALUES (%s, %s, %s) ON DUPLICATE KEY UPDATE itemName = %s"
            conn.cursor.execute(sql, (userID, itemCode, itemName, itemName,))
            updatedHistory = conn.cursor.fetchall()
        return updatedHistory

