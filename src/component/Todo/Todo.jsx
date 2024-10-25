import React, { useEffect, useState } from 'react'

const Todo = () => {
    const [tasks, setTasks] = useState([]);
    const [taskInput, setTaskInput] = useState("");
    const [undoStack, setUndoStack] = useState([]);

    const handleAddTask = () => {
        if (!taskInput.trim())
            return;

        const newTask = { id: Date.now(), text: taskInput, completed: false }

        setTasks((prevTasks => [...prevTasks, newTask]));

        setUndoStack(prevStack => [
            { action: "add", task: newTask },
            ...prevStack.slice(0, 4)
        ]);

        setTaskInput("");
    }

    const handleComplete = (id) => {
        setTasks(prevTasks =>
            prevTasks.map((task) =>
                task.id === id ? { ...task, completed: true } : task)
        )
        const completedTask = tasks.find((task) => task.id === id);
        setUndoStack(prevStack => [
            { action: "complete", task: completedTask },
            ...prevStack.slice(0, 4)
        ]);
    }

    const handleDelete = (id) => {
        const deletedTask = tasks.find((task) => task.id === id);

        setTasks(prevTasks =>
            prevTasks.filter((task) =>
                task.id !== id)
        );

        setUndoStack(prevStack => [
            { action: "delete", task: deletedTask },
            ...prevStack.slice(0, 4)
        ]);
    }

    const handleUndo = () => {
        if (undoStack.length === 0) {
            console.log("empty undo stack");
            return;
        };

        const [lastAction, ...restStack] = undoStack;
        const { action, task } = lastAction;

        if (action === "add") {
            console.log("undo add", task);
            setTasks((prevTasks) => prevTasks.filter((t) => t.id !== task.id));
        } else if (action === "delete") {
            console.log("undo delete", task);
            setTasks((prevStacks) => [...prevStacks, task]);
        } else if (action === "complete") {
            console.log("undo complete", task);
            setTasks((prevTasks) =>
                prevTasks.map((t) =>
                    t.id === task.id ? { ...t, completed: !t.completed } : t
                )
            );
        }

        setUndoStack(restStack);
    };


    useEffect(() => {
        console.log("undoStack: ", undoStack)
        const handleKeyDown = (e) => {
            if (e.key === "z" && e.ctrlKey) {
                handleUndo();
            }
        }
        window.addEventListener("keydown", handleKeyDown);
        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        }
    }, [undoStack]);

    return (
        <>
            <h2>To-Do List</h2>
            <input
                type="text"
                value={taskInput}
                onChange={(e) => setTaskInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAddTask()}
            />
            <button onClick={handleAddTask}>Add Task</button>
            <button onClick={handleUndo}>Undo Task</button>

            <ul>
                {
                    tasks.map(task => (
                        <li key={task.id} style={{ textDecoration: task.completed ? "line-through" : "none" }}>
                            {task?.text}
                            <button onClick={() => handleComplete(task.id)} disabled={task.completed}>
                                {task.completed ? "Completed" : "Mark Complete"}
                            </button>
                            <button onClick={() => handleDelete(task.id)}>
                                Delete
                            </button>
                        </li>
                    ))
                }
            </ul>
        </>
    )
}

export default Todo