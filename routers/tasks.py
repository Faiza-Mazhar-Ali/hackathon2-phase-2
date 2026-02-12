from fastapi import APIRouter, HTTPException, status
from typing import List, Dict
from schemas import TaskCreate, TaskUpdate, TaskResponse

# Initialize the tasks router with the tag "tasks"
router = APIRouter(
    prefix="/api/{user_id}/tasks",
    tags=["tasks"]
)

# Mock storage for tasks (in-memory)
tasks_db: Dict[int, Dict[int, dict]] = {}  # {user_id: {task_id: task_data}}
task_id_counter = 1


def get_next_task_id():
    """Generate a unique task ID"""
    global task_id_counter
    current_id = task_id_counter
    task_id_counter += 1
    return current_id


@router.get("/", response_model=List[TaskResponse])
async def get_tasks(user_id: int):
    """Get all tasks for a specific user"""
    user_tasks = tasks_db.get(user_id, {})
    return [
        TaskResponse(
            id=task["id"],
            user_id=task["user_id"],
            title=task["title"],
            description=task["description"],
            completed=task["completed"]
        )
        for task in user_tasks.values()
    ]


@router.post("/", response_model=TaskResponse)
async def create_task(user_id: int, task: TaskCreate):
    """Create a new task for a specific user"""
    global task_id_counter
    
    # Ensure user exists in tasks_db
    if user_id not in tasks_db:
        tasks_db[user_id] = {}
    
    # Create new task
    new_task_id = get_next_task_id()
    new_task = {
        "id": new_task_id,
        "user_id": user_id,
        "title": task.title,
        "description": task.description or "",
        "completed": False
    }
    
    tasks_db[user_id][new_task_id] = new_task
    
    return TaskResponse(
        id=new_task["id"],
        user_id=new_task["user_id"],
        title=new_task["title"],
        description=new_task["description"],
        completed=new_task["completed"]
    )


@router.get("/{task_id}", response_model=TaskResponse)
async def get_task(user_id: int, task_id: int):
    """Get a specific task by ID for a specific user"""
    user_tasks = tasks_db.get(user_id, {})
    task = user_tasks.get(task_id)
    
    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )
    
    return TaskResponse(
        id=task["id"],
        user_id=task["user_id"],
        title=task["title"],
        description=task["description"],
        completed=task["completed"]
    )


@router.put("/{task_id}", response_model=TaskResponse)
async def update_task(user_id: int, task_id: int, task_update: TaskUpdate):
    """Update a specific task by ID for a specific user"""
    user_tasks = tasks_db.get(user_id, {})
    task = user_tasks.get(task_id)
    
    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )
    
    # Update task fields if provided
    if task_update.title is not None:
        task["title"] = task_update.title
    if task_update.description is not None:
        task["description"] = task_update.description
    if task_update.completed is not None:
        task["completed"] = task_update.completed
    
    return TaskResponse(
        id=task["id"],
        user_id=task["user_id"],
        title=task["title"],
        description=task["description"],
        completed=task["completed"]
    )


@router.delete("/{task_id}")
async def delete_task(user_id: int, task_id: int):
    """Delete a specific task by ID for a specific user"""
    user_tasks = tasks_db.get(user_id, {})
    
    if task_id not in user_tasks:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )
    
    del user_tasks[task_id]
    return {"message": f"Task {task_id} deleted successfully"}


@router.patch("/{task_id}/toggle", response_model=TaskResponse)
async def toggle_task_completion(user_id: int, task_id: int):
    """Toggle the completion status of a specific task"""
    user_tasks = tasks_db.get(user_id, {})
    task = user_tasks.get(task_id)
    
    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )
    
    # Toggle completion status
    task["completed"] = not task["completed"]
    
    return TaskResponse(
        id=task["id"],
        user_id=task["user_id"],
        title=task["title"],
        description=task["description"],
        completed=task["completed"]
    )