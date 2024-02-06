from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi


class MongoServer:
    def __init__(self, url, dbname, dbcoll):
        client = MongoClient(url, server_api=ServerApi("1"))
        try:
            client.admin.command("ping")
            print("Pinged your deployment. You successfully connected to MongoDB!")
            client = MongoClient(url)
            db = client[dbname]
            self.collection = db[dbcoll]
        except Exception as e:
            print(e)


db = MongoServer(
    url="mongodb+srv://yc359032:jYW7xwHcvGiQDqCp@cluster0.8lnefaq.mongodb.net/?retryWrites=true&w=majority",
    dbname="iot",
    dbcoll="tokens",
)
userdb = MongoServer(
    url="mongodb+srv://yc359032:jYW7xwHcvGiQDqCp@cluster0.8lnefaq.mongodb.net/?retryWrites=true&w=majority",
    dbname="iot",
    dbcoll="users",
)
