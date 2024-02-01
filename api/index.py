from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse, RedirectResponse
from lotify.client import Client
import uuid

from pydantic import BaseModel
from .models import db

app = FastAPI()


CLIENT_ID = "6ImFrDXtdLOwlQDWK5VYcF"
SECRET = "FmO9AZeE1c1XuMM9FzcNfpFflg2zdmL1DhhO5JzRJit"
URI = "http://localhost:3000/api/callback"

lotify = Client(client_id=CLIENT_ID, client_secret=SECRET, redirect_uri=URI)


class Send(BaseModel):
    token: str
    message: str


@app.get("/api/python")
def hello_world():
    return {"message": "Hello World"}


@app.get("/api/linelink")
async def linelink():
    link = lotify.get_auth_link(state=uuid.uuid4())
    return link


@app.get("/api/callback")
async def confirm(request: Request, code: str):
    token = lotify.get_access_token(code=code)
    db.collection.insert_one({"_id": token, "name": "未命名"})
    return RedirectResponse(url="/")


@app.get("/api/findall")
async def confirm():
    data = db.collection.find()
    data = [document for document in data]
    return JSONResponse(data)


@app.post("/api/send")
def send(item: Send):
    try:
        response = lotify.send_message(access_token=item.token, message=item.message)
        # Assuming lotify.send_message returns a response that you want to include in the JSON response
        return JSONResponse(
            content={"status": "success", "response": response}, status_code=200
        )
    except Exception as e:
        # Handle exceptions or errors here
        return JSONResponse(
            content={"status": "error", "detail": str(e)}, status_code=500
        )


@app.post("/api/rename")
def send(item: Send):
    respond = db.collection.replace_one({"_id": item.token}, {"name": item.message})
    print(respond)
    return JSONResponse(content={"status": "success"}, status_code=200)


@app.post("/api/delete")
def send(item: Send):
    try:
        lotify.revoke(access_token=item.token)
        db.collection.delete_one({"_id": item.token})
        # Assuming lotify.send_message returns a response that you want to include in the JSON response
        return JSONResponse(content={"status": "success"}, status_code=200)
    except Exception as e:
        # Handle exceptions or errors here
        print(e)
        return JSONResponse(
            content={"status": "error", "detail": str(e)}, status_code=500
        )
