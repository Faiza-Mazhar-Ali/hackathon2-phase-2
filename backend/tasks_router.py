import json
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import or_, and_

from database import get_db
from models import Task as TaskModel, User
from schemas import TaskCreate, TaskUpdate, Task
from dependencies import get_current_user

# Create tasks router with prefix and tags
router = APIRouter(prefix="/api", tags=["tasks"])


@router.get("/{user_id}/tasks", response_model=list[Task])
def get_tasks(
    user_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
    completed: bool = None,
    priority: str = None,
    search: str = None
):
    # Ensure user can only access their own tasks
    if current_user.id != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to access these tasks"
        )

    # Build query with filters
    query = db.query(TaskModel).filter(TaskModel.owner_id == user_id)

    if completed is not None:
        query = query.filter(TaskModel.completed == completed)

    if priority:
        query = query.filter(TaskModel.priority == priority)

    if search:
        query = query.filter(
            or_(
                TaskModel.title.contains(search),
                TaskModel.description.contains(search)
            )
        )

    tasks = query.all()

    # Convert tags JSON string back to list
    for task in tasks:
        if task.tags:
            try:
                task.tags = json.loads(task.tags)
            except json.JSONDecodeError:
                task.tags = []
        else:
            task.tags = []

    return tasks


@router.post("/{user_id}/tasks", response_model=Task)
def create_task(
    user_id: int,
    task: TaskCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Ensure user can only create tasks for themselves
    if current_user.id != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to create tasks for this user"
        )

    # Convert tags list to JSON string for storage
    task_dict = task.model_dump()
    if task_dict.get('tags'):
        task_dict['tags'] = json.dumps(task_dict['tags'])
    else:
        task_dict['tags'] = json.dumps([])

    # Handle due_date conversion to ensure compatibility
    if task_dict.get('due_date'):
        from datetime import datetime
        due_date_str = task_dict['due_date']
        # Try to parse the date string in various formats
        date_formats = ['%Y-%m-%d', '%m/%d/%Y', '%d/%m/%Y', '%Y-%m-%d %H:%M:%S']
        
        parsed_date = None
        for fmt in date_formats:
            try:
                parsed_date = datetime.strptime(due_date_str, fmt)
                break
            except ValueError:
                continue
        
        # If none of the formats worked, leave as is and let DB handle it
        if parsed_date:
            task_dict['due_date'] = parsed_date
        else:
            # If parsing fails, set to None to avoid database errors
            task_dict['due_date'] = None

    db_task = TaskModel(**task_dict, owner_id=user_id)
    db.add(db_task)
    db.commit()
    db.refresh(db_task)
    return db_task


@router.get("/{user_id}/tasks/{task_id}", response_model=Task)
def get_task(
    user_id: int,
    task_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Ensure user can only access their own tasks
    if current_user.id != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to access this task"
        )

    task = db.query(TaskModel).filter(
        TaskModel.id == task_id,
        TaskModel.owner_id == user_id
    ).first()

    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )

    # Convert tags JSON string back to list
    if task.tags:
        try:
            task.tags = json.loads(task.tags)
        except json.JSONDecodeError:
            task.tags = []
    else:
        task.tags = []

    return task


@router.put("/{user_id}/tasks/{task_id}", response_model=Task)
def update_task(
    user_id: int,
    task_id: int,
    task_update: TaskUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Ensure user can only update their own tasks
    if current_user.id != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to update this task"
        )

    task = db.query(TaskModel).filter(
        TaskModel.id == task_id,
        TaskModel.owner_id == user_id
    ).first()

    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )

    # Update task fields
    update_data = task_update.model_dump(exclude_unset=True)
    if 'tags' in update_data and update_data['tags'] is not None:
        update_data['tags'] = json.dumps(update_data['tags'])
    
    for field, value in update_data.items():
        setattr(task, field, value)

    db.commit()
    db.refresh(task)
    return task


@router.delete("/{user_id}/tasks/{task_id}")
def delete_task(
    user_id: int,
    task_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Ensure user can only delete their own tasks
    if current_user.id != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to delete this task"
        )
    
    task = db.query(TaskModel).filter(
        TaskModel.id == task_id,
        TaskModel.owner_id == user_id
    ).first()
    
    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )
    
    db.delete(task)
    db.commit()
    return {"message": f"Task {task_id} deleted successfully"}


@router.patch("/{user_id}/tasks/{task_id}/toggle", response_model=Task)
def toggle_task_completion(
    user_id: int,
    task_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Ensure user can only toggle their own tasks
    if current_user.id != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to toggle this task"
        )
    
    task = db.query(TaskModel).filter(
        TaskModel.id == task_id,
        TaskModel.owner_id == user_id
    ).first()
    
    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )
    
    # Toggle completion status
    task.completed = not task.completed
    db.commit()
    db.refresh(task)
    return task