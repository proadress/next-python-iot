from typing import Annotated
from fastapi import APIRouter, Depends, Request
from fastapi.responses import JSONResponse, RedirectResponse
from lotify.client import Client
import uuid
from pydantic import BaseModel
from api.auth import get_current_user
from .models import db


api = APIRouter(prefix="/api", tags=["api"])


CLIENT_ID = "6ImFrDXtdLOwlQDWK5VYcF"
SECRET = "FmO9AZeE1c1XuMM9FzcNfpFflg2zdmL1DhhO5JzRJit"
URI = "https://next-python-iot.vercel.app/api/callback"
# URI = "http://localhost:3000/api/callback"


lotify = Client(client_id=CLIENT_ID, client_secret=SECRET, redirect_uri=URI)


class Send(BaseModel):
    token: str
    message: str


tokenData = Send(token="", message="")


@api.get("/linelink")
async def linelink():
    link = lotify.get_auth_link(state=uuid.uuid4())
    print(link)
    return link


@api.post("/data")
async def data(item: Send):
    global tokenData
    tokenData = item
    print(tokenData)
    return JSONResponse(content={"status": "success"}, status_code=200)


@api.get("/callback")
async def callback(request: Request, code: str):
    token = lotify.get_access_token(code=code)
    db.collection.insert_one(
        {"_id": token, "name": tokenData.token, "user": tokenData.message}
    )
    return RedirectResponse(url="/")


@api.get("/findall")
async def findall(current_user: Annotated[str, Depends(get_current_user)]):
    data = db.collection.find({"user": current_user})
    data = [document for document in data]
    return JSONResponse(data)


@api.post("/send")
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


@api.post("/rename")
def rename(item: Send):
    respond = db.collection.update_one(
        {"_id": item.token}, {"$set": {"name": item.message}}
    )
    print(respond)
    return JSONResponse(content={"status": "success"}, status_code=200)


@api.post("/delete")
def delete(item: Send):
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
