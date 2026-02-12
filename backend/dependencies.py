from datetime import datetime, timedelta, timezone
from typing import Optional
from jose import JWTError, jwt
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
import os

from database import get_db
from models import User
from schemas import TokenData

# Secret key for JWT encoding/decoding (should be stored in environment variables in production)
SECRET_KEY = os.getenv("SECRET_KEY", "09d25e094faa6ca2556c818166b7a9563b93f7099f6f0f4caa6cf63b88e8d3e7")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

security = HTTPBearer()


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


def verify_token(token: str, credentials_exception):
    try:
        # Decode the token
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: str = payload.get("sub")
        if user_id is None:
            print("No user ID in token payload")  # Debugging
            raise credentials_exception
        token_data = TokenData(user_id=user_id)
    except JWTError as e:
        print(f"JWT Error: {e}")  # Debugging
        raise credentials_exception
    return token_data


def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )

    try:
        print(f"Received token: {credentials.credentials[:20] if len(credentials.credentials) > 20 else credentials.credentials}...")  # Debugging
        token_data = verify_token(credentials.credentials, credentials_exception)
        print(f"Token data user ID: {token_data.user_id}")  # Updated to use new field
        
        # Convert the user_id field to integer
        try:
            user_id = int(token_data.user_id)
        except ValueError:
            print(f"Invalid user ID in token: {token_data.user_id}")  # Debugging
            raise credentials_exception

        # Query for the user by ID
        user_query = db.query(User).filter(User.id == user_id)
        user = user_query.first()
        
        print(f"Query result: {user.username if user else 'None'}")  # Debugging
        
        if user is None:
            # Log all user IDs in the database for debugging
            all_users = db.query(User.id).all()
            print(f"All user IDs in DB: {[u[0] for u in all_users]}")  # Debugging
            raise credentials_exception
            
        return user
    except HTTPException:
        # Re-raise HTTP exceptions
        raise
    except Exception as e:
        print(f"Unexpected error in get_current_user: {str(e)}")  # Debugging
        raise credentials_exception