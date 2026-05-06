import { useState, useEffect } from "react";

function App() {
  const [user, setUser] = useState(null);
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ email: "", password: "" });

  const handleSubmit = () => {
    if (form.email && form.password) {
      setUser(form.email);
    }
  };

  if (!user) {
    return (
      <div style={{ textAlign: "center", marginTop: "100px" }}>
        <h2>{isLogin ? "Login" : "Register"}</h2>

        <input
          placeholder="Email"
          onChange={(e) =>
            setForm({ ...form, email: e.target.value })
          }
        />
        <br /><br />

        <input
          type="password"
          placeholder="Password"
          onChange={(e) =>
            setForm({ ...form, password: e.target.value })
          }
        />
        <br /><br />

        <button onClick={handleSubmit}>
          {isLogin ? "Login" : "Register"}
        </button>

        <p
          onClick={() => setIsLogin(!isLogin)}
          style={{ cursor: "pointer" }}
        >
          {isLogin ? "Create Account" : "Already have account?"}
        </p>
      </div>
    );
  }

  return <TaskManager />;
}

// ================= TASK MANAGER =================

function TaskManager() {
  const [task, setTask] = useState("");
  const [deadline, setDeadline] = useState("");
  const [priority, setPriority] = useState("Low");
  const [tasks, setTasks] = useState([]);

  const API = `$ {process.env.REACT_APP_API_URL}/tasks`;
  

  // GET TASKS
  const getTasks = async () => {
    try {
      const res = await fetch(`${API}`);
      const data = await res.json();
      setTasks(data);
    } catch (err) {
      console.log("GET ERROR:", err);
    }
  };

  useEffect(() => {
    getTasks();
  }, []);

  // ADD TASK
  const addTask = async () => {
  console.log("ADD BUTTON CLICKED"); // 👈 STEP 2 (DEBUG)

  await fetch(`${API}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      task,
      deadline,
      priority
    })
  });

  getTasks(); // refresh UI
};
      

  // DELETE TASK
  const deleteTask = async (id) => {
  try {
    await fetch(`${process.env.REACT_APP_API_URL}/tasks/${id}`, {
      method: "DELETE",
    });

    getTasks(); // refresh UI after delete
  } catch (err) {
    console.log("DELETE ERROR:", err);
  }
};
const toggleTask = async (id) => {
  try {
    const res = await fetch(`${process.env.REACT_APP_API_URL}/tasks/${id}`, {
      method: "PUT",
    });

    const updated = await res.json();

    // 🔥 INSTANT UI UPDATE (NO DELAY)
    setTasks((prev) =>
      prev.map((t) =>
        t._id === id ? { ...t, completed: updated.completed } : t
      )
    );

  } catch (err) {
    console.log("TOGGLE ERROR:", err);
  }
};
 const getColor= (level)=> {
  if (level=== "High") return "red";
  if (level==="Medium") return "orange";
  return "green";
 };

  return (
    <div style={{ display: "flex", justifyContent: "center", marginTop: "50px" }}>
      <div style={{ width: "400px", padding: "20px", border: "1px solid #ccc", borderRadius: "10px" }}>

        <h2 style={{ textAlign: "center" }}>Task Manager</h2>

        <input
          value={task}
          onChange={(e) => setTask(e.target.value)}
          placeholder="Task Name"
          style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
        />

        <input
          type="date"
          value={deadline}
          onChange={(e) => setDeadline(e.target.value)}
          style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
        />

        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
        >
          <option>Low</option>
          <option>Medium</option>
          <option>High</option>
        </select>

        <button
          onClick={addTask}
          style={{
            width: "100%",
            padding: "10px",
            background: "green",
            color: "white",
            border: "none",
            borderRadius: "5px",
          }}
        >
          Add Task
        </button>

        {/* TASK LIST */}
        <ul style={{ marginTop: "20px", padding: 0 }}>
          {tasks.map((t) => (
            <li
  key={t._id}
  style={{
    listStyle: "none",
    padding: "12px",
    marginBottom: "10px",
    background: "#fff",
    borderRadius: "8px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    boxShadow: "0 2px 5px rgba(0,0,0,0.1)"
  }}
>
              <div>
  <b style={{
    textDecoration: t.completed ? "line-through" : "none",
    fontSize: "16px"
  }}>
    {t.task}
  </b>
  <br />

  <small>📅 {t.deadline || "No deadline"}</small>
  <br />

  <small style={{ color: getColor(t.priority) }}>
    🔥 {t.priority}
  </small>
  <br />

  <small style={{
    color: t.completed ? "green" : "red",
    fontWeight: "bold"
  }}>
    {t.completed ? "✅ Done" : "⏳ Pending"}
  </small>
</div>

              <button
                onClick={() => deleteTask(t._id)}
                style={{
                  background: "red",
                  color: "white",
                  border: "none",
                  borderRadius: "5px",
                  padding: "5px 10px",
                  marginRight: "5px"
                }}
              >
                Delete
              </button>
              <button
  onClick={() => toggleTask(t._id)}
  style={{
    background: t.completed ? "gray" : "blue",
    color: "white",
    border: "none",
    borderRadius: "5px",
    padding: "5px 10px",
    marginLeft: "5px"
  }}
>
  {t.completed ? "Undo" : "Done"}
</button>
            </li>
          ))}
        </ul>

      </div>
    </div>
  );
}

export default App;