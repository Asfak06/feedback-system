import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Button, Card } from "react-bootstrap";
import { getCookie } from "cookies-next";
import { Container, Row, Col } from 'react-bootstrap';
import axios from 'axios';
import { Table } from 'react-bootstrap';
import { API_BASE_URL } from "../../utils";

export default function Dashboard() {
  const router = useRouter();
  const [loggedIn, setLoggedIn] = useState(false);
  const [feedbackCounts, setFeedbackCounts] = useState(null);
  const [feedback, setFeedback] = useState([]);

  useEffect(() => {
    const fetchFeedbackCounts = async () => {
      const response = await axios.get(`${API_BASE_URL}/api/dashboard`);
      setFeedbackCounts(response.data);
    };

    fetchFeedbackCounts();
  }, []);


  useEffect(() => {
    axios.get(`${API_BASE_URL}/api/feedback`).then((response) => {
      setFeedback(response.data);
    });
  }, []);


  useEffect(() => {
    const cookie = getCookie("loggedIn");
    console.log(cookie)
    if (cookie) {
      setLoggedIn(true);
    } else {
      router.push("/admin/login");
    }
  }, []);

  const handleLogout = () => {
    document.cookie = "loggedIn=false; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    setLoggedIn(false);
    router.push("/admin/login");
  };

  return (
    <>
      {loggedIn ? (
        <div className="container">
          <h1 className="text-center my-4">Dashboard</h1>
          <Card>
            <Card.Body>
              <Card.Title>Welcome to the Dashboard</Card.Title>
              <Row className="mt-3">
                <Col>
                <h2>Total Feedback Count: {feedbackCounts?.totalUsers || 0}</h2>
                </Col>
                <Col>
                <h2>Total Upvotes: {feedbackCounts?.totalUpvotes || 0}</h2>
                </Col>
                <Col>
                <h2>Total Downvotes: {Math.abs(feedbackCounts?.totalDownvotes) || 0}</h2>
                </Col>
            </Row>
            <Row>
                


            <Table className="mt-4" striped bordered hover>
                <thead>
                    <tr>
                    <th>#</th>
                    <th>Booth Number</th>
                    <th>User Name</th>
                    <th>User ID</th>
                    <th>Feedback</th>
                    <th>Vote</th>
                    </tr>
                </thead>
                <tbody>
                    {feedback.map((f, index) => (
                    <tr key={f.uuid}>
                        <td>{index + 1}</td>
                        <td>{f.boothNumber}</td>
                        <td>{f.userName}</td>
                        <td>{f.userId}</td>
                        <td>{f.feedback}</td>
                        <td>{f.vote}</td>
                    </tr>
                    ))}
                </tbody>
            </Table>
            </Row>

              <Card.Text>This is the protected area of the application.</Card.Text>
              <Button variant="danger" onClick={handleLogout}>
                Logout
              </Button>
            </Card.Body>
          </Card>
        </div>
      ) : null}
    </>
  );
}
