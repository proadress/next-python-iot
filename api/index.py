from typing import Annotated
from fastapi import Depends, FastAPI
from .models import db
from .auth import User, auth, get_current_user
from .api import api

app = FastAPI()
app.include_router(auth)
app.include_router(api)


@app.get("/api")
def hello_world(current_user: Annotated[str, Depends(get_current_user)]):
    return {"message": f"Hello {current_user}"}
