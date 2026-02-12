import pytest
from fastapi.testclient import TestClient
from passlib.context import CryptContext
from models import User
from database import get_db
from conftest import test_db
from auth_router import get_password_hash
from dependencies import create_access_token
from datetime import timedelta
import json


pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def test_register_user(client):
    # Test user registration
    response = client.post(
        "/api/auth/register",
        json={
            "username": "testuser_unique1",
            "email": "test1@example.com",
            "password": "testpassword123"
        }
    )
    
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"


def test_login_user(client):
    # First register a user
    client.post(
        "/api/auth/register",
        json={
            "username": "loginuser_unique2",
            "email": "login2@example.com",
            "password": "testpassword123"
        }
    )
    
    # Then try to login
    response = client.post(
        "/api/auth/login",
        json={
            "email": "login2@example.com",
            "password": "testpassword123"
        }
    )
    
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"


def test_get_current_user_with_valid_token(client):
    # Register a user first
    register_response = client.post(
        "/api/auth/register",
        json={
            "username": "profileuser_unique3",
            "email": "profile3@example.com",
            "password": "testpassword123"
        }
    )
    
    assert register_response.status_code == 200
    token = register_response.json()["access_token"]
    
    # Access protected route with valid token
    response = client.get(
        "/api/auth/me",
        headers={"Authorization": f"Bearer {token}"}
    )
    
    assert response.status_code == 200
    user_data = response.json()
    assert user_data["username"] == "profileuser_unique3"
    assert user_data["email"] == "profile3@example.com"


def test_create_and_get_tasks(client):
    # Register a user
    register_response = client.post(
        "/api/auth/register",
        json={
            "username": "taskuser_unique4",
            "email": "task4@example.com",
            "password": "testpassword123"
        }
    )
    
    assert register_response.status_code == 200
    token = register_response.json()["access_token"]
    
    # Get the user ID by accessing the /me endpoint
    user_response = client.get(
        "/api/auth/me",
        headers={"Authorization": f"Bearer {token}"}
    )
    
    assert user_response.status_code == 200
    user_id = user_response.json()["id"]
    
    # Create a task
    create_response = client.post(
        f"/api/{user_id}/tasks",
        json={
            "title": "Test Task",
            "description": "This is a test task"
        },
        headers={"Authorization": f"Bearer {token}"}
    )
    
    assert create_response.status_code == 200
    task_data = create_response.json()
    assert task_data["title"] == "Test Task"
    assert task_data["description"] == "This is a test task"
    
    # Get the task
    get_response = client.get(
        f"/api/{user_id}/tasks/{task_data['id']}",
        headers={"Authorization": f"Bearer {token}"}
    )
    
    assert get_response.status_code == 200
    retrieved_task = get_response.json()
    assert retrieved_task["id"] == task_data["id"]
    assert retrieved_task["title"] == "Test Task"


def test_update_task(client):
    # Register a user
    register_response = client.post(
        "/api/auth/register",
        json={
            "username": "updateuser_unique5",
            "email": "update5@example.com",
            "password": "testpassword123"
        }
    )
    
    assert register_response.status_code == 200
    token = register_response.json()["access_token"]
    
    # Get the user ID by accessing the /me endpoint
    user_response = client.get(
        "/api/auth/me",
        headers={"Authorization": f"Bearer {token}"}
    )
    
    assert user_response.status_code == 200
    user_id = user_response.json()["id"]
    
    # Create a task
    create_response = client.post(
        f"/api/{user_id}/tasks",
        json={
            "title": "Original Title",
            "description": "Original Description"
        },
        headers={"Authorization": f"Bearer {token}"}
    )
    
    assert create_response.status_code == 200
    task_data = create_response.json()
    
    # Update the task
    update_response = client.put(
        f"/api/{user_id}/tasks/{task_data['id']}",
        json={
            "title": "Updated Title",
            "description": "Updated Description",
            "completed": True
        },
        headers={"Authorization": f"Bearer {token}"}
    )
    
    assert update_response.status_code == 200
    updated_task = update_response.json()
    assert updated_task["title"] == "Updated Title"
    assert updated_task["description"] == "Updated Description"
    assert updated_task["completed"] is True


def test_delete_task(client):
    # Register a user
    register_response = client.post(
        "/api/auth/register",
        json={
            "username": "deleteuser_unique6",
            "email": "delete6@example.com",
            "password": "testpassword123"
        }
    )
    
    assert register_response.status_code == 200
    token = register_response.json()["access_token"]
    
    # Get the user ID by accessing the /me endpoint
    user_response = client.get(
        "/api/auth/me",
        headers={"Authorization": f"Bearer {token}"}
    )
    
    assert user_response.status_code == 200
    user_id = user_response.json()["id"]
    
    # Create a task
    create_response = client.post(
        f"/api/{user_id}/tasks",
        json={
            "title": "Task to Delete",
            "description": "This task will be deleted"
        },
        headers={"Authorization": f"Bearer {token}"}
    )
    
    assert create_response.status_code == 200
    task_data = create_response.json()
    
    # Delete the task
    delete_response = client.delete(
        f"/api/{user_id}/tasks/{task_data['id']}",
        headers={"Authorization": f"Bearer {token}"}
    )
    
    assert delete_response.status_code == 200
    assert delete_response.json()["message"] == f"Task {task_data['id']} deleted successfully"