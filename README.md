# Task Board Application

## Overview

The Task Board Application is for task management which built using Next.js, React, TypeScript, Tailwind CSS, and the `@dnd-kit/core` library.

It allows users to create, view, edit, delete task and comments and also have functionality to drag and drop the task card to change the status of tasks.
The status can changes into:
- To Do
- In Progress
- Done
Users can move tasks between columns using drag-and-drop functionality.

## Loading States

### How handle the loading state

This project use the `isLoading` state with the `useTasks()` hook to for whether tasks are still being fetched.
When `isLoading` is `true`, the Task Board displays a loading message:

```tsx
if (isLoading) {
    return (
        <div className="w-full p-6">
            <p>Loading tasks...</p>
        </div>
    );
}
```

### Why this was used
- If the tasks are still being fetched then there was nothing render or display on the screen. So this loading state is for that user can understand that the task are still being fetched he has to wait for a while.
- By this user have the clear message to wait for a while and the project is running, not crashed.
- After the tasks are fetched the loading state is removed and the tasks are showing to user, so not a single time user have to face the empty screen.

## Error States
### 1. Initial task-loading error
If fetching tasks fails and no tasks are available, this displays an error message and a Try Again button.
```tsx
if (error && tasks.length === 0) {
    return (
        <div className="w-full p-6">
            <p className="mb-4 text-red-600">{error}</p>

            <button
                type="button"
                onClick={loadTasks}
                className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
            >
                Try Again
            </button>
        </div>
    );
}
```

**Why this approach was used:**
- It shows that the json server is stopped or getting some error in fetching the task, user have to wait for a while and try to click the try again button. 
- After the json server is running, user just once click the try again button then the task are fetched without the error without refreshing the page.
- It avoids to show a blank page to user when some error is occurred. 

### 2. Drag-and-drop update error
When a user moves a task to another column, the application updates the interface immediately and then sends the change to the API.
If the API request fails, the application restores the task to its previous state and displays an error message.

```tsx
try {
    const savedTask = await updateTask(task.id, {
        title: updatedTask.title,
        description: updatedTask.description,
        status: updatedTask.status,
        order: updatedTask.order,
    });

    saveTask(savedTask);
} catch (error) {
    console.error("Failed to update task status:", error);

    saveTask(previousTask);
    setDragError(
        "Unable to update task status. Please try again."
    );
}
```

**Why this approach was used:**

- The interface responds immediately when a task is moved.
- If the server rejects the update, the previous task state is stays without the changed status.
- Users receive the same status with task when dnd fails.

### 3. Error message display
The project displays loading-related and drag-and-drop errors in the task board interface.
```tsx
{(error || dragError) && (
    <p className="mx-5 mb-4 text-sm text-red-600">
        {dragError || error}
    </p>
)}
```
This gives users visible feedback when an operation fails.

### 4. Comment Error Handling

The comment feature allows users to add comments to tasks. The comments are handled through API requests, errors can occur while loading or submitting comments.
The project handle these situations by displaying an appropriate error message and allowing users to retry the operation when possible.

**Loading comments**

If fetching comments fails, display an error message instead of silently showing an empty comment list.

**Adding a comment**

If submitting a comment fails, inform the user that the comment could not be saved. Keep the entered comment text available so the user can retry without typing it again.

**Displaying errors**

Show a clear message near the comment form or comment list. Avoid displaying raw technical API errors directly to users.

#### Why this approach was used

- User easily getting that what error is occur and show a proper message till the error is resolved.
- User have to wait for a while then perform the action which is remaining.
- It also the successful operation performed message when the operation is successful and also the error message box when it fails.
