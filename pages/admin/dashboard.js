import 'bootstrap/dist/css/bootstrap.min.css';

import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Button, Card } from "react-bootstrap";
import { getCookie } from "cookies-next";
import { Container, Row, Col,Form } from 'react-bootstrap';
import axios from 'axios';
import { Table } from 'react-bootstrap';
import { API_BASE_URL } from "../../utils";
import { booths } from "../../utils";
import { PaginationControl } from 'react-bootstrap-pagination-control';
export default function Dashboard() {
  const router = useRouter();
  const [loggedIn, setLoggedIn] = useState(false);
  const [feedbackCounts, setFeedbackCounts] = useState(null);
  const [feedback, setFeedback] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState();
  const [boothNumber, setBoothNumber] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  useEffect(() => {
    const fetchFeedbackCounts = async () => {
      const response = await axios.get(`${API_BASE_URL}/api/dashboard`);
      setFeedbackCounts(response.data);
    };

    fetchFeedbackCounts();
  }, []);


  useEffect(() => {
    axios.get(`${API_BASE_URL}/api/feedback?page=${page}&limit=5&boothNumber=${boothNumber}&fromDate=${fromDate}&toDate=${toDate}`).then((response) => {
      setFeedback(response.data.rows);
      setTotal(response.data.count)
    });
  }, [page]);


  const handleFilter = ()=>{
    console.log(toDate)
    axios.get(`${API_BASE_URL}/api/feedback?page=${page}&limit=5&boothNumber=${boothNumber}&fromDate=${fromDate}&toDate=${toDate}`).then((response) => {
      setFeedback(response.data.rows);
      setTotal(response.data.count)
    });
  }

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
                <h3>Total Neutral Votes: {Math.abs(feedbackCounts?.totalNeutralVotes) || 0}</h3>
                </Col>
                <Col>
                <h2>Total Downvotes: {Math.abs(feedbackCounts?.totalDownvotes) || 0}</h2>
                </Col>
            </Row>
            <Row>
                
            <Row className='mt-4 w-100 m-auto'>
     
              <Col>
                    <div>
                        <Form.Group >
                            <Form.Label>Select Start Date</Form.Label>
                            <Form.Control type="date" onChange={(e)=>setFromDate(e.target.value)} />
                        </Form.Group>
                    </div>
              </Col>
              <Col>
                    <div>
                        <Form.Group >
                        <Form.Label>Select End Date</Form.Label>
                            <Form.Control type="date" onChange={(e)=>setToDate(e.target.value)} />
                        </Form.Group>
                    </div>
              </Col>
              <Col>
              <Form.Label>Select Booth</Form.Label>
                <select
                  className="form-select"
                  aria-label="Filter by Booth Number"
                  onChange={(e)=>{setBoothNumber(e.target.value);setPage(1);}}
                >
                  <option defaultValue value="">
                    Filter By Booths
                  </option>
                  {booths.map((booth,i) => (
                    <option key={i} value={i+1}>
                       {booth}
                    </option>
                  ))}
                </select>
              </Col>
              <Col>
                   <div className='mt-2'>
                    <Form.Group >
                       <br/>
                       <Form.Control type="submit" onClick={handleFilter}/>
                    </Form.Group>
                  </div>
              </Col>
            </Row>

            <Table className="mt-4" striped bordered hover>
                <thead>
                    <tr>
                    <th>#</th>
                    <th>Booth Name</th>
                    <th>Feedback</th>
                    <th>Vote</th>
                    <th>Phone number</th>
                    <th>Date</th>
                    </tr>
                </thead>
                <tbody>
                    {feedback.map((f, i) => (
                    <tr key={f.uuid}>
                        <td> {page>1 ? ((page*5)-5)+i+1 : i+1 }</td>
                        <td>{booths[f.boothNumber-1]}</td>
                        <td>{f.feedback}</td>
                        <td>{f.vote===1?'liked': f.vote === -1 ? 'disliked':'neutral'}</td>
                        <td>{f.phoneNumber}</td>
                        <td>{new Date(f.updatedAt).toDateString()} {new Date(f.updatedAt).toLocaleTimeString()}</td>
                    </tr>
                    ))}
                </tbody>
            </Table>
            </Row>
            <Row>
            <p>Results : { total }</p>
              <PaginationControl
                  page={page}
                  between={4}
                  total={total}
                  limit={5}
                  changePage={(page) => {
                    setPage(page); 
                    console.log(page)
                  }}
                  ellipsis={1}
                />

           
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
