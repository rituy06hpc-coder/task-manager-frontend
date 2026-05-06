import { useState} from "react";

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

  const API = `${process.env.REACT_APP_API_URL}/tasks`;

  // GET TASKS
  const getTasks = async()=> {
    try{
      const res = await fetch(API);
      const data = await res.json();
      setTasks(data);
    } catch(err){
      console.log("GET ERROR:",err);
    }
  };
  // ADD TASK
  const addTask = async () => {
    await fetch(API, {
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

    getTasks();
  };

  // DELETE TASK
  const deleteTask = async (id) => {
    try {
      await fetch(`${process.env.REACT_APP_API_URL}/tasks/${id}`, {
        method: "DELETE",
      });

      getTasks();
    } catch (err) {
      console.log("DELETE ERROR:", err);
    }
  };

  // TOGGLE TASK
  const toggleTask = async (id) => {
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/tasks/${id}`, {
        method: "PUT",
      });

      const updated = await res.json();

      setTasks((prev) =>
        prev.map((t) =>
          t._id === id ? { ...t, completed: updated.completed } : t
        )
      );
    } catch (err) {
      console.log("TOGGLE ERROR:", err);
    }
  };

  const getColor = (level) => {
    if (level === "High") return "red";
    if (level === "Medium") return "orange";
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
        />

        <input
          type="date"
          value={deadline}
          onChange={(e) => setDeadline(e.target.value)}
        />

        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
        >
          <option>Low</option>
          <option>Medium</option>
          <option>High</option>
        </select>

        <button onClick={addTask}>
          Add Task
        </button>

        <ul>
          {tasks.map((t) => (
            <li key={t._id}>
              <div>
                <b style={{ textDecoration: t.completed ? "line-through" : "none" }}>
                  {t.task}
                </b>
                <br />
                <small>📅 {t.deadline}</small>
                <br />
                <small style={{ color: getColor(t.priority) }}>
                  🔥 {t.priority}
                </small>
              </div>

              <button onClick={() => deleteTask(t._id)}>Delete</button>
              <button onClick={() => toggleTask(t._id)}>
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