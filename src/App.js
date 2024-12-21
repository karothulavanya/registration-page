import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import axios from "axios";
import StudentInfo from "./StudentInfo";
import Address from "./Address";
import ContactInfo from "./ContactInfo";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import StudentsList from "./StudentsList";

const App = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    dob: null,
    studentId: "",
    gender: "",
    streetAddress: "",
    city: "",
    state: "",
    country: "",
    phone: "",
    email: "",
  });

  const [students, setStudents] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);
  // Fetch students from the backend
  useEffect(() => {
    axios
      .get("http://localhost:5000/students")
      .then((response) => setStudents(response.data))
      .catch((error) => console.error("Error fetching students:", error));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDateChange = (date) => {
    setFormData((prev) => ({
      ...prev,
      dob: date,
    }));
  };

  const handleCreate = () => {
    if (editingIndex === null) {
      axios
        .post("http://localhost:5000/students", formData)
        .then((response) => {
          setStudents((prev) => [...prev, response.data]);
        })
        .catch((error) => console.error("Error adding student:", error));
    } else {
      handleUpdate();
    }
    setFormData({
      firstName: "",
      lastName: "",
      dob: null,
      studentId: "",
      gender: "",
      streetAddress: "",
      city: "",
      state: "",
      country: "",
      phone: "",
      email: "",
    });
    setEditingIndex(null);
  };

  const handleEdit = (index) => {
    const student = students[index];
    console.log(student, "sssssssssssssss");

    setFormData({
      ...student,
    });
    setEditingIndex(index);
  };

  const handleUpdate = () => {
    const studentId = students[editingIndex].id;
    axios
      .put(`http://localhost:5000/students/${studentId}`, formData)
      .then(() => {
        const updatedStudents = students.map((student, index) =>
          index === editingIndex ? formData : student
        );
        setStudents(updatedStudents);
      })
      .catch((error) => console.error("Error updating student:", error));
  };

  const handleDelete = (index) => {
    const studentId = students[index].id;
    axios
      .delete(`http://localhost:5000/students/${studentId}`)
      .then(() => {
        const updatedStudents = students.filter((_, i) => i !== index);
        setStudents(updatedStudents);
      })
      .catch((error) => console.error("Error deleting student:", error));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleCreate();
  };

  return (
    <Router>
      <div className="container">
        {/* Routes and link components for navigation */}
        <Routes>
          <Route
            path="/"
            element={
              <div className="row justify-content-center">
                <div className="col-12 col-md-8 col-lg-4">
                  <div className="card p-4 shadow-lg">
                    <h2 className="text-center mb-4">
                      Student Registration Form
                    </h2>
                    <form onSubmit={handleSubmit}>
                      <StudentInfo
                        formData={formData}
                        handleChange={handleChange}
                        handleDateChange={handleDateChange}
                      />
                      <Address
                        formData={formData}
                        handleChange={handleChange}
                      />
                      <ContactInfo
                        formData={formData}
                        handleChange={handleChange}
                      />
                      <div className="d-flex justify-content-center">
                        <button
                          type="submit"
                          className="btn btn-light btn-block btn-lg"
                        >
                          {editingIndex === null ? "Submit" : "Update"}
                        </button>
                      </div>
                    </form>
                  </div>
                  <div className="text-center my-4">
                    <Link to="/students" className="btn btn-primary">
                      View Students List
                    </Link>
                  </div>
                </div>
              </div>
            }
          />
          <Route
            path="/students"
            element={
              <StudentsList
                students={students}
                handleEdit={handleEdit}
                handleDelete={handleDelete}
              />
            }
          />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
