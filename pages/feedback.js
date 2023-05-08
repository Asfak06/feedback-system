import { useRouter } from 'next/router';
import { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import axios from 'axios';
import { HandThumbsUp, HandThumbsDown } from 'react-bootstrap-icons';
import { API_BASE_URL } from '../utils';

function FeedbackForm() {
  const router = useRouter();
  const { boothNumber, userId, userName } = router.query;
  const [feedback, setFeedback] = useState({});
  const [vote, setVote] = useState(null);

  const onUpvote = () => {
    setVote('up');
  };

  const onDownvote = () => {
    setVote('down');
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFeedback({ ...feedback, [name]: value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = {
      boothNumber: router.query.boothNumber,
      userId: router.query.userId,
      userName: router.query.userName,
      vote: event.target.vote.value,
      feedback: event.target.feedback.value
    };

    if (!data.boothNumber || !data.userId || !data.userName || !data.vote || !data.feedback) {
      alert('Missing data');
      return;
    }

    try {
      console.log(data);
      const res = await axios.post(`${API_BASE_URL}/api/feedback`, data);
      console.log(res.data);
      alert('Success');
    } catch (error) {
      console.error(error);
      alert('Something went wrong');
    }
  };

  return (
    <div className="container">
      <div className="d-flex flex-column justify-content-center align-items-center">
        <h1>Feedback Form</h1>
        <p>Booth Number: {boothNumber}</p>
        <p>User ID: {userId}</p>
        <p>User Name: {userName}</p>
      </div>

      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label className="fw-bold">Vote:</Form.Label>
          <div className="d-flex align-items-center">
            <label className="form-check-label d-flex align-items-center mx-3">
              <input
                type="radio"
                name="vote"
                value={1}
                hidden
                checked={vote === 'up'}
                onChange={onUpvote}
              />
              <HandThumbsUp
                className={`mx-2 cursor-pointer ${
                  vote === 'up' ? 'text-success' : 'text-black'
                }`}
              />
              <span>{vote === 'up' ? 'Liked' : 'Like'}</span>
            </label>
            <label className="form-check-label d-flex align-items-center mx-3">
              <input
                type="radio"
                name="vote"
                value={-1}
                hidden
                checked={vote === 'down'}
                onChange={onDownvote}
              />
              <HandThumbsDown
                className={`mx-2 cursor-pointer ${
                  vote === 'down' ? 'text-danger' : 'text-black'
                }`}
              />
              <span>{vote === 'down' ? 'Disliked' : 'Dislike'}</span>
            </label>
          </div>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label className="fw-bold">Remarks:</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            name="feedback"
            onChange={handleInputChange}
          />
        </Form.Group>
        
        <Button variant="primary" type="submit">
          Submit
        </Button>
      </Form>
    </div>
  );
}

export default FeedbackForm;
