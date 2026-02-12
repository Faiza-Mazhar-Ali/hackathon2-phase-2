from fastapi import APIRouter, HTTPException, status
from typing import Dict
from schemas import UserCreate, UserLogin, UserResponse, Token

# Initialize the auth router with the tag "auth"
router = APIRouter(
    prefix="/api/auth",
    tags=["auth"]
)

# Mock storage for users (in-memory)
users_db: Dict[int, dict] = {}
user_id_counter = 1


@router.post("/register", response_model=UserResponse)
async def register(user: UserCreate):
    """Register a new user"""
    global user_id_counter
    
    # Check if user with email already exists
    for user_data in users_db.values():
        if user_data["email"] == user.email:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already registered"
            )
    
    # Create new user
    new_user = {
        "id": user_id_counter,
        "username": user.username,
        "email": user.email,
        "password": user.password  # In a real app, hash the password
    }
    
    users_db[user_id_counter] = new_user
    user_id_counter += 1
    
    return UserResponse(
        id=new_user["id"],
        username=new_user["username"],
        email=new_user["email"]
    )


@router.post("/login", response_model=Token)
async def login(credentials: UserLogin):
    """Login user and return access token"""
    # Find user by email
    user_found = None
    for user_data in users_db.values():
        if user_data["email"] == credentials.email and user_data["password"] == credentials.password:
            user_found = user_data
            break
    
    if not user_found:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials"
        )
    
    # Return a mock token (in a real app, generate a proper JWT)
    return Token(
        access_token=f"mock_token_for_user_{user_found['id']}",
        token_type="bearer"
    )


@router.post("/logout")
async def logout():
    """Logout user"""
    # In a real app, invalidate the token
    return {"message": "Successfully logged out"}


@router.get("/me", response_model=UserResponse)
async def get_current_user():
    """Get current user profile"""
    # In a real app, extract user ID from token
    # For this mock, we'll return a dummy user
    # Since we don't have authentication, we'll return the first user
    if not users_db:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No users registered"
        )
    
    # Return the first user in the database
    first_user = next(iter(users_db.values()))
    return UserResponse(
        id=first_user["id"],
        username=first_user["username"],
        email=first_user["email"]
    )